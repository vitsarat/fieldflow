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

// Check if user is logged in, redirect to index.html if not
onAuthStateChanged(auth, async (user) => {
    const currentPath = window.location.pathname;
    const protectedPages = ['/dashboard.html', '/tasks.html', '/income.html', '/profile.html', '/performance.html'];

    if (user) {
        // Check if user exists in Firestore, if not, create a new user document
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            // Create a new user document if it doesn't exist
            await setDoc(userDocRef, {
                employeeId: user.email.split('@')[0], // e.g., "a001" from "a001@fieldflow.com"
                email: user.email,
                name: user.displayName || 'ไม่ระบุชื่อ',
                role: user.email === 'admin@fieldflow.com' ? 'admin' : 'employee'
            });
        }

        // Redirect to dashboard if on index.html
        if (currentPath === '/index.html') {
            window.location.href = '/dashboard.html';
        }
    } else if (protectedPages.includes(currentPath)) {
        // Redirect to index.html if not logged in
        window.location.href = '/index.html';
    }
});
