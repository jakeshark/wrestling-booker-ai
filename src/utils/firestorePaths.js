// src/utils/firestorePaths.js

// ── Base path builders ─────────────────────────────────────────────────────────
export const playerRoot = (appId, userId) =>
  `/artifacts/${appId}/users/${userId}`;

export const playerSaveCollection = (appId, userId) =>
  `${playerRoot(appId, userId)}/player_saves`;

export const playerSaveDoc = (appId, userId, saveId) =>
  `${playerSaveCollection(appId, userId)}/${saveId}`;

// ── Save-scoped collections ────────────────────────────────────────────────────
export const wrestlersCol = (appId, userId, saveId) =>
  `${playerSaveDoc(appId, userId, saveId)}/save_wrestlers`;

export const messagesCol = (appId, userId, saveId) =>
  `${playerSaveDoc(appId, userId, saveId)}/save_messages`;

export const showsCol = (appId, userId, saveId) =>
  `${playerSaveDoc(appId, userId, saveId)}/save_shows`;

export const storylinesCol = (appId, userId, saveId) =>
  `${playerSaveDoc(appId, userId, saveId)}/save_storylines`;

export const careerEventsCol = (appId, userId, saveId) =>
  `${playerSaveDoc(appId, userId, saveId)}/save_career_events`;

export const journalEntriesCol = (appId, userId, saveId) =>
  `${playerSaveDoc(appId, userId, saveId)}/save_journal_entries`;

// ── Aliases expected by older modules (journal.js, deleteSave.js, etc.) ────────

// journal.js uses this helper name:
export const saveJournalEntries = (appId, userId, saveId) =>
  journalEntriesCol(appId, userId, saveId);

// small namespace helper used by journal utils
export const journal = {
  entries: journalEntriesCol,
};

// deleteSave.js (and maybe other legacy code) still imports these:
export const saveDoc         = playerSaveDoc;
export const saveMessages    = messagesCol;
export const saveWrestlers   = wrestlersCol;
export const saveShows       = showsCol;
export const saveStorylines  = storylinesCol;
export const saveCareerEvents = careerEventsCol;

// ── Aggregated default export (for `import paths, {...} from './firestorePaths'`) ─
export const paths = {
  playerSaveCollection,
  playerSaveDoc,
  wrestlersCol,
  messagesCol,
  showsCol,
  storylinesCol,
  careerEventsCol,
  journalEntriesCol,
  // legacy aliases:
  saveDoc,
  saveMessages,
  saveWrestlers,
  saveShows,
  saveStorylines,
  saveCareerEvents,
  journal,
};

export default paths;
