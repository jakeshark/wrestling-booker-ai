// src/utils/firestorePaths.js

// -------- Public dataset paths (used for seeding default data) --------

// Root for public data
// NOTE: This matches the structure Codex refactored to.
// If your actual Firestore layout is different, we can adjust later.
// For now, this keeps the app building and running.
export const publicRoot = (appId) =>
  `/artifacts/${appId}/public/data`;

// Generic helper – this is what App.jsx expects to call as a FUNCTION.
// Example usage: publicDataCollection(appId, 'datasets')
// or publicDataCollection(appId, 'datasets/default-fiction')
export const publicDataCollection = (appId, subPath) =>
  subPath ? `${publicRoot(appId)}/${subPath}` : publicRoot(appId);

// More specific dataset helpers (optional, but kept for clarity)
export const datasetWrestlersCol = (appId) =>
  `${publicRoot(appId)}/dataset_wrestlers`;

export const datasetCompaniesCol = (appId) =>
  `${publicRoot(appId)}/dataset_companies`;

export const datasetShowsCol = (appId) =>
  `${publicRoot(appId)}/dataset_shows`;

// -------- Player save paths (per-user game state) --------

export const playerRoot = (appId, userId) =>
  `/artifacts/${appId}/users/${userId}`;

// Canonical version
export const playerSaveCollection = (appId, userId) =>
  `${playerRoot(appId, userId)}/player_saves`;

// 🔧 Alias for older code that expects “playerSavesCollection”
export const playerSavesCollection = playerSaveCollection;

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

export const saveSubcollection = (appId, userId, saveId, subcollection) =>
  `${playerSaveDoc(appId, userId, saveId)}/${subcollection}`;

// -------- Alias exports to match older utility names --------

// Used by deleteSave.js and possibly other helpers
export const saveDoc = playerSaveDoc;
export const saveMessages = messagesCol;
export const saveWrestlers = wrestlersCol;
export const saveShows = showsCol;
export const saveStorylines = storylinesCol;
export const saveCareerEvents = careerEventsCol;

// Alias expected by journal.js
export const saveJournalEntries = (appId, userId, saveId) =>
  journalEntriesCol(appId, userId, saveId);

export const journal = { entries: journalEntriesCol };

// A grouped object some callers import as `paths`
export const paths = {
  // public side
  publicRoot,
  publicDataCollection,
  datasetWrestlersCol,
  datasetCompaniesCol,
  datasetShowsCol,

  // player save side
  playerSaveCollection,
  playerSavesCollection,
  playerSaveDoc,
  wrestlersCol,
  messagesCol,
  showsCol,
  storylinesCol,
  careerEventsCol,
  journalEntriesCol,

  // alias helpers
  saveDoc,
  saveMessages,
  saveWrestlers,
  saveShows,
  saveStorylines,
  saveCareerEvents,
  saveJournalEntries,
  saveSubcollection,

  journal,
};

// Default export to satisfy `import paths, { ... } from './firestorePaths'`
export default paths;
