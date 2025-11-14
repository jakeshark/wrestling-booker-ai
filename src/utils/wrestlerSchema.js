const ALLOWED_GENDERS = new Set(['Male', 'Female', 'Nonbinary']);
const ALLOWED_WEIGHT_CLASSES = new Set([
  'Lightweight',
  'Middleweight',
  'Cruiserweight',
  'Heavyweight',
  'Super Heavyweight'
]);
const ALLOWED_ALIGNMENTS = new Set(['Face', 'Heel', 'Tweener']);
const ALLOWED_MOVE_TYPES = new Set(['Strike', 'Slam', 'Submission', 'Top Rope']);
const ALLOWED_CONTRACT_TYPES = new Set(['Written', 'Per Appearance']);

const coerceNumber = (value, fallback) => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  if (typeof fallback === 'number' && Number.isFinite(fallback)) return fallback;
  return 0;
};

const clampNumber = (value, fallback = 0, min = 0, max = 100) => {
  const num = coerceNumber(value, fallback);
  const clamped = Math.max(min, Math.min(max, num));
  return Math.round(clamped);
};

const toInteger = (value, fallback = 0) => Math.round(coerceNumber(value, fallback));

const ensureString = (value, fallback = '') => {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed.length > 0) return trimmed;
  }
  return fallback;
};

const ensureStringArray = (value, fallback = []) => {
  if (!Array.isArray(value)) return [...fallback];
  const unique = new Set();
  for (const entry of value) {
    const sanitized = ensureString(entry, '');
    if (sanitized) unique.add(sanitized);
  }
  return Array.from(unique.values());
};

const ensureEnum = (value, allowed, fallback) => {
  if (allowed.has(value)) return value;
  return fallback;
};

const sanitizeFinisher = (finisher, fallback) => {
  if (!finisher || typeof finisher !== 'object') {
    return { ...fallback };
  }

  const name = ensureString(finisher.name, fallback.name);
  const moveType = ALLOWED_MOVE_TYPES.has(finisher.moveType)
    ? finisher.moveType
    : fallback.moveType;

  return { name, moveType };
};

const ensureFinishers = (finishers, wrestlerName) => {
  const base = ensureString(wrestlerName, 'Signature');
  const fallback = [
    { name: `${base} Impact`, moveType: 'Slam' },
    { name: `${base} Finale`, moveType: 'Submission' }
  ];

  if (!Array.isArray(finishers) || finishers.length < 2) {
    return fallback;
  }

  const [first, second] = finishers;
  return [
    sanitizeFinisher(first, fallback[0]),
    sanitizeFinisher(second, fallback[1])
  ];
};

const sanitizeRelationships = (relationships = {}) => {
  const safe = typeof relationships === 'object' && relationships !== null ? relationships : {};
  const allies = ensureStringArray(safe.allies);
  const rivals = ensureStringArray(safe.rivals);
  const tagPartner = ensureString(safe.tagPartner, '') || null;
  const stable = ensureString(safe.stable, '') || null;

  return {
    allies,
    rivals,
    tagPartner,
    stable
  };
};

export const slugifyWrestlerName = (name) => {
  const safe = ensureString(name, 'wrestler');
  const slug = safe
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || 'wrestler';
};

export const mapRelationshipNamesToIds = (relationships = {}, nameToId = {}) => {
  const safe = sanitizeRelationships(relationships);
  const resolve = (value) => {
    if (!value) return null;
    if (nameToId[value]) return nameToId[value];
    const normalized = value.replace(/\s+/g, ' ').trim();
    if (nameToId[normalized]) return nameToId[normalized];
    return value;
  };

  const allies = safe.allies.map(resolve).filter(Boolean);
  const rivals = safe.rivals.map(resolve).filter(Boolean);
  const tagPartner = resolve(safe.tagPartner);

  return {
    allies,
    rivals,
    tagPartner: tagPartner || null,
    stable: safe.stable || null
  };
};

export const normalizeWrestler = (raw = {}) => {
  const name = ensureString(raw.name, 'Unnamed Wrestler');
  const gender = ensureEnum(raw.gender, ALLOWED_GENDERS, 'Male');
  const weightClass = ensureEnum(raw.weightClass, ALLOWED_WEIGHT_CLASSES, 'Middleweight');
  const alignment = ensureEnum(raw.alignment || raw.disposition, ALLOWED_ALIGNMENTS, 'Face');
  const gimmick = ensureString(raw.gimmick || raw.character?.gimmick, 'Unknown');

  const charisma = clampNumber(
    raw.charisma ?? raw.character?.charisma ?? raw.stats?.charisma,
    50
  );
  const speakingAbility = clampNumber(
    raw.speakingAbility ?? raw.character?.speakingAbility,
    charisma,
    0,
    100
  );
  const starPower = clampNumber(
    raw.starPower ?? raw.character?.starPower,
    Math.round((charisma + speakingAbility) / 2)
  );

  const brawl = clampNumber(raw.inRing?.brawl ?? raw.stats?.brawling, 50);
  const speed = clampNumber(raw.inRing?.speed ?? raw.stats?.speed, 50);
  const technical = clampNumber(raw.inRing?.technical ?? raw.stats?.technical, 50);
  const aerial = clampNumber(raw.inRing?.aerial ?? raw.stats?.aerial, speed);
  const psychology = clampNumber(raw.inRing?.psychology ?? raw.stats?.psychology, 60);
  const safety = clampNumber(raw.inRing?.safety ?? raw.stats?.safety, 70);

  const condition = clampNumber(raw.physical?.condition ?? raw.condition, 70);
  const momentum = clampNumber(raw.physical?.momentum ?? raw.momentum, 50);
  const durability = clampNumber(raw.physical?.durability ?? raw.durability, 70);

  const morale = clampNumber(raw.metadata?.morale ?? raw.morale, 75);
  const popularity = clampNumber(
    raw.metadata?.popularity ?? raw.popularity,
    Math.round((charisma + starPower) / 2)
  );
  const debutYear = clampNumber(
    raw.metadata?.debutYear ?? raw.debutYear,
    2010,
    1960,
    2035
  );
  const bio = ensureString(raw.metadata?.bio ?? raw.bio, 'Biography not yet provided.');

  const finishers = ensureFinishers(raw.moveSet?.finishers || raw.finishers, name);

  const professionalism = clampNumber(
    raw.personality?.professionalism ?? raw.professionalism,
    60
  );
  const motivation = clampNumber(raw.personality?.motivation ?? raw.motivation, 60);
  const friendliness = clampNumber(raw.personality?.friendliness ?? raw.friendliness, 60);
  const behaviorNotes = ensureStringArray(raw.personality?.behaviorNotes ?? raw.behaviorNotes);

  const relationships = sanitizeRelationships(raw.relationships);

  const contractType = ensureEnum(
    raw.contract?.contractType ?? raw.contractType,
    ALLOWED_CONTRACT_TYPES,
    'Per Appearance'
  );
  const durationMonths = Math.max(
    0,
    toInteger(raw.contract?.durationMonths ?? raw.durationMonths, contractType === 'Per Appearance' ? 12 : 24)
  );
  const monthlySalary = Math.max(
    0,
    toInteger(raw.contract?.monthlySalary ?? raw.monthlySalary, contractType === 'Per Appearance' ? 8000 : 25000)
  );

  const normalized = {
    ...raw,
    id: ensureString(raw.id, raw.id || ''),
    name,
    gender,
    age: clampNumber(raw.age, 30, 16, 60),
    weightClass,
    nationality: ensureString(raw.nationality, 'United States'),
    alignment,
    disposition: alignment,
    gimmick,
    character: {
      alignment,
      gimmick,
      charisma,
      speakingAbility,
      starPower
    },
    charisma,
    speakingAbility,
    starPower,
    inRing: {
      brawl,
      speed,
      technical,
      aerial,
      psychology,
      safety
    },
    physical: {
      condition,
      momentum,
      durability
    },
    moveSet: {
      finishers
    },
    finishers,
    contract: {
      contractType,
      durationMonths,
      monthlySalary
    },
    personality: {
      professionalism,
      motivation,
      friendliness,
      behaviorNotes
    },
    relationships,
    metadata: {
      morale,
      popularity,
      debutYear,
      bio
    },
    morale,
    popularity,
    stats: {
      brawling: brawl,
      speed,
      technical,
      charisma
    }
  };

  return normalized;
};

export const prepareWrestlerForStorage = (wrestler, { id, datasetId, nameToId } = {}) => {
  const base = { ...(wrestler || {}) };

  if (id) {
    base.id = id;
  }
  if (datasetId) {
    base.datasetId = datasetId;
  }

  if (base.relationships && nameToId) {
    base.relationships = mapRelationshipNamesToIds(base.relationships, nameToId);
  }

  const normalized = normalizeWrestler(base);
  if (datasetId) {
    normalized.datasetId = datasetId;
  }
  if (id) {
    normalized.id = id;
  }

  return normalized;
};

export default normalizeWrestler;
