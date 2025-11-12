const baseArtifactsPath = (appId) => `/artifacts/${appId}`;
const publicDataRoot = (appId) => `${baseArtifactsPath(appId)}/public/data`;
const publicDataCollection = (appId, collection) => `${publicDataRoot(appId)}/${collection}`;
const publicDataDoc = (appId, collection, docId) => `${publicDataCollection(appId, collection)}/${docId}`;

const userRoot = (appId, userId) => `${baseArtifactsPath(appId)}/users/${userId}`;
const playerSavesCollection = (appId, userId) => `${userRoot(appId, userId)}/player_saves`;
const playerSaveDocPath = (appId, userId, saveId) => `${playerSavesCollection(appId, userId)}/${saveId}`;
const playerSaveCollection = (appId, userId, saveId, collection) => `${playerSaveDocPath(appId, userId, saveId)}/${collection}`;
const playerSaveDoc = (appId, userId, saveId, collection, docId) => `${playerSaveCollection(appId, userId, saveId, collection)}/${docId}`;
const saveWrestlers = (appId, userId, saveId) => `${playerSaveDocPath(appId, userId, saveId)}/save_wrestlers`;

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
  saveWrestlers
};

export default paths;
