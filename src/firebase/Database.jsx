import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY ?? process.env.VITE_FIREBASE_APIKEY,
  authDomain: "voochat-316.firebaseapp.com",
  projectId: "voochat-316",
  storageBucket: "voochat-316.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGE_ID ?? process.env.VITE_FIREBASE_MESSAGE_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
export {app, db, auth, storage };
