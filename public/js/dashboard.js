import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { auth, onAuthStateChanged } from "./auth.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = "index.html";
        return;
    }

    // ดึงข้อมูลงาน
    const tasksQuery = query(collection(db, "tasks"), where("assignedTo", "==", user.uid));
    const tasksSnapshot = await getDocs(tasksQuery);
    const taskCount = tasksSnapshot.size;
    document.getElementById("taskCount").textContent = taskCount;

    // ดึงงานด่วน
    const urgentTasksQuery = query(
        collection(db, "tasks"),
        where("assignedTo", "==", user.uid),
        where("status", "==", "urgent")
    );
    const urgentTasksSnapshot = await getDocs(urgentTasksQuery);
    document.getElementById("urgentTasks").textContent = urgentTasksSnapshot.size;

    // ดึงข้อมูลรายได้
    const incomesQuery = query(collection(db, "incomes"), where("userId", "==", user.uid));
    const incomesSnapshot = await getDocs(incomesQuery);
    let totalIncome = 0;
    incomesSnapshot.forEach(doc => {
        totalIncome += doc.data().amount || 0;
    });
    document.getElementById("totalIncome").textContent = totalIncome.toLocaleString() + " บาท";

    // ดึงข้อมูลการจบงาน
    const completedTasksQuery = query(
        collection(db, "tasks"),
        where("assignedTo", "==", user.uid),
        where("status", "==", "completed")
    );
    const completedTasksSnapshot = await getDocs(completedTasksQuery);
    const completionRate = taskCount > 0 ? (completedTasksSnapshot.size / taskCount) * 100 : 0;
    document.getElementById("completionRate").textContent = completionRate.toFixed(1) + "%";

    // ดึงคะแนน
    const ratingsQuery = query(collection(db, "ratings"), where("userId", "==", user.uid));
    const ratingsSnapshot = await getDocs(ratingsQuery);
    let rating = 0;
    ratingsSnapshot.forEach(doc => {
        rating = doc.data().score || 0;
    });
    document.getElementById("rating").textContent = rating;
});