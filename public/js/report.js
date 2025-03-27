import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { auth, onAuthStateChanged } from "./auth.js";

async function getFirebaseConfig() {
    const response = await fetch('/firebase-config');
    if (!response.ok) {
        throw new Error(`Failed to fetch firebaseConfig: ${response.status} ${response.statusText}`);
    }
    return await response.json();
}

(async () => {
    try {
        const firebaseConfig = await getFirebaseConfig();
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);

        onAuthStateChanged(auth, async (user) => {
            if (!user) {
                window.location.href = "index.html";
                return;
            }

            // ดึงข้อมูลงาน
            const tasksQuery = query(collection(db, "tasks"), where("assignedTo", "==", user.email));
            const tasksSnapshot = await getDocs(tasksQuery);
            const totalTasks = tasksSnapshot.size;

            const completedTasksQuery = query(
                collection(db, "tasks"),
                where("assignedTo", "==", user.email),
                where("status", "in", ["completed", "COMPLETED", "Completed"])
            );
            const completedTasksSnapshot = await getDocs(completedTasksQuery);
            const completedTasks = completedTasksSnapshot.size;

            // อัพเดตข้อมูลในหน้า
            document.getElementById("completed6090").textContent = `${completedTasks}/${totalTasks}`;
            document.getElementById("remaining6090").textContent = Math.max(0, Math.ceil(totalTasks * 0.88) - completedTasks);

            // สร้าง Chart (ตัวอย่าง)
            const ctx6090 = document.getElementById("chart6090").getContext("2d");
            new Chart(ctx6090, {
                type: "doughnut",
                data: {
                    labels: ["Completed", "Remaining"],
                    datasets: [{
                        data: [completedTasks, totalTasks - completedTasks],
                        backgroundColor: ["#28a745", "#ff9300"]
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { position: "top" }
                    }
                }
            });

            // NPL Chart (สมมติข้อมูล)
            const ctxNPL = document.getElementById("chartNPL").getContext("2d");
            new Chart(ctxNPL, {
                type: "doughnut",
                data: {
                    labels: ["Completed", "Remaining"],
                    datasets: [{
                        data: [completedTasks, totalTasks - completedTasks],
                        backgroundColor: ["#28a745", "#ff9300"]
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { position: "top" }
                    }
                }
            });
        });
    } catch (error) {
        console.error("Error in report.js:", error);
    }
})();
