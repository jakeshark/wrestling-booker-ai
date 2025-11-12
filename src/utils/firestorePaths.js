export const userSaves = (appId, userId) => `/artifacts/${appId}/users/${userId}/player_saves`;

export const saveRoot = (appId, userId, saveId) => `${userSaves(appId, userId)}/${saveId}`;

const saveCollectionPath = (collectionName) => (appId, userId, saveId) => `${saveRoot(appId, userId, saveId)}/${collectionName}`;

export const saveCollection = (appId, userId, saveId, collectionName) =>
  saveCollectionPath(collectionName)(appId, userId, saveId);

export const paths = {
  wrestlers: saveCollectionPath('save_wrestlers'),
  messages: saveCollectionPath('save_messages'),
  shows: saveCollectionPath('save_shows'),
  storylines: saveCollectionPath('save_storylines'),
  relationships: saveCollectionPath('save_relationships'),
  careerEvents: saveCollectionPath('save_career_events'),
  companies: saveCollectionPath('save_companies'),
  staff: saveCollectionPath('save_staff'),
  titles: saveCollectionPath('save_titles'),
  tvDeals: saveCollectionPath('save_tv_deals'),
  tvShows: saveCollectionPath('save_tv_shows'),
  events: saveCollectionPath('save_events'),
  teams: saveCollectionPath('save_teams'),
  stables: saveCollectionPath('save_stables'),
  sponsors: saveCollectionPath('save_sponsors'),
  socialPosts: saveCollectionPath('save_social_posts'),
  journal: saveCollectionPath('save_journal_entries'),
};

export const saveDoc = (collectionPath, docId) => `${collectionPath}/${docId}`;
