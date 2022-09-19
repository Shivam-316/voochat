import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDoNicTcX6UyyrcAdUq6i85mn6WSkHwKJk",
    authDomain: "voochat-316.firebaseapp.com",
    projectId: "voochat-316",
    storageBucket: "voochat-316.appspot.com",
    messagingSenderId: "585959797947",
    appId: "1:585959797947:web:e9a05f3f1861176cfb259e"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)