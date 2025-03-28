import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// กำหนดค่า Firebase Config (แทนที่ด้วยค่าจริงจาก Firebase Console > Project Settings)
const firebaseConfig = {
  apiKey: "AIzaSyDyOLP6v2mw5CRPMwVwynTU-qAAq8QMrlc",
  authDomain: "fieldflow-b3ee5.firebaseapp.com",
  projectId: "fieldflow-b3ee5",
  storageBucket: "fieldflow-b3ee5.firebasestorage.app",
  messagingSenderId: "384778621124",
  appId: "1:384778621124:web:1a40999850200d49c63991"
};

// เริ่มต้น Firebase App
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Export ฟังก์ชันที่จำเป็น
export { auth, onAuthStateChanged, signInWithEmailAndPassword, signOut };

// ดีบัก: ตรวจสอบว่า auth ถูกกำหนดค่าเรียบร้อย
console.log("Auth initialized:", auth);

// ดีบัก: ตรวจสอบสถานะการล็อกอินเมื่อมีการเปลี่ยนแปลง
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("Auth state changed in auth.js - User logged in:", user.uid, "Email:", user.email);
        // ตรวจสอบ token
        user.getIdTokenResult().then((tokenResult) => {
            console.log("User token email in auth.js:", tokenResult.claims.email);
        }).catch((error) => {
            console.error("Error getting token in auth.js:", error);
        });
    } else {
        console.log("Auth state changed in auth.js - No user logged in");
    }
});
