const baseArtifactsPath = (appId) => `/artifacts/${appId}`;
const publicDataRoot = (appId) => `${baseArtifactsPath(appId)}/public/data`;
const publicDataCollection = (appId, collection) => `${publicDataRoot(appId)}/${collection}`;
const publicDataDoc = (appId, collection, docId) => `${publicDataCollection(appId, collection)}/${docId}`;

const userRoot = (appId, userId) => `${baseArtifactsPath(appId)}/users/${userId}`;
const playerSavesCollection = (appId, userId) => `${userRoot(appId, userId)}/player_saves`;
const playerSaveDocPath = (appId, userId, saveId) => `${playerSavesCollection(appId, userId)}/${saveId}`;
const playerSaveCollection = (appId, userId, saveId, collection) => `${playerSaveDocPath(appId, userId, saveId)}/${collection}`;
const playerSaveDoc = (appId, userId, saveId, collection, docId) => `${playerSaveCollection(appId, userId, saveId, collection)}/${docId}`;

export const saveDoc = (appId, userId, saveId) => playerSaveDocPath(appId, userId, saveId);
export const saveMessages = (appId, userId, saveId) => `${saveDoc(appId, userId, saveId)}/save_messages`;
export const saveWrestlers = (appId, userId, saveId) => `${saveDoc(appId, userId, saveId)}/save_wrestlers`;
export const saveShows = (appId, userId, saveId) => `${saveDoc(appId, userId, saveId)}/save_shows`;
export const saveStorylines = (appId, userId, saveId) => `${saveDoc(appId, userId, saveId)}/save_storylines`;
export const saveCareerEvents = (appId, userId, saveId) => `${saveDoc(appId, userId, saveId)}/save_career_events`;

const paths = {
  baseArtifactsPath,
  publicDataRoot,
  publicDataCollection,
  publicDataDoc,
  userRoot,
  playerSavesCollection,
  playerSaveDocPath,
  playerSaveCollection,
  playerSaveDoc,
  saveDoc,
  saveMessages,
  saveWrestlers,
  saveShows,
  saveStorylines,
  saveCareerEvents,
};

export {
  baseArtifactsPath,
  publicDataRoot,
  publicDataCollection,
  publicDataDoc,
  userRoot,
  playerSavesCollection,
  playerSaveDocPath,
  playerSaveCollection,
  playerSaveDoc,
};

export default paths;
