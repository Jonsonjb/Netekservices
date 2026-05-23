import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  collection, 
  query, 
  where,
  deleteDoc,
  updateDoc,
  getDocFromServer
} from 'firebase/firestore';

// Load our configuration
import firebaseConfig from '../firebase-applet-config.json';

// Detect if we have a real active Firebase config
export const isFirebaseLive = !!(firebaseConfig && firebaseConfig.apiKey && firebaseConfig.apiKey.length > 5);

let app;
let authInstance: any;
let dbInstance: any;

if (isFirebaseLive) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    authInstance = getAuth(app);
    dbInstance = getFirestore(app, firebaseConfig.firestoreDatabaseId || "(default)");
    
    // Validate connection to Firestore as requested in SKILL.md
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(dbInstance, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    };
    testConnection();
  } catch (err) {
    console.error("Failed to initialize Firebase SDK:", err);
  }
}

export const auth = authInstance;
export const db = dbInstance;

// Error handlers following strict SKILL.md JSON specifications
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const currentAuth = isFirebaseLive ? authInstance : null;
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: currentAuth?.currentUser?.uid || 'simulated-uid',
      email: currentAuth?.currentUser?.email || 'simulated-user@gmail.com',
      emailVerified: currentAuth?.currentUser?.emailVerified || true,
      isAnonymous: currentAuth?.currentUser?.isAnonymous || false,
      tenantId: currentAuth?.currentUser?.tenantId || null,
      providerInfo: currentAuth?.currentUser?.providerData?.map((provider: any) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error Details: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// SIMULATED AUTH DB HELPER (Fallback when Firebase is still configuring in UI)
const SIMULATED_USER_KEY = 'netek_simulated_user';
const SIMULATED_DOCS_KEY = 'netek_simulated_docs';

export interface AppUser {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  phoneNumber?: string;
  location?: string;
}

// Pure Interactive Mock Database wrapper for instant feedback
const mockDocsLocal = {
  get: () => {
    try {
      const saved = localStorage.getItem(SIMULATED_DOCS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  },
  save: (docs: any[]) => {
    localStorage.setItem(SIMULATED_DOCS_KEY, JSON.stringify(docs));
  }
};

// Unified high level APIs for Google Login & documents tracking
export async function loginWithGoogle(): Promise<AppUser> {
  if (isFirebaseLive && auth) {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    // Save/update user profile in live Firestore
    const userProfile = {
      uid: user.uid,
      displayName: user.displayName || 'Utilizador Netek',
      email: user.email || '',
      photoURL: user.photoURL || '',
      updatedAt: new Date().toISOString()
    };
    
    try {
      await setDoc(doc(db, 'users', user.uid), userProfile);
    } catch (e) {
      console.warn("Failed to save profile to Firestore, rules might be setting up:", e);
    }
    
    return {
      uid: user.uid,
      displayName: userProfile.displayName,
      email: userProfile.email,
      photoURL: userProfile.photoURL
    };
  } else {
    // Return Simulated Mode profile
    const simulatedUser: AppUser = {
      uid: 'simulated-google-uid-12345',
      displayName: 'Netek Demo User',
      email: 'utilizador.teste@gmail.com',
      photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop',
      phoneNumber: '+258 84 123 4567',
      location: 'Maputo, Moçambique'
    };
    localStorage.setItem(SIMULATED_USER_KEY, JSON.stringify(simulatedUser));
    return simulatedUser;
  }
}

export async function checkAuthStatus(callback: (user: AppUser | null) => void) {
  if (isFirebaseLive && auth) {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        callback({
          uid: user.uid,
          displayName: user.displayName || 'Utilizador Netek',
          email: user.email || '',
          photoURL: user.photoURL || '',
        });
      } else {
        callback(null);
      }
    });
  } else {
    // Simulated check
    const saved = localStorage.getItem(SIMULATED_USER_KEY);
    if (saved) {
      try {
        callback(JSON.parse(saved));
      } catch {
        callback(null);
      }
    } else {
      callback(null);
    }
    // Return a dummy unsubscribe function
    return () => {};
  }
}

export async function logoutUser() {
  if (isFirebaseLive && auth) {
    await signOut(auth);
  } else {
    localStorage.removeItem(SIMULATED_USER_KEY);
  }
}

// Unified CRUD operations for saved CVs & Letters
export async function saveDocument(docData: any) {
  if (isFirebaseLive && db) {
    const docPath = `cvs_letters/${docData.id}`;
    try {
      await setDoc(doc(db, 'cvs_letters', docData.id), {
        ...docData,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, docPath);
    }
  } else {
    // Simulator write
    const docs = mockDocsLocal.get();
    const existingIndex = docs.findIndex((d: any) => d.id === docData.id);
    const updatedDoc = {
      ...docData,
      updatedAt: new Date().toISOString()
    };
    if (existingIndex >= 0) {
      docs[existingIndex] = updatedDoc;
    } else {
      docs.push(updatedDoc);
    }
    mockDocsLocal.save(docs);
  }
}

export async function fetchDocuments(userId: string): Promise<any[]> {
  if (isFirebaseLive && db) {
    const path = 'cvs_letters';
    try {
      const q = query(collection(db, path), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      const list: any[] = [];
      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      return list;
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  } else {
    // Simulator fetch
    return mockDocsLocal.get().filter((doc: any) => doc.userId === userId);
  }
}

export async function deleteDocument(docId: string) {
  if (isFirebaseLive && db) {
    const path = `cvs_letters/${docId}`;
    try {
      await deleteDoc(doc(db, 'cvs_letters', docId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  } else {
    // Simulator delete
    const docs = mockDocsLocal.get().filter((doc: any) => doc.id !== docId);
    mockDocsLocal.save(docs);
  }
}
