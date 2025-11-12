import { addDoc, collection, doc, getDocs, Timestamp, updateDoc } from 'firebase/firestore';
import { saveJournalEntries as saveJournalEntriesPath } from './firestorePaths';

export const journalPaths = {
  saveJournalEntries: (appId, userId, saveId) => saveJournalEntriesPath(appId, userId, saveId)
};

const ensureArray = (value) => {
  if (Array.isArray(value)) return value.filter((item) => item !== undefined && item !== null);
  if (value === undefined || value === null) return [];
  return [value];
};

const resolveGameTimestamp = (value) => {
  if (!value) return Timestamp.now();
  if (typeof value.toMillis === 'function' && typeof value.toDate === 'function') {
    return value;
  }
  if (value instanceof Date) {
    return Timestamp.fromDate(value);
  }
  const parsed = Date.parse(value);
  if (!Number.isNaN(parsed)) {
    return Timestamp.fromMillis(parsed);
  }
  return Timestamp.now();
};

const toMillis = (value) => {
  if (!value) return null;
  if (typeof value.toMillis === 'function') {
    return value.toMillis();
  }
  if (value instanceof Date) {
    return value.getTime();
  }
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? null : parsed;
};

const formatGameDate = (timestamp) => {
  try {
    const date = timestamp instanceof Date ? timestamp : timestamp?.toDate?.() ?? null;
    if (!date) return 'current day';
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch (error) {
    console.warn('[Journal] Unable to format game date', error);
    return 'current day';
  }
};

const cleanObject = (obj = {}) => Object.fromEntries(
  Object.entries(obj).filter(([, value]) => value !== undefined)
);

const buildRosterMaps = (roster = []) => {
  const byId = new Map();
  roster.forEach((wrestler) => {
    if (!wrestler?.id) return;
    byId.set(wrestler.id, wrestler);
  });
  return byId;
};

const wrestlerIsRetired = (wrestler) => {
  if (!wrestler) return false;
  if (typeof wrestler.isRetired === 'boolean') return wrestler.isRetired;
  const status = (wrestler.status || wrestler.careerStatus || wrestler.employmentStatus || '').toString().toLowerCase();
  return status.includes('retired');
};

const wrestlerNameOrId = (rosterById, wrestlerId) => rosterById.get(wrestlerId)?.name || wrestlerId;

const checkMustHoldTitle = (titles = [], requirement) => {
  if (!requirement || !requirement.titleId || !requirement.wrestlerId) return true;
  return titles.some((title) => {
    if (!title || title.id !== requirement.titleId) return false;
    const holderCandidates = [
      title.currentHolderId,
      title.current_holder_id,
      title.currentChampionId,
      title.currentChampion?.id,
      title.championId
    ].filter(Boolean);
    return holderCandidates.includes(requirement.wrestlerId);
  });
};

export const createQuest = async (db, { appId, userId, saveId, quest }) => {
  if (!db || !appId || !userId || !saveId || !quest) {
    console.warn('[Journal] Missing data when creating quest.');
    return null;
  }

  const nowTs = resolveGameTimestamp(quest.createdAt || quest.updatedAt || quest.timestamp);

  const payload = {
    ...quest,
    status: quest.status || 'active',
    notes: ensureArray(quest.notes),
    createdAt: quest.createdAt ? resolveGameTimestamp(quest.createdAt) : nowTs,
    updatedAt: quest.updatedAt ? resolveGameTimestamp(quest.updatedAt) : nowTs,
  };

  const questsRef = collection(db, saveJournalEntriesPath(appId, userId, saveId));
  const docRef = await addDoc(questsRef, payload);

  return { id: docRef.id, ...payload };
};

export const updateQuest = async (db, { appId, userId, saveId, questId, patch }) => {
  if (!db || !appId || !userId || !saveId || !questId || !patch) {
    console.warn('[Journal] Missing data when updating quest.');
    return null;
  }

  const updates = cleanObject({
    ...patch,
    notes: patch.notes ? ensureArray(patch.notes) : undefined,
    updatedAt: resolveGameTimestamp(patch.updatedAt || patch.timestamp || Timestamp.now()),
  });

  const questRef = doc(db, saveJournalEntriesPath(appId, userId, saveId), questId);
  await updateDoc(questRef, updates);

  return { id: questId, ...updates };
};

const evaluateQuestStatus = ({
  quest,
  roster,
  rosterById,
  titles,
  currentDate,
  currentTimestamp,
}) => {
  if (!quest || quest.status !== 'active') {
    return null;
  }

  const successConditions = quest.successConditions || {};
  const failConditions = quest.failConditions || {};

  const rosterIds = new Set((roster || []).map((w) => w.id));

  const deadlineMillis = toMillis(quest.deadline);
  const currentMillis = toMillis(currentTimestamp);

  if (
    failConditions &&
    (failConditions.deadlineExceeded === true || failConditions.deadlineExceeded === undefined || failConditions.deadlineExceeded === null)
  ) {
    if (deadlineMillis !== null && currentMillis !== null && deadlineMillis < currentMillis) {
      return {
        status: 'failed',
        note: `Deadline passed on ${formatGameDate(currentDate || currentTimestamp)}.`,
        reason: 'deadline'
      };
    }
  }

  const leftIds = ensureArray(failConditions?.wrestlerLeftIds);
  if (leftIds.length > 0) {
    const missing = leftIds.filter((id) => !rosterIds.has(id));
    if (missing.length > 0) {
      const names = missing.map((id) => wrestlerNameOrId(rosterById, id)).join(', ');
      return {
        status: 'failed',
        note: `Failed because ${names} left the company.`,
        reason: 'wrestler_left'
      };
    }
  }

  const retiredIds = ensureArray(failConditions?.retiredIds);
  if (retiredIds.length > 0) {
    const retiredMatches = retiredIds.filter((id) => wrestlerIsRetired(rosterById.get(id)));
    if (retiredMatches.length > 0) {
      const names = retiredMatches.map((id) => wrestlerNameOrId(rosterById, id)).join(', ');
      return {
        status: 'failed',
        note: `Failed because ${names} retired.`,
        reason: 'retired'
      };
    }
  }

  const successChecks = [];

  const mustHaveIds = ensureArray(successConditions?.mustHaveWrestlerIds);
  if (mustHaveIds.length > 0) {
    successChecks.push(mustHaveIds.every((id) => rosterIds.has(id)));
  }

  const mustBeTogether = ensureArray(successConditions?.mustBeEmployedTogether);
  if (mustBeTogether.length > 0) {
    const allPresent = mustBeTogether.every((id) => rosterIds.has(id));
    successChecks.push(allPresent);
  }

  if (successConditions?.mustHoldTitle) {
    successChecks.push(checkMustHoldTitle(titles, successConditions.mustHoldTitle));
  }

  const hasSuccessCriteria = successChecks.length > 0;
  const allSuccessCriteriaMet = successChecks.every(Boolean);

  if (hasSuccessCriteria && allSuccessCriteriaMet) {
    return {
      status: 'succeeded',
      note: `Marked succeeded on ${formatGameDate(currentDate || currentTimestamp)}.`,
      reason: 'success'
    };
  }

  return null;
};

export const evaluateQuests = async (db, { appId, userId, saveId, gameData }) => {
  if (!db || !appId || !userId || !saveId) {
    console.warn('[Journal] Missing data when evaluating quests.');
    return { quests: [], succeeded: [], failed: [] };
  }

  try {
    const questsRef = collection(db, saveJournalEntriesPath(appId, userId, saveId));
    const snapshot = await getDocs(questsRef);
    const quests = snapshot.docs
      .map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
      .sort((a, b) => {
        const aCreated = toMillis(a.createdAt) || 0;
        const bCreated = toMillis(b.createdAt) || 0;
        return bCreated - aCreated;
      });

    const roster = gameData?.save_wrestlers || [];
    const rosterById = buildRosterMaps(roster);
    const titles = gameData?.save_titles || [];
    const currentTimestamp = resolveGameTimestamp(gameData?.currentDate || gameData?.currentGameDate || Timestamp.now());
    const currentDate = currentTimestamp.toDate();

    const activeQuests = quests.filter((quest) => quest.status === 'active');

    const succeeded = [];
    const failed = [];
    const updatedQuests = new Map(quests.map((quest) => [quest.id, quest]));

    for (const quest of activeQuests) {
      const evaluation = evaluateQuestStatus({
        quest,
        roster,
        rosterById,
        titles,
        currentDate,
        currentTimestamp,
      });

      if (!evaluation) continue;

      const noteText = evaluation.note;
      const updatedNotes = [...ensureArray(quest.notes), noteText];
      const nextQuestState = {
        ...quest,
        status: evaluation.status,
        updatedAt: currentTimestamp,
        notes: updatedNotes,
      };

      const questRef = doc(db, saveJournalEntriesPath(appId, userId, saveId), quest.id);
      await updateDoc(questRef, {
        status: evaluation.status,
        updatedAt: currentTimestamp,
        notes: updatedNotes,
      });

      updatedQuests.set(quest.id, nextQuestState);

      if (evaluation.status === 'succeeded') {
        succeeded.push({ quest: nextQuestState, note: noteText });
      } else if (evaluation.status === 'failed') {
        failed.push({ quest: nextQuestState, note: noteText, reason: evaluation.reason });
      }
    }

    const finalQuests = Array.from(updatedQuests.values()).sort((a, b) => {
      const aCreated = toMillis(a.createdAt) || 0;
      const bCreated = toMillis(b.createdAt) || 0;
      return bCreated - aCreated;
    });

    console.log(`[Journal] evaluate: ${activeQuests.length} active -> ${succeeded.length} succeeded, ${failed.length} failed`);

    return {
      quests: finalQuests,
      succeeded,
      failed,
    };
  } catch (error) {
    console.error('[Journal] Failed to evaluate quests', error);
    return { quests: [], succeeded: [], failed: [] };
  }
};

export default {
  journalPaths,
  createQuest,
  updateQuest,
  evaluateQuests,
};
