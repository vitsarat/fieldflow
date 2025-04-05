// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDyOLP6v2mw5CRPMwVwynTU-qAAq8QMrlc",
  authDomain: "fieldflow-b3ee5.firebaseapp.com",
  projectId: "fieldflow-b3ee5",
  storageBucket: "fieldflow-b3ee5.firebasestorage.app",
  messagingSenderId: "384778621124",
  appId: "1:384778621124:web:ea912e4770f1811ec63991"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, signInWithEmailAndPassword };
