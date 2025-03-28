import { auth, onAuthStateChanged } from './auth.js';
import { getFirestore, collection, query, where, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const db = getFirestore();

console.log("Setting up onAuthStateChanged...");

onAuthStateChanged(auth, (user) => {
    console.log("onAuthStateChanged triggered:", user);
    if (user) {
        console.log("User logged in:", user.uid, "Email:", user.email);
        user.getIdTokenResult().then((tokenResult) => {
            console.log("User token email:", tokenResult.claims.email);
            loadTasks(user);
        }).catch((error) => {
            console.error("Error getting token:", error);
        });
    } else {
        console.log("No user logged in, redirecting to index.html");
        window.location.href = "index.html";
    }
});

async function loadTasks(user) {
    try {
        const taskList = document.getElementById("taskList");
        taskList.innerHTML = ""; // ล้างข้อมูลเก่า

        console.log("Fetching all tasks without filter...");
        const allTasksQuery = query(collection(db, "tasks"));
        onSnapshot(allTasksQuery, (snapshot) => {
            console.log("All tasks snapshot size:", snapshot.size);
            snapshot.forEach(doc => {
                const task = doc.data();
                console.log("Task (no filter):", doc.id, task);
            });
        });

        console.log("Fetching tasks for email:", user.email);
        const userTasksQuery = query(collection(db, "tasks"), where("assignedTo", "==", user.email));
        onSnapshot(userTasksQuery, (snapshot) => {
            console.log("Tasks snapshot size:", snapshot.size);
            if (snapshot.empty) {
                taskList.innerHTML = '<p class="no-tasks">ไม่มีงาน</p>';
                return;
            }

            taskList.innerHTML = ""; // ล้างข้อมูลเก่า
            snapshot.forEach(doc => {
                const task = doc.data();
                console.log("Task found:", doc.id, task);
                const taskElement = document.createElement("div");
                taskElement.className = `task ${task.status}`;
                taskElement.innerHTML = `
                    <div>
                        <h3>${task.title}</h3>
                        <p>สถานะ: ${task.status}</p>
                    </div>
                    <button onclick="viewTask('${doc.id}')">ดูรายละเอียด</button>
                `;
                taskList.appendChild(taskElement);
            });
        });
    } catch (error) {
        console.error("Error fetching tasks:", error);
        taskList.innerHTML = `<p class="error">เกิดข้อผิดพลาด: ${error.message}</p>`;
    }
}

window.viewTask = function(taskId) {
    window.location.href = `task-detail.html?taskId=${taskId}`;
};
