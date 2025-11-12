// src/utils/firestorePaths.js

// Base path builders
export const playerRoot = (appId, userId) =>
  `/artifacts/${appId}/users/${userId}`;

export const playerSaveCollection = (appId, userId) =>
  `${playerRoot(appId, userId)}/player_saves`;

export const playerSaveDoc = (appId, userId, saveId) =>
  `${playerSaveCollection(appId, userId)}/${saveId}`;

// Save-scoped collections
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

// alias expected by journal.js
export const saveJournalEntries = (appId, userId, saveId) =>
  journalEntriesCol(appId, userId, saveId);

export const journal = { entries: journalEntriesCol };

export const paths = {
  playerSaveCollection,
  playerSaveDoc,
  wrestlersCol,
  messagesCol,
  showsCol,
  storylinesCol,
  careerEventsCol,
  journalEntriesCol,
  journal,
};

// add default export to satisfy `import paths, {...} from './firestorePaths'`
export default paths;
