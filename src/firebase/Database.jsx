import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getStorage, connectStorageEmulator } from 'firebase/storage'

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
// const storage = getStorage(app);
// connectFirestoreEmulator(db, 'localhost', 8080);
// connectAuthEmulator(auth, "http://localhost:9099");
// connectStorageEmulator(storage, "localhost", 9199);
export {app, db, auth, storage };
