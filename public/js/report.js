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

    // ดึงข้อมูลงานกลุ่ม 6090
    const tasks6090Query = query(
        collection(db, "tasks"),
        where("assignedTo", "==", user.uid),
        where("group", "==", "6090")
    );
    const tasks6090Snapshot = await getDocs(tasks6090Query);
    let completed6090 = 0;
    let total6090 = tasks6090Snapshot.size;
    let principle6090 = 0;

    tasks6090Snapshot.forEach(doc => {
        const task = doc.data();
        if (task.status === "completed") {
            completed6090++;
            principle6090 += parseFloat(task.principle) || 0;
        }
    });

    document.getElementById("completed6090").textContent = `${completed6090}/${total6090}`;
    document.getElementById("principle6090").textContent = principle6090.toLocaleString();

    const ctx6090 = document.getElementById("chart6090").getContext("2d");
    new Chart(ctx6090, {
        type: "doughnut",
        data: {
            labels: ["จบแล้ว", "คงเหลือ"],
            datasets: [{
                data: [completed6090, total6090 - completed6090],
                backgroundColor: ["#28a745", "#ff4444"]
            }]
        },
        options: {
            plugins: {
                legend: { labels: { color: "#fff" } }
            }
        }
    });

    // ดึงข้อมูลงานกลุ่ม NPL
    const tasksNPLQuery = query(
        collection(db, "tasks"),
        where("assignedTo", "==", user.uid),
        where("group", "==", "NPL")
    );
    const tasksNPLSnapshot = await getDocs(tasksNPLQuery);
    let completedNPL = 0;
    let totalNPL = tasksNPLSnapshot.size;
    let principleNPL = 0;

    tasksNPLSnapshot.forEach(doc => {
        const task = doc.data();
        if (task.status === "completed") {
            completedNPL++;
        } else {
            principleNPL += parseFloat(task.principle) || 0;
        }
    });

    document.getElementById("completedNPL").textContent = `${completedNPL}/${totalNPL}`;
    document.getElementById("principleNPL").textContent = principleNPL.toLocaleString();

    const ctxNPL = document.getElementById("chartNPL").getContext("2d");
    new Chart(ctxNPL, {
        type: "doughnut",
        data: {
            labels: ["จบแล้ว", "คงเหลือ"],
            datasets: [{
                data: [completedNPL, totalNPL - completedNPL],
                backgroundColor: ["#28a745", "#ff4444"]
            }]
        },
        options: {
            plugins: {
                legend: { labels: { color: "#fff" } }
            }
        }
    });

    // สรุปผลเรียลไทม์
    const completedTasksQuery = query(
        collection(db, "tasks"),
        where("assignedTo", "==", user.uid),
        where("status", "==", "completed")
    );
    const completedTasksSnapshot = await getDocs(completedTasksQuery);
    let dailyCompleted = 0;
    let totalPrinciple = 0;

    completedTasksSnapshot.forEach(doc => {
        const task = doc.data();
        const completedDate = task.completedDate ? new Date(task.completedDate) : null;
        const today = new Date();
        if (completedDate && completedDate.toDateString() === today.toDateString()) {
            dailyCompleted++;
        }
        totalPrinciple += parseFloat(task.principle) || 0;
    });

    document.getElementById("dailyCompleted").textContent = dailyCompleted;
    document.getElementById("totalPrinciple").textContent = totalPrinciple.toLocaleString();

    // Forecast
    const target6090 = 0.88 * total6090;
    const targetNPL = 0.40 * totalNPL;
    document.getElementById("remaining6090").textContent = Math.max(0, Math.ceil(target6090 - completed6090));
    document.getElementById("remainingNPL").textContent = Math.max(0, Math.ceil(targetNPL - completedNPL));

    // เปอร์เซ็นต์จบงาน (จาก performance.html)
    const usersQuery = query(collection(db, "users"));
    const usersSnapshot = await getDocs(usersQuery);
    const completionTable = document.getElementById("completionTable");
    let usersData = [];

    for (const userDoc of usersSnapshot.docs) {
        const userData = userDoc.data();
        const userTasksQuery = query(
            collection(db, "tasks"),
            where("assignedTo", "==", userDoc.id)
        );
        const userTasksSnapshot = await getDocs(userTasksQuery);
        const userCompletedTasksQuery = query(
            collection(db, "tasks"),
            where("assignedTo", "==", userDoc.id),
            where("status", "==", "completed")
        );
        const userCompletedTasksSnapshot = await getDocs(userCompletedTasksQuery);
        const completionRate = userTasksSnapshot.size > 0 ? (userCompletedTasksSnapshot.size / userTasksSnapshot.size) * 100 : 0;
        usersData.push({
            employeeId: userData.employeeId,
            completionRate: completionRate.toFixed(1)
        });
    }

    usersData.sort((a, b) => b.completionRate - a.completionRate);
    usersData.forEach((user, index) => {
        const row = `
            <tr>
                <td>${index + 1}</td>
                <td>${user.employeeId}</td>
                <td>${user.completionRate}%</td>
            </tr>
        `;
        completionTable.innerHTML += row;
    });
});