import { addDoc, collection, doc, getDocs, Timestamp, updateDoc } from 'firebase/firestore';
import paths, { saveJournalEntries as saveJournalEntriesPath } from '@/utils/firestorePaths';
import { callAI } from '@/utils/aiClient';

export const journalPaths = {
  saveJournalEntries: (appId, userId, saveId) => saveJournalEntriesPath(appId, userId, saveId)
};

/**
 * Minimal journal entry writer.
 * @param {object} db
 * @param {string} appId
 * @param {string} userId
 * @param {string} saveId
 * @param {object} entry   See schema below.
 * @returns {Promise<string>} new doc id
 */
export async function addJournalEntry(...args) {
  let db;
  let appId;
  let userId;
  let saveId;
  let entry;

  if (args.length === 1 && args[0] && typeof args[0] === 'object') {
    ({ db, appId, userId, saveId, ...entry } = args[0]);
  } else {
    [db, appId, userId, saveId, entry] = args;
  }

  if (!db || !appId || !userId || !saveId || !entry) {
    throw new Error('[journal] addJournalEntry missing required data');
  }

  const colRef = collection(db, paths.journal(appId, userId, saveId));
  const docRef = await addDoc(colRef, {
    createdAt: Timestamp.now(),
    status: 'open',     // 'open' | 'completed' | 'cancelled' | 'broken'
    source: 'message',  // origin: 'message' for now
    ...entry
  });
  return docRef.id;
}

export async function detectPromiseWithAI({ requestText, replyText, replyType }) {
  if (!replyText) return null;

  console.log('[journal] AI: checking reply for promise', { replyType });

  try {
    const result = await callAI('journal-promise-detector', {
      requestText,
      replyText,
      replyType,
    });

    if (!result || !result.madePromise) {
      console.log('[journal] AI: no promise detected');
      return null;
    }

    console.log('[journal] AI detected promise:', result.promiseSummary);

    return {
      type: 'promise',
      subject: result.promiseSummary || replyText,
      original: replyText,
    };
  } catch (err) {
    console.error('[journal] AI promise detection failed:', err);
    return null;
  }
}

/**
 * Heuristic extractor that tries to detect a promise/commitment in free text.
 * Returns null if nothing confident enough is found.
 * VERY conservative—only fires on obvious phrases.
 */
export function extractPromiseFromReply({ replyText, wrestlerName, gameDateISO }) {
  if (!replyText) return null;
  const text = replyText.trim().toLowerCase();

  // Quick “commitment” cues
  const commitCues = [
    /\bi(?:'| wi)ll\b/,            // "I'll", "I will"
    /\bwe(?:'| wi)ll\b/,           // "we'll", "we will"
    /\bpromise\b/,
    /\bcommit\b/,
    /\bguarantee\b/,
    /\b(count|hold)\s+me\s+to\b/
  ];

  const soundsCommitted = commitCues.some((rx) => rx.test(text));
  if (!soundsCommitted) return null;

  // Rough topic sniffers (extendable)
  let promiseType = null;
  if (/\b(title|championship)\b/.test(text)) promiseType = 'title_program';
  else if (/\bpush\b/.test(text)) promiseType = 'push';
  else if (/\b(hire|sign)\b/.test(text)) promiseType = 'talent_signing';
  else if (/\b(time\s*off|vacation|leave)\b/.test(text)) promiseType = 'grant_time_off';
  else if (/\bmatch\b/.test(text)) promiseType = 'book_match';
  else if (/\b(feud|story( ?line)?)\b/.test(text)) promiseType = 'storyline_program';
  else promiseType = 'unspecified';

  // Due-date sniffers (very conservative)
  // Examples it will catch: "by May 2026", "before 2026", "this summer", "next month"
  // For now, we store a text hint; later we can NLP it to a real date.
  let dueHint = null;
  const byBefore = text.match(/\bby\s+([a-z]+\s+\d{4}|\d{4})/) || text.match(/\bbefore\s+(\d{4})/);
  if (byBefore) dueHint = byBefore[0];

  const seasonal = text.match(/\b(this|next)\s+(spring|summer|fall|autumn|winter|month|quarter|year)\b/);
  if (!dueHint && seasonal) dueHint = seasonal[0];

  // Build the entry payload
  return {
    kind: 'promise',
    who: wrestlerName || 'Unknown',
    textOriginal: replyText,
    promise: {
      type: promiseType,          // e.g., 'title_program'
      dueHint: dueHint || null,   // store raw text like "by May 2026"
      madeOn: gameDateISO || null // string ISO from in-game date if available
    },
    // lightweight audit anchor so we can link the originating thread later if needed
    anchors: {
      context: 'message_reply',
    }
  };
}

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

export const evaluateQuests = async (
  db,
  { appId, userId, saveId, currentDate, gameData } = {}
) => {
  if (!db || !appId || !userId || !saveId) {
    console.warn('[Journal] Missing data when evaluating quests.');
    return { quests: [], succeeded: [], failed: [], summary: { evaluated: 0, failed: 0, succeeded: 0 } };
  }

  const pickTimestamp = (value) => {
    if (!value) return null;
    try {
      return resolveGameTimestamp(value);
    } catch (error) {
      console.warn('[Journal] Unable to resolve timestamp', error);
      return null;
    }
  };

  try {
    const questsRef = collection(db, saveJournalEntriesPath(appId, userId, saveId));
    const snapshot = await getDocs(questsRef);

    if (snapshot.empty) {
      return { quests: [], succeeded: [], failed: [], summary: { evaluated: 0, failed: 0, succeeded: 0 } };
    }

    const allQuests = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })) || [];

    const roster = Array.isArray(gameData?.save_wrestlers) ? gameData.save_wrestlers : [];
    const rosterById = buildRosterMaps(roster);

    const currentGameTimestamp =
      pickTimestamp(currentDate)
      || pickTimestamp(gameData?.currentDate)
      || pickTimestamp(gameData?.currentGameDate)
      || Timestamp.now();

    const currentMillis = toMillis(currentGameTimestamp);
    const evaluationTimestamp = Timestamp.now();

    const updatedQuests = new Map(allQuests.map((quest) => [quest.id, quest]));
    const failed = [];
    const succeeded = [];

    const normalizeStatus = (status) => (status ? status.toString().toLowerCase() : '');
    const isQuestOpen = (status) => {
      const normalized = normalizeStatus(status);
      if (!normalized) return true;
      return ['active', 'open', 'pending', 'in_progress'].includes(normalized);
    };

    const resolveDueMillis = (quest) => {
      const dueCandidate =
        quest?.deadline
        ?? quest?.dueDate
        ?? quest?.due_date
        ?? quest?.dueBy
        ?? quest?.promise?.deadline
        ?? quest?.promise?.dueDate;
      return toMillis(dueCandidate);
    };

    const firstLinkedWrestlerName = (quest) => {
      const ids = ensureArray(quest?.linkedEntities?.wrestlerIds);
      if (ids.length === 0) return null;
      for (const wrestlerId of ids) {
        const wrestler = rosterById.get(wrestlerId);
        if (wrestler?.name) return wrestler.name;
      }
      return ids[0] || null;
    };

    for (const quest of allQuests) {
      if (!quest || !isQuestOpen(quest.status)) {
        continue;
      }

      const dueMillis = resolveDueMillis(quest);

      if (dueMillis === null || currentMillis === null) {
        continue;
      }

      if (dueMillis >= currentMillis) {
        continue;
      }

      const questRef = doc(db, saveJournalEntriesPath(appId, userId, saveId), quest.id);

      const updatedNotes = [...ensureArray(quest.notes)];
      const dueDateLabel = formatGameDate(Timestamp.fromMillis(dueMillis));
      const wrestlerName = firstLinkedWrestlerName(quest);
      const questTitle = quest?.title || 'Untitled Quest';
      const failureMessage = wrestlerName
        ? `You didn't follow through on your promise to ${wrestlerName} by ${dueDateLabel}, so the quest has failed.`
        : `You didn't follow through on "${questTitle}" by ${dueDateLabel}, so the quest has failed.`;

      updatedNotes.push(`Automatically failed on ${formatGameDate(currentGameTimestamp)} because the due date passed.`);

      const questUpdate = {
        status: 'failed',
        resolvedAt: currentGameTimestamp,
        evaluatedAt: evaluationTimestamp,
        updatedAt: evaluationTimestamp,
        notes: updatedNotes,
      };

      try {
        await updateDoc(questRef, questUpdate);
      } catch (updateError) {
        console.error('[Journal] Failed to update quest during evaluation', updateError);
        continue;
      }

      try {
        await addJournalEntry(db, appId, userId, saveId, {
          title: `Quest failed: ${questTitle}`,
          description: failureMessage,
          status: 'failed',
          source: 'system',
          category: quest?.category || 'Quest',
          linkedEntities: quest?.linkedEntities || null,
          relatedQuestId: quest.id,
          resolvedAt: currentGameTimestamp,
        });
      } catch (entryError) {
        console.error('[Journal] Failed to append quest failure entry', entryError);
      }

      const nextQuestState = {
        ...quest,
        ...questUpdate,
      };

      updatedQuests.set(quest.id, nextQuestState);
      failed.push({ quest: nextQuestState, reason: 'deadline' });
    }

    const finalQuests = Array.from(updatedQuests.values()).sort((a, b) => {
      const aCreated = toMillis(a.createdAt) || 0;
      const bCreated = toMillis(b.createdAt) || 0;
      return bCreated - aCreated;
    });

    return {
      quests: finalQuests,
      succeeded,
      failed,
      summary: {
        evaluated: failed.length + succeeded.length,
        failed: failed.length,
        succeeded: succeeded.length,
      },
    };
  } catch (error) {
    const wrapped = new Error(`Failed to evaluate quests: ${error?.message || error}`);
    wrapped.cause = error;
    console.error('[Journal] Failed to evaluate quests', error);
    throw wrapped;
  }
};

export default {
  journalPaths,
  createQuest,
  updateQuest,
  evaluateQuests,
};
