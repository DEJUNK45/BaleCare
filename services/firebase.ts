import { initializeApp, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInAnonymously,
  signOut,
  Auth,
  User,
  onAuthStateChanged as firebaseOnAuthStateChanged
} from 'firebase/auth';

// Use a safer config parsing strategy
const getFirebaseConfig = () => {
  try {
    // @ts-ignore
    if (typeof __firebase_config !== 'undefined') {
       // @ts-ignore
       const cfg = JSON.parse(__firebase_config);
       // Ensure apiKey exists to avoid auth/invalid-api-key error
       if (cfg && cfg.apiKey) {
         return cfg;
       }
    }
  } catch (e) {
    console.warn("Firebase config not found or invalid.");
  }
  return null;
};

const config = getFirebaseConfig();
let app: FirebaseApp | undefined;
let authInstance: Auth | undefined;

if (config) {
  try {
    app = initializeApp(config);
    authInstance = getAuth(app);
  } catch (e) {
    console.error("Firebase initialization failed:", e);
  }
} else {
  console.warn("App running without Firebase connection (Config missing or invalid). Mock Auth enabled.");
}

export const googleProvider = new GoogleAuthProvider();

// --- MOCK AUTH IMPLEMENTATION ---
// This allows the app to function in preview environments without valid keys
let mockUser: User | null = null;
const mockListeners: ((user: User | null) => void)[] = [];

const notifyMockListeners = () => {
  mockListeners.forEach(listener => listener(mockUser));
};

const createMockUser = (isAnonymous: boolean): User => {
  return {
    uid: isAnonymous ? `guest-${Date.now()}` : `user-${Date.now()}`,
    displayName: isAnonymous ? null : 'Demo User',
    email: isAnonymous ? null : 'demo@example.com',
    photoURL: null,
    emailVerified: true,
    isAnonymous: isAnonymous,
    metadata: {},
    providerData: [],
    refreshToken: '',
    tenantId: null,
    delete: async () => {},
    getIdToken: async () => 'mock-token',
    getIdTokenResult: async () => ({} as any),
    reload: async () => {},
    toJSON: () => ({}),
    phoneNumber: null,
  } as unknown as User;
};

// --- AUTH FUNCTIONS ---

export const loginWithGoogle = async () => {
  if (!authInstance) {
    console.warn("Firebase not configured. Using Mock Auth.");
    mockUser = createMockUser(false);
    notifyMockListeners();
    return { user: mockUser };
  }
  return signInWithPopup(authInstance, googleProvider);
};

export const loginAnonymously = async () => {
  if (!authInstance) {
     console.warn("Firebase not configured. Using Mock Guest Auth.");
     mockUser = createMockUser(true);
     notifyMockListeners();
     return { user: mockUser };
  }
  return signInAnonymously(authInstance);
};

export const logoutUser = async () => {
  if (!authInstance) {
    mockUser = null;
    notifyMockListeners();
    return;
  }
  return signOut(authInstance);
};

// Safe subscription helper that works even if auth is not initialized
export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
  if (!authInstance) {
    mockListeners.push(callback);
    callback(mockUser); // Initial state
    return () => {
      const index = mockListeners.indexOf(callback);
      if (index > -1) mockListeners.splice(index, 1);
    };
  }
  return firebaseOnAuthStateChanged(authInstance, callback);
};

export const auth = authInstance;