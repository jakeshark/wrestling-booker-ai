const isNumeric = (value) => typeof value === 'number' && Number.isFinite(value);

export const getSkillRating = (wrestler = {}, statKey) => {
  if (!wrestler) return null;
  const stats = wrestler.stats || {};
  const inRing = wrestler.inRing || {};

  switch (statKey) {
    case 'brawl':
      if (isNumeric(stats.brawling)) return stats.brawling;
      if (isNumeric(inRing.brawl)) return inRing.brawl;
      break;
    case 'speed':
      if (isNumeric(stats.speed)) return stats.speed;
      if (isNumeric(inRing.speed)) return inRing.speed;
      break;
    case 'tech':
      if (isNumeric(stats.technical)) return stats.technical;
      if (isNumeric(inRing.technical)) return inRing.technical;
      break;
    case 'charisma':
      if (isNumeric(stats.charisma)) return stats.charisma;
      if (isNumeric(wrestler.charisma)) return wrestler.charisma;
      if (isNumeric(wrestler.character?.charisma)) return wrestler.character.charisma;
      break;
    default:
      break;
  }

  return null;
};

export const calculateOverallRating = (wrestler = {}) => {
  const coreKeys = ['brawl', 'speed', 'tech', 'charisma'];
  const values = coreKeys
    .map((key) => getSkillRating(wrestler, key))
    .filter((value) => isNumeric(value));

  if (values.length === 0) return null;

  const total = values.reduce((sum, value) => sum + value, 0);
  return Math.round(total / values.length);
};

export const getPopularityRating = (wrestler = {}) => {
  if (isNumeric(wrestler.popularity)) return wrestler.popularity;
  if (isNumeric(wrestler.metadata?.popularity)) return wrestler.metadata.popularity;
  if (isNumeric(wrestler.stats?.popularity)) return wrestler.stats.popularity;
  return null;
};

export default {
  calculateOverallRating,
  getPopularityRating,
  getSkillRating
};
