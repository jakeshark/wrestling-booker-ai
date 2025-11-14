const POSITIVE_KEYWORDS = ['friend', 'ally', 'like', 'mentor', 'partner', 'respect', 'love', 'trusted'];
const NEGATIVE_KEYWORDS = ['hate', 'dislike', 'rival', 'enemy', 'resent', 'bad blood', 'heat', 'hostile'];

const simplifyRelationshipType = (type = '') => {
  const normalized = type.toLowerCase();

  if (normalized.includes('tag')) return 'Tag partner';
  if (normalized.includes('mentor')) return 'Mentor link';
  if (normalized.includes('ally') || normalized.includes('alliance')) return 'Ally';
  if (normalized.includes('rival') || normalized.includes('grudge')) return 'Rival';
  if (normalized.includes('partner')) return 'Partner';

  return type;
};

const classifyTone = (status = '', type = '') => {
  const sample = `${status} ${type}`.toLowerCase();

  if (POSITIVE_KEYWORDS.some(keyword => sample.includes(keyword))) {
    return 'positive';
  }

  if (NEGATIVE_KEYWORDS.some(keyword => sample.includes(keyword))) {
    return 'negative';
  }

  return 'neutral';
};

const formatPersonName = (person) => {
  if (!person) return 'Unknown Person';

  if (person.shortName && person.shortName.trim().length > 0) {
    return person.shortName.trim();
  }

  return person.name || 'Unknown Person';
};

export const buildKeyRelationships = (wrestlerId, relationships = [], wrestlers = [], limit = 4) => {
  if (!wrestlerId) return [];

  const relevant = relationships.filter(rel =>
    rel && (rel.personA_Id === wrestlerId || rel.personB_Id === wrestlerId)
  );

  const details = relevant.map(rel => {
    const otherId = rel.personA_Id === wrestlerId ? rel.personB_Id : rel.personA_Id;
    const otherPerson = wrestlers.find(w => w.id === otherId);
    const role = simplifyRelationshipType(rel.relationshipType || 'Relationship');
    const tone = classifyTone(rel.status || '', rel.relationshipType || '');

    return {
      id: rel.id,
      role,
      tone,
      status: rel.status || 'Status unknown',
      otherName: formatPersonName(otherPerson)
    };
  });

  return details.slice(0, limit);
};

export default buildKeyRelationships;
