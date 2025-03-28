import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

async function getFirebaseConfig() {
    console.log("Fetching firebaseConfig from /firebase-config...");
    const response = await fetch('/firebase-config');
    if (!response.ok) {
        throw new Error(`Failed to fetch firebaseConfig: ${response.status} ${response.statusText}`);
    }
    const config = await response.json();
    console.log("firebaseConfig fetched:", config);
    return config;
}

const firebaseConfig = await getFirebaseConfig();
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// เพิ่มการรีเฟรช token
auth.onIdTokenChanged(async (user) => {
    if (user) {
        console.log("ID token changed, refreshing...");
        await user.getIdToken(true); // บังคับรีเฟรช token
    }
});

export { signInWithEmailAndPassword, onAuthStateChanged };
