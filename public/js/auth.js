import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDyOLP6v2mw5CRPMwVwynTU-qAAq8QMrlc",
  authDomain: "fieldflow-b3ee5.firebaseapp.com",
  projectId: "fieldflow-b3ee5",
  storageBucket: "fieldflow-b3ee5.firebasestorage.app",
  messagingSenderId: "384778621124",
  appId: "1:384778621124:web:1a40999850200d49c63991"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, signInWithEmailAndPassword, onAuthStateChanged };
