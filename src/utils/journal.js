import { addDoc, collection, getFirestore, Timestamp } from 'firebase/firestore';
import paths from './firestorePaths';

export async function enqueueJournalNote({ appId, userId, saveId }, payload = {}) {
  const db = getFirestore();
  const { type, summary, meta } = payload;
  const journalCollectionPath = paths.playerSaveCollection(appId, userId, saveId, 'save_journal');
  const docRef = await addDoc(collection(db, journalCollectionPath), {
    type,
    summary,
    createdAt: Timestamp.now(),
    status: 'open',
    meta
  });

  return docRef.id;
}

export default enqueueJournalNote;
