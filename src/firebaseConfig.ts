// src/firebaseConfig.ts

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDKcn4ogsf1kpa22OTQGl-6OgiOzgXaUok",
  authDomain: "urban-civic-689da.firebaseapp.com",
  projectId: "urban-civic-689da",
  storageBucket: "urban-civic-689da.appspot.com", // 🔁 Note: corrected domain
  messagingSenderId: "941677534291",
  appId: "1:941677534291:web:f1db16436628a0e7c6baa6",
  measurementId: "G-30MX84BXZ0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const analytics = getAnalytics(app);

// Export what you'll use elsewhere
export { auth, provider, db, analytics };