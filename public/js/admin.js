import { auth, onAuthStateChanged } from './auth.js';
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const db = getFirestore();

onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("Admin logged in:", user.uid);
        loadAdminDashboard();
    } else {
        console.log("No admin logged in, redirecting to index.html");
        window.location.href = "index.html";
    }
});

async function loadAdminDashboard() {
    try {
        const adminDashboard = document.getElementById("adminDashboard");
        adminDashboard.innerHTML = ""; // ล้างข้อมูลเก่า

        const tasksSnapshot = await getDocs(collection(db, "tasks"));
        let totalTasks = tasksSnapshot.size;
        let urgentTasks = 0;

        tasksSnapshot.forEach(doc => {
            const task = doc.data();
            if (task.status === "urgent") {
                urgentTasks++;
            }
        });

        const totalTasksCard = `
            <div class="card">
                <h3>งานทั้งหมด</h3>
                <p>${totalTasks}</p>
            </div>
        `;
        const urgentTasksCard = `
            <div class="card">
                <h3>งานด่วน</h3>
                <p>${urgentTasks}</p>
            </div>
        `;

        adminDashboard.innerHTML = totalTasksCard + urgentTasksCard;
    } catch (error) {
        console.error("Error loading admin dashboard:", error);
    }
}
