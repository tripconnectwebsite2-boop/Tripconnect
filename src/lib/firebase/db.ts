import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyC6STcc6a82EIrg7apay8QdsH24HobiTRw",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "trip-connect-versel.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "trip-connect-versel",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "trip-connect-versel.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "913300034921",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:913300034921:web:fafe1ed1ed98337b4a99f8",
};

function getFirestoreInstance() {
  try {
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    return getFirestore(app);
  } catch (err) {
    console.warn("[Firestore] Initialization error:", err);
    return null;
  }
}

/**
 * Fetch persistent store from Cloud Firestore.
 * Always fetches the freshest store from cloud without cooldown locks.
 */
export async function fetchStoreFromFirestore(): Promise<any | null> {
  try {
    const db = getFirestoreInstance();
    if (!db) return null;
    const snap = await getDoc(doc(db, "tripconnect", "store"));
    if (snap.exists()) {
      return snap.data();
    }
  } catch (err: any) {
    console.warn("[Firestore] Read error:", err?.message || err);
  }
  return null;
}

/**
 * Persist store to Cloud Firestore across all Vercel serverless instances.
 * Awaited directly to guarantee persistence before serverless response termination.
 */
export async function saveStoreToFirestore(store: any): Promise<boolean> {
  try {
    const db = getFirestoreInstance();
    if (!db) return false;
    // Clean undefined fields before writing to Firestore
    const cleanStore = JSON.parse(JSON.stringify(store));
    await setDoc(doc(db, "tripconnect", "store"), cleanStore);
    return true;
  } catch (err: any) {
    console.error("[Firestore] Cloud store write error:", err?.message || err);
    return false;
  }
}
