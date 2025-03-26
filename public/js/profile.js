import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";
import { auth, onAuthStateChanged } from "./auth.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = "index.html";
        return;
    }

    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
        const userData = userDoc.data();
        document.getElementById("employeeId").textContent = userData.employeeId || "A001";
        document.getElementById("fullName").textContent = userData.fullName || "พูลทรัพย์ พลชารี";
        document.getElementById("team").textContent = userData.team || "F4012 รุ่งเรือง";
        document.getElementById("branch").textContent = userData.branch || "อุดรธานี";
        document.getElementById("status").textContent = userData.status || "ว่างงาน";

        if (userData.profilePicUrl) {
            document.getElementById("profilePic").src = userData.profilePicUrl;
        }

        const level = userData.level || 3;
        const score = userData.score || 750;
        document.getElementById("level").textContent = level;
        document.getElementById("score").textContent = `${score}/1000`;
        document.getElementById("progressBar").style.width = `${(score / 1000) * 100}%`;

        document.getElementById("teamInfo").textContent = userData.team || "F4012 รุ่งเรือง";
        document.getElementById("branchInfo").textContent = userData.branch || "อุดรธานี";
        document.getElementById("teamCompletion").textContent = userData.teamCompletion || "82%";

        const goalTarget = userData.goalTarget || 10;
        const goalProgress = userData.goalProgress || 6;
        document.getElementById("goalTarget").textContent = goalTarget;
        document.getElementById("goalProgressText").textContent = `${goalProgress}/${goalTarget}`;
        document.getElementById("goalProgress").style.width = `${(goalProgress / goalTarget) * 100}%`;
    }
});

const profilePic = document.getElementById("profilePic");
const profilePicInput = document.getElementById("profilePicInput");

profilePic.addEventListener("click", () => profilePicInput.click());
profilePicInput.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
        const user = auth.currentUser;
        const storageRef = ref(storage, `profile_pics/${user.uid}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        profilePic.src = downloadURL;

        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, { profilePicUrl: downloadURL });
    } catch (error) {
        console.error("Upload error:", error);
        alert(`เกิดข้อผิดพลาดในการอัพโหลดรูป: ${error.message}`);
    }
});

const ctx = document.getElementById("performanceChart").getContext("2d");
new Chart(ctx, {
    type: "line",
    data: {
        labels: ["วัน 1", "วัน 2", "วัน 3", "วัน 4", "วัน 5", "วัน 6", "วัน 7"],
        datasets: [{
            label: "เปอร์เซ็นต์การจบงาน",
            data: [65, 70, 68, 75, 80, 78, 82],
            borderColor: "#34d058",
            backgroundColor: "rgba(52, 208, 88, 0.2)",
            fill: true,
            tension: 0.4
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                title: { display: true, text: "เปอร์เซ็นต์ (%)", color: "#fff" },
                ticks: { color: "#fff" }
            },
            x: {
                title: { display: true, text: "วันที่", color: "#fff" },
                ticks: { color: "#fff" }
            }
        },
        plugins: {
            legend: { labels: { color: "#fff" } }
        }
    }
});