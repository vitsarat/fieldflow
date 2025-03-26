import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { auth, onAuthStateChanged } from "./auth.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        console.log("No user logged in, redirecting to index.html");
        window.location.href = "index.html";
        return;
    }

    console.log("User logged in:", user.uid);

    try {
        // ดึงข้อมูลงานทั้งหมด
        const tasksQuery = query(collection(db, "tasks"), where("assignedTo", "==", user.email));
        const tasksSnapshot = await getDocs(tasksQuery);
        const taskCount = tasksSnapshot.size;
        document.getElementById("taskCount").textContent = taskCount;
        console.log("Total tasks:", taskCount);

        // ดึงงานด่วน (รองรับตัวพิมพ์ใหญ่-เล็ก)
        const urgentTasksQuery = query(
            collection(db, "tasks"),
            where("assignedTo", "==", user.email),
            where("status", "in", ["urgent", "URGENT", "Urgent"])
        );
        const urgentTasksSnapshot = await getDocs(urgentTasksQuery);
        document.getElementById("urgentTasks").textContent = urgentTasksSnapshot.size;
        console.log("Urgent tasks:", urgentTasksSnapshot.size);

        // ดึงข้อมูลรายได้
        const incomesQuery = query(collection(db, "incomes"), where("userId", "==", user.uid));
        const incomesSnapshot = await getDocs(incomesQuery);
        let totalIncome = 0;
        incomesSnapshot.forEach(doc => {
            const amount = doc.data().amount;
            if (typeof amount === "number") {
                totalIncome += amount;
            }
        });
        document.getElementById("totalIncome").textContent = totalIncome.toLocaleString() + " บาท";
        console.log("Total income:", totalIncome);

        // ดึงข้อมูลการจบงาน
        const completedTasksQuery = query(
            collection(db, "tasks"),
            where("assignedTo", "==", user.email),
            where("status", "in", ["completed", "COMPLETED", "Completed"])
        );
        const completedTasksSnapshot = await getDocs(completedTasksQuery);
        const completionRate = taskCount > 0 ? (completedTasksSnapshot.size / taskCount) * 100 : 0;
        document.getElementById("completionRate").textContent = completionRate.toFixed(1) + "%";
        console.log("Completion rate:", completionRate);

        // ดึงคะแนน
        const ratingsQuery = query(collection(db, "ratings"), where("userId", "==", user.uid));
        const ratingsSnapshot = await getDocs(ratingsQuery);
        let rating = 0;
        ratingsSnapshot.forEach(doc => {
            const score = doc.data().score;
            if (typeof score === "number") {
                rating = score;
            }
        });
        document.getElementById("rating").textContent = rating;
        console.log("Rating:", rating);
    } catch (error) {
        console.error("Error in dashboard.js:", error);
    }
});
