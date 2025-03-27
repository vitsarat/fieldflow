import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
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

            // ดึงข้อมูลโปรไฟล์
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                document.getElementById("employeeId").textContent = userData.employeeId || "A001";
                document.getElementById("fullName").textContent = userData.fullName || "พูลทรัพย์ พลชารี";
                document.getElementById("team").textContent = userData.team || "F4012 รุ่งเรือง";
                document.getElementById("branch").textContent = userData.branch || "อุดรธานี";
                document.getElementById("status").textContent = userData.status || "ว่างงาน";
            }

            // สร้าง Chart (ตัวอย่าง)
            const ctx = document.getElementById("performanceChart").getContext("2d");
            new Chart(ctx, {
                type: "line",
                data: {
                    labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"],
                    datasets: [{
                        label: "Tasks Completed",
                        data: [5, 3, 7, 2, 4, 6, 5],
                        borderColor: "#ff9300",
                        fill: false
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: { beginAtZero: true }
                    }
                }
            });
        });
    } catch (error) {
        console.error("Error in profile.js:", error);
    }
})();
