import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBTZiFTi0GNQRVjLQjS7I74L8ne8NAGuMc",
  authDomain: "protolab-57bfb.firebaseapp.com",
  projectId: "protolab-57bfb",
  storageBucket: "protolab-57bfb.firebasestorage.app",
  messagingSenderId: "681902866220",
  appId: "1:681902866220:web:91ee047b41e7ca5304f689",
  measurementId: "G-8Z482GF0TM",
};

// Initialize Firebase safely — avoid duplicate initialization
const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Core services
const auth = getAuth(app);
const db = getFirestore(app);

// Auth providers
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

// Analytics — only initialize if the environment supports it
isSupported().then((supported) => {
  if (supported) {
    getAnalytics(app);
  }
});

export { auth, db, googleProvider, githubProvider };
