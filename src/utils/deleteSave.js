import { collection, doc, deleteDoc, getDocs, writeBatch } from 'firebase/firestore';
import paths, {
  saveDoc,
  saveMessages,
  saveWrestlers,
  saveShows,
  saveStorylines,
  saveCareerEvents,
  titlesCol,
} from './firestorePaths';

const SUBCOLLECTIONS = [
  { name: 'save_messages', builder: saveMessages },
  { name: 'save_wrestlers', builder: saveWrestlers },
  { name: 'save_shows', builder: saveShows },
  { name: 'save_storylines', builder: saveStorylines },
  { name: 'save_career_events', builder: saveCareerEvents },
  { name: 'save_titles', builder: titlesCol },
];

export async function deletePlayerSave({ db, appId, userId, saveId }) {
  if (!db) throw new Error('Firestore instance is required.');
  if (!appId || !userId || !saveId) throw new Error('appId, userId, and saveId are required for deletePlayerSave.');

  console.log(`[DeleteSave] start saveId=${saveId}`);

  for (const { name, builder } of SUBCOLLECTIONS) {
    if (typeof builder !== 'function') {
      console.warn(`[DeleteSave] Missing path builder for ${name}, skipping.`);
      continue;
    }

    const collectionPath = builder(appId, userId, saveId);
    const colRef = collection(db, collectionPath);
    const snapshot = await getDocs(colRef);
    const docs = snapshot.docs;

    if (docs.length === 0) {
      console.log(`[DeleteSave] ${name}: no documents to delete.`);
      continue;
    }

    let batchIndex = 0;
    for (let i = 0; i < docs.length; i += 500) {
      batchIndex += 1;
      const batch = writeBatch(db);
      const chunk = docs.slice(i, i + 500);
      chunk.forEach(docSnap => batch.delete(docSnap.ref));
      await batch.commit();
      console.log(`[DeleteSave] ${name}: committed batch ${batchIndex} deleting ${chunk.length} documents.`);
    }

    console.log(`[DeleteSave] ${name}: deleted ${docs.length} documents total.`);
  }

  const saveDocPath = (typeof saveDoc === 'function') ? saveDoc(appId, userId, saveId) : paths.playerSaveDocPath(appId, userId, saveId);
  await deleteDoc(doc(db, saveDocPath));
  console.log(`[DeleteSave] complete saveId=${saveId}`);
}

export default deletePlayerSave;
