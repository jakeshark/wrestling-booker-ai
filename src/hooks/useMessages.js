import { useCallback, useEffect, useMemo, useState } from 'react';
import { addDoc, collection, doc, Timestamp, writeBatch, setDoc } from 'firebase/firestore';
import { callAI } from '../utils/aiClient';
import paths from '../utils/firestorePaths';
import { getOutcomeForReply } from '../utils/replyOutcomes';

const buildMessageContacts = (messages, wrestlers) => {
  if (!messages) return [];
  const contactsMap = new Map();

  for (const msg of messages) {
    let otherId = null;
    let otherName = null;

    if (msg.senderId && msg.senderId !== 'booker') {
      otherId = msg.senderId;
    } else if (msg.recipientId && msg.recipientId !== 'booker') {
      otherId = msg.recipientId;
    }

    if (!otherId) continue;

    const wrestler = wrestlers.find(w => w.id === otherId);
    otherName = wrestler ? wrestler.name : (msg.senderName || 'Unknown');

    if (!contactsMap.has(otherId)) {
      contactsMap.set(otherId, {
        id: otherId,
        name: otherName,
        latestTimestamp: msg.timestamp,
        latestSnippet: msg.body
      });
    } else {
      const existing = contactsMap.get(otherId);
      if (msg.timestamp && existing.latestTimestamp && msg.timestamp.toMillis() > existing.latestTimestamp.toMillis()) {
        contactsMap.set(otherId, {
          ...existing,
          latestTimestamp: msg.timestamp,
          latestSnippet: msg.body
        });
      }
    }
  }

  return Array.from(contactsMap.values()).sort((a, b) => {
    if (!a.latestTimestamp || !b.latestTimestamp) return 0;
    return b.latestTimestamp.toMillis() - a.latestTimestamp.toMillis();
  });
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

const rewriteFollowupForTone = (aiMessage, tone) => {
  if (tone === 'negative') {
    return `...okay, I get it. ${aiMessage} I was hoping for more, but I'll keep doing my part.`;
  }
  if (tone === 'positive') {
    return `Awesome, appreciate that. ${aiMessage}`;
  }
  return aiMessage;
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

const useMessages = ({ gameData, setGameData, activeSave, db, appId, userId, addToast }) => {
  const [showMessagesModal, setShowMessagesModal] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState(null);
  const [replyDraft, setReplyDraft] = useState('');
  const [hoverReply, setHoverReply] = useState(null);
  const [lockedReply, setLockedReply] = useState(null);
  const [selectedReplyTone, setSelectedReplyTone] = useState(null);
  const [isSending, setIsSending] = useState(false);

  const contacts = useMemo(() => (
    buildMessageContacts(gameData.save_messages || [], gameData.save_wrestlers || [])
  ), [gameData.save_messages, gameData.save_wrestlers]);

  const unreadMessages = useMemo(() => (
    (gameData.save_messages || []).filter(msg => !msg.isRead).length
  ), [gameData.save_messages]);

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
    return { id: selectedContactId, name: 'Unknown Talent' };
  }, [gameData.save_wrestlers, selectedContactId]);

  const conversationMessages = useMemo(() => {
    if (!selectedContactId) return [];
    const allMsgs = gameData.save_messages || [];

    return allMsgs
      .filter(msg => {
        if (msg.senderId === selectedContactId) return true;
        if (msg.recipientId === selectedContactId) return true;
        if (msg.senderId === selectedContactId && !msg.recipientId) return true;
        return false;
      })
      .sort((a, b) => {
        const aTime = a.timestamp ? a.timestamp.toMillis() : 0;
        const bTime = b.timestamp ? b.timestamp.toMillis() : 0;
        return aTime - bTime;
      });
  }, [gameData.save_messages, selectedContactId]);

  const replyOptions = useMemo(() => {
    if (!selectedContactId || conversationMessages.length === 0) return [];

    const latestFromContact = [...conversationMessages]
      .reverse()
      .find(message => message.senderId === selectedContactId && Array.isArray(message.replyOptions));

    return latestFromContact ? latestFromContact.replyOptions : [];
  }, [conversationMessages, selectedContactId]);

  const replyInputValue = hoverReply !== null && !lockedReply ? hoverReply : replyDraft;

  const closeMessages = useCallback(async () => {
    setShowMessagesModal(false);
    setHoverReply(null);
    setLockedReply(null);
    setReplyDraft('');
    setSelectedReplyTone(null);
    setIsSending(false);

    const unreadCount = (gameData.save_messages || []).filter(msg => !msg.isRead).length;
    if (!activeSave || !db || !appId || !userId || unreadCount === 0) return;

    setGameData(prevData => ({
      ...prevData,
      save_messages: (prevData.save_messages || []).map(msg => ({ ...msg, isRead: true }))
    }));

    try {
      const batch = writeBatch(db);
      const messagesRef = collection(db, paths.playerSaveCollection(appId, userId, activeSave.id, 'save_messages'));

      (gameData.save_messages || []).forEach(msg => {
        if (!msg.isRead) {
          const docRef = doc(messagesRef, msg.id);
          batch.update(docRef, { isRead: true });
        }
      });

      await batch.commit();
    } catch (error) {
      console.error('Error marking messages as read: ', error);
    }
  }, [activeSave, appId, db, gameData.save_messages, setGameData, userId]);

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
      isRead: true
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

      // TODO (Journal): if this reply includes a promise, create a quest
      // Example payload:
      // import { createQuest } from '../utils/journal';
      // await createQuest(db, { appId, userId, saveId: activeSave.id, quest: { /* ... */ }});

      const tone = detectToneFromReply(trimmedReply);
      const wrestler = contact;
      const latestTopicMessage = [...conversationMessages]
        .reverse()
        .find(message => message.senderId === selectedContactId && message.topic);
      const topic = latestTopicMessage?.topic || 'general';
      const replyTone = detectReplyTone(trimmedReply, selectedReplyTone);
      const { moraleDelta } = getOutcomeForReply(topic, replyTone);
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

      console.log(`[ReplyOutcome] ${wrestler.name} topic=${topic} tone=${replyTone} delta=${moraleDelta} -> ${clampedMorale}`);

      if (typeof addToast === 'function') {
        let moraleText = `Morale ${moraleDelta >= 0 ? '+' : ''}${moraleDelta}`;
        if (clampedMorale === 0) {
          moraleText = 'Morale at minimum (0)';
        } else if (clampedMorale === 100) {
          moraleText = 'Morale capped (100)';
        }
        addToast(`${wrestler.name}: ${moraleText}`);
      }

      const updatedWrestler = { ...wrestler, morale: clampedMorale };
      const followupData = await callAI('wrestler-message', {
        wrestler: {
          id: updatedWrestler.id,
          name: updatedWrestler.name,
          disposition: updatedWrestler.disposition,
          gimmick: updatedWrestler.gimmick,
          morale: updatedWrestler.morale
        },
        topic: tone === 'negative' ? 'push_denied' : tone === 'positive' ? 'push_approved' : 'conditional_response'
      });

      if (followupData && followupData.message) {
        const followMessage = {
          senderId: wrestler.id,
          senderName: wrestler.name,
          recipientId: 'booker',
          body: rewriteFollowupForTone(followupData.message, tone),
          timestamp: nowTs,
          type: 'Text',
          isRead: false,
          replyOptions: followupData.replyOptions || [],
          topic
        };

        const followMsgRef = await addDoc(messagesRef, followMessage);
        const followMsgWithId = { id: followMsgRef.id, ...followMessage };

        setGameData(prevData => ({
          ...prevData,
          save_messages: [...(prevData.save_messages || []), followMsgWithId]
        }));
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
    replyInputValue,
    isSending
  };
};

export default useMessages;
