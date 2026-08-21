import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore, collection, doc, setDoc, updateDoc } from 'firebase/firestore';
import { EnglishConcept, FirebaseConfigState, ContributorProfile } from '@/types/dictionary';
import { getStoredFirebaseConfig } from './storage';

let appInstance: FirebaseApp | null = null;
let firestoreInstance: Firestore | null = null;

export function getFirebaseApp(customConfig?: FirebaseConfigState): FirebaseApp | null {
  const config = customConfig || getStoredFirebaseConfig();
  if (!config || !config.apiKey || !config.projectId) {
    return null;
  }

  try {
    if (!getApps().length) {
      appInstance = initializeApp({
        apiKey: config.apiKey,
        authDomain: config.authDomain || `${config.projectId}.firebaseapp.com`,
        projectId: config.projectId,
        storageBucket: config.storageBucket || `${config.projectId}.appspot.com`,
        messagingSenderId: config.messagingSenderId,
        appId: config.appId
      });
    } else {
      appInstance = getApp();
    }
    return appInstance;
  } catch (err) {
    console.warn('Firebase initialization warning:', err);
    return null;
  }
}

export function getFirestoreDB(customConfig?: FirebaseConfigState): Firestore | null {
  const app = getFirebaseApp(customConfig);
  if (!app) return null;
  try {
    if (!firestoreInstance) {
      firestoreInstance = getFirestore(app);
    }
    return firestoreInstance;
  } catch (e) {
    console.warn('Firestore instance warning:', e);
    return null;
  }
}

// Clean object for Firestore by removing any undefined keys and converting to plain JSON
function cleanDataForFirestore<T>(data: T): any {
  return JSON.parse(JSON.stringify(data));
}

// Sync concept (with moderation status & proposals) to Firestore collection 'telugu_concepts'
export async function syncConceptToFirestore(concept: EnglishConcept) {
  const db = getFirestoreDB();
  if (!db) return;
  try {
    const docRef = doc(db, 'telugu_concepts', concept.id);
    const sanitized = cleanDataForFirestore(concept);
    await setDoc(docRef, sanitized, { merge: true });
  } catch (e) {
    console.warn('Firestore concept sync notice:', e);
  }
}

// Sync user profile & stats to Firestore collection 'user_profiles'
export async function syncUserProfileToFirestore(profile: ContributorProfile) {
  const db = getFirestoreDB();
  if (!db) return;
  try {
    const docRef = doc(db, 'user_profiles', profile.id);
    const sanitized = cleanDataForFirestore(profile);
    await setDoc(docRef, sanitized, { merge: true });
  } catch (e) {
    console.warn('Firestore user profile sync notice:', e);
  }
}
