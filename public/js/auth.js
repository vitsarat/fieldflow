import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { firebaseConfig } from "./firebase-config.js";

console.log("auth.js loaded");

let app;
try {
    console.log("Initializing Firebase app with config:", firebaseConfig);
    app = initializeApp(firebaseConfig);
    console.log("Firebase app initialized:", app);
} catch (error) {
    console.error("Error initializing Firebase in auth.js:", error);
}

const auth = getAuth(app);
console.log("Auth initialized:", auth);

function login(email, password) {
    console.log("Attempting to login with email:", email);
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log("User logged in successfully:", user.uid);
            window.location.href = user.email === "admin@fieldflow.com" ? "admin.html" : "dashboard.html";
        })
        .catch((error) => {
            console.error("Login error:", error.message);
        });
}

const loginForm = document.getElementById("loginForm");
if (loginForm) {
    console.log("Login form found, adding event listener...");
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("employeeId").value + "@fieldflow.com";
        const password = document.getElementById("password").value;
        console.log("Form submitted, calling login...");
        login(email, password);
    });
} else {
    console.log("Login form not found. This script should only run on the login page.");
}

export { auth, onAuthStateChanged, signInWithEmailAndPassword };
