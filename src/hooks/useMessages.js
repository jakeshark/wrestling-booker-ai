import { useCallback, useEffect, useMemo, useState } from 'react';
import { addDoc, collection, doc, Timestamp, writeBatch } from 'firebase/firestore';

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

const useMessages = ({ gameData, setGameData, activeSave, db, appId, userId }) => {
  const [showMessagesModal, setShowMessagesModal] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState(null);
  const [replyDraft, setReplyDraft] = useState('');
  const [hoverReply, setHoverReply] = useState(null);
  const [lockedReply, setLockedReply] = useState(null);

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

    const unreadCount = (gameData.save_messages || []).filter(msg => !msg.isRead).length;
    if (!activeSave || !db || !appId || !userId || unreadCount === 0) return;

    setGameData(prevData => ({
      ...prevData,
      save_messages: (prevData.save_messages || []).map(msg => ({ ...msg, isRead: true }))
    }));

    try {
      const batch = writeBatch(db);
      const messagesRef = collection(db, `/artifacts/${appId}/users/${userId}/player_saves/${activeSave.id}/save_messages`);

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
  }, []);

  const handleReplyHover = useCallback((text) => {
    setHoverReply(text);
  }, []);

  const handleReplyHoverLeave = useCallback(() => {
    setHoverReply(null);
  }, []);

  const handleReplyClick = useCallback((text) => {
    setLockedReply(text);
    setReplyDraft(text);
  }, []);

  const handleReplyDraftChange = useCallback((e) => {
    setReplyDraft(e.target.value);
    setLockedReply(null);
  }, []);

  const handleSendReply = useCallback(async () => {
    if (!replyDraft.trim() || !selectedContactId) return;
    if (!activeSave || !db || !appId) return;

    const contact = selectedContact;
    if (!contact) return;
    const nowTs = activeSave.currentDate ? activeSave.currentDate : Timestamp.now();

    const playerMessage = {
      senderId: 'booker',
      senderName: 'Booker',
      recipientId: selectedContactId,
      body: replyDraft.trim(),
      timestamp: nowTs,
      type: 'Text',
      isRead: true
    };

    try {
      const messagesRef = collection(db, `/artifacts/${appId}/users/${userId}/player_saves/${activeSave.id}/save_messages`);
      const newMsgRef = await addDoc(messagesRef, playerMessage);
      const playerMsgWithId = { id: newMsgRef.id, ...playerMessage };

      setGameData(prevData => ({
        ...prevData,
        save_messages: [...(prevData.save_messages || []), playerMsgWithId]
      }));

      const tone = detectToneFromReply(replyDraft.trim());
      const wrestler = contact;
      const followup = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'wrestler-message',
          wrestler: {
            id: wrestler.id,
            name: wrestler.name,
            disposition: wrestler.disposition,
            gimmick: wrestler.gimmick,
            morale: wrestler.morale
          },
          topic: tone === 'negative' ? 'push_denied' : tone === 'positive' ? 'push_approved' : 'conditional_response'
        })
      });

      let followupData = null;
      if (followup.ok) {
        followupData = await followup.json();
      }

      if (followupData && followupData.message) {
        const followMessage = {
          senderId: wrestler.id,
          senderName: wrestler.name,
          recipientId: 'booker',
          body: rewriteFollowupForTone(followupData.message, tone),
          timestamp: nowTs,
          type: 'Text',
          isRead: false,
          replyOptions: followupData.replyOptions || []
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
    } catch (error) {
      console.error('Error sending reply:', error);
    }
  }, [activeSave, appId, db, replyDraft, selectedContact, selectedContactId, setGameData, userId]);

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
    replyInputValue
  };
};

export default useMessages;
