import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously, 
  signInWithCustomToken, 
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

// --- Icon Components (Simple SVGs) ---
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
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mr-2">
    <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408s4.262.139 6.337.408c.922.12 1.631.94 1.631 1.876v13.066c0 .936-.709 1.756-1.631 1.876-2.075.27-4.19.408-6.337.408s-4.262-.139-6.337-.408c-.922-.12-1.631-.94-1.631-1.876V4.534c0-.936.709 1.756 1.631-1.876ZM7.5 10.5a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H8.25Z" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
  </svg>
);

const AssistantIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mr-2">
    <path fillRule="evenodd" d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.861 2.861l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.861 2.861l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.861-2.861l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.385 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM13.5 18a.75.75 0 0 1 .721.544l.27 1.256a2.25 2.25 0 0 0 1.715 1.715l1.256.27a.75.75 0 0 1 0 1.442l-1.256.27a2.25 2.25 0 0 0-1.715 1.715l-.27 1.256a.75.75 0 0 1-1.442 0l-.27-1.256a2.25 2.25 0 0 0-1.715-1.715l-1.256-.27a.75.75 0 0 1 0-1.442l1.256.27a2.25 2.25 0 0 0 1.715-1.715l.27-1.256a.75.75 0 0 1 .721-.544Z" clipRule="evenodd" />
  </svg>
);

const BookingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mr-2">
    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z" clipRule="evenodd" />
  </svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z" clipRule="evenodd" />
  </svg>
);

const RosterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mr-2">
    <path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM15.75 9.75a.75.75 0 0 0-1.5 0v.75a.75.75 0 0 0 1.5 0v-.75ZM21 9.75a.75.75 0 0 0-1.5 0v.75a.75.75 0 0 0 1.5 0v-.75ZM9.75 9.75a.75.75 0 0 0-1.5 0v.75a.75.75 0 0 0 1.5 0v-.75ZM7.06 12.236a.75.75 0 0 0-1.06 0l-.03.03a.75.75 0 0 0 1.06 1.06l.03-.03a.75.75 0 0 0 0-1.06Zm10.97 0a.75.75 0 0 0 0 1.06l.03.03a.75.75 0 0 0 1.06-1.06l-.03-.03a.75.75 0 0 0-1.06 0ZM7.5 15a.75.75 0 0 0-1.5 0v.75a.75.75 0 0 0 1.5 0v-.75Zm3.375-1.5a.75.75 0 0 0-1.5 0v3a.75.75 0 0 0 1.5 0v-3Zm3.75 0a.75.75 0 0 0-1.5 0v3a.75.75 0 0 0 1.5 0v-3Zm3.375 1.5a.75.75 0 0 0-1.5 0v.75a.75.75 0 0 0 1.5 0v-.75Z" clipRule="evenodd" />
    <path d="M4.5 19.5a3 3 0 0 0 3 3h9a3 3 0 0 0 3-3v-5.63l-3.03-3.03a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 0 1-1.06 0l-3-3a.75.75 0 0 0-1.06 0L4.5 13.87V19.5Z" />
  </svg>
);

const UserPlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
    <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM1.646 13.107a.75.75 0 0 1 .862.088c.854.63 1.91.955 3.028.955s2.174-.325 3.028-.955a.75.75 0 1 1 .95 1.169A4.502 4.502 0 0 0 8.5 15.5c-1.318 0-2.55-.42-3.53-1.134a.75.75 0 0 1 .088-.95l-.002-.002ZM15 9.75a.75.75 0 0 1 .75.75v2.25h2.25a.75.75 0 0 1 0 1.5H15.75v2.25a.75.75 0 0 1-1.5 0v-2.25H12a.75.75 0 0 1 0-1.5h2.25V10.5a.75.75 0 0 1 .75-.75Z" />
  </svg>
);

const XCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.707-11.707a1 1 0 0 0-1.414-1.414L10 8.586 7.707 6.293a1 1 0 0 0-1.414 1.414L8.586 10l-2.293 2.293a1 1 0 1 0 1.414 1.414L10 11.414l2.293 2.293a1 1 0 0 0 1.414-1.414L11.414 10l2.293-2.293Z" clipRule="evenodd" />
  </svg>
);

const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-yellow-400">
    <path fillRule="evenodd" d="M10.868 2.884c.321-.772 1.415-.772 1.736 0l1.83 4.401 4.79 1.149c.82.198 1.135 1.106.546 1.691l-3.473 3.385 1.03 4.88c.174.82-.716 1.459-1.442 1.053L10 18.273l-4.32 2.271c-.726.406-1.616-.234-1.442-1.053l1.03-4.88L1.873 10.124c-.589-.586-.274-1.493.546-1.691l4.79-1.149 1.83-4.401Z" clipRule="evenodd" />
  </svg>
);

const FireIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mr-2">
    <path fillRule="evenodd" d="M12.963 2.286a.75.75 0 0 0-1.071 1.05 9.75 9.75 0 0 1 1.332 10.065c-.537.42-1.166.738-1.85.966.347.858.52 1.77.52 2.714 0 2.21-1.79 4.019-3.999 4.019S6 21.29 6 19.079c0-.944.173-1.856.52-2.714-.683-.228-1.313-.546-1.85-.966a9.75 9.75 0 0 1 1.332-10.065.75.75 0 0 0-1.071-1.05C2.983 4.25 1.5 6.735 1.5 9.67c0 3.089 1.78 5.765 4.312 6.945.305.138.638.39.998.741.436.422.955.986 1.408 1.626.435.613.75 1.32.75 2.097 0 1.057.86 1.919 1.918 1.919s1.919-.862 1.919-1.919c0-.777.315-1.484.75-2.097.453-.64.972-1.204 1.408-1.626.36-.351.693-.603.998-.741C20.72 15.435 22.5 12.76 22.5 9.67c0-2.935-1.483-5.42-3.86-6.333Z" clipRule="evenodd" />
  </svg>
);

const HistoryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mr-2">
    <path fillRule="evenodd" d="M12 1.5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0V3a9 9 0 0 0-9 9 .75.75 0 0 1-1.5 0 10.5 10.5 0 0 1 10.5-10.5ZM10.5 10.038a5.25 5.25 0 1 0 4.93 4.93.75.75 0 0 1 1.437.426A6.75 6.75 0 1 1 9.006 8.35a.75.75 0 0 1 1.493 1.688Z" clipRule="evenodd" />
    <path d="M7.163 15.962c.311.23.638.448.977.652A.75.75 0 0 1 7.8 17.8a9 9 0 1 1 8.4 0 .75.75 0 0 1-1.34.614c.339-.204.666-.423.977-.652a.75.75 0 1 1 .9 1.399A10.499 10.499 0 0 1 12 20.25a10.5 10.5 0 1 1 0-21 10.5 10.5 0 0 1 4.937 1.189.75.75 0 1 1-.9 1.4A9 9 0 0 0 12 3.75a9 9 0 0 0-4.837 1.513.75.75 0 0 1-.9-1.4A10.5 10.5 0 0 1 12 1.5a10.5 10.5 0 0 1 10.5 10.5 10.5 10.5 0 0 1-1.189 4.937.75.75 0 1 1-1.4-.9Z" />
  </svg>
);

const RelationshipsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mr-2">
    <path d="M4.5 6.375a.75.75 0 0 1 .75-.75h13.5a.75.75 0 0 1 .75.75v11.25a.75.75 0 0 1-.75.75H5.25a.75.75 0 0 1-.75-.75V6.375Z" />
    <path fillRule="evenodd" d="M5.057 2.376A.75.75 0 0 1 5.25 2.25H18.75a.75.75 0 0 1 .193.021l3.75 1.5a.75.75 0 0 1 .307.601v13.064a.75.75 0 0 1-.307.601l-3.75 1.5A.75.75 0 0 1 18.75 20h-13.5a.75.75 0 0 1-.193-.021l-3.75-1.5a.75.75 0 0 1-.307-.601V4.5a.75.75 0 0 1 .307-.601l3.75-1.5ZM6 3.75l-3 1.2v12.75l3 1.2h12l3-1.2V4.95l-3-1.2H6Z" clipRule="evenodd" />
    <path d="M12 8.25a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3a.75.75 0 0 1 .75-.75Z" />
    <path d="M12 15a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-1.5 0V15.75a.75.75 0 0 1 .75-.75Z" />
    <path d="M8.25 12a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75Z" />
    <path d="M13.5 12a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75Z" />
  </svg>
);


// --- Firebase Config ---
// This config is now loaded from Vercel's Environment Variables
// via import.meta.env
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID
};

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;


// Main Application
function App() {
  // --- Firebase & Auth State ---
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [appId, setAppId] = useState(null); // (NEW) Store App ID

  // --- Game State ---
  const [gameState, setGameState] = useState('LOADING'); // LOADING, MAIN_MENU, IN_GAME, BOOKING_SHOW, ROSTER_SCREEN, SHOW_RESULTS, STORYLINE_SCREEN, CAREER_HISTORY_SCREEN, RELATIONSHIPS_SCREEN, BUSY
  const [datasets, setDatasets] = useState([]);
  const [playerSaves, setPlayerSaves] = useState([]);
  const [activeSave, setActiveSave] = useState(null); // This will hold the loaded save_game doc
  const [gameData, setGameData] = useState({}); // This will hold all collections for the active save
  const [loadingMessage, setLoadingMessage] = useState('Initializing Game...');
  const [showMessagesModal, setShowMessagesModal] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [showAssistantModal, setShowAssistantModal] = useState(false);
  const [assistantQuery, setAssistantQuery] = useState("");
  const [assistantResponse, setAssistantResponse] = useState("");
  const [isAssistantLoading, setIsAssistantLoading] = useState(false);
  
  // --- Booking State ---
  const [currentShow, setCurrentShow] = useState(null); // The show object being booked
  const [currentSegments, setCurrentSegments] = useState([]); // Array of segment objects for the show
  const [showSegmentModal, setShowSegmentModal] = useState(false);
  const [editingSegmentIndex, setEditingSegmentIndex] = useState(null);
  const [segmentFormData, setSegmentFormData] = useState({ type: 'Match', participants: [], winnerId: null, storylineId: null });
  const [participantSearch, setParticipantSearch] = useState("");
  const [participantResults, setParticipantResults] = useState([]);
  
  // --- Show Results State ---
  const [showRecap, setShowRecap] = useState(""); // For AI show recap
  const [showRating, setShowRating] = useState(0); // For show rating

  // --- Storyline State ---
  const [showStorylineModal, setShowStorylineModal] = useState(false);
  const [storylineFormData, setStorylineFormData] = useState({ name: '', participants: [] });
  const [storylineParticipantSearch, setStorylineParticipantSearch] = useState("");
  const [storylineParticipantResults, setStorylineParticipantResults] = useState([]);
  const [viewingWrestler, setViewingWrestler] = useState(null); // For Career History & Relationships

  // --- Design Doc Schemas ---
  // (These are the collections we need to copy for a new game)
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

  // (NEW) Define collections that need ID mapping
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
    'dataset_events': 'save_shows', // Note: dataset_events becomes save_shows
    'dataset_teams': 'save_teams',
    'dataset_stables': 'save_stables',
    'dataset_sponsors': 'save_sponsors',
    'dataset_relationships': 'save_relationships',
    'save_messages': 'save_messages', // Not a dataset, but used for mapping
    'save_social_posts': 'save_social_posts', // Not a dataset, but used for mapping
    'save_storylines': 'save_storylines',
    'save_career_events': 'save_career_events' // (NEW) Not a dataset, but used for mapping
  };

  // --- Collections to load in-game ---
  const SAVE_COLLECTION_NAMES = Object.values(SAVE_COLLECTIONS_MAP);


  // --- Phase 1, Task 1 & 3: Firebase Init & Default Dataset Seeder ---

  // 1. Initialize Firebase
  useEffect(() => {
    try {
      if (!firebaseConfig.apiKey || !firebaseConfig.appId) {
        setLoadingMessage("Firebase config is missing. Please add it to your Vercel Environment Variables.");
        console.error("Firebase config is missing.");
        return;
      }
      
      // (NEW) Store the App ID from the config
      setAppId(firebaseConfig.appId);

      const app = initializeApp(firebaseConfig);
      const authInstance = getAuth(app);
      const dbInstance = getFirestore(app);
      
      setLogLevel('debug'); // Enable Firestore logging
      setDb(dbInstance);
      setAuth(authInstance);

      // 2. Set up Auth Listener
      onAuthStateChanged(authInstance, async (user) => {
        if (user) {
          setUserId(user.uid);
          setIsAuthReady(true);
        } else {
          try {
            // We are not using __initial_auth_token in Vercel, so just sign in anonymously
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

  // 3. Seed Default Dataset & Fetch Main Menu Data
  useEffect(() => {
    if (!isAuthReady || !db || !userId || !appId) return; // (NEW) Wait for App ID

    const seedAndFetch = async () => {
      setLoadingMessage('Checking for game data...');
      // (NEW) Pass all required instances
      await seedDefaultDataset(db, userId, appId);
      
      setLoadingMessage('Fetching datasets...');
      await fetchDatasets(db, userId, appId);
      
      setLoadingMessage('Fetching your save games...');
      await fetchPlayerSaves(db, userId, appId);
      
      setGameState('MAIN_MENU');
    };

    seedAndFetch();
  }, [isAuthReady, db, userId, appId]); // (NEW) Rerun if auth or appId is ready

  // --- Phase 1, Task 3: Default Dataset Seeder ---
  const seedDefaultDataset = async (db, userId, appId) => {
    const datasetId = 'default-fiction';
    // (FIXED) Correct path
    const datasetRef = doc(db, `/artifacts/${appId}/public/data/datasets`, datasetId);
    
    try {
      const docSnap = await getDoc(datasetRef);
      if (docSnap.exists()) {
        console.log("Default dataset already exists.");
        return;
      }

      setLoadingMessage('Creating default dataset...');
      const batch = writeBatch(db);

      // 1. Create Dataset entry
      batch.set(datasetRef, {
        name: "Default Fiction",
        description: "A balanced, fictional universe to start your booking career.",
        createdAt: Timestamp.now()
      });

      // 2. Create Company (dataset_companies)
      // (FIXED) Correct path
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

      // 3. Create Wrestlers (dataset_wrestlers)
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
        // (FIXED) Correct path
        const wrestlerRef = doc(collection(db, `/artifacts/${appId}/public/data/dataset_wrestlers`));
        wrestlerRefs[wrestler.name] = wrestlerRef.id;
        batch.set(wrestlerRef, { ...wrestler, datasetId: datasetId });
      }

      // 4. Create Titles (dataset_titles)
      // (FIXED) Correct path
      batch.set(doc(collection(db, `/artifacts/${appId}/public/data/dataset_titles`)), {
        datasetId: datasetId, companyId: companyId, titleName: "FX World Championship", prestige: 80, isTagTeam: false, initialHolderId: null
      });
      batch.set(doc(collection(db, `/artifacts/${appId}/public/data/dataset_titles`)), {
        datasetId: datasetId, companyId: companyId, titleName: "FX Women's Championship", prestige: 70, isTagTeam: false, initialHolderId: null
      });

      // 5. Create TV Show (dataset_tv_shows)
      // (FIXED) Correct path
      batch.set(doc(collection(db, `/artifacts/${appId}/public/data/dataset_tv_shows`)), {
        datasetId: datasetId, companyId: companyId, showName: "FX Voltage", dayOfWeek: "Monday"
      });

      // 6. Create Events (dataset_events)
      const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      for (let i = 0; i < months.length; i++) {
        let tier = "Monthly_Event";
        let name = `${months[i]} Mayhem`;
        if (i === 3) { tier = "Major_Event"; name = "Spring Stampede"; }
        if (i === 7) { tier = "Major_Event"; name = "Summer Scorcher"; }
        if (i === 11) { tier = "Flagship_Event"; name = "Final Conflict"; }
        
        // (FIXED) Correct path
        batch.set(doc(collection(db, `/artifacts/${appId}/public/data/dataset_events`)), {
          datasetId: datasetId, 
          companyId: companyId, 
          month: i + 1, 
          eventName: name, 
          eventTier: tier,
        });
      }

      // 7. Create Relationships (dataset_relationships)
      // (FIXED) Correct path
      batch.set(doc(collection(db, `/artifacts/${appId}/public/data/dataset_relationships`)), {
        datasetId: datasetId,
        personA_Id: wrestlerRefs["Alex 'The Ace' Valour"],
        personB_Id: wrestlerRefs["Jax 'The Juggernaut' Stone"],
        relationshipType: 'Rivalry',
        status: 'Strongly Dislike',
        notes: "Real-life rivalry from their training days."
      });
      batch.set(doc(collection(db, `/artifacts/${appId}/public/data/dataset_relationships`)), {
        datasetId: datasetId,
        personA_Id: wrestlerRefs["Leo 'Lionheart' Cruz"],
        personB_Id: wrestlerRefs["Eliza 'High-Flyer' Hayes"],
        relationshipType: 'Friendship',
        status: 'Friends',
        notes: "Came up on the indies together."
      });


      await batch.commit();
      console.log("Default dataset created successfully.");
    } catch (error) {
      console.error("Error seeding dataset: ", error);
      setLoadingMessage("Error creating default data. Please refresh.");
    }
  };

  // --- Data Fetching Callbacks ---
  const fetchDatasets = async (db, userId, appId) => {
    try {
      // (FIXED) Correct path
      const q = query(collection(db, `/artifacts/${appId}/public/data/datasets`));
      const querySnapshot = await getDocs(q);
      const datasetsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDatasets(datasetsData);
    } catch (error) {
      console.error("Error fetching datasets: ", error);
    }
  };

  const fetchPlayerSaves = async (db, userId, appId) => {
    if (!userId) return;
    try {
      // (FIXED) Correct path
      const q = query(collection(db, `/artifacts/${appId}/users/${userId}/player_saves`));
      const querySnapshot = await getDocs(q);
      const savesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPlayerSaves(savesData);
    } catch (error) {
      console.error("Error fetching player saves: ", error);
    }
  };

  // --- Phase 1, Task 4: "New Game" & "Load Game" Logic ---

  const handleNewGame = async (datasetId) => {
    if (!userId || !db || !appId) return;

    setGameState('BUSY');
    setLoadingMessage('Starting your new game... This may take a moment.');

    try {
      // 1. Create new player_save document
      const newSaveData = {
        userId: userId,
        datasetId: datasetId,
        saveName: `New Game (${new Date().toLocaleDateString()})`,
        lastPlayed: Timestamp.now(),
        currentDate: Timestamp.fromDate(new Date('2025-01-07T09:00:00')), // Start on Show Day
        playerCompanyId: null // We'll set this after we copy the company
      };
      // (FIXED) Correct path
      const newSaveRef = await addDoc(collection(db, `/artifacts/${appId}/users/${userId}/player_saves`), newSaveData);
      const newSaveId = newSaveRef.id;

      // 2. (REVISED) Copy all dataset collections in passes
      const batch = writeBatch(db);
      const idMap = new Map(); // <old_doc_id, new_doc_id>
      let playerCompanyId = null;

      // --- PASS 1: Create new docs for items that HAVE IDs (wrestlers, companies, etc.) ---
      setLoadingMessage('Copying core data...');
      for (const datasetCollectionName of ID_MAPPED_COLLECTIONS) {
        const saveCollectionName = SAVE_COLLECTIONS_MAP[datasetCollectionName];
        if (!saveCollectionName) continue;

        const q = query(collection(db, `/artifacts/${appId}/public/data/${datasetCollectionName}`), where("datasetId", "==", datasetId));
        const querySnapshot = await getDocs(q);

        for (const docSnap of querySnapshot.docs) {
          const oldDocId = docSnap.id;
          const docData = docSnap.data();
          
          const newDocRef = doc(collection(db, `/artifacts/${appId}/users/${userId}/player_saves/${newSaveId}/${saveCollectionName}`));
          const newDocId = newDocRef.id;
          
          idMap.set(oldDocId, newDocId); // Store the mapping
          
          batch.set(newDocRef, docData);

          if (datasetCollectionName === 'dataset_companies' && !playerCompanyId) {
            playerCompanyId = newDocId; // Assign the NEW company ID
          }
        }
      }
      
      // --- PASS 2: Copy remaining docs and map foreign keys ---
      setLoadingMessage('Linking relationships and shows...');
      const remainingCollections = DATASET_COLLECTIONS.filter(col => !ID_MAPPED_COLLECTIONS.includes(col));

      for (const datasetCollectionName of remainingCollections) {
        const saveCollectionName = SAVE_COLLECTIONS_MAP[datasetCollectionName];
        if (!saveCollectionName) continue;

        const q = query(collection(db, `/artifacts/${appId}/public/data/${datasetCollectionName}`), where("datasetId", "==", datasetId));
        const querySnapshot = await getDocs(q);

        for (const docSnap of querySnapshot.docs) {
          const docData = docSnap.data();
          let newDocData = { ...docData };

          // --- Map Foreign Keys ---
          if (datasetCollectionName === 'dataset_events') {
            newDocData.status = "Planned";
            const showDate = (docData.month === 1) 
              ? new Date(2025, docData.month - 1, 7, 18, 0, 0)
              : new Date(2025, docData.month - 1, 28, 18, 0, 0);
            newDocData.date = Timestamp.fromDate(showDate);
            // Map the company ID
            newDocData.companyId = idMap.get(docData.companyId) || docData.companyId;
          }
          
          if (datasetCollectionName === 'dataset_relationships') {
            newDocData.personA_Id = idMap.get(docData.personA_Id) || docData.personA_Id;
            newDocData.personB_Id = idMap.get(docData.personB_Id) || docData.personB_Id;
          }
          
          if (datasetCollectionName === 'dataset_titles') {
            newDocData.companyId = idMap.get(docData.companyId) || docData.companyId;
            newDocData.initialHolderId = idMap.get(docData.initialHolderId) || null;
            // We'd also map currentHolderId if it existed
          }
          
          if (datasetCollectionName === 'dataset_tv_shows') {
             newDocData.companyId = idMap.get(docData.companyId) || docData.companyId;
          }
          // --- End Map ---

          const newDocRef = doc(collection(db, `/artifacts/${appId}/users/${userId}/player_saves/${newSaveId}/${saveCollectionName}`));
          batch.set(newDocRef, newDocData);
        }
      }

      await batch.commit();

      // 3. Update the player_save with the company ID
      await setDoc(newSaveRef, { playerCompanyId: playerCompanyId }, { merge: true });

      // 4. Load the new game
      await handleLoadGame(newSaveId);

    } catch (error) {
      console.error("Error creating new game: ", error);
      setLoadingMessage("Failed to create new game. Please try again.");
      setGameState('MAIN_MENU');
    }
  };

  const handleLoadGame = async (saveId) => {
    if (!userId || !db || !appId) return;

    setGameState('BUSY');
    setLoadingMessage('Loading your save game...');

    try {
      // 1. Get the save game doc
      // (FIXED) Correct path
      const saveRef = doc(db, `/artifacts/${appId}/users/${userId}/player_saves`, saveId);
      const saveSnap = await getDoc(saveRef);

      if (!saveSnap.exists()) {
        throw new Error("Save game not found.");
      }
      
      const saveData = { id: saveSnap.id, ...saveSnap.data() };
      setActiveSave(saveData);

      // 2. Load all associated save collections into gameData state
      let loadedGameData = {};
      let unreadCount = 0;
      
      for (const collectionName of SAVE_COLLECTION_NAMES) { 
        // (FIXED) Correct path
        const q = query(collection(db, `/artifacts/${appId}/users/${userId}/player_saves/${saveId}/${collectionName}`));
        const querySnapshot = await getDocs(q);
        
        const collectionData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        loadedGameData[collectionName] = collectionData;
        
        if (collectionName === 'save_messages') {
          unreadCount = collectionData.filter(msg => !msg.isRead).length;
        }
      }
      
      setGameData(loadedGameData);
      setUnreadMessages(unreadCount);
      
      // 3. Go in-game
      setGameState('IN_GAME');

    } catch (error) {
      console.error("Error loading game: ", error);
      setLoadingMessage("Failed to load game. Please try again.");
      setGameState('MAIN_MENU');
    }
  };
  
  // --- Phase 1, Task 5: "Next Day" Logic (Updated for Phase 2) ---
  const handleNextDay = async () => {
    if (!activeSave) return;
    
    setGameState('BUSY');
    setLoadingMessage('Simulating next day...');
    
    try {
      // 1. Run the simulation engine for the current day
      await runSimulationAndEvents(activeSave.id);

      // 2. Increment the date
      const currentDate = activeSave.currentDate.toDate();
      const nextDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
      const newTimestamp = Timestamp.fromDate(nextDate);
      
      // 3. Update the save game doc in Firestore
      // (FIXED) Correct path
      const saveRef = doc(db, `/artifacts/${appId}/users/${userId}/player_saves`, activeSave.id);
      await setDoc(saveRef, { 
        currentDate: newTimestamp,
        lastPlayed: Timestamp.now()
      }, { merge: true });
      
      // 4. Update local state
      setActiveSave(prevSave => ({ ...prevSave, currentDate: newTimestamp }));
      
      setGameState('IN_GAME');
      
    } catch (error) {
      console.error("Error advancing day: ", error);
      setLoadingMessage("Error saving progress. Please refresh.");
    }
  };
  
  const handleExitGame = () => {
    setActiveSave(null);
    setGameData({});
    setGameState('MAIN_MENU');
    // (FIXED) Pass correct args
    fetchPlayerSaves(db, userId, appId);
  };

  // --- Phase 2: AI & Simulation Engine ---

  const runSimulationAndEvents = async (saveId) => {
    console.log("Sim Engine: Running daily simulation...");
    
    const wrestlers = gameData.save_wrestlers;
    if (!wrestlers || wrestlers.length === 0) return;

    if (Math.random() < 0.25) {
      console.log("Sim Engine: Event triggered!");
      const randomWrestler = wrestlers[Math.floor(Math.random() * wrestlers.length)];
      const topics = ['unhappy_booking', 'excited_push', 'request_time_off'];
      const randomTopic = topics[Math.floor(Math.random() * topics.length)];
      await generateAndSaveMessage(saveId, randomWrestler, randomTopic);
    }
  };

  const generateAndSaveMessage = async (saveId, wrestler, topic) => {
    console.log(`AI Engine: Generating message for ${wrestler.name} about ${topic}`);
    setLoadingMessage(`Generating event for ${wrestler.name}...`);

    let userQuery = "";
    switch (topic) {
      case 'unhappy_booking':
        userQuery = "I'm feeling really frustrated with my booking lately. Write a text message to my boss (the booker) complaining about being overlooked or misused.";
        break;
      case 'excited_push':
        userQuery = "I'm really happy with my current push. Write a text message to my boss (the booker) thanking them and saying you're ready for more.";
        break;
      case 'request_time_off':
      default:
        userQuery = "I need to ask for a week off for some personal reasons. Write a text message to my boss (the booker) politely asking for the time off.";
        break;
    }

    const systemPrompt = `
      You are a professional wrestler. You are writing an informal text message (NOT an email) to your boss, who is the head booker of the company.
      
      Your Name: ${wrestler.name}
      Your Gimmick: ${wrestler.gimmick}
      Your Disposition: ${wrestler.disposition} (Face = good guy, Heel = bad guy, Tweener = in-between)

      Keep the message concise (1-3 sentences), reflecting your persona. Be informal, like a real text message.
      Do NOT use hashtags. Do NOT sign your name at the end (the booker knows who you are).
    `;

    try {
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${GEMINI_API_KEY}`;

      const payload = {
        contents: [{ parts: [{ text: userQuery }] }],
        systemInstruction: {
          parts: [{ text: systemPrompt }]
        },
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
      }

      const result = await response.json();
      const messageText = result.candidates?.[0]?.content?.parts?.[0]?.text;

      if (messageText) {
        // Save to Firestore
        const messageData = {
          senderId: wrestler.id,
          senderName: wrestler.name,
          body: messageText,
          timestamp: Timestamp.now(),
          type: 'Text', // As opposed to 'Email'
          isRead: false
        };
        
        // (FIXED) Correct path
        const messagesRef = collection(db, `/artifacts/${appId}/users/${userId}/player_saves/${saveId}/save_messages`);
        const newDocRef = await addDoc(messagesRef, messageData);
        
        // Update local state to show new message instantly
        const newMessage = { id: newDocRef.id, ...messageData };
        setGameData(prevData => ({
          ...prevData,
          save_messages: [...(prevData.save_messages || []), newMessage]
        }));
        setUnreadMessages(prev => prev + 1);
      }
    } catch (error) {
      console.error("Error generating AI message: ", error);
    }
  };
  
  const handleGetAIAdvice = async () => {
    if (!assistantQuery || !gameData.save_wrestlers) return;

    setIsAssistantLoading(true);
    setAssistantResponse("");

    const rosterContext = gameData.save_wrestlers.map(w => (
      `${w.name} (Disposition: ${w.disposition}, Gimmick: ${w.gimmick}, Morale: ${w.morale}, Charisma: ${w.stats.charisma})`
    )).join('\n');

    const systemPrompt = `
      You are an expert wrestling booker and creative assistant. The user is your boss.
      You will be given a question from the user and a list of their current roster.
      Your job is to provide creative, insightful, and actionable advice.
      Base your advice on the wrestler's disposition, gimmick, and stats.
      
      Here is the current roster:
      ${rosterContext}
    `;

    const userQuery = assistantQuery;

    try {
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${GEMINI_API_KEY}`;

      const payload = {
        contents: [{ parts: [{ text: userQuery }] }],
        systemInstruction: {
          parts: [{ text: systemPrompt }]
        },
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
      }

      const result = await response.json();
      const adviceText = result.candidates?.[0]?.content?.parts?.[0]?.text;

      if (adviceText) {
        setAssistantResponse(adviceText);
      } else {
        setAssistantResponse("The AI assistant couldn't come up with a response. Try rephrasing your question.");
      }
    } catch (error) {
      console.error("Error getting AI advice: ", error);
      setAssistantResponse("There was an error connecting to the AI assistant. Please try again.");
    } finally {
      setIsAssistantLoading(false);
    }
  };
  
  const handleMarkMessagesRead = async () => {
    if (!activeSave || unreadMessages === 0) return;
    
    setUnreadMessages(0);
    
    setGameData(prevData => ({
      ...prevData,
      save_messages: prevData.save_messages.map(msg => ({ ...msg, isRead: true }))
    }));
    
    try {
      const batch = writeBatch(db);
      // (FIXED) Correct path
      const messagesRef = collection(db, `/artifacts/${appId}/users/${userId}/player_saves/${activeSave.id}/save_messages`);
      
      gameData.save_messages.forEach(msg => {
        if (!msg.isRead) {
          const docRef = doc(messagesRef, msg.id);
          batch.update(docRef, { isRead: true });
        }
      });
      
      await batch.commit();
    } catch (error) {
      console.error("Error marking messages as read: ", error);
    }
  };


  // --- Phase 1, Task 8: Booking Show Logic ---

  const handleStartBookingShow = (show) => {
    setCurrentShow(show);
    setCurrentSegments(Array(10).fill(null)); 
    setGameState('BOOKING_SHOW');
  };

  const handleOpenSegmentModal = (index) => {
    setEditingSegmentIndex(index);
    const existingSegment = currentSegments[index];
    setSegmentFormData(existingSegment || { type: 'Match', participants: [], winnerId: null, storylineId: null });
    setParticipantSearch("");
    setParticipantResults([]);
    setShowSegmentModal(true);
  };

  const handleSaveSegment = () => {
    const newSegments = [...currentSegments];
    newSegments[editingSegmentIndex] = segmentFormData;
    setCurrentSegments(newSegments);
    
    setShowSegmentModal(false);
    setEditingSegmentIndex(null);
    setSegmentFormData({ type: 'Match', participants: [], winnerId: null, storylineId: null });
  };
  
  // (NEW) Helper function to calculate segment ratings
  const calculateSegmentRating = (segment, allWrestlers) => {
    if (!segment || segment.participants.length === 0) return 0;

    let totalCharisma = 0;
    let totalWorkrate = 0;
    const participants = [];

    for (const p of segment.participants) {
      const wrestler = allWrestlers.find(w => w.id === p.id);
      if (wrestler) {
        participants.push(wrestler);
        totalCharisma += wrestler.stats.charisma;
      }
    }
    
    const numParticipants = participants.length;
    if (numParticipants === 0) return 0;
    
    const avgCharisma = totalCharisma / numParticipants;

    if (segment.type === 'Angle') {
      // Per EWR guides, angle rating is 100% charisma
      return Math.min(100, Math.floor(avgCharisma));
    }

    if (segment.type === 'Match') {
      // Per EWR guides, match rating is a blend of charisma (overness) and workrate
      for (const wrestler of participants) {
        totalWorkrate += (wrestler.stats.brawling + wrestler.stats.speed + wrestler.stats.technical) / 3;
      }
      const avgWorkrate = totalWorkrate / numParticipants;
      
      // 60% Overness (Charisma), 40% Workrate
      const rating = (avgCharisma * 0.6) + (avgWorkrate * 0.4);
      return Math.min(100, Math.floor(rating));
    }

    return 0; // Default
  };

  // (NEW) Overhauled show running logic
  const handleRunShow = async () => {
    setGameState('BUSY');
    setLoadingMessage('Calculating segment ratings...');
    
    try {
      let ratedSegments = [];
      let totalWeightedRating = 0;
      let totalWeight = 0;

      // --- 1. Calculate Individual Segment Ratings & Weighted Show Rating ---
      let lastNonNullSegmentIndex = -1;
      for (let i = currentSegments.length - 1; i >= 0; i--) {
        if (currentSegments[i]) {
          lastNonNullSegmentIndex = i;
          break;
        }
      }

      for (let i = 0; i < currentSegments.length; i++) {
        const segment = currentSegments[i];
        if (!segment) {
          ratedSegments.push(null);
          continue;
        }

        const rating = calculateSegmentRating(segment, gameData.save_wrestlers);
        const ratedSegment = { ...segment, rating: rating };
        ratedSegments.push(ratedSegment);

        // Apply weights per EWR guides
        let weight = 1.0;
        if (i === 0) weight = 1.2; // Opener
        if (i === lastNonNullSegmentIndex) weight = 2.0; // Main Event

        totalWeightedRating += rating * weight;
        totalWeight += weight;
      }

      const finalShowRating = totalWeight > 0 ? Math.floor(totalWeightedRating / totalWeight) : 0;
      setShowRating(finalShowRating);
      
      // --- 2. Run Simulation & Log Events ---
      setLoadingMessage('Logging career events...');
      // (NEW) Pass ratedSegments to logging
      await logCareerEvents(ratedSegments, finalShowRating);

      setLoadingMessage('Simulating backstage changes...');
      // (NEW) Pass ratedSegments and show data to simulation
      await runShowSimulation(ratedSegments, currentShow);

      // --- 3. Generate AI Recap ---
      setLoadingMessage('Generating show recap...');
      // (NEW) Pass ratedSegments for more detailed recap context
      const recapText = await generateShowRecap(currentShow, ratedSegments, finalShowRating);
      setShowRecap(recapText);

      // --- 4. Save to Database ---
      setLoadingMessage('Saving show results...');
      const showRef = doc(db, `/artifacts/${appId}/users/${userId}/player_saves/${activeSave.id}/save_shows`, currentShow.id);
      
      const showUpdateData = {
        status: "Complete",
        segments: ratedSegments, // Save the new segments WITH ratings
        rating: finalShowRating,
        recap: recapText
      };
      
      await setDoc(showRef, showUpdateData, { merge: true });

      // --- 5. Update Local State ---
      setGameData(prevData => ({
        ...prevData,
        save_shows: prevData.save_shows.map(show => 
          show.id === currentShow.id 
            ? { ...show, ...showUpdateData }
            : show
        )
      }));

      // --- 6. Go to Results Screen ---
      setGameState('SHOW_RESULTS');
      
    } catch (error) {
      console.error("Error running show:", error);
      setLoadingMessage("Error saving show. Please try again.");
      setGameState('BOOKING_SHOW');
    }
  };

  // --- Phase 2, Task 5: AI Show Recap ---
  // (NEW) Now accepts ratedSegments for more context
  const generateShowRecap = async (show, ratedSegments, rating) => {
    console.log(`AI Engine: Generating recap for ${show.eventName}`);
    setLoadingMessage(`Generating show recap for ${show.eventName}...`);

    const cardForAI = ratedSegments
      .filter(s => s) 
      .map((s, index) => {
        const participants = s.participants.map(p => p.name).join(' vs. ');
        let result = "";
        
        const storyline = s.storylineId ? gameData.save_storylines.find(story => story.id === s.storylineId) : null;
        const storylineContext = storyline ? ` (Storyline: ${storyline.name})` : "";

        // (NEW) Add the segment rating to the AI prompt
        const ratingContext = `(Rating: ${s.rating}/100)`;

        if (s.type === 'Match') {
          const winner = s.winnerId ? s.participants.find(p => p.id === s.winnerId)?.name : 'N/A';
          result = winner !== 'N/A' ? ` (Winner: ${winner})` : " (Result: Draw/No Contest)";
        } else {
          return `Segment ${index + 1} (Angle)${storylineContext}: ${s.participants.map(p => p.name).join(', ')} ${ratingContext}`;
        }
        return `${index + 1}. ${s.type}${storylineContext}: ${participants}${result} ${ratingContext}`;
      }).join('\n');

    const systemPrompt = `
      You are a professional wrestling "dirt sheet" journalist, like Dave Meltzer. 
      You are writing a recap of a wrestling show for your subscribers. 
      Your tone should be critical, insightful, and use insider terms (e.g., "went over," "clean win," "got their heat back," "Gimmick," "push," "B-show").
      You will be given the name of the show, the final rating (out of 100), and the segments that happened (including their individual ratings).
      
      Your recap should be a few paragraphs long. 
      - First, give an overall impression of the show based on the **overall rating**.
      - Then, pick 2-3 key segments (especially the main event, which is the last one) and describe what happened, using their **individual segment ratings** to justify your praise or criticism.
      - IMPORTANT: If a segment includes a "(Storyline: ...)" tag, pay special attention to it. Mention how the segment (and its rating) advanced that specific storyline.
      - Conclude with a final thought on the show's direction.
      - Do NOT just list every segment. Be selective.
    `;
    
    const userQuery = `
      Show Name: ${show.eventName}
      Overall Rating: ${rating}/100
      
      Booked Card:
      ${cardForAI}
    `;

    let recapText = "No AI recap could be generated for this show.";
    try {
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${GEMINI_API_KEY}`;

      const payload = {
        contents: [{ parts: [{ text: userQuery }] }],
        systemInstruction: {
          parts: [{ text: systemPrompt }]
        },
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
      }

      const result = await response.json();
      const generatedText = result.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (generatedText) {
        recapText = generatedText;
      }
    
    } catch (error) {
      console.error("Error generating AI recap: ", error);
      recapText = "An error occurred while generating the show recap. The show is still saved.";
    }
        
    return recapText;
  };


  // --- Phase 3, Task 4: Post-Show Simulation Engine v2 ---
  // (UPDATED) Now accepts ratedSegments
  const runShowSimulation = async (ratedSegments, show) => {
    console.log("Sim Engine v2: Running post-show simulation...");
    if (!ratedSegments || !show || !gameData.save_wrestlers || !gameData.save_relationships || !gameData.save_storylines || !db || !userId || !appId) {
      console.warn("Sim Engine v2: Missing required data, skipping simulation.");
      return;
    }

    const batch = writeBatch(db);
    const wrestlerUpdates = new Map();
    const storylineUpdates = new Map();
    
    const allWrestlers = gameData.save_wrestlers;
    const allRelationships = gameData.save_relationships;
    const allStorylines = gameData.save_storylines;

    // --- Helper Functions ---
    const getWrestler = (id) => {
      if (wrestlerUpdates.has(id)) {
        return wrestlerUpdates.get(id);
      }
      return allWrestlers.find(w => w.id === id);
    };

    const getRelationship = (id1, id2) => {
      return allRelationships.find(rel => 
        (rel.personA_Id === id1 && rel.personB_Id === id2) ||
        (rel.personA_Id === id2 && rel.personB_Id === id1)
      );
    };
    
    const getStoryline = (id) => {
      if (storylineUpdates.has(id)) {
        return storylineUpdates.get(id);
      }
      return allStorylines.find(s => s.id === id);
    };

    // (NEW) Event Tier Morale Multiplier
    const getMoraleMultiplier = (tier) => {
      switch (tier) {
        case 'Flagship_Event':
          return 2.0;
        case 'Major_Event':
          return 1.5;
        case 'Monthly_Event':
        default:
          return 1.0;
      }
    };
    
    // (NEW) Storyline Heat change based on segment rating
    const getHeatChange = (segmentRating) => {
      if (segmentRating >= 75) return 5; // Good segment, big heat gain
      if (segmentRating >= 50) return 2; // Average segment, small heat gain
      return -3; // Bad segment, heat loss
    };

    // --- Simulation Logic ---
    try {
      const moraleMultiplier = getMoraleMultiplier(show.eventTier);

      for (const segment of ratedSegments) {
        if (!segment) continue; 
        
        // (NEW) Get segment rating
        const segmentRating = segment.rating || 50; // Default to 50 if rating is missing

        // 1. (NEW) Update Storyline Heat
        if (segment.storylineId) {
          const storyline = getStoryline(segment.storylineId);
          if (storyline) {
            const baseHeat = storylineUpdates.has(storyline.id)
              ? storylineUpdates.get(storyline.id).heat
              : storyline.heat;
            
            // (NEW) Use segment rating to determine heat change
            const heatChange = getHeatChange(segmentRating);
            const finalHeat = Math.max(0, Math.min(100, baseHeat + heatChange));
            
            storylineUpdates.set(storyline.id, { ...storyline, heat: finalHeat });
            console.log(`Sim Update: Storyline '${storyline.name}' heat ${baseHeat} -> ${finalHeat} (Segment Rating: ${segmentRating})`);
          }
        }

        // 2. Update Wrestler Morale (only for matches for now)
        if (segment.type === 'Match') {
          const participantIds = segment.participants.map(p => p.id);

          for (const participant of segment.participants) {
            const wrestler = getWrestler(participant.id);
            if (!wrestler) continue;

            let moraleChange = 0;
            const baseMorale = wrestlerUpdates.has(participant.id)
              ? wrestlerUpdates.get(participant.id).morale
              : wrestler.morale;

            // Storyline Logic
            if (segment.storylineId) {
              if (segment.winnerId === participant.id) {
                moraleChange += 10; // Storyline win
              } else if (segment.winnerId) { 
                moraleChange -= 5; // Storyline loss
              }
            }

            // Relationship Logic
            const opponentIds = participantIds.filter(id => id !== participant.id);
            for (const oppId of opponentIds) {
              const relationship = getRelationship(participant.id, oppId);
              if (relationship) {
                if (relationship.status.includes('Friend')) {
                  moraleChange += 3;
                } else if (relationship.status.includes('Dislike') || relationship.status.includes('Hate')) {
                  moraleChange -= 3;
                }
              }
            }

            // Apply Multiplier and update
            if (moraleChange !== 0) {
              const finalMorale = Math.max(0, Math.min(100, baseMorale + (moraleChange * moraleMultiplier)));
              wrestlerUpdates.set(participant.id, { ...wrestler, morale: finalMorale });
              console.log(`Sim Update: ${wrestler.name} morale ${baseMorale} -> ${finalMorale} (Multiplier: ${moraleMultiplier}x)`);
            }
          }
        }
      }

      // --- Commit Updates to Firestore ---
      let updatesMade = false;
      
      if (wrestlerUpdates.size > 0) {
        wrestlerUpdates.forEach((wrestler, id) => {
          const docRef = doc(db, `/artifacts/${appId}/users/${userId}/player_saves/${activeSave.id}/save_wrestlers`, id);
          batch.update(docRef, { morale: wrestler.morale });
        });
        updatesMade = true;
      }
      
      if (storylineUpdates.size > 0) {
        storylineUpdates.forEach((storyline, id) => {
          const docRef = doc(db, `/artifacts/${appId}/users/${userId}/player_saves/${activeSave.id}/save_storylines`, id);
          batch.update(docRef, { heat: storyline.heat });
        });
        updatesMade = true;
      }

      if (updatesMade) {
        await batch.commit();

        // --- Update Local State ---
        setGameData(prevData => ({
          ...prevData,
          save_wrestlers: prevData.save_wrestlers.map(w => {
            if (wrestlerUpdates.has(w.id)) {
              return wrestlerUpdates.get(w.id);
            }
            return w;
          }),
          save_storylines: prevData.save_storylines.map(s => {
            if (storylineUpdates.has(s.id)) {
              return storylineUpdates.get(s.id);
            }
            return s;
          })
        }));
        console.log("Sim Engine v2: Morale and Storyline updates saved and local state updated.");
      } else {
        console.log("Sim Engine v2: No morale or storyline changes to apply.");
      }

    } catch (error) {
      console.error("Error during post-show simulation: ", error);
    }
  };


  // --- Phase 3, Task 2: Log Career Events ---
  // (UPDATED) Accepts ratedSegments
  const logCareerEvents = async (ratedSegments, showRating) => {
    console.log("Sim Engine: Logging career events to memory...");
    if (!db || !userId || !appId || !activeSave) return;
    
    try {
      const batch = writeBatch(db);
      const company = gameData.save_companies.find(c => c.id === activeSave.playerCompanyId);
      const companySize = company ? company.size : "Unknown";
      
      let newCareerEvents = []; 

      for (const segment of ratedSegments) {
        if (!segment) continue;
        
        for (const participant of segment.participants) {
          const opponentIds = segment.participants
            .filter(p => p.id !== participant.id)
            .map(p => p.id);
            
          const opponentNames = segment.participants
            .filter(p => p.id !== participant.id)
            .map(p => p.name)
            .join(', ');

          let eventType = "Angle";
          let notes = `Participated in an angle with ${opponentNames || 'others'}`;
          
          if (segment.type === 'Match') {
            if (segment.winnerId === participant.id) {
              eventType = "Match Win";
              notes = `Won match against ${opponentNames || 'opponent(s)'}`;
            } else if (segment.winnerId) {
              eventType = "Match Loss";
              const winnerName = segment.participants.find(p => p.id === segment.winnerId)?.name;
              notes = `Lost match to ${winnerName || 'opponent(s)'}`;
            } else {
              eventType = "Match Draw/NC";
              notes = `Match with ${opponentNames || 'opponent(s)'} ended in a draw/no contest.`;
            }
          }
          
          const careerEventData = {
            playerSaveId: activeSave.id,
            wrestlerId: participant.id,
            date: activeSave.currentDate, 
            eventType: eventType,
            companyId: activeSave.playerCompanyId,
            companySize: companySize,
            segmentRating: segment.rating || showRating, // (NEW) Use segment rating
            opponentIds: opponentIds,
            notes: notes,
            storylineId: segment.storylineId || null,
            showId: currentShow.id
          };
          
          // (FIXED) Correct path
          const newEventRef = doc(collection(db, `/artifacts/${appId}/users/${userId}/player_saves/${activeSave.id}/save_career_events`));
          batch.set(newEventRef, careerEventData);

          newCareerEvents.push({ id: newEventRef.id, ...careerEventData });
        }
      }
      
      await batch.commit();
      console.log("Career events successfully logged to memory.");

      setGameData(prevData => ({
        ...prevData,
        save_career_events: [
          ...(prevData.save_career_events || []),
          ...newCareerEvents
        ]
      }));
      
    } catch (error) {
      console.error("Error logging career events:", error);
    }
  };


  // --- Booking Modal Handlers ---
  const handleParticipantSearch = (query) => {
    setParticipantSearch(query);
    if (query.length < 1) { 
      setParticipantResults([]);
      return;
    }
    
    const results = gameData.save_wrestlers
      .filter(w => w.name.toLowerCase().includes(query.toLowerCase()))
      .filter(w => !segmentFormData.participants.find(p => p.id === w.id));
      
    setParticipantResults(results.slice(0, 5));
  };

  const handleAddParticipant = (wrestler) => {
    setSegmentFormData(prev => ({
      ...prev,
      participants: [...prev.participants, { id: wrestler.id, name: wrestler.name }]
    }));
    setParticipantSearch("");
    setParticipantResults([]);
  };
  
  const handleRemoveParticipant = (wrestlerId) => {
    setSegmentFormData(prev => ({
      ...prev,
      participants: prev.participants.filter(p => p.id !== wrestlerId),
      winnerId: prev.winnerId === wrestlerId ? null : prev.winnerId
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

  // --- Phase 3: Storyline Logic ---
  const handleOpenCreateStorylineModal = () => {
    setStorylineFormData({ name: '', participants: [] });
    setStorylineParticipantSearch("");
    setStorylineParticipantResults([]);
    setShowStorylineModal(true);
  };
  
  const handleStorylineParticipantSearch = (query) => {
    setStorylineParticipantSearch(query);
    if (query.length < 1) {
      setStorylineParticipantResults([]);
      return;
    }
    const results = gameData.save_wrestlers
      .filter(w => w.name.toLowerCase().includes(query.toLowerCase()))
      .filter(w => !storylineFormData.participants.find(p => p.id === w.id));
    setStorylineParticipantResults(results.slice(0, 5));
  };

  const handleAddStorylineParticipant = (wrestler) => {
    setStorylineFormData(prev => ({
      ...prev,
      participants: [...prev.participants, { id: wrestler.id, name: wrestler.name }]
    }));
    setStorylineParticipantSearch("");
    setStorylineParticipantResults([]);
  };
  
  const handleRemoveStorylineParticipant = (wrestlerId) => {
    setStorylineFormData(prev => ({
      ...prev,
      participants: prev.participants.filter(p => p.id !== wrestlerId)
    }));
  };
  
  const handleCreateStoryline = async () => {
    if (!storylineFormData.name || storylineFormData.participants.length < 2) {
      console.error("Storyline must have a name and at least 2 participants.");
      return;
    }
    
    setLoadingMessage('Creating storyline...');
    setGameState('BUSY');
    
    try {
      const newStorylineData = {
        ...storylineFormData,
        companyId: activeSave.playerCompanyId,
        heat: 10,
        status: "Active",
        beats: [] 
      };
      
      // (FIXED) Correct path
      const docRef = await addDoc(collection(db, `/artifacts/${appId}/users/${userId}/player_saves/${activeSave.id}/save_storylines`), newStorylineData);
      
      const newStoryline = { id: docRef.id, ...newStorylineData };
      
      setGameData(prevData => ({
        ...prevData,
        save_storylines: [...(prevData.save_storylines || []), newStoryline]
      }));
      
      setShowStorylineModal(false);
      setGameState('STORYLINE_SCREEN');
      
    } catch (error) {
      console.error("Error creating storyline:", error);
      setLoadingMessage("Failed to create storyline. Please try again.");
      setGameState('STORYLINE_SCREEN');
    }
  };


  // --- Phase 3: Career History Logic ---
  const handleViewCareerHistory = (wrestler) => {
    setViewingWrestler(wrestler);
    setGameState('CAREER_HISTORY_SCREEN');
  };

  // --- Phase 3: Relationships Logic ---
  const handleViewRelationships = (wrestler) => {
    setViewingWrestler(wrestler);
    setGameState('RELATIONSHIPS_SCREEN');
  };


  // --- UI Render Functions ---

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
        {/* --- New Game --- */}
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
        
        {/* --- Load Game --- */}
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

  // --- Phase 1, Tasks 5-9: Game Dashboard ---
  const renderGameDashboard = () => {
    if (!activeSave || !gameData.save_companies) return renderLoadingScreen();
    
    const playerCompany = gameData.save_companies.find(c => c.id === activeSave.playerCompanyId);
    
    const currentDateStr = activeSave.currentDate.toDate().toISOString().split('T')[0];
    const plannedShow = gameData.save_shows?.find(show => 
      show.date.toDate().toISOString().split('T')[0] === currentDateStr && show.status === 'Planned'
    );
    
    return (
      <div className="max-w-7xl mx-auto p-4 md:p-8 text-white">
        {/* --- Header --- */}
        <div className="flex flex-col md:flex-row justify-between items-center p-4 bg-gray-800 rounded-lg shadow-lg">
          <div>
            <h1 className="text-2xl font-bold text-white">{playerCompany?.name || 'Your Company'}</h1>
            <p className="text-indigo-300">{activeSave.saveName}</p>
          </div>
          <div className="text-center md:text-right mt-4 md:mt-0">
            <h2 className="text-xl font-semibold">{activeSave.currentDate.toDate().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h2>
            <p className="text-gray-400">Prestige: {playerCompany?.prestige} | Finances: ${playerCompany?.finances.toLocaleString()}</p>
          </div>
        </div>
        
        {/* --- Main Dashboard --- */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* --- Main Actions --- */}
          <div className="md:col-span-3">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg min-h-[400px]">
              <h3 className="text-xl font-semibold mb-4">Today's Actions</h3>
              
              {plannedShow ? (
                <div className="text-center p-8 bg-gray-700 rounded-lg">
                  <h4 className="text-2xl font-bold text-yellow-300">IT'S SHOW DAY!</h4>
                  <p className="text-lg mt-2">Time to book **{plannedShow.eventName}**!</p>
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
          
          {/* --- Navigation --- */}
          <div className="md:col-span-1 space-y-4">
            <button 
              className="w-full p-4 bg-gray-700 rounded-lg shadow-md text-left hover:bg-gray-600 transition-all flex items-center justify-between"
              onClick={() => setShowMessagesModal(true)}
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
            <button className="w-full p-4 bg-gray-700 rounded-lg shadow-md text-left hover:bg-gray-600 transition-all">
              Staff
            </button>
            <button 
              onClick={() => setGameState('STORYLINE_SCREEN')}
              className="w-full p-4 bg-gray-700 rounded-lg shadow-md text-left hover:bg-gray-600 transition-all flex items-center"
            >
              <FireIcon />
              Storyline Planner
            </button>
            <button className="w-full p-4 bg-gray-700 rounded-lg shadow-md text-left hover:bg-gray-600 transition-all">
              Finances
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
    
    const sortedMessages = (gameData.save_messages || []).sort((a, b) => b.timestamp.toMillis() - a.timestamp.toMillis());

    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
        onClick={() => setShowMessagesModal(false)}
      >
        <div 
          className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center p-4 border-b border-gray-700">
            <h2 className="text-2xl font-bold text-white">Your Messages</h2>
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
          <div className="overflow-y-auto p-4 space-y-4">
            {sortedMessages.length === 0 ? (
              <p className="text-gray-400 text-center p-8">Your inbox is empty.</p>
            ) : (
              sortedMessages.map(msg => (
                <div key={msg.id} className={`p-4 rounded-lg ${msg.isRead ? 'bg-gray-700' : 'bg-indigo-900 border-l-4 border-indigo-400'}`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-lg">{msg.senderName}</span>
                    <span className="text-xs text-gray-400">{msg.timestamp.toDate().toLocaleString()}</span>
                  </div>
                  <p className="text-gray-200 whitespace-pre-wrap">{msg.body}</p>
                </div>
              ))
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
  
  // --- Booking Screen ---
  const renderBookingScreen = () => {
    if (!currentShow) return null;

    return (
      <div className="max-w-7xl mx-auto p-4 md:p-8 text-white">
        {/* --- Header --- */}
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

        {/* --- Segment List --- */}
        <div className="mt-6 space-y-3">
          {currentSegments.map((segment, index) => (
            <button 
              key={index}
              onClick={() => handleOpenSegmentModal(index)}
              className="w-full p-4 bg-gray-700 rounded-lg shadow-md text-left hover:bg-gray-600 transition-all flex items-center"
            >
              <span className="text-lg font-bold text-gray-400 w-12">{index + 1}.</span>
              {segment ? (
                <div>
                  <span className={`text-sm font-bold px-2 py-0.5 rounded ${segment.type === 'Match' ? 'bg-blue-600' : 'bg-purple-600'}`}>
                    {segment.type}
                  </span>
                  <span className="ml-3 text-lg text-white">
                    {segment.participants.map(p => p.name).join(' vs. ')}
                  </span>
                  {segment.winnerId && (
                    <p className="ml-16 text-sm text-yellow-400">
                      Winner: {segment.participants.find(p => p.id === segment.winnerId)?.name || 'N/A'}
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

  // --- Roster Screen ---
  const renderRosterScreen = () => {
    const wrestlers = gameData.save_wrestlers || [];
    
    const getDispositionClass = (disposition) => {
      switch (disposition) {
        case 'Face': return 'text-green-400';
        case 'Heel': return 'text-red-400';
        case 'Tweener': return 'text-yellow-400';
        default: return 'text-gray-400';
      }
    };

    return (
      <div className="max-w-7xl mx-auto p-4 md:p-8 text-white">
        {/* --- Header --- */}
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

        {/* --- Roster Grid --- */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {wrestlers.length === 0 && (
            <p className="text-gray-400 md:col-span-3 text-center">No wrestlers found in your save data.</p>
          )}
          {wrestlers.sort((a,b) => a.name.localeCompare(b.name)).map(wrestler => (
            <div key={wrestler.id} className="bg-gray-800 p-4 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold text-white">{wrestler.name}</h3>
              <p className="text-sm text-gray-400 mb-2">Gimmick: <span className="font-semibold text-gray-200">{wrestler.gimmick}</span></p>
              
              <div className="flex justify-between text-sm mb-3">
                <span className={`font-bold ${getDispositionClass(wrestler.disposition)}`}>
                  {wrestler.disposition}
                </span>
                <span className="text-gray-300">
                  Morale: <span className="font-semibold text-white">{wrestler.morale}</span>
                </span>
              </div>
              
              <div className="border-t border-gray-700 pt-2 grid grid-cols-4 gap-2 text-center text-xs">
                <div>
                  <span className="text-gray-400">BRAWL</span>
                  <p className="text-lg font-bold">{wrestler.stats.brawling}</p>
                </div>
                <div>
                  <span className="text-gray-400">SPEED</span>
                  <p className="text-lg font-bold">{wrestler.stats.speed}</p>
                </div>
                <div>
                  <span className="text-gray-400">TECH</span>
                  <p className="text-lg font-bold">{wrestler.stats.technical}</p>
                </div>
                <div>
                  <span className="text-gray-400">CHAR</span>
                  <p className="text-lg font-bold">{wrestler.stats.charisma}</p>
                </div>
              </div>
              
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleViewCareerHistory(wrestler)}
                  className="w-full p-2 bg-indigo-600 text-white font-semibold rounded-lg text-sm hover:bg-indigo-500 transition-all flex items-center justify-center"
                >
                  <HistoryIcon />
                  History
                </button>
                <button
                  onClick={() => handleViewRelationships(wrestler)}
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


  // --- Show Results Screen ---
  const renderShowResultsScreen = () => {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-8 text-white">
        {/* --- Header --- */}
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

        {/* --- AI Recap --- */}
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
  };
  
  // --- Storyline Screen ---
  const renderStorylineScreen = () => {
    const storylines = gameData.save_storylines || [];

    return (
      <div className="max-w-7xl mx-auto p-4 md:p-8 text-white">
        {/* --- Header --- */}
        <div className="flex justify-between items-center p-4 bg-gray-800 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-white flex items-center">
            <FireIcon />
            Storyline Manager
          </h1>
          <div className="flex space-x-2">
            <button 
              onClick={() => handleOpenCreateStorylineModal()}
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

        {/* --- Storyline List --- */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {storylines.length === 0 && (
            <p className="text-gray-400 md:col-span-2 text-center p-8">You have no active storylines. Go create one!</p>
          )}
          {storylines.filter(s => s.status === 'Active').map(storyline => (
            <div key={storyline.id} className="bg-gray-800 p-4 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold text-white">{storyline.name}</h3>
              <p className="text-sm text-gray-400 mb-2">
                Heat: <span className="font-semibold text-red-400">{storyline.heat}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {storyline.participants.map(p => (
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


  // --- Career History Screen ---
  const renderCareerHistoryScreen = () => {
    if (!viewingWrestler || !gameData.save_career_events) return renderLoadingScreen();

    const events = (gameData.save_career_events || [])
      .filter(event => event.wrestlerId === viewingWrestler.id)
      .sort((a, b) => b.date.toMillis() - a.date.toMillis()); 

    const getEventColor = (type) => {
      if (type === 'Match Win') return 'text-green-400';
      if (type === 'Match Loss') return 'text-red-400';
      if (type.includes('Draw')) return 'text-yellow-400';
      return 'text-gray-300';
    };

    return (
      <div className="max-w-4xl mx-auto p-4 md:p-8 text-white">
        {/* --- Header --- */}
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

        {/* --- History List --- */}
        <div className="mt-6 bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div className="shadow overflow-hidden border-b border-gray-700">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-700">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Event Type
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Notes
                        </th>
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
                        events.map(event => (
                          <tr key={event.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                              {event.date.toDate().toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span className={`font-semibold ${getEventColor(event.eventType)}`}>
                                {event.eventType}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-normal text-sm text-gray-200">
                              {event.notes}
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
      </div>
    );
  };
  
  // --- Relationships Screen ---
  const renderRelationshipsScreen = () => {
    if (!viewingWrestler || !gameData.save_relationships || !gameData.save_wrestlers) return renderLoadingScreen();

    const relationships = (gameData.save_relationships || [])
      .filter(rel => rel.personA_Id === viewingWrestler.id || rel.personB_Id === viewingWrestler.id);

    const getOtherPersonName = (rel) => {
      const otherId = rel.personA_Id === viewingWrestler.id ? rel.personB_Id : rel.personA_Id;
      const otherPerson = gameData.save_wrestlers.find(w => w.id === otherId);
      return otherPerson ? otherPerson.name : 'Unknown Person';
    };

    const getStatusColor = (status) => {
      if (status.includes('Friend') || status.includes('Like')) return 'text-green-400';
      if (status.includes('Dislike') || status.includes('Hate')) return 'text-red-400';
      return 'text-gray-300';
    };

    return (
      <div className="max-w-4xl mx-auto p-4 md:p-8 text-white">
        {/* --- Header --- */}
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

        {/* --- Relationship List --- */}
        <div className="mt-6 bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div className="shadow overflow-hidden border-b border-gray-700">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-700">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Person
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Type
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Notes
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                      {relationships.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="px-6 py-8 text-center text-gray-400">
                            No relationships found for this wrestler.
                          </td>
                        </tr>
                      ) : (
                        relationships.map(rel => (
                          <tr key={rel.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-white">
                              {getOtherPersonName(rel)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {rel.relationshipType}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span className={`font-semibold ${getStatusColor(rel.status)}`}>
                                {rel.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-normal text-sm text-gray-200">
                              {rel.notes}
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
      </div>
    );
  };


  // --- Booking Segment Modal ---
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
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Participants
              </label>
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
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Add Participant
              </label>
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
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Winner (Optional)
                </label>
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
  
  // --- Create Storyline Modal ---
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
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Participants (min. 2)
              </label>
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
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Add Participant
              </label>
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

  // --- Main Render ---
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
            return <p>An unexpected error occurred. Please refresh.</p>;
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

