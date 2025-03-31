// js/auth.js
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { getFirestore, doc, getDoc, setDoc } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

// Initialize Firebase App
const firebaseConfig = window.env;
const app = initializeApp(firebaseConfig);

// Initialize Auth and Firestore
const auth = getAuth(app);
const db = getFirestore(app);

// Export for use in other files
export { app, auth, db, signInWithEmailAndPassword, onAuthStateChanged, signOut };

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
