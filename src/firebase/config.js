import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAp6vY6pwGmiM1AQEUKnCDcY9PgKUdQOnU",
  authDomain: "cypo-702e0.firebaseapp.com",
  projectId: "cypo-702e0",
  storageBucket: "cypo-702e0.firebasestorage.app",
  messagingSenderId: "185678297392",
  appId: "1:185678297392:web:750910c2255ea18f3ef0f5",
  measurementId: "G-G9RB2TM24L"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {
  auth,
  db,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged
};