import { useCallback, useEffect, useMemo, useState } from 'react';
import { addDoc, collection, doc, Timestamp, writeBatch, setDoc } from 'firebase/firestore';
import { callAI } from '../utils/aiClient';
import paths from '../utils/firestorePaths';
import { addJournalEntry, extractPromiseFromReply } from "../utils/journal";

const timestampToMillis = (timestamp) => {
  if (!timestamp) return 0;
  if (typeof timestamp === 'number') return timestamp;
  if (typeof timestamp === 'string') {
    const parsed = new Date(timestamp).getTime();
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  if (typeof timestamp.toMillis === 'function') return timestamp.toMillis();
  if (typeof timestamp.seconds === 'number') {
    const nanos = typeof timestamp.nanoseconds === 'number' ? timestamp.nanoseconds : 0;
    return (timestamp.seconds * 1000) + Math.floor(nanos / 1e6);
  }
  return 0;
};

const fallbackContactId = (msg) => msg?.senderId || msg?.senderName || 'unknown';
const fallbackDisplayName = (msg) => msg?.senderName || 'Unknown';

const resolveContactId = (msg) => {
  if (!msg) return 'unknown';
  if (msg.senderId && msg.senderId !== 'booker') return msg.senderId;
  if (msg.recipientId && msg.recipientId !== 'booker') return msg.recipientId;
  if (
    msg.recipientName &&
    (msg.senderId === 'booker' || (typeof msg.senderName === 'string' && msg.senderName.toLowerCase() === 'booker'))
  ) {
    return msg.recipientName;
  }
  return fallbackContactId(msg);
};

const resolveContactName = (msg, wrestlers) => {
  if (!msg) return 'Unknown';
  const contactId = resolveContactId(msg);
  const wrestler = wrestlers.find(w => w.id === contactId);
  if (wrestler) return wrestler.name;

  if (msg.senderId && msg.senderId !== 'booker') {
    return msg.senderName || fallbackDisplayName(msg);
  }

  if (msg.recipientId && msg.recipientId !== 'booker') {
    return msg.recipientName || fallbackDisplayName(msg);
  }

  if (msg.recipientName && (msg.senderId === 'booker' || (msg.senderName || '').toLowerCase() === 'booker')) {
    return msg.recipientName;
  }

  return fallbackDisplayName(msg);
};

const normalizeMessages = (rawMessages) => {
  if (!Array.isArray(rawMessages)) return [];

  return rawMessages.reduce((acc, msg) => {
    if (!msg || typeof msg !== 'object') return acc;
    if (!msg.senderId && !msg.senderName) return acc;

    const normalizedMsg = { ...msg };

    if (!normalizedMsg.type) {
      normalizedMsg.type = 'Text';
    }

    if (!Array.isArray(normalizedMsg.replyOptions)) {
      normalizedMsg.replyOptions = Array.isArray(msg.replyOptions) ? msg.replyOptions : [];
    }

    acc.push(normalizedMsg);
    return acc;
  }, []);
};

const buildMessageContacts = (messages, wrestlers) => {
  if (!Array.isArray(messages) || messages.length === 0) return [];
  const contactsMap = new Map();

  for (const msg of messages) {
    const otherId = resolveContactId(msg);
    if (!otherId || otherId === 'booker') continue;

    const otherName = resolveContactName(msg, wrestlers);
    const existing = contactsMap.get(otherId);
    const msgMillis = timestampToMillis(msg.timestamp);

    if (!existing) {
      contactsMap.set(otherId, {
        id: otherId,
        name: otherName,
        latestTimestamp: msg.timestamp,
        latestSnippet: msg.body
      });
    } else if (msgMillis > timestampToMillis(existing.latestTimestamp)) {
      contactsMap.set(otherId, {
        ...existing,
        latestTimestamp: msg.timestamp,
        latestSnippet: msg.body
      });
    }
  }

  return Array.from(contactsMap.values()).sort((a, b) => (
    timestampToMillis(b.latestTimestamp) - timestampToMillis(a.latestTimestamp)
  ));
};

const detectToneFromReply = (text) => {
  const lower = text.toLowerCase();
  if (lower.includes('yes') || lower.includes('ok') || lower.includes("sounds good") || lower.includes('i can') || lower.includes("let's do it")) {
    return 'positive';
  }
  if (lower.includes('no') || lower.includes("can't") || lower.includes("won't") || lower.includes('not right now') || lower.includes("doesn't fit")) {
    return 'negative';
  }
  return 'neutral';
};

const labelToTone = (label) => {
  const normalized = (label || '').toLowerCase();
  if (normalized === 'yes') return 'yes';
  if (normalized === 'no') return 'no';
  if (normalized === 'maybe') return 'maybe';
  return null;
};

const detectReplyTone = (text, fallbackTone) => {
  if (fallbackTone) return fallbackTone;
  const lower = (text || '').toLowerCase();
  if (lower.includes('yes') || lower.includes('sure') || lower.includes('definitely') || lower.includes("let's do") || lower.includes('absolutely')) {
    return 'yes';
  }
  if (lower.includes('no') || lower.includes("can't") || lower.includes("won't") || lower.includes('not happening') || lower.includes('decline')) {
    return 'no';
  }
  if (lower.includes('maybe') || lower.includes('perhaps') || lower.includes('not sure') || lower.includes('we will see')) {
    return 'maybe';
  }
  const sentiment = detectToneFromReply(text || '');
  if (sentiment === 'positive') return 'yes';
  if (sentiment === 'negative') return 'no';
  return 'maybe';
};

// TODO: expose tone→delta in settings for balancing.
const REPLY_TONE_DELTAS = {
  yes: 4,
  maybe: 1,
  no: -5
};

const useMessages = ({ gameData, setGameData, activeSave, db, appId, userId, addToast }) => {
  const [showMessagesModal, setShowMessagesModal] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState(null);
  const [replyDraft, setReplyDraft] = useState('');
  const [hoverReply, setHoverReply] = useState(null);
  const [lockedReply, setLockedReply] = useState(null);
  const [selectedReplyTone, setSelectedReplyTone] = useState(null);
  const [isSending, setIsSending] = useState(false);

  const normalizedMessages = useMemo(() => (
    normalizeMessages(gameData?.save_messages)
  ), [gameData?.save_messages]);

  useEffect(() => {
    const rawMessages = Array.isArray(gameData?.save_messages) ? gameData.save_messages : [];
    console.log(`Messages: loaded ${rawMessages.length} raw, ${normalizedMessages.length} usable after normalization`);
  }, [gameData?.save_messages, normalizedMessages.length]);

  const contacts = useMemo(() => (
    buildMessageContacts(normalizedMessages, gameData.save_wrestlers || [])
  ), [normalizedMessages, gameData.save_wrestlers]);

  const unreadMessages = useMemo(() => (
    normalizedMessages.filter(msg => msg && !msg.isRead).length
  ), [normalizedMessages]);

  useEffect(() => {
    if (contacts.length === 0) {
      setSelectedContactId(null);
      return;
    }

    if (!selectedContactId) {
      setSelectedContactId(contacts[0].id);
    } else {
      const stillExists = contacts.some(contact => contact.id === selectedContactId);
      if (!stillExists) {
        setSelectedContactId(contacts[0].id);
      }
    }
  }, [contacts, selectedContactId]);

  const openMessages = useCallback(() => {
    setShowMessagesModal(true);
    setHoverReply(null);
    setLockedReply(null);
    setReplyDraft('');
    setSelectedReplyTone(null);
    setIsSending(false);

    if (!selectedContactId && contacts.length > 0) {
      setSelectedContactId(contacts[0].id);
    }
  }, [contacts, selectedContactId]);

  const selectedContact = useMemo(() => {
    if (!selectedContactId) return null;
    const wrestlers = gameData.save_wrestlers || [];
    const wrestler = wrestlers.find(w => w.id === selectedContactId);
    if (wrestler) return wrestler;
    const contact = contacts.find(c => c.id === selectedContactId);
    if (contact) return { id: contact.id, name: contact.name };
    return { id: selectedContactId, name: 'Unknown Talent' };
  }, [contacts, gameData.save_wrestlers, selectedContactId]);

  const conversationMessages = useMemo(() => {
    if (!selectedContactId) return [];
    return normalizedMessages
      .filter(msg => resolveContactId(msg) === selectedContactId)
      .sort((a, b) => timestampToMillis(a.timestamp) - timestampToMillis(b.timestamp));
  }, [normalizedMessages, selectedContactId]);

  const latestThreadMessage = useMemo(() => (
    conversationMessages.length > 0
      ? conversationMessages[conversationMessages.length - 1]
      : null
  ), [conversationMessages]);

  const canReplyToThread = useMemo(() => {
    if (!latestThreadMessage) return false;
    if (latestThreadMessage.senderId === 'booker') return false;
    return latestThreadMessage.canReply !== false;
  }, [latestThreadMessage]);

  const replyOptions = useMemo(() => {
    if (!selectedContactId || conversationMessages.length === 0) return [];
    if (!canReplyToThread) return [];

    const latestFromContact = [...conversationMessages]
      .reverse()
      .find(message => (
        message.senderId === selectedContactId &&
        Array.isArray(message.replyOptions) &&
        message.canReply !== false
      ));

    return latestFromContact ? latestFromContact.replyOptions : [];
  }, [canReplyToThread, conversationMessages, selectedContactId]);

  const replyInputValue = hoverReply !== null && !lockedReply ? hoverReply : replyDraft;

  const closeMessages = useCallback(async () => {
    setShowMessagesModal(false);
    setHoverReply(null);
    setLockedReply(null);
    setReplyDraft('');
    setSelectedReplyTone(null);
    setIsSending(false);

    const unreadCount = normalizedMessages.filter(msg => msg && !msg.isRead).length;
    if (!activeSave || !db || !appId || !userId || unreadCount === 0) return;

    setGameData(prevData => ({
      ...prevData,
      save_messages: (prevData.save_messages || []).map(msg => (
        msg && typeof msg === 'object' ? { ...msg, isRead: true } : msg
      ))
    }));

    try {
      const batch = writeBatch(db);
      const messagesRef = collection(db, paths.playerSaveCollection(appId, userId, activeSave.id, 'save_messages'));

      (gameData.save_messages || []).forEach(msg => {
        if (msg && !msg.isRead && msg.id) {
          const docRef = doc(messagesRef, msg.id);
          batch.update(docRef, { isRead: true });
        }
      });

      await batch.commit();
    } catch (error) {
      console.error('Error marking messages as read: ', error);
    }
  }, [activeSave, appId, db, gameData.save_messages, normalizedMessages, setGameData, userId]);

  const handleContactClick = useCallback((contactId) => {
    setSelectedContactId(contactId);
    setReplyDraft('');
    setHoverReply(null);
    setLockedReply(null);
    setSelectedReplyTone(null);
    setIsSending(false);
  }, []);

  const handleReplyHover = useCallback((text) => {
    setHoverReply(text);
  }, []);

  const handleReplyHoverLeave = useCallback(() => {
    setHoverReply(null);
  }, []);

  const handleReplyClick = useCallback((text, label) => {
    setLockedReply(text);
    setReplyDraft(text);
    const tone = labelToTone(label) || detectReplyTone(text, null);
    setSelectedReplyTone(tone);
  }, []);

  const handleReplyDraftChange = useCallback((e) => {
    const value = e.target.value;
    setReplyDraft(value);
    if (!lockedReply) {
      setSelectedReplyTone(null);
    }
    setLockedReply(null);
  }, [lockedReply]);

  const handleSendReply = useCallback(async () => {
    if (isSending) return;
    if (!replyDraft.trim() || !selectedContactId) return;
    if (!activeSave || !db || !appId || !userId) return;
    if (!canReplyToThread) return;

    const contact = selectedContact;
    if (!contact) return;
    const nowTs = activeSave.currentDate ? activeSave.currentDate : Timestamp.now();
    const trimmedReply = replyDraft.trim();

    const playerMessage = {
      senderId: 'booker',
      senderName: 'Booker',
      recipientId: selectedContactId,
      body: trimmedReply,
      timestamp: nowTs,
      type: 'Text',
      isRead: true,
      canReply: false
    };

    try {
      setIsSending(true);
      const messagesRef = collection(db, paths.playerSaveCollection(appId, userId, activeSave.id, 'save_messages'));
      const newMsgRef = await addDoc(messagesRef, playerMessage);
      const playerMsgWithId = { id: newMsgRef.id, ...playerMessage };

      setGameData(prevData => ({
        ...prevData,
        save_messages: [...(prevData.save_messages || []), playerMsgWithId]
      }));

      try {
        const gameDateISO = activeSave?.currentDate?.toDate?.().toISOString?.() ?? null;
        const maybeEntry = extractPromiseFromReply({
          replyText: trimmedReply,
          wrestlerName: contact?.name || selectedContact?.name || null,
          gameDateISO
        });

        if (maybeEntry) {
          await addJournalEntry(db, appId, userId, activeSave.id, maybeEntry);
        }
      } catch (e) {
        console.warn('Journal capture failed (non-fatal):', e);
      }

      const wrestler = contact;
      const latestTopicMessage = [...conversationMessages]
        .reverse()
        .find(message => message.senderId === selectedContactId && message.topic);
      const topic = latestTopicMessage?.topic || 'general';
      const replyTone = detectReplyTone(trimmedReply, selectedReplyTone);
      const moraleDelta = REPLY_TONE_DELTAS[replyTone] ?? 0;
      const currentMorale = typeof wrestler.morale === 'number' ? wrestler.morale : 50;
      const clampedMorale = Math.max(0, Math.min(100, currentMorale + moraleDelta));
      const wrestlerDocRef = doc(db, paths.saveWrestlers(appId, userId, activeSave.id), wrestler.id);
      await setDoc(wrestlerDocRef, { morale: clampedMorale }, { merge: true });

      setGameData(prevData => ({
        ...prevData,
        save_wrestlers: (prevData.save_wrestlers || []).map(w => (
          w.id === wrestler.id ? { ...w, morale: clampedMorale } : w
        ))
      }));

      const toastMessage = `${wrestler.name}: Morale ${moraleDelta >= 0 ? '+' : ''}${moraleDelta}`;

      const careerEventData = {
        type: 'reply_effect',
        wrestlerId: wrestler.id,
        moraleDelta,
        date: nowTs
      };

      try {
        const careerEventsRef = collection(db, paths.playerSaveCollection(appId, userId, activeSave.id, 'save_career_events'));
        const careerEventRef = await addDoc(careerEventsRef, careerEventData);
        const careerEventWithId = { id: careerEventRef.id, ...careerEventData };
        setGameData(prevData => ({
          ...prevData,
          save_career_events: [...(prevData.save_career_events || []), careerEventWithId]
        }));
      } catch (careerEventError) {
        console.error('Error logging reply effect career event:', careerEventError);
      }

      const updatedWrestler = { ...wrestler, morale: clampedMorale };
      const reactionData = await callAI('wrestler-reaction', {
        wrestler: {
          id: updatedWrestler.id,
          name: updatedWrestler.name,
          disposition: updatedWrestler.disposition,
          gimmick: updatedWrestler.gimmick,
          morale: updatedWrestler.morale
        },
        topic,
        playerMessage: trimmedReply,
        tone: replyTone
      });

      let reactionSaved = false;
      if (reactionData && reactionData.message) {
        const followMessage = {
          senderId: wrestler.id,
          senderName: wrestler.name,
          recipientId: 'booker',
          body: reactionData.message,
          timestamp: nowTs,
          type: 'Text',
          isRead: false,
          topic,
          canReply: false
        };

        const followMsgRef = await addDoc(messagesRef, followMessage);
        const followMsgWithId = { id: followMsgRef.id, ...followMessage };

        setGameData(prevData => ({
          ...prevData,
          save_messages: [...(prevData.save_messages || []), followMsgWithId]
        }));
        reactionSaved = true;
      }

      if (typeof addToast === 'function') {
        if (reactionSaved) {
          await new Promise(resolve => setTimeout(resolve, 150));
        }
        // Show toast after the wrestler reaction has rendered so the player reads the message first.
        addToast(toastMessage);
      }

      setReplyDraft('');
      setHoverReply(null);
      setLockedReply(null);
      setSelectedReplyTone(null);
    } catch (error) {
      console.error('Error sending reply:', error);
    } finally {
      setIsSending(false);
    }
  }, [
    activeSave,
    addToast,
    appId,
    conversationMessages,
    db,
    isSending,
    replyDraft,
    canReplyToThread,
    selectedContact,
    selectedContactId,
    selectedReplyTone,
    setGameData,
    userId
  ]);

  return {
    showMessagesModal,
    openMessages,
    closeMessages,
    unreadMessages,
    contacts,
    selectedContact,
    conversationMessages,
    handleContactClick,
    handleReplyHover,
    handleReplyHoverLeave,
    handleReplyClick,
    handleReplyDraftChange,
    handleSendReply,
    replyDraft,
    hoverReply,
    lockedReply,
    replyOptions,
    canReplyToThread,
    replyInputValue,
    isSending
  };
};

export default useMessages;
