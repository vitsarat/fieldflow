import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function login(email, password) {
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log("User logged in:", user.uid);
            window.location.href = user.email === "admin@fieldflow.com" ? "admin.html" : "dashboard.html";
        })
        .catch((error) => {
            console.error("Login error:", error.message);
        });
}

document.getElementById("loginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("employeeId").value + "@fieldflow.com";
    const password = document.getElementById("password").value;
    login(email, password);
});

export { auth, onAuthStateChanged, signInWithEmailAndPassword };
