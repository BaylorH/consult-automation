import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDj_9N9rBwI5Qwb13catbt7anuz-t7OAdc",
  authDomain: "consult-automation.firebaseapp.com",
  projectId: "consult-automation",
  storageBucket: "consult-automation.firebasestorage.app",
  messagingSenderId: "979935818389",
  appId: "1:979935818389:web:d6375d64936fec438b219c"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Restrict to fiftyflowers.com domain
googleProvider.setCustomParameters({
  hd: 'fiftyflowers.com'
});
