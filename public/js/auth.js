import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

export const auth = getAuth();
export { signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
