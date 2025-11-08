// src/App.jsx
import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  addDoc,
  collection,
  query,
  where,
  getDocs,
  Timestamp,
  writeBatch,
  setLogLevel
} from 'firebase/firestore';

// --- Icon Components ---
const LoadingIcon = () => (
  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const GameIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-indigo-400">
    <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l2.056-7.36H4.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z" clipRule="evenodd" />
  </svg>
);

const MessageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6 mr-2">
    <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408s4.262.139 6.337.408c.922.12 1.631.94 1.631 1.876v13.066c0 .936-.709 1.756-1.631 1.876-2.075.27-4.19.408-6.337.408s-4.262-.139-6.337-.408c-.922-.12-1.631-.94-1.631-1.876V4.534c0-.936.709-1.756 1.631-1.876ZM7.5 10.5a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H8.25Z" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
    <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
  </svg>
);

const AssistantIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6 mr-2">
    <path fillRule="evenodd" d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.861 2.861l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.861 2.861l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.861-2.861l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.385 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM13.5 18a.75.75 0 0 1 .721.544l.27 1.256a2.25 2.25 0 0 0 1.715 1.715l1.256.27a.75.75 0 0 1 0 1.442l-1.256.27a2.25 2.25 0 0 0-1.715 1.715l-.27 1.256a.75.75 0 0 1-1.442 0l-.27-1.256a2.25 2.25 0 0 0-1.715-1.715l-1.256-.27a.75.75 0 0 1 0-1.442l1.256.27a2.25 2.25 0 0 0 1.715-1.715l.27-1.256a.75.75 0 0 1 .721-.544Z" clipRule="evenodd" />
  </svg>
);

const BookingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6 mr-2">
    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z" clipRule="evenodd" />
  </svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5 mr-2">
    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z" clipRule="evenodd" />
  </svg>
);

const RosterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6 mr-2">
    <path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM15.75 9.75a.75.75 0 0 0-1.5 0v.75a.75.75 0 0 0 1.5 0v-.75ZM21 9.75a.75.75 0 0 0-1.5 0v.75a.75.75 0 0 0 1.5 0v-.75ZM9.75 9.75a.75.75 0 0 0-1.5 0v.75a.75.75 0 0 0 1.5 0v-.75ZM7.06 12.236a.75.75 0 0 0-1.06 0l-.03.03a.75.75 0 0 0 1.06 1.06l.03-.03a.75.75 0 0 0 0-1.06Zm10.97 0a.75.75 0 0 0 0 1.06l.03.03a.75.75 0 0 0 1.06-1.06l-.03-.03a.75.75 0 0 0-1.06 0ZM7.5 15a.75.75 0 0 0-1.5 0v.75a.75.75 0 0 0 1.5 0v-.75Zm3.375-1.5a.75.75 0 0 0-1.5 0v3a.75.75 0 0 0 1.5 0v-3Zm3.75 0a.75.75 0 0 0-1.5 0v3a.75.75 0 0 0 1.5 0v-3Zm3.375 1.5a.75.75 0 0 0-1.5 0v.75a.75.75 0 0 0 1.5 0v-.75Z" clipRule="evenodd" />
    <path d="M4.5 19.5a3 3 0 0 0 3 3h9a3 3 0 0 0 3-3v-5.63l-3.03-3.03a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 0 1-1.06 0l-3-3a.75.75 0 0 0-1.06 0L4.5 13.87V19.5Z" />
  </svg>
);

const UserPlusIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" className={className}>
    <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM1.646 13.107a.75.75 0 0 1 .862.088c.854.63 1.91.955 3.028.955s2.174-.325 3.028-.955a.75.75 0 1 1 .95 1.169A4.502 4.502 0 0 0 8.5 15.5c-1.318 0-2.55-.42-3.53-1.134a.75.75 0 0 1 .088-.95l-.002-.002ZM15 9.75a.75.75 0 0 1 .75.75v2.25h2.25a.75.75 0 0 1 0 1.5H15.75v2.25a.75.75 0 0 1-1.5 0v-2.25H12a.75.75 0 0 1 0-1.5h2.25V10.5a.75.75 0 0 1 .75-.75Z" />
  </svg>
);

const XCircleIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" className={className}>
    <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.707-11.707a1 1 0 0 0-1.414-1.414L10 8.586 7.707 6.293a1 1 0 0 0-1.414 1.414L8.586 10l-2.293 2.293a1 1 0 1 0 1.414 1.414L10 11.414l2.293 2.293a1 1 0 0 0 1.414-1.414L11.414 10l2.293-2.293Z" clipRule="evenodd" />
  </svg>
);

const StarIcon = ({ className = "w-5 h-5 text-yellow-400" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" className={className}>
    <path fillRule="evenodd" d="M10.868 2.884c.321-.772 1.415-.772 1.736 0l1.83 4.401 4.79 1.149c.82.198 1.135 1.106.546 1.691l-3.473 3.385 1.03 4.88c.174.82-.716 1.459-1.442 1.053L10 18.273l-4.32 2.271c-.726.406-1.616-.234-1.442-1.053l1.03-4.88L1.873 10.124c-.589-.586-.274-1.493.546-1.691l4.79-1.149 1.83-4.401Z" clipRule="evenodd" />
  </svg>
);

const FireIcon = ({ className = "w-6 h-6 mr-2" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className={className}>
    <path fillRule="evenodd" d="M12.963 2.286a.75.75 0 0 0-1.071 1.05 9.75 9.75 0 0 1 1.332 10.065c-.537.42-1.166.738-1.85.966.347.858.52 1.77.52 2.714 0 2.21-1.79 4.019-3.999 4.019S6 21.29 6 19.079c0-.944.173-1.856.52-2.714-.683-.228-1.313-.546-1.85-.966a9.75 9.75 0 0 1 1.332-10.065.75.75 0 0 0-1.071-1.05C2.983 4.25 1.5 6.735 1.5 9.67c0 3.089 1.78 5.765 4.312 6.945.305.138.638.39.998.741.436.422.955.986 1.408 1.626.435.613.75 1.32.75 2.097 0 1.057.86 1.919 1.918 1.919s1.919-.862 1.919-1.919c0-.777.315-1.484.75-2.097.453-.64.972-1.204 1.408-1.626.36-.351.693-.603.998-.741C20.72 15.435 22.5 12.76 22.5 9.67c0-2.935-1.483-5.42-3.86-6.333Z" clipRule="evenodd" />
  </svg>
);

const HistoryIcon = ({ className = "w-6 h-6 mr-2" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className={className}>
    <path fillRule="evenodd" d="M12 1.5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0V3a9 9 0 0 0-9 9 .75.75 0 0 1-1.5 0 10.5 10.5 0 0 1 10.5-10.5ZM10.5 10.038a5.25 5.25 0 1 0 4.93 4.93.75.75 0 0 1 1.437.426A6.75 6.75 0 1 1 9.006 8.35a.75.75 0 0 1 1.493 1.688Z" clipRule="evenodd" />
    <path d="M7.163 15.962c.311.23.638.448.977.652A.75.75 0 0 1 7.8 17.8a9 9 0 1 1 8.4 0 .75.75 0 0 1-1.34.614c.339-.204.666-.423.977-.652a.75.75 0 1 1 .9 1.399A10.499 10.499 0 0 1 12 20.25a10.5 10.5 0 1 1 0-21 10.5 10.5 0 0 1 4.937 1.189.75.75 0 1 1-.9 1.4A9 9 0 0 0 12 3.75a9 9 0 0 0-4.837 1.513.75.75 0 0 1-.9-1.4A10.5 10.5 0 0 1 12 1.5a10.5 10.5 0 0 1 10.5 10.5 10.5 10.5 0 0 1-1.189 4.937.75.75 0 1 1-1.4-.9Z" />
  </svg>
);

const RelationshipsIcon = ({ className = "w-6 h-6 mr-2" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className={className}>
    <path d="M4.5 6.375a.75.75 0 0 1 .75-.75h13.5a.75.75 0 0 1 .75.75v11.25a.75.75 0 0 1-.75.75H5.25a.75.75 0 0 1-.75-.75V6.375Z" />
    <path fillRule="evenodd" d="M5.057 2.376A.75.75 0 0 1 5.25 2.25H18.75a.75.75 0 0 1 .193.021l3.75 1.5a.75.75 0 0 1 .307.601v13.064a.75.75 0 0 1-.307.601l-3.75 1.5A.75.75 0 0 1 18.75 20h-13.5a.75.75 0 0 1-.193-.021l-3.75-1.5a.75.75 0 0 1-.307-.601V4.5a.75.75 0 0 1 .307-.601l3.75-1.5ZM6 3.75l-3 1.2v12.75l3 1.2h12l3-1.2V4.95l-3-1.2H6Z" clipRule="evenodd" />
    <path d="M12 8.25a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3a.75.75 0 0 1 .75-.75Z" />
    <path d="M12 15a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-1.5 0V15.75a.75.75 0 0 1 .75-.75Z" />
    <path d="M8.25 12a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75Z" />
    <path d="M13.5 12a.75.75 0 0 1 .75-.75h1.5a.75.75 0 1 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75Z" />
  </svg>
);

// --- Firebase Config ---
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID
};

function App() {
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [appId, setAppId] = useState(null);

  const [gameState, setGameState] = useState('LOADING');
  const [datasets, setDatasets] = useState([]);
  const [playerSaves, setPlayerSaves] = useState([]);
  const [activeSave, setActiveSave] = useState(null);
  const [gameData, setGameData] = useState({});
  const [loadingMessage, setLoadingMessage] = useState('Initializing Game...');

  // messages UI
  const [showMessagesModal, setShowMessagesModal] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [selectedMessageSenderId, setSelectedMessageSenderId] = useState(null);
  const [replyDraft, setReplyDraft] = useState('');
  const [isReplyDirty, setIsReplyDirty] = useState(false);
  const [hoveredReplyText, setHoveredReplyText] = useState('');
  const [activeMessageForReply, setActiveMessageForReply] = useState(null);
  const [lastSelectedReplyTone, setLastSelectedReplyTone] = useState(null);

  // assistant
  const [showAssistantModal, setShowAssistantModal] = useState(false);
  const [assistantQuery, setAssistantQuery] = useState("");
  const [assistantResponse, setAssistantResponse] = useState("");
  const [isAssistantLoading, setIsAssistantLoading] = useState(false);

  // booking
  const [currentShow, setCurrentShow] = useState(null);
  const [currentSegments, setCurrentSegments] = useState([]);
  const [showSegmentModal, setShowSegmentModal] = useState(false);
  const [editingSegmentIndex, setEditingSegmentIndex] = useState(null);
  const [segmentFormData, setSegmentFormData] = useState({ type: 'Match', participants: [], winnerId: null, storylineId: null });
  const [participantSearch, setParticipantSearch] = useState("");
  const [participantResults, setParticipantResults] = useState([]);

  // show recap
  const [showRecap, setShowRecap] = useState("");
  const [showRating, setShowRating] = useState(0);

  // storylines
  const [showStorylineModal, setShowStorylineModal] = useState(false);
  const [storylineFormData, setStorylineFormData] = useState({ name: '', participants: [] });
  const [storylineParticipantSearch, setStorylineParticipantSearch] = useState("");
  const [storylineParticipantResults, setStorylineParticipantResults] = useState([]);

  // detail screens
  const [viewingWrestler, setViewingWrestler] = useState(null);

  const DATASET_COLLECTIONS = [
    'dataset_companies',
    'dataset_wrestlers',
    'dataset_staff',
    'dataset_titles',
    'dataset_tv_deals',
    'dataset_tv_shows',
    'dataset_events',
    'dataset_teams',
    'dataset_stables',
    'dataset_sponsors',
    'dataset_relationships',
  ];

  const ID_MAPPED_COLLECTIONS = [
    'dataset_companies',
    'dataset_wrestlers',
    'dataset_staff',
    'dataset_teams',
    'dataset_stables',
  ];

  const SAVE_COLLECTIONS_MAP = {
    'dataset_companies': 'save_companies',
    'dataset_wrestlers': 'save_wrestlers',
    'dataset_staff': 'save_staff',
    'dataset_titles': 'save_titles',
    'dataset_tv_deals': 'save_tv_deals',
    'dataset_tv_shows': 'save_tv_shows',
    'dataset_events': 'save_shows',
    'dataset_teams': 'save_teams',
    'dataset_stables': 'save_stables',
    'dataset_sponsors': 'save_sponsors',
    'dataset_relationships': 'save_relationships',
    'save_messages': 'save_messages',
    'save_social_posts': 'save_social_posts',
    'save_storylines': 'save_storylines',
    'save_career_events': 'save_career_events'
  };

  const SAVE_COLLECTION_NAMES = Object.values(SAVE_COLLECTIONS_MAP);

  useEffect(() => {
    try {
      if (!firebaseConfig.apiKey || !firebaseConfig.appId) {
        setLoadingMessage("Firebase config is missing. Please add it to your Vercel Environment Variables.");
        console.error("Firebase config is missing.");
        return;
      }

      setAppId(firebaseConfig.appId);

      const app = initializeApp(firebaseConfig);
      const authInstance = getAuth(app);
      const dbInstance = getFirestore(app);

      setLogLevel('debug');
      setDb(dbInstance);
      setAuth(authInstance);

      onAuthStateChanged(authInstance, async (user) => {
        if (user) {
          setUserId(user.uid);
          setIsAuthReady(true);
        } else {
          try {
            await signInAnonymously(authInstance);
          } catch (error) {
            console.error("Error signing in anonymously:", error);
            if (error.code === 'auth/internal-error' || error.code === 'auth/operation-not-allowed') {
              setLoadingMessage("Authentication Error: Anonymous Sign-In is disabled in your Firebase project. Please enable it in the Firebase Console.");
            } else {
              setLoadingMessage("Authentication failed. Please refresh.");
            }
          }
        }
      });

    } catch (error) {
      console.error("Error initializing Firebase:", error);
      setLoadingMessage("Failed to initialize game data. Please refresh.");
    }
  }, []);

  useEffect(() => {
    if (!isAuthReady || !db || !userId || !appId) return;

    const run = async () => {
      setLoadingMessage('Checking for game data...');
      await seedDefaultDataset(db, userId, appId);

      setLoadingMessage('Fetching datasets...');
      await fetchDatasets(db, userId, appId);

      setLoadingMessage('Fetching your save games...');
      await fetchPlayerSaves(db, userId, appId);

      setGameState('MAIN_MENU');
    };

    run();
  }, [isAuthReady, db, userId, appId]);

  const seedDefaultDataset = async (db, userId, appId) => {
    const datasetId = 'default-fiction';
    const datasetRef = doc(db, `/artifacts/${appId}/public/data/datasets`, datasetId);

    try {
      const docSnap = await getDoc(datasetRef);
      if (docSnap.exists()) return;

      setLoadingMessage('Creating default dataset...');
      const batch = writeBatch(db);

      batch.set(datasetRef, {
        name: "Default Fiction",
        description: "A balanced, fictional universe to start your booking career.",
        createdAt: Timestamp.now()
      });

      const companyRef = doc(collection(db, `/artifacts/${appId}/public/data/dataset_companies`));
      const companyId = companyRef.id;
      batch.set(companyRef, {
        datasetId: datasetId,
        name: "Federation X",
        prestige: 60,
        finances: 5000000,
        publicImage: 50,
        riskLevel: 50,
        size: "National"
      });

      const wrestlers = [
        { name: "Alex 'The Ace' Valour", stats: { brawling: 80, speed: 75, technical: 85, charisma: 90 }, disposition: 'Face', gimmick: 'Franchise Player', alternateNames: ['The Golden Boy'], morale: 75 },
        { name: "Jax 'The Juggernaut' Stone", stats: { brawling: 95, speed: 60, technical: 65, charisma: 70 }, disposition: 'Heel', gimmick: 'Monster', morale: 75 },
        { name: "Kenji 'Codebreak' Tanaka", stats: { brawling: 70, speed: 90, technical: 95, charisma: 80 }, disposition: 'Face', gimmick: 'Show Stealer', morale: 75 },
        { name: "Mia 'Showtime' Evans", stats: { brawling: 65, speed: 85, technical: 80, charisma: 90 }, disposition: 'Face', gimmick: 'Teen Idol', morale: 75 },
        { name: "Victoria 'The Queen' Black", stats: { brawling: 75, speed: 70, technical: 85, charisma: 95 }, disposition: 'Heel', gimmick: 'Rich Snob', alternateNames: ['Vicky Black'], morale: 75 },
        { name: "Leo 'Lionheart' Cruz", stats: { brawling: 85, speed: 80, technical: 75, charisma: 85 }, disposition: 'Face', gimmick: 'Hero', morale: 75 },
        { name: "Silas 'The Serpent' Retch", stats: { brawling: 80, speed: 70, technical: 80, charisma: 85 }, disposition: 'Heel', gimmick: 'Evil', morale: 75 },
        { name: "Eliza 'High-Flyer' Hayes", stats: { brawling: 50, speed: 95, technical: 80, charisma: 75 }, disposition: 'Face', gimmick: 'Daredevil', morale: 75 },
        { name: "Goliath", stats: { brawling: 90, speed: 50, technical: 50, charisma: 60 }, disposition: 'Heel', gimmick: 'Monster', morale: 75 },
        { name: "Johnny Spade", stats: { brawling: 70, speed: 70, technical: 70, charisma: 70 }, disposition: 'Tweener', gimmick: 'No Gimmick Needed', morale: 75 }
      ];

      const wrestlerRefs = {};
      for (const wrestler of wrestlers) {
        const wRef = doc(collection(db, `/artifacts/${appId}/public/data/dataset_wrestlers`));
        wrestlerRefs[wrestler.name] = wRef.id;
        batch.set(wRef, { ...wrestler, datasetId });
      }

      batch.set(doc(collection(db, `/artifacts/${appId}/public/data/dataset_titles`)), {
        datasetId,
        companyId,
        titleName: "FX World Championship",
        prestige: 80,
        isTagTeam: false,
        initialHolderId: null
      });
      batch.set(doc(collection(db, `/artifacts/${appId}/public/data/dataset_titles`)), {
        datasetId,
        companyId,
        titleName: "FX Women's Championship",
        prestige: 70,
        isTagTeam: false,
        initialHolderId: null
      });

      batch.set(doc(collection(db, `/artifacts/${appId}/public/data/dataset_tv_shows`)), {
        datasetId,
        companyId,
        showName: "FX Voltage",
        dayOfWeek: "Monday"
      });

      const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
      for (let i = 0; i < months.length; i++) {
        let tier = "Monthly_Event";
        let name = `${months[i]} Mayhem`;
        if (i === 3) { tier = "Major_Event"; name = "Spring Stampede"; }
        if (i === 7) { tier = "Major_Event"; name = "Summer Scorcher"; }
        if (i === 11) { tier = "Flagship_Event"; name = "Final Conflict"; }

        batch.set(doc(collection(db, `/artifacts/${appId}/public/data/dataset_events`)), {
          datasetId,
          companyId,
          month: i + 1,
          eventName: name,
          eventTier: tier,
        });
      }

      batch.set(doc(collection(db, `/artifacts/${appId}/public/data/dataset_relationships`)), {
        datasetId,
        personA_Id: wrestlerRefs["Alex 'The Ace' Valour"],
        personB_Id: wrestlerRefs["Jax 'The Juggernaut' Stone"],
        relationshipType: 'Rivalry',
        status: 'Strongly Dislike',
        notes: "Real-life rivalry from their training days."
      });
      batch.set(doc(collection(db, `/artifacts/${appId}/public/data/dataset_relationships`)), {
        datasetId,
        personA_Id: wrestlerRefs["Leo 'Lionheart' Cruz"],
        personB_Id: wrestlerRefs["Eliza 'High-Flyer' Hayes"],
        relationshipType: 'Friendship',
        status: 'Friends',
        notes: "Came up on the indies together."
      });

      await batch.commit();

    } catch (err) {
      console.error("Error seeding dataset: ", err);
      setLoadingMessage("Error creating default data. Please refresh.");
    }
  };

  const fetchDatasets = async (db, userId, appId) => {
    try {
      const q = query(collection(db, `/artifacts/${appId}/public/data/datasets`));
      const snap = await getDocs(q);
      setDatasets(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error("Error fetching datasets:", err);
    }
  };

  const fetchPlayerSaves = async (db, userId, appId) => {
    if (!userId) return;
    try {
      const q = query(collection(db, `/artifacts/${appId}/users/${userId}/player_saves`));
      const snap = await getDocs(q);
      setPlayerSaves(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error("Error fetching player saves:", err);
    }
  };

  const handleNewGame = async (datasetId) => {
    if (!userId || !db || !appId) return;
    setGameState('BUSY');
    setLoadingMessage('Starting your new game...');

    try {
      const newSaveData = {
        userId,
        datasetId,
        saveName: `New Game (${new Date().toLocaleDateString()})`,
        lastPlayed: Timestamp.now(),
        currentDate: Timestamp.fromDate(new Date('2025-01-07T09:00:00')),
        playerCompanyId: null
      };

      const saveRef = await addDoc(collection(db, `/artifacts/${appId}/users/${userId}/player_saves`), newSaveData);
      const saveId = saveRef.id;

      const batch = writeBatch(db);
      const idMap = new Map();
      let playerCompanyId = null;

      for (const col of ID_MAPPED_COLLECTIONS) {
        const saveCol = SAVE_COLLECTIONS_MAP[col];
        if (!saveCol) continue;
        const q = query(collection(db, `/artifacts/${appId}/public/data/${col}`), where("datasetId", "==", datasetId));
        const snap = await getDocs(q);
        for (const docSnap of snap.docs) {
          const oldId = docSnap.id;
          const data = docSnap.data();
          const newRef = doc(collection(db, `/artifacts/${appId}/users/${userId}/player_saves/${saveId}/${saveCol}`));
          idMap.set(oldId, newRef.id);
          batch.set(newRef, data);
          if (col === 'dataset_companies' && !playerCompanyId) {
            playerCompanyId = newRef.id;
          }
        }
      }

      const remaining = DATASET_COLLECTIONS.filter(c => !ID_MAPPED_COLLECTIONS.includes(c));
      for (const col of remaining) {
        const saveCol = SAVE_COLLECTIONS_MAP[col];
        if (!saveCol) continue;
        const q = query(collection(db, `/artifacts/${appId}/public/data/${col}`), where("datasetId", "==", datasetId));
        const snap = await getDocs(q);
        for (const docSnap of snap.docs) {
          const data = docSnap.data();
          let newData = { ...data };

          if (col === 'dataset_events') {
            newData.status = "Planned";
            const showDate = (data.month === 1)
              ? new Date(2025, data.month - 1, 7, 18, 0, 0)
              : new Date(2025, data.month - 1, 28, 18, 0, 0);
            newData.date = Timestamp.fromDate(showDate);
            newData.companyId = idMap.get(data.companyId) || data.companyId;
          }

          if (col === 'dataset_relationships') {
            newData.personA_Id = idMap.get(data.personA_Id) || data.personA_Id;
            newData.personB_Id = idMap.get(data.personB_Id) || data.personB_Id;
          }

          if (col === 'dataset_titles') {
            newData.companyId = idMap.get(data.companyId) || data.companyId;
            newData.initialHolderId = idMap.get(data.initialHolderId) || null;
          }

          if (col === 'dataset_tv_shows') {
            newData.companyId = idMap.get(data.companyId) || data.companyId;
          }

          const newRef = doc(collection(db, `/artifacts/${appId}/users/${userId}/player_saves/${saveId}/${saveCol}`));
          batch.set(newRef, newData);
        }
      }

      await batch.commit();
      await setDoc(saveRef, { playerCompanyId }, { merge: true });

      await handleLoadGame(saveId);

    } catch (err) {
      console.error("Error creating new game:", err);
      setLoadingMessage("Failed to create new game. Please try again.");
      setGameState('MAIN_MENU');
    }
  };

  const handleLoadGame = async (saveId) => {
    if (!userId || !db || !appId) return;
    setGameState('BUSY');
    setLoadingMessage('Loading your save game...');

    try {
      const saveRef = doc(db, `/artifacts/${appId}/users/${userId}/player_saves`, saveId);
      const snap = await getDoc(saveRef);
      if (!snap.exists()) throw new Error("Save not found.");
      const saveData = { id: snap.id, ...snap.data() };
      setActiveSave(saveData);

      let loaded = {};
      let unreadCount = 0;

      for (const col of SAVE_COLLECTION_NAMES) {
        const q = query(collection(db, `/artifacts/${appId}/users/${userId}/player_saves/${saveId}/${col}`));
        const colSnap = await getDocs(q);
        const arr = colSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        loaded[col] = arr;
        if (col === 'save_messages') {
          unreadCount = arr.filter(m => !m.isRead).length;
        }
      }

      setGameData(loaded);
      setUnreadMessages(unreadCount);
      setGameState('IN_GAME');

    } catch (err) {
      console.error("Error loading save:", err);
      setLoadingMessage("Failed to load game.");
      setGameState('MAIN_MENU');
    }
  };

  const handleNextDay = async () => {
    if (!activeSave) return;
    setGameState('BUSY');
    setLoadingMessage('Simulating next day...');

    try {
      await runSimulationAndEvents(activeSave.id);

      const currentDate = activeSave.currentDate.toDate();
      const nextDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
      const newTs = Timestamp.fromDate(nextDate);

      const saveRef = doc(db, `/artifacts/${appId}/users/${userId}/player_saves`, activeSave.id);
      await setDoc(saveRef, { currentDate: newTs, lastPlayed: Timestamp.now() }, { merge: true });

      setActiveSave(prev => ({ ...prev, currentDate: newTs }));
      setGameState('IN_GAME');
    } catch (err) {
      console.error("Error advancing day:", err);
      setLoadingMessage("Error advancing day.");
    }
  };

  const handleExitGame = () => {
    setActiveSave(null);
    setGameData({});
    setGameState('MAIN_MENU');
    fetchPlayerSaves(db, userId, appId);
  };

  const runSimulationAndEvents = async (saveId) => {
    const wrestlers = gameData.save_wrestlers;
    if (!wrestlers || wrestlers.length === 0) return;

    if (Math.random() < 0.25) {
      const randomW = wrestlers[Math.floor(Math.random() * wrestlers.length)];
      const topics = ['unhappy_booking', 'excited_push', 'request_time_off', 'contract_negotiation'];
      const randomTopic = topics[Math.floor(Math.random() * topics.length)];
      await generateAndSaveMessage(saveId, randomW, randomTopic);
    }
  };

  const getCurrentGameTimestamp = () => {
    if (activeSave && activeSave.currentDate) return activeSave.currentDate;
    return Timestamp.now();
  };

  const generateAndSaveMessage = async (saveId, wrestler, topic) => {
    try {
      const resp = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'wrestler-message',
          wrestler,
          topic
        })
      });

      if (!resp.ok) {
        console.error("wrestler-message AI failed:", await resp.text());
        return;
      }

      const data = await resp.json();
      const messageText = data.message;
      const replyOptions = Array.isArray(data.replyOptions) ? data.replyOptions.slice(0, 3) : [];

      if (messageText) {
        const messageData = {
          senderId: wrestler.id,
          senderName: wrestler.name,
          body: messageText,
          timestamp: getCurrentGameTimestamp(),
          type: 'Text',
          isRead: false,
          topic: topic,
          replyOptions: replyOptions
        };

        const messagesRef = collection(db, `/artifacts/${appId}/users/${userId}/player_saves/${saveId}/save_messages`);
        const newRef = await addDoc(messagesRef, messageData);

        setGameData(prev => ({
          ...prev,
          save_messages: [...(prev.save_messages || []), { id: newRef.id, ...messageData }]
        }));
        setUnreadMessages(prev => prev + 1);
      }
    } catch (err) {
      console.error("Error generating message:", err);
    }
  };

  const handleGetAIAdvice = async () => {
    if (!assistantQuery || !gameData.save_wrestlers) return;

    setIsAssistantLoading(true);
    setAssistantResponse("");

    const rosterContext = gameData.save_wrestlers.map(w => (
      `${w.name} (Disposition: ${w.disposition}, Gimmick: ${w.gimmick}, Morale: ${w.morale}, Charisma: ${w.stats.charisma})`
    )).join('\n');

    try {
      const resp = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'booker-assistant',
          rosterContext,
          query: assistantQuery
        })
      });

      if (!resp.ok) {
        throw new Error(`assistant call failed: ${resp.status}`);
      }

      const data = await resp.json();
      setAssistantResponse(data.text || "Couldn't generate response.");
    } catch (err) {
      console.error("Error in assistant:", err);
      setAssistantResponse("There was an error connecting to the AI assistant. Please try again.");
    } finally {
      setIsAssistantLoading(false);
    }
  };

  const handleMarkMessagesRead = async () => {
    if (!activeSave || unreadMessages === 0) return;
    setUnreadMessages(0);

    setGameData(prev => ({
      ...prev,
      save_messages: (prev.save_messages || []).map(m => ({ ...m, isRead: true }))
    }));

    try {
      const batch = writeBatch(db);
      const ref = collection(db, `/artifacts/${appId}/users/${userId}/player_saves/${activeSave.id}/save_messages`);
      (gameData.save_messages || []).forEach(m => {
        if (!m.isRead) {
          batch.update(doc(ref, m.id), { isRead: true });
        }
      });
      await batch.commit();
    } catch (err) {
      console.error("Error marking read:", err);
    }
  };

  const calculateSegmentRating = (segment, allWrestlers) => {
    if (!segment || segment.participants.length === 0) return 0;
    let totalCharisma = 0;
    let totalWorkrate = 0;
    const participants = [];

    for (const p of segment.participants) {
      const w = allWrestlers.find(x => x.id === p.id);
      if (w) {
        participants.push(w);
        totalCharisma += w.stats.charisma;
      }
    }

    const count = participants.length;
    if (count === 0) return 0;
    const avgCharisma = totalCharisma / count;

    if (segment.type === 'Angle') {
      return Math.min(100, Math.floor(avgCharisma));
    }

    if (segment.type === 'Match') {
      for (const w of participants) {
        totalWorkrate += (w.stats.brawling + w.stats.speed + w.stats.technical) / 3;
      }
      const avgWorkrate = totalWorkrate / count;
      const rating = (avgCharisma * 0.6) + (avgWorkrate * 0.4);
      return Math.min(100, Math.floor(rating));
    }

    return 0;
  };

  const handleStartBookingShow = (show) => {
    setCurrentShow(show);
    setCurrentSegments(Array(10).fill(null));
    setGameState('BOOKING_SHOW');
  };

  const handleOpenSegmentModal = (idx) => {
    setEditingSegmentIndex(idx);
    const existing = currentSegments[idx];
    setSegmentFormData(existing || { type: 'Match', participants: [], winnerId: null, storylineId: null });
    setParticipantSearch("");
    setParticipantResults([]);
    setShowSegmentModal(true);
  };

  const handleSaveSegment = () => {
    const newSegs = [...currentSegments];
    newSegs[editingSegmentIndex] = segmentFormData;
    setCurrentSegments(newSegs);
    setShowSegmentModal(false);
    setEditingSegmentIndex(null);
    setSegmentFormData({ type: 'Match', participants: [], winnerId: null, storylineId: null });
  };

  const handleRunShow = async () => {
    setGameState('BUSY');
    setLoadingMessage('Calculating segment ratings...');

    try {
      let rated = [];
      let totalWeighted = 0;
      let totalWeight = 0;

      let lastIndex = -1;
      for (let i = currentSegments.length - 1; i >= 0; i--) {
        if (currentSegments[i]) {
          lastIndex = i;
          break;
        }
      }

      for (let i = 0; i < currentSegments.length; i++) {
        const seg = currentSegments[i];
        if (!seg) {
          rated.push(null);
          continue;
        }
        const rating = calculateSegmentRating(seg, gameData.save_wrestlers);
        const rSeg = { ...seg, rating };
        rated.push(rSeg);
        let weight = 1.0;
        if (i === 0) weight = 1.2;
        if (i === lastIndex) weight = 2.0;
        totalWeighted += rating * weight;
        totalWeight += weight;
      }

      const finalRating = totalWeight > 0 ? Math.floor(totalWeighted / totalWeight) : 0;
      setShowRating(finalRating);

      setLoadingMessage('Logging career events...');
      await logCareerEvents(rated, finalRating);

      setLoadingMessage('Simulating backstage changes...');
      await runShowSimulation(rated, currentShow);

      setLoadingMessage('Generating show recap...');
      const recap = await generateShowRecap(currentShow, rated, finalRating);
      setShowRecap(recap);

      setLoadingMessage('Saving show results...');

      const showRef = doc(db, `/artifacts/${appId}/users/${userId}/player_saves/${activeSave.id}/save_shows`, currentShow.id);
      const updateData = {
        status: "Complete",
        segments: rated,
        rating: finalRating,
        recap
      };
      await setDoc(showRef, updateData, { merge: true });

      setGameData(prev => ({
        ...prev,
        save_shows: prev.save_shows.map(s => s.id === currentShow.id ? { ...s, ...updateData } : s)
      }));

      setGameState('SHOW_RESULTS');

    } catch (err) {
      console.error("Error running show:", err);
      setLoadingMessage("Error running show.");
      setGameState('BOOKING_SHOW');
    }
  };

  const generateShowRecap = async (show, ratedSegments, rating) => {
    const payload = {
      type: 'show-recap',
      showName: show.eventName,
      overallRating: rating,
      segments: ratedSegments.map(seg => {
        if (!seg) return null;
        return {
          type: seg.type,
          participants: seg.participants,
          rating: seg.rating,
          storylineId: seg.storylineId || null
        };
      })
    };

    try {
      const resp = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!resp.ok) throw new Error(`recap failed: ${resp.status}`);

      const data = await resp.json();
      return data.text || "Recap unavailable.";
    } catch (err) {
      console.error("Error generating recap:", err);
      return "Recap unavailable.";
    }
  };

  const runShowSimulation = async (ratedSegments, show) => {
    if (!ratedSegments || !show || !gameData.save_wrestlers || !gameData.save_relationships || !gameData.save_storylines || !db || !userId || !appId) {
      return;
    }

    const batch = writeBatch(db);
    const wrestlerUpdates = new Map();
    const storylineUpdates = new Map();

    const allW = gameData.save_wrestlers;
    const allR = gameData.save_relationships;
    const allS = gameData.save_storylines;

    const getWrestler = (id) => {
      if (wrestlerUpdates.has(id)) return wrestlerUpdates.get(id);
      return allW.find(w => w.id === id);
    };

    const getRelationship = (a, b) => {
      return allR.find(rel =>
        (rel.personA_Id === a && rel.personB_Id === b) ||
        (rel.personA_Id === b && rel.personB_Id === a)
      );
    };

    const getStoryline = (id) => {
      if (storylineUpdates.has(id)) return storylineUpdates.get(id);
      return allS.find(s => s.id === id);
    };

    const moraleMult = (tier) => {
      switch (tier) {
        case 'Flagship_Event': return 2.0;
        case 'Major_Event': return 1.5;
        default: return 1.0;
      }
    };

    const heatDelta = (r) => {
      if (r >= 75) return 5;
      if (r >= 50) return 2;
      return -3;
    };

    try {
      const mMult = moraleMult(show.eventTier);

      for (const seg of ratedSegments) {
        if (!seg) continue;

        const segRating = seg.rating || 50;

        if (seg.storylineId) {
          const st = getStoryline(seg.storylineId);
          if (st) {
            const baseHeat = storylineUpdates.has(st.id) ? storylineUpdates.get(st.id).heat : st.heat;
            const newHeat = Math.max(0, Math.min(100, baseHeat + heatDelta(segRating)));
            storylineUpdates.set(st.id, { ...st, heat: newHeat });
          }
        }

        if (seg.type === 'Match') {
          const ids = seg.participants.map(p => p.id);

          for (const p of seg.participants) {
            const w = getWrestler(p.id);
            if (!w) continue;

            const baseMorale = wrestlerUpdates.has(p.id) ? wrestlerUpdates.get(p.id).morale : w.morale;
            let moraleChange = 0;

            if (seg.storylineId) {
              if (seg.winnerId === p.id) {
                moraleChange += 10;
              } else if (seg.winnerId) {
                moraleChange -= 5;
              }
            }

            const opps = ids.filter(id => id !== p.id);
            for (const oppId of opps) {
              const rel = getRelationship(p.id, oppId);
              if (rel) {
                if (rel.status.includes('Friend')) moraleChange += 3;
                else if (rel.status.includes('Dislike') || rel.status.includes('Hate')) moraleChange -= 3;
              }
            }

            if (moraleChange !== 0) {
              const finalMorale = Math.max(0, Math.min(100, baseMorale + moraleChange * mMult));
              wrestlerUpdates.set(p.id, { ...w, morale: finalMorale });
            }
          }
        }
      }

      let updates = false;
      if (wrestlerUpdates.size > 0) {
        wrestlerUpdates.forEach((w, id) => {
          const wRef = doc(db, `/artifacts/${appId}/users/${userId}/player_saves/${activeSave.id}/save_wrestlers`, id);
          batch.update(wRef, { morale: w.morale });
        });
        updates = true;
      }

      if (storylineUpdates.size > 0) {
        storylineUpdates.forEach((s, id) => {
          const sRef = doc(db, `/artifacts/${appId}/users/${userId}/player_saves/${activeSave.id}/save_storylines`, id);
          batch.update(sRef, { heat: s.heat });
        });
        updates = true;
      }

      if (updates) {
        await batch.commit();

        setGameData(prev => ({
          ...prev,
          save_wrestlers: prev.save_wrestlers.map(w => wrestlerUpdates.has(w.id) ? wrestlerUpdates.get(w.id) : w),
          save_storylines: prev.save_storylines.map(s => storylineUpdates.has(s.id) ? storylineUpdates.get(s.id) : s)
        }));
      }

    } catch (err) {
      console.error("Error in show sim:", err);
    }
  };

  const logCareerEvents = async (ratedSegments, showRating) => {
    if (!db || !userId || !appId || !activeSave) return;

    try {
      const batch = writeBatch(db);
      const company = gameData.save_companies.find(c => c.id === activeSave.playerCompanyId);
      const companySize = company ? company.size : "Unknown";

      let newEvents = [];

      for (const seg of ratedSegments) {
        if (!seg) continue;

        for (const p of seg.participants) {
          const oppIds = seg.participants.filter(x => x.id !== p.id).map(x => x.id);
          const oppNames = seg.participants.filter(x => x.id !== p.id).map(x => x.name).join(', ');

          let eventType = "Angle";
          let notes = `Participated in an angle with ${oppNames || 'others'}`;

          if (seg.type === 'Match') {
            if (seg.winnerId === p.id) {
              eventType = "Match Win";
              notes = `Won match against ${oppNames || 'opponent(s)'}`;
            } else if (seg.winnerId) {
              eventType = "Match Loss";
              const winnerName = seg.participants.find(x => x.id === seg.winnerId)?.name;
              notes = `Lost match to ${winnerName || 'opponent(s)'}`;
            } else {
              eventType = "Match Draw/NC";
              notes = `Match with ${oppNames || 'opponent(s)'} ended in a draw/no contest.`;
            }
          }

          const ev = {
            playerSaveId: activeSave.id,
            wrestlerId: p.id,
            date: activeSave.currentDate,
            eventType,
            companyId: activeSave.playerCompanyId,
            companySize,
            segmentRating: seg.rating || showRating,
            opponentIds: oppIds,
            notes,
            storylineId: seg.storylineId || null,
            showId: currentShow.id
          };

          const evRef = doc(collection(db, `/artifacts/${appId}/users/${userId}/player_saves/${activeSave.id}/save_career_events`));
          batch.set(evRef, ev);
          newEvents.push({ id: evRef.id, ...ev });
        }
      }

      await batch.commit();

      setGameData(prev => ({
        ...prev,
        save_career_events: [
          ...(prev.save_career_events || []),
          ...newEvents
        ]
      }));
    } catch (err) {
      console.error("Error logging career events:", err);
    }
  };

  const handleParticipantSearch = (text) => {
    setParticipantSearch(text);
    if (text.length < 1) {
      setParticipantResults([]);
      return;
    }
    const results = gameData.save_wrestlers
      .filter(w => w.name.toLowerCase().includes(text.toLowerCase()))
      .filter(w => !segmentFormData.participants.find(p => p.id === w.id));
    setParticipantResults(results.slice(0, 5));
  };

  const handleAddParticipant = (w) => {
    setSegmentFormData(prev => ({
      ...prev,
      participants: [...prev.participants, { id: w.id, name: w.name }]
    }));
    setParticipantSearch("");
    setParticipantResults([]);
  };

  const handleRemoveParticipant = (id) => {
    setSegmentFormData(prev => ({
      ...prev,
      participants: prev.participants.filter(p => p.id !== id),
      winnerId: prev.winnerId === id ? null : prev.winnerId
    }));
  };

  const handleWinnerSelect = (e) => {
    setSegmentFormData(prev => ({
      ...prev,
      winnerId: e.target.value || null
    }));
  };

  const handleSegmentTypeChange = (e) => {
    setSegmentFormData(prev => ({
      ...prev,
      type: e.target.value,
      winnerId: e.target.value === 'Angle' ? null : prev.winnerId
    }));
  };

  const handleStorylineSelect = (e) => {
    setSegmentFormData(prev => ({
      ...prev,
      storylineId: e.target.value || null
    }));
  };

  const handleOpenCreateStorylineModal = () => {
    setStorylineFormData({ name: '', participants: [] });
    setStorylineParticipantSearch("");
    setStorylineParticipantResults([]);
    setShowStorylineModal(true);
  };

  const handleStorylineParticipantSearch = (text) => {
    setStorylineParticipantSearch(text);
    if (text.length < 1) {
      setStorylineParticipantResults([]);
      return;
    }
    const results = gameData.save_wrestlers
      .filter(w => w.name.toLowerCase().includes(text.toLowerCase()))
      .filter(w => !storylineFormData.participants.find(p => p.id === w.id));
    setStorylineParticipantResults(results.slice(0, 5));
  };

  const handleAddStorylineParticipant = (w) => {
    setStorylineFormData(prev => ({
      ...prev,
      participants: [...prev.participants, { id: w.id, name: w.name }]
    }));
    setStorylineParticipantSearch("");
    setStorylineParticipantResults([]);
  };

  const handleRemoveStorylineParticipant = (id) => {
    setStorylineFormData(prev => ({
      ...prev,
      participants: prev.participants.filter(p => p.id !== id)
    }));
  };

  const handleCreateStoryline = async () => {
    if (!storylineFormData.name || storylineFormData.participants.length < 2) return;
    setLoadingMessage('Creating storyline...');
    setGameState('BUSY');

    try {
      const newData = {
        ...storylineFormData,
        companyId: activeSave.playerCompanyId,
        heat: 10,
        status: "Active",
        beats: []
      };

      const sRef = await addDoc(collection(db, `/artifacts/${appId}/users/${userId}/player_saves/${activeSave.id}/save_storylines`), newData);
      const storyline = { id: sRef.id, ...newData };

      setGameData(prev => ({
        ...prev,
        save_storylines: [...(prev.save_storylines || []), storyline]
      }));

      setShowStorylineModal(false);
      setGameState('STORYLINE_SCREEN');
    } catch (err) {
      console.error("Error creating storyline:", err);
      setLoadingMessage("Failed to create storyline.");
      setGameState('STORYLINE_SCREEN');
    }
  };

  const handleViewCareerHistory = (w) => {
    setViewingWrestler(w);
    setGameState('CAREER_HISTORY_SCREEN');
  };

  const handleViewRelationships = (w) => {
    setViewingWrestler(w);
    setGameState('RELATIONSHIPS_SCREEN');
  };

  // --- Messages helpers ---
  const getAllMessages = () => gameData.save_messages || [];

  const getConversationThreads = () => {
    const all = getAllMessages();
    const map = new Map();

    all.forEach(msg => {
      // ignore system messages entirely
      if (msg.type === 'System') return;
      if (typeof msg.body === 'string' && msg.body.startsWith("System:")) return;

      const senderId = msg.senderId || 'unknown';
      const senderName = msg.senderName || '';

      // filter out the booker in every possible shape
      const isFromBooker = msg.isFromBooker === true;
      const isBookerId = senderId.toLowerCase() === 'booker';
      const isBookerName = senderName.toLowerCase() === 'booker';
      if (isFromBooker || isBookerId || isBookerName) {
        return;
      }

      if (!map.has(senderId)) {
        map.set(senderId, []);
      }
      map.get(senderId).push(msg);
    });

    const threads = [];
    map.forEach((msgs, senderId) => {
      msgs.sort((a, b) => a.timestamp.toMillis() - b.timestamp.toMillis());
      const lastMsg = msgs[msgs.length - 1];
      threads.push({
        senderId,
        senderName: lastMsg?.senderName || 'Unknown',
        lastMessage: lastMsg,
        messages: msgs
      });
    });

    threads.sort((a, b) => b.lastMessage.timestamp.toMillis() - a.lastMessage.timestamp.toMillis());
    return threads;
  };

  const formatGameTimestamp = (ts) => {
    if (!ts) return '';
    try {
      const d = ts.toDate();
      return d.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      });
    } catch {
      return '';
    }
  };

  const handleOpenMessagesModal = () => {
    setShowMessagesModal(true);
    const threads = getConversationThreads();
    if (threads.length > 0) {
      setSelectedMessageSenderId(threads[0].senderId);
      setActiveMessageForReply(threads[0].messages[threads[0].messages.length - 1]);
    } else {
      setSelectedMessageSenderId(null);
      setActiveMessageForReply(null);
    }
    setReplyDraft('');
    setIsReplyDirty(false);
    setHoveredReplyText('');
    setLastSelectedReplyTone(null);
  };

  // make "no" spikier, no matter morale
  const generateLocalFollowUp = (tone, originalMsg, wrestlerObj) => {
    const topic = originalMsg?.topic || 'general';
    const senderName = originalMsg?.senderName || 'Talent';

    if (tone === 'yes') {
      switch (topic) {
        case 'request_time_off':
          return `${senderName}: Appreciate you giving me the time. I’ll come back ready to go.`;
        case 'contract_negotiation':
          return `${senderName}: Thanks for working with me on that. I’ll make sure I justify it.`;
        case 'unhappy_booking':
          return `${senderName}: That’s good to hear. I’ll keep proving I belong higher.`;
        default:
          return `${senderName}: Perfect — thanks for backing me on this.`;
      }
    }

    if (tone === 'no') {
      // Always disappointed or annoyed for a no
      switch (topic) {
        case 'request_time_off':
          return `${senderName}: That’s rough. I was hoping for some flexibility there. I’ll keep it professional, but I’m not thrilled.`;
        case 'contract_negotiation':
          return `${senderName}: Okay, but that’s not what I was looking for. I may have to see what else is out there if this doesn’t move.`;
        case 'unhappy_booking':
          return `${senderName}: So we’re staying where we are. I’ll do business, but I want it on record that I’m not happy with the spot.`;
        case 'excited_push':
          return `${senderName}: Alright. I thought there was momentum, but if the timing’s not there, I guess I wait.`;
        default:
          return `${senderName}: Got it. Not the answer I wanted, but I heard you.`;
      }
    }

    if (tone === 'maybe') {
      switch (topic) {
        case 'request_time_off':
          return `${senderName}: Fair enough — keep me in the loop on dates and I’ll work around it.`;
        case 'contract_negotiation':
          return `${senderName}: Okay, let’s revisit after the next run. I still think I’m worth more.`;
        case 'unhappy_booking':
          return `${senderName}: Alright. If I keep getting reactions, I’ll bring it back to you.`;
        default:
          return `${senderName}: That works — we can circle back when it makes sense.`;
      }
    }

    return `${senderName}: Okay.`;
  };

  const getMoraleDeltaForTone = (tone) => {
    if (tone === 'yes') return +5;
    if (tone === 'no') return -5;
    if (tone === 'maybe') return 0;
    return 0;
  };

  const handleSendReply = async () => {
    if (!activeMessageForReply || !replyDraft.trim()) return;
    if (!activeSave || !db || !userId || !appId) return;

    const senderId = activeMessageForReply.senderId;
    const senderName = activeMessageForReply.senderName;

    const bookerMsg = {
      senderId: 'booker',
      senderName: 'Booker',
      body: replyDraft.trim(),
      timestamp: getCurrentGameTimestamp(),
      type: 'Text',
      isRead: true,
      isFromBooker: true,
      inReplyTo: activeMessageForReply.id
    };

    let usedTone = lastSelectedReplyTone || 'maybe';
    if (!lastSelectedReplyTone) {
      const lower = replyDraft.toLowerCase();
      if (lower.startsWith("yes") || lower.includes("we can do that")) usedTone = 'yes';
      else if (lower.startsWith("no") || lower.includes("not right now") || lower.includes("can’t") || lower.includes("cant") || lower.includes("won’t")) usedTone = 'no';
      else if (lower.includes("if") || lower.includes("revisit") || lower.includes("let's see") || lower.includes("lets see")) usedTone = 'maybe';
    }

    const wrestlerObj = gameData.save_wrestlers?.find(w => w.id === senderId);
    const followUpText = generateLocalFollowUp(usedTone, activeMessageForReply, wrestlerObj);
    const moraleDelta = getMoraleDeltaForTone(usedTone);

    const talentReply = {
      senderId,
      senderName,
      body: followUpText,
      timestamp: getCurrentGameTimestamp(),
      type: 'Text',
      isRead: false,
      isFollowUp: true
    };

    const msgRef = collection(db, `/artifacts/${appId}/users/${userId}/player_saves/${activeSave.id}/save_messages`);
    const bookerDoc = await addDoc(msgRef, bookerMsg);
    const talentDoc = await addDoc(msgRef, talentReply);

    let updatedWrestlers = gameData.save_wrestlers;
    if (senderId && gameData.save_wrestlers) {
      const target = gameData.save_wrestlers.find(w => w.id === senderId);
      if (target) {
        const newMorale = Math.max(0, Math.min(100, (target.morale ?? 75) + moraleDelta));
        const wRef = doc(db, `/artifacts/${appId}/users/${userId}/player_saves/${activeSave.id}/save_wrestlers`, senderId);
        await setDoc(wRef, { morale: newMorale }, { merge: true });
        updatedWrestlers = gameData.save_wrestlers.map(w => w.id === senderId ? { ...w, morale: newMorale } : w);
      }
    }

    setGameData(prev => ({
      ...prev,
      save_messages: [
        ...(prev.save_messages || []),
        { id: bookerDoc.id, ...bookerMsg },
        { id: talentDoc.id, ...talentReply }
      ],
      save_wrestlers: updatedWrestlers
    }));

    setReplyDraft('');
    setIsReplyDirty(false);
    setHoveredReplyText('');
    setLastSelectedReplyTone(null);
  };

  const handleReplyHover = (text) => {
    if (!text) return;
    setHoveredReplyText(text);
    if (!isReplyDirty) setReplyDraft(text);
  };

  const handleReplyHoverLeave = () => {
    setHoveredReplyText('');
    if (!isReplyDirty) setReplyDraft('');
  };

  const handleReplyDraftChange = (e) => {
    setReplyDraft(e.target.value);
    setIsReplyDirty(true);
    setLastSelectedReplyTone(null);
  };

  const handleReplyButtonClick = (text, tone) => {
    if (!text) return;
    setReplyDraft(text);
    setIsReplyDirty(true);
    setHoveredReplyText('');
    setLastSelectedReplyTone(tone);
  };

  // --- renderers ---
  const renderLoadingScreen = () => (
    <div className="flex flex-col items-center justify-center min-h-screen text-white">
      <LoadingIcon />
      <p className="mt-2 text-lg">{loadingMessage}</p>
    </div>
  );

  const renderMainMenu = () => (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="flex items-center space-x-4 p-4 bg-gray-800 rounded-lg shadow-lg">
        <GameIcon />
        <div>
          <h1 className="text-3xl font-bold text-white">Wrestling Booker AI</h1>
          <p className="text-indigo-300">Welcome, Booker. (User ID: {userId})</p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-white mb-4">Start New Game</h2>
          {datasets.length === 0 ? (
            <p className="text-gray-400">No datasets found.</p>
          ) : (
            <div className="space-y-3">
              {datasets.map(dataset => (
                <button
                  key={dataset.id}
                  onClick={() => handleNewGame(dataset.id)}
                  className="w-full text-left p-4 bg-indigo-600 rounded-lg hover:bg-indigo-500 shadow-md transition-all duration-200"
                >
                  <h3 className="text-lg font-bold text-white">{dataset.name}</h3>
                  <p className="text-indigo-100 text-sm">{dataset.description}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-white mb-4">Load Game</h2>
          {playerSaves.length === 0 ? (
            <p className="text-gray-400">No save games found.</p>
          ) : (
            <div className="space-y-3">
              {playerSaves.sort((a, b) => b.lastPlayed.toMillis() - a.lastPlayed.toMillis()).map(save => (
                <button
                  key={save.id}
                  onClick={() => handleLoadGame(save.id)}
                  className="w-full text-left p-4 bg-gray-700 rounded-lg hover:bg-gray-600 shadow-md transition-all duration-200"
                >
                  <h3 className="text-lg font-bold text-white">{save.saveName}</h3>
                  <p className="text-gray-300 text-sm">
                    In-Game Date: {save.currentDate.toDate().toLocaleDateString()}
                  </p>
                  <p className="text-gray-400 text-xs">
                    Last Played: {save.lastPlayed.toDate().toLocaleString()}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderGameDashboard = () => {
    if (!activeSave || !gameData.save_companies) return renderLoadingScreen();
    const playerCompany = gameData.save_companies.find(c => c.id === activeSave.playerCompanyId);

    const currentDateStr = activeSave.currentDate.toDate().toISOString().split('T')[0];
    const plannedShow = gameData.save_shows?.find(show =>
      show.date.toDate().toISOString().split('T')[0] === currentDateStr && show.status === 'Planned'
    );

    return (
      <div className="max-w-7xl mx-auto p-4 md:p-8 text-white">
        <div className="flex flex-col md:flex-row justify-between items-center p-4 bg-gray-800 rounded-lg shadow-lg">
          <div>
            <h1 className="text-2xl font-bold text-white">{playerCompany?.name || 'Your Company'}</h1>
            <p className="text-indigo-300">{activeSave.saveName}</p>
          </div>
          <div className="text-center md:text-right mt-4 md:mt-0">
            <h2 className="text-xl font-semibold">
              {activeSave.currentDate.toDate().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </h2>
            <p className="text-gray-400">Prestige: {playerCompany?.prestige} | Finances: ${playerCompany?.finances.toLocaleString()}</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-3">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg min-h-[400px]">
              <h3 className="text-xl font-semibold mb-4">Today's Actions</h3>
              {plannedShow ? (
                <div className="text-center p-8 bg-gray-700 rounded-lg">
                  <h4 className="text-2xl font-bold text-yellow-300">IT'S SHOW DAY!</h4>
                  <p className="text-lg mt-2">Time to book {plannedShow.eventName}!</p>
                  <p className="text-sm text-gray-400">(Tier: {plannedShow.eventTier})</p>
                  <button
                    onClick={() => handleStartBookingShow(plannedShow)}
                    className="mt-6 px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-500 transition-all"
                  >
                    Go to Booking Screen
                  </button>
                </div>
              ) : (
                <div className="text-center p-8 bg-gray-700 rounded-lg">
                  <h4 className="text-2xl font-semibold">Downtime Day</h4>
                  <p className="text-lg mt-2 text-gray-300">Manage your company, plan storylines, and negotiate with talent.</p>
                  <button
                    onClick={handleNextDay}
                    className="mt-6 px-12 py-4 bg-green-600 text-white text-lg font-bold rounded-lg shadow-lg hover:bg-green-500 transition-all"
                  >
                    Next Day
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-1 space-y-4">
            <button
              className="w-full p-4 bg-gray-700 rounded-lg shadow-md text-left hover:bg-gray-600 transition-all flex items-center justify-between"
              onClick={handleOpenMessagesModal}
            >
              <span className="flex items-center">
                <MessageIcon />
                Messages
              </span>
              {unreadMessages > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                  {unreadMessages}
                </span>
              )}
            </button>
            <button
              className="w-full p-4 bg-gray-700 rounded-lg shadow-md text-left hover:bg-gray-600 transition-all flex items-center justify-between"
              onClick={() => {
                setAssistantResponse("");
                setAssistantQuery("");
                setShowAssistantModal(true);
              }}
            >
              <span className="flex items-center">
                <AssistantIcon />
                AI Assistant
              </span>
            </button>
            <button className="w-full p-4 bg-gray-700 rounded-lg shadow-md text-left hover:bg-gray-600 transition-all">
              Book Show (View Schedule)
            </button>
            <button
              onClick={() => setGameState('ROSTER_SCREEN')}
              className="w-full p-4 bg-gray-700 rounded-lg shadow-md text-left hover:bg-gray-600 transition-all flex items-center"
            >
              <RosterIcon />
              Roster
            </button>
            <button
              onClick={() => setGameState('STORYLINE_SCREEN')}
              className="w-full p-4 bg-gray-700 rounded-lg shadow-md text-left hover:bg-gray-600 transition-all flex items-center"
            >
              <FireIcon />
              Storyline Planner
            </button>
            <button
              onClick={handleExitGame}
              className="w-full p-4 bg-red-700 rounded-lg shadow-md text-left hover:bg-red-600 transition-all"
            >
              Exit to Main Menu
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderMessagesModal = () => {
    if (!showMessagesModal) return null;
    const threads = getConversationThreads();
    const selectedThread = threads.find(t => t.senderId === selectedMessageSenderId);
    const messagesForThread = selectedThread ? selectedThread.messages : [];
    const activeMessageReplyOptions = activeMessageForReply?.replyOptions || [];

    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
        onClick={() => {
          setShowMessagesModal(false);
          handleMarkMessagesRead();
        }}
      >
        <div
          className="bg-gray-900 rounded-lg shadow-2xl w-full max-w-5xl max-h-[90vh] flex"
          onClick={(e) => e.stopPropagation()}
        >
          {/* left */}
          <div className="w-1/3 border-r border-gray-700 overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white">Inbox</h2>
              <button
                onClick={() => {
                  setShowMessagesModal(false);
                  handleMarkMessagesRead();
                }}
                className="text-gray-400 hover:text-white"
              >
                <CloseIcon />
              </button>
            </div>
            <div>
              {threads.length === 0 && (
                <p className="text-gray-400 p-4 text-sm">Your inbox is empty.</p>
              )}
              {threads.map(thread => (
                <button
                  key={thread.senderId}
                  onClick={() => {
                    setSelectedMessageSenderId(thread.senderId);
                    setActiveMessageForReply(thread.messages[thread.messages.length - 1]);
                    setReplyDraft('');
                    setIsReplyDirty(false);
                    setHoveredReplyText('');
                    setLastSelectedReplyTone(null);
                  }}
                  className={`w-full flex flex-col items-start px-4 py-3 text-left hover:bg-gray-800 transition-all ${thread.senderId === selectedMessageSenderId ? 'bg-gray-800' : ''}`}
                >
                  <div className="flex items-center w-full justify-between">
                    <span className="text-white font-semibold">{thread.senderName}</span>
                    <span className="text-xs text-gray-400">{formatGameTimestamp(thread.lastMessage.timestamp)}</span>
                  </div>
                  <p className="text-xs text-gray-400 truncate w-full">{thread.lastMessage.body}</p>
                </button>
              ))}
            </div>
          </div>

          {/* right */}
          <div className="w-2/3 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <div>
                <h3 className="text-lg font-bold text-white">{selectedThread ? selectedThread.senderName : 'Select a conversation'}</h3>
                <p className="text-xs text-gray-400">All messages are shoot/backstage.</p>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messagesForThread.length === 0 ? (
                <p className="text-gray-400 text-sm">No messages in this conversation yet.</p>
              ) : (
                messagesForThread.map(msg => {
                  // already filtered system above, but double guard
                  if (msg.type === 'System' || (typeof msg.body === 'string' && msg.body.startsWith("System:"))) {
                    return null;
                  }
                  return (
                    <div key={msg.id} className={`flex ${msg.isFromBooker ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] rounded-lg px-4 py-2 ${msg.isFromBooker ? 'bg-indigo-600 text-white' : msg.isFollowUp ? 'bg-gray-700 text-gray-100' : 'bg-gray-800 text-white'}`}>
                        <p className="whitespace-pre-wrap text-sm">{msg.body}</p>
                        <p className="text-[0.6rem] text-gray-300 mt-1 text-right">{formatGameTimestamp(msg.timestamp)}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {selectedThread && (
              <div className="p-4 border-t border-gray-700 bg-gray-900">
                <div className="flex space-x-2 mb-3">
                  <button
                    onMouseEnter={() => handleReplyHover(activeMessageReplyOptions[0] || '')}
                    onMouseLeave={handleReplyHoverLeave}
                    onClick={() => handleReplyButtonClick(activeMessageReplyOptions[0] || '', 'yes')}
                    className="px-3 py-1 bg-gray-800 rounded text-sm text-white hover:bg-gray-700"
                  >
                    Yes
                  </button>
                  <button
                    onMouseEnter={() => handleReplyHover(activeMessageReplyOptions[1] || '')}
                    onMouseLeave={handleReplyHoverLeave}
                    onClick={() => handleReplyButtonClick(activeMessageReplyOptions[1] || '', 'no')}
                    className="px-3 py-1 bg-gray-800 rounded text-sm text-white hover:bg-gray-700"
                  >
                    No
                  </button>
                  <button
                    onMouseEnter={() => handleReplyHover(activeMessageReplyOptions[2] || '')}
                    onMouseLeave={handleReplyHoverLeave}
                    onClick={() => handleReplyButtonClick(activeMessageReplyOptions[2] || '', 'maybe')}
                    className="px-3 py-1 bg-gray-800 rounded text-sm text-white hover:bg-gray-700"
                  >
                    Maybe
                  </button>
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={replyDraft}
                    onChange={handleReplyDraftChange}
                    placeholder="Type a response to this talent..."
                    className="flex-grow bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    onClick={handleSendReply}
                    disabled={!replyDraft.trim()}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 disabled:bg-gray-600"
                  >
                    Send
                  </button>
                </div>
                <p className="text-[0.65rem] text-gray-500 mt-2">Hover to preview. Click to lock. Send to finalize.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderAssistantModal = () => {
    if (!showAssistantModal) return null;
    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
        onClick={() => setShowAssistantModal(false)}
      >
        <div
          className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center p-4 border-b border-gray-700">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <AssistantIcon />
              AI Booker Assistant
            </h2>
            <button
              onClick={() => setShowAssistantModal(false)}
              className="text-gray-400 hover:text-white"
            >
              <CloseIcon />
            </button>
          </div>

          <div className="flex-grow overflow-y-auto p-4 space-y-4">
            {assistantResponse ? (
              <div className="p-4 bg-gray-700 rounded-lg whitespace-pre-wrap font-mono text-sm">
                {assistantResponse}
              </div>
            ) : (
              <div className="text-center text-gray-400 p-8">
                <p className="text-lg">Welcome, Booker.</p>
                <p>Ask me for creative advice, booking ideas, or who to push.</p>
                <p className="text-sm mt-4">(e.g., "Who has main event potential?" or "Give me a feud idea for Alex Valour.")</p>
              </div>
            )}

            {isAssistantLoading && (
              <div className="flex items-center justify-center p-4">
                <LoadingIcon />
                <span className="ml-2">Assistant is thinking...</span>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-700 bg-gray-800">
            <div className="flex space-x-2">
              <input
                type="text"
                value={assistantQuery}
                onChange={(e) => setAssistantQuery(e.target.value)}
                placeholder="Ask for booking advice..."
                className="flex-grow bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={isAssistantLoading}
                onKeyPress={(e) => e.key === 'Enter' && !isAssistantLoading && handleGetAIAdvice()}
              />
              <button
                onClick={handleGetAIAdvice}
                disabled={isAssistantLoading || !assistantQuery}
                className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-500 transition-all disabled:bg-gray-500 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderBookingScreen = () => {
    if (!currentShow) return null;
    return (
      <div className="max-w-7xl mx-auto p-4 md:p-8 text-white">
        <div className="flex flex-col md:flex-row justify-between items-center p-4 bg-gray-800 rounded-lg shadow-lg">
          <div>
            <h1 className="text-2xl font-bold text-white">Book Show: {currentShow.eventName}</h1>
            <p className="text-indigo-300">
              {activeSave.currentDate.toDate().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              <span className="ml-4 font-semibold text-yellow-400">(Tier: {currentShow.eventTier})</span>
            </p>
          </div>
          <div className="flex space-x-2 mt-4 md:mt-0">
            <button
              onClick={() => setGameState('IN_GAME')}
              className="px-4 py-2 bg-gray-600 text-white font-bold rounded-lg shadow-lg hover:bg-gray-500 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleRunShow}
              className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg shadow-lg hover:bg-green-500 transition-all"
            >
              Run Show
            </button>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {currentSegments.map((seg, idx) => (
            <button
              key={idx}
              onClick={() => handleOpenSegmentModal(idx)}
              className="w-full p-4 bg-gray-700 rounded-lg shadow-md text-left hover:bg-gray-600 transition-all flex items-center"
            >
              <span className="text-lg font-bold text-gray-400 w-12">{idx + 1}.</span>
              {seg ? (
                <div>
                  <span className={`text-sm font-bold px-2 py-0.5 rounded ${seg.type === 'Match' ? 'bg-blue-600' : 'bg-purple-600'}`}>
                    {seg.type}
                  </span>
                  <span className="ml-3 text-lg text-white">
                    {seg.participants.map(p => p.name).join(' vs. ')}
                  </span>
                  {seg.winnerId && (
                    <p className="ml-16 text-sm text-yellow-400">
                      Winner: {seg.participants.find(p => p.id === seg.winnerId)?.name || 'N/A'}
                    </p>
                  )}
                </div>
              ) : (
                <span className="text-lg text-gray-400 flex items-center">
                  <PlusIcon />
                  Add Segment
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderRosterScreen = () => {
    const wrestlers = gameData.save_wrestlers || [];
    const dispClass = (d) => {
      switch (d) {
        case 'Face': return 'text-green-400';
        case 'Heel': return 'text-red-400';
        case 'Tweener': return 'text-yellow-400';
        default: return 'text-gray-400';
      }
    };

    return (
      <div className="max-w-7xl mx-auto p-4 md:p-8 text-white">
        <div className="flex justify-between items-center p-4 bg-gray-800 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-white flex items-center">
            <RosterIcon />
            Your Roster
          </h1>
          <button
            onClick={() => setGameState('IN_GAME')}
            className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-500 transition-all"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {wrestlers.length === 0 && (
            <p className="text-gray-400 md:col-span-3 text-center">No wrestlers found.</p>
          )}
          {wrestlers.sort((a, b) => a.name.localeCompare(b.name)).map(w => (
            <div key={w.id} className="bg-gray-800 p-4 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold text-white">{w.name}</h3>
              <p className="text-sm text-gray-400 mb-2">Gimmick: <span className="font-semibold text-gray-200">{w.gimmick}</span></p>

              <div className="flex justify-between text-sm mb-3">
                <span className={`font-bold ${dispClass(w.disposition)}`}>{w.disposition}</span>
                <span className="text-gray-300">Morale: <span className="font-semibold text-white">{w.morale}</span></span>
              </div>

              <div className="border-t border-gray-700 pt-2 grid grid-cols-4 gap-2 text-center text-xs">
                <div>
                  <span className="text-gray-400">BRAWL</span>
                  <p className="text-lg font-bold">{w.stats.brawling}</p>
                </div>
                <div>
                  <span className="text-gray-400">SPEED</span>
                  <p className="text-lg font-bold">{w.stats.speed}</p>
                </div>
                <div>
                  <span className="text-gray-400">TECH</span>
                  <p className="text-lg font-bold">{w.stats.technical}</p>
                </div>
                <div>
                  <span className="text-gray-400">CHAR</span>
                  <p className="text-lg font-bold">{w.stats.charisma}</p>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleViewCareerHistory(w)}
                  className="w-full p-2 bg-indigo-600 text-white font-semibold rounded-lg text-sm hover:bg-indigo-500 transition-all flex items-center justify-center"
                >
                  <HistoryIcon />
                  History
                </button>
                <button
                  onClick={() => handleViewRelationships(w)}
                  className="w-full p-2 bg-purple-600 text-white font-semibold rounded-lg text-sm hover:bg-purple-500 transition-all flex items-center justify-center"
                >
                  <RelationshipsIcon />
                  Relations
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderShowResultsScreen = () => (
    <div className="max-w-4xl mx-auto p-4 md:p-8 text-white">
      <div className="p-4 bg-gray-800 rounded-lg shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Show Results: {currentShow.eventName}</h1>
            <p className="text-indigo-300">
              {activeSave.currentDate.toDate().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Overall Rating</p>
            <p className="text-4xl font-bold text-yellow-400 flex items-center">
              <StarIcon className="w-8 h-8 mr-1" />
              {showRating}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-gray-800 p-6 rounded-lg shadow-lg min-h-[200px]">
        <h2 className="text-2xl font-semibold mb-4 text-white">Dirt Sheet Recap</h2>
        {showRecap ? (
          <p className="text-gray-300 whitespace-pre-wrap font-mono text-sm leading-relaxed">
            {showRecap}
          </p>
        ) : (
          <div className="flex items-center justify-center p-8">
            <LoadingIcon />
            <span className="ml-3 text-lg">Generating AI recap...</span>
          </div>
        )}
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={handleNextDay}
          className="px-12 py-4 bg-green-600 text-white text-lg font-bold rounded-lg shadow-lg hover:bg-green-500 transition-all"
        >
          Continue (Next Day)
        </button>
      </div>
    </div>
  );

  const renderStorylineScreen = () => {
    const storylines = gameData.save_storylines || [];
    return (
      <div className="max-w-7xl mx-auto p-4 md:p-8 text-white">
        <div className="flex justify-between items-center p-4 bg-gray-800 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-white flex items-center">
            <FireIcon />
            Storyline Manager
          </h1>
          <div className="flex space-x-2">
            <button
              onClick={handleOpenCreateStorylineModal}
              className="px-4 py-2 bg-green-600 text-white font-bold rounded-lg shadow-lg hover:bg-green-500 transition-all flex items-center"
            >
              <PlusIcon />
              Create Storyline
            </button>
            <button
              onClick={() => setGameState('IN_GAME')}
              className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-500 transition-all"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {storylines.length === 0 && (
            <p className="text-gray-400 md:col-span-2 text-center p-8">You have no active storylines.</p>
          )}
          {storylines.filter(s => s.status === 'Active').map(s => (
            <div key={s.id} className="bg-gray-800 p-4 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold text-white">{s.name}</h3>
              <p className="text-sm text-gray-400 mb-2">
                Heat: <span className="font-semibold text-red-400">{s.heat}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {s.participants.map(p => (
                  <span key={p.id} className="bg-gray-700 text-sm px-3 py-1 rounded-full">
                    {p.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderCareerHistoryScreen = () => {
    if (!viewingWrestler || !gameData.save_career_events) return renderLoadingScreen();
    const events = (gameData.save_career_events || [])
      .filter(e => e.wrestlerId === viewingWrestler.id)
      .sort((a, b) => b.date.toMillis() - a.date.toMillis());

    const color = (t) => {
      if (t === 'Match Win') return 'text-green-400';
      if (t === 'Match Loss') return 'text-red-400';
      if (t.includes('Draw')) return 'text-yellow-400';
      return 'text-gray-300';
    };

    return (
      <div className="max-w-4xl mx-auto p-4 md:p-8 text-white">
        <div className="flex justify-between items-center p-4 bg-gray-800 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-white flex items-center">
            <HistoryIcon />
            Career History: {viewingWrestler.name}
          </h1>
          <button
            onClick={() => {
              setGameState('ROSTER_SCREEN');
              setViewingWrestler(null);
            }}
            className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-500 transition-all"
          >
            Back to Roster
          </button>
        </div>

        <div className="mt-6 bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-700">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Event Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {events.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="px-6 py-8 text-center text-gray-400">
                          No career events found for this wrestler.
                        </td>
                      </tr>
                    ) : (
                      events.map(e => (
                        <tr key={e.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                            {e.date.toDate().toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`font-semibold ${color(e.eventType)}`}>{e.eventType}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-normal text-sm text-gray-200">
                            {e.notes}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderRelationshipsScreen = () => {
    if (!viewingWrestler || !gameData.save_relationships || !gameData.save_wrestlers) return renderLoadingScreen();
    const rels = (gameData.save_relationships || [])
      .filter(r => r.personA_Id === viewingWrestler.id || r.personB_Id === viewingWrestler.id);

    const otherName = (r) => {
      const otherId = r.personA_Id === viewingWrestler.id ? r.personB_Id : r.personA_Id;
      const other = gameData.save_wrestlers.find(w => w.id === otherId);
      return other ? other.name : 'Unknown Person';
    };

    const statusColor = (s) => {
      if (s.includes('Friend') || s.includes('Like')) return 'text-green-400';
      if (s.includes('Dislike') || s.includes('Hate')) return 'text-red-400';
      return 'text-gray-300';
    };

    return (
      <div className="max-w-4xl mx-auto p-4 md:p-8 text-white">
        <div className="flex justify-between items-center p-4 bg-gray-800 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-white flex items-center">
            <RelationshipsIcon />
            Relationships: {viewingWrestler.name}
          </h1>
          <button
            onClick={() => {
              setGameState('ROSTER_SCREEN');
              setViewingWrestler(null);
            }}
            className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-500 transition-all"
          >
            Back to Roster
          </button>
        </div>

        <div className="mt-6 bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-700">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Person</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {rels.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="px-6 py-8 text-center text-gray-400">
                          No relationships found.
                        </td>
                      </tr>
                    ) : (
                      rels.map(r => (
                        <tr key={r.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-white">
                            {otherName(r)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {r.relationshipType}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`font-semibold ${statusColor(r.status)}`}>
                              {r.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-normal text-sm text-gray-200">
                            {r.notes}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSegmentModal = () => {
    if (!showSegmentModal) return null;
    const storylines = gameData.save_storylines || [];

    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
        onClick={() => setShowSegmentModal(false)}
      >
        <div
          className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center p-4 border-b border-gray-700">
            <h2 className="text-2xl font-bold text-white">Edit Segment {editingSegmentIndex + 1}</h2>
            <button
              onClick={() => setShowSegmentModal(false)}
              className="text-gray-400 hover:text-white"
            >
              <CloseIcon />
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Segment Type</label>
              <select
                name="type"
                value={segmentFormData.type}
                onChange={handleSegmentTypeChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Match">Match</option>
                <option value="Angle">Angle</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Assign to Storyline (Optional)</label>
              <select
                name="storylineId"
                value={segmentFormData.storylineId || ""}
                onChange={handleStorylineSelect}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">-- None --</option>
                {storylines.filter(s => s.status === 'Active').map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Participants</label>
              <div className="p-2 bg-gray-700 rounded-lg min-h-[50px] flex flex-wrap gap-2">
                {segmentFormData.participants.map(p => (
                  <span key={p.id} className="flex items-center bg-indigo-600 text-white text-sm font-medium px-3 py-1 rounded-full">
                    {p.name}
                    <button
                      onClick={() => handleRemoveParticipant(p.id)}
                      className="ml-2 text-indigo-100 hover:text-white"
                    >
                      <XCircleIcon />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-300 mb-1">Add Participant</label>
              <div className="flex items-center">
                <UserPlusIcon className="absolute left-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={participantSearch}
                  onChange={(e) => handleParticipantSearch(e.target.value)}
                  placeholder="Search roster..."
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              {participantResults.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-gray-600 border border-gray-500 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {participantResults.map(w => (
                    <button
                      key={w.id}
                      onClick={() => handleAddParticipant(w)}
                      className="block w-full text-left px-4 py-2 text-white hover:bg-indigo-500"
                    >
                      {w.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {segmentFormData.type === 'Match' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Winner (Optional)</label>
                <select
                  name="winnerId"
                  value={segmentFormData.winnerId || ""}
                  onChange={handleWinnerSelect}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={segmentFormData.participants.length === 0}
                >
                  <option value="">-- Select a Winner --</option>
                  {segmentFormData.participants.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="p-4 bg-gray-700 border-t border-gray-600 flex justify-end space-x-3">
            <button
              onClick={() => setShowSegmentModal(false)}
              className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg shadow-lg hover:bg-gray-500 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveSegment}
              className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-500 transition-all"
            >
              Save Segment
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderCreateStorylineModal = () => {
    if (!showStorylineModal) return null;
    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
        onClick={() => setShowStorylineModal(false)}
      >
        <div
          className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center p-4 border-b border-gray-700">
            <h2 className="text-2xl font-bold text-white">Create New Storyline</h2>
            <button
              onClick={() => setShowStorylineModal(false)}
              className="text-gray-400 hover:text-white"
            >
              <CloseIcon />
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Storyline Name</label>
              <input
                type="text"
                name="name"
                value={storylineFormData.name}
                onChange={(e) => setStorylineFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Main Event Title Feud"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Participants (min. 2)</label>
              <div className="p-2 bg-gray-700 rounded-lg min-h-[50px] flex flex-wrap gap-2">
                {storylineFormData.participants.map(p => (
                  <span key={p.id} className="flex items-center bg-indigo-600 text-white text-sm font-medium px-3 py-1 rounded-full">
                    {p.name}
                    <button
                      onClick={() => handleRemoveStorylineParticipant(p.id)}
                      className="ml-2 text-indigo-100 hover:text-white"
                    >
                      <XCircleIcon />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-300 mb-1">Add Participant</label>
              <div className="flex items-center">
                <UserPlusIcon className="absolute left-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={storylineParticipantSearch}
                  onChange={(e) => handleStorylineParticipantSearch(e.target.value)}
                  placeholder="Search roster..."
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              {storylineParticipantResults.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-gray-600 border border-gray-500 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {storylineParticipantResults.map(w => (
                    <button
                      key={w.id}
                      onClick={() => handleAddStorylineParticipant(w)}
                      className="block w-full text-left px-4 py-2 text-white hover:bg-indigo-500"
                    >
                      {w.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="p-4 bg-gray-700 border-t border-gray-600 flex justify-end space-x-3">
            <button
              onClick={() => setShowStorylineModal(false)}
              className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg shadow-lg hover:bg-gray-500 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateStoryline}
              className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg shadow-lg hover:bg-green-500 transition-all"
            >
              Create Storyline
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-900 min-h-screen font-sans text-gray-200">
      {(() => {
        switch (gameState) {
          case 'LOADING':
          case 'BUSY':
            return renderLoadingScreen();
          case 'MAIN_MENU':
            return renderMainMenu();
          case 'IN_GAME':
            return renderGameDashboard();
          case 'BOOKING_SHOW':
            return renderBookingScreen();
          case 'ROSTER_SCREEN':
            return renderRosterScreen();
          case 'SHOW_RESULTS':
            return renderShowResultsScreen();
          case 'STORYLINE_SCREEN':
            return renderStorylineScreen();
          case 'CAREER_HISTORY_SCREEN':
            return renderCareerHistoryScreen();
          case 'RELATIONSHIPS_SCREEN':
            return renderRelationshipsScreen();
          default:
            return <p className="text-white p-4">An unexpected error occurred. Please refresh.</p>;
        }
      })()}
      {renderMessagesModal()}
      {renderAssistantModal()}
      {renderSegmentModal()}
      {renderCreateStorylineModal()}
    </div>
  );
}

export default App;
