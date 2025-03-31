// js/auth.js
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

// Initialize Firebase App
const firebaseConfig = window.env;
const app = initializeApp(firebaseConfig);

// Initialize Auth and Firestore
const auth = getAuth(app);
const db = getFirestore(app);

// Export for use in other files
export { app, auth, db, signInWithEmailAndPassword, onAuthStateChanged, signOut };

// Check if user is logged in, redirect to index.html if not
onAuthStateChanged(auth, (user) => {
    const currentPath = window.location.pathname;
    const protectedPages = ['/dashboard.html', '/tasks.html', '/income.html', '/profile.html', '/performance.html'];

    if (!user && protectedPages.includes(currentPath)) {
        window.location.href = '/index.html';
    } else if (user && currentPath === '/index.html') {
        window.location.href = '/dashboard.html';
    }
});
