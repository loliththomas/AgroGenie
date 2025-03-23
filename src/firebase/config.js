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
  apiKey: "AIzaSyBXeJVXv9ed0uhzZoIYe4kt1xQTan8WcG0",
  authDomain: "agro-6969.firebaseapp.com",
  projectId: "agro-6969",
  storageBucket: "agro-6969.firebasestorage.app",
  messagingSenderId: "461703580117",
  appId: "1:461703580117:web:888226d817c15758e6d55c",
  measurementId: "G-XCJ9WXB5H2"
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