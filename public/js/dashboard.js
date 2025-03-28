import { auth, onAuthStateChanged } from './auth.js';
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const db = getFirestore();

// ตรวจสอบสถานะการล็อกอิน
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("User logged in:", user.uid, "Email:", user.email);
        loadDashboard(user);
    } else {
        console.log("No user logged in, redirecting to index.html");
        window.location.href = "index.html";
    }
});

async function loadDashboard(user) {
    try {
        const dashboardDiv = document.getElementById("dashboard");
        dashboardDiv.innerHTML = ""; // ล้างข้อมูลเก่า

        // ดึงข้อมูลงานจาก Firestore
        const tasksSnapshot = await getDocs(collection(db, "tasks"));
        let totalTasks = tasksSnapshot.size;
        let completedTasks = 0;

        tasksSnapshot.forEach(doc => {
            const task = doc.data();
            if (task.status === "completed") {
                completedTasks++;
            }
        });

        // สร้างการ์ดแดชบอร์ด
        const totalTasksCard = `
            <div class="card">
                <h3>งานทั้งหมด</h3>
                <p>${totalTasks}</p>
            </div>
        `;
        const completedTasksCard = `
            <div class="card">
                <h3>งานที่เสร็จแล้ว</h3>
                <p>${completedTasks}</p>
            </div>
        `;

        dashboardDiv.innerHTML = totalTasksCard + completedTasksCard;
    } catch (error) {
        console.error("Error loading dashboard:", error);
    }
}
