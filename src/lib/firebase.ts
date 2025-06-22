// IMPORTANT:
// Create a file named .env.local in the root of your project
// and add your Firebase project's configuration keys.
// For example:
//
// NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
// NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-auth-domain"
// NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
// NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-storage-bucket"
// NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
// NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"

import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let googleProvider: GoogleAuthProvider | null = null;

if (firebaseConfig.apiKey) {
  try {
    app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
  } catch (error: any) {
    console.error("Firebase initialization error:", error.message);
    app = null;
    auth = null;
    db = null;
    googleProvider = null;
  }
} else {
  console.warn(
    "Firebase API Key is missing. Firebase features will be disabled. Please create a .env.local file with your Firebase project's configuration."
  );
}

export { app, auth, db, googleProvider };
