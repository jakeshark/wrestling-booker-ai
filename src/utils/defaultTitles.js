import { DEFAULT_COMPANY, DEFAULT_DATASET_ID } from './defaultDataset';

/**
 * Default title belts for Proving Ground Wrestling.
 * These are seeded into the public `dataset_titles` collection and copied
 * into `save_titles` when a new game is created.
 *
 * All belts start vacant (currentHolderId: null).
 * companyId uses the dataset company ID ('pgw') — it gets remapped to the
 * save's Firestore company doc ID during new game creation via idMap.
 */
export const DEFAULT_TITLES = [
  {
    id: 'pgw-world-heavyweight-championship',
    datasetId: DEFAULT_DATASET_ID,
    companyId: DEFAULT_COMPANY.id,
    name: 'PGW World Heavyweight Championship',
    shortName: 'World Title',
    prestige: 'World',
    weightClass: 'Heavyweight',
    isTagTeam: false,
    isActive: true,
    currentHolderId: null,
    currentHolderName: null,
    currentHolderIds: null,
    wonOn: null,
    history: [],
  },
  {
    id: 'pgw-intercontinental-championship',
    datasetId: DEFAULT_DATASET_ID,
    companyId: DEFAULT_COMPANY.id,
    name: 'PGW Intercontinental Championship',
    shortName: 'Intercontinental Title',
    prestige: 'Secondary',
    weightClass: null,
    isTagTeam: false,
    isActive: true,
    currentHolderId: null,
    currentHolderName: null,
    currentHolderIds: null,
    wonOn: null,
    history: [],
  },
  {
    id: 'pgw-tag-team-championships',
    datasetId: DEFAULT_DATASET_ID,
    companyId: DEFAULT_COMPANY.id,
    name: 'PGW Tag Team Championships',
    shortName: 'Tag Titles',
    prestige: 'Tag',
    weightClass: null,
    isTagTeam: true,
    isActive: true,
    currentHolderId: null,
    currentHolderName: null,
    currentHolderIds: null,
    wonOn: null,
    history: [],
  },
];

/**
 * Returns the prestige color classes for a title belt (Tailwind).
 */
export function getTitlePrestigeStyle(prestige) {
  switch (prestige) {
    case 'World':     return { badge: 'bg-yellow-600 text-yellow-100', ring: 'ring-yellow-500' };
    case 'Secondary': return { badge: 'bg-blue-600 text-blue-100',   ring: 'ring-blue-500' };
    case 'Tag':       return { badge: 'bg-green-700 text-green-100', ring: 'ring-green-500' };
    case 'Specialty': return { badge: 'bg-purple-700 text-purple-100', ring: 'ring-purple-500' };
    default:          return { badge: 'bg-gray-600 text-gray-100',   ring: 'ring-gray-500' };
  }
}

export default DEFAULT_TITLES;
