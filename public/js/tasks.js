import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { auth, onAuthStateChanged } from "./auth.js";

const db = getFirestore();

console.log("Setting up onAuthStateChanged...");
onAuthStateChanged(auth, async (user) => {
    console.log("onAuthStateChanged triggered:", user);
    if (!user) {
        console.log("No user logged in, redirecting to index.html");
        window.location.href = "index.html";
        return;
    }

    console.log("User logged in:", user.uid, "Email:", user.email);

    try {
        console.log("Fetching tasks for email:", user.email);
        const tasksQuery = query(collection(db, "tasks"), where("assignedTo", "==", user.email));
        const tasksSnapshot = await getDocs(tasksQuery);
        console.log("Tasks snapshot size:", tasksSnapshot.size);
        const taskList = document.getElementById("taskList");

        if (tasksSnapshot.empty) {
            console.log("No tasks found for this user");
            taskList.innerHTML = '<p class="no-tasks">ไม่มีงานในขณะนี้</p>';
            return;
        }

        tasksSnapshot.forEach(doc => {
            const task = doc.data();
            console.log("Task found:", task);
            const taskElement = document.createElement("div");
            taskElement.classList.add("task");

            if (task.status.toLowerCase() === "urgent") {
                taskElement.classList.add("urgent");
            } else if (task.status.toLowerCase() === "completed") {
                taskElement.classList.add("completed");
            }

            taskElement.innerHTML = `
                <p>${task.title}</p>
                <button onclick="viewTask('${doc.id}')"><i class="fas fa-eye"></i> ดูรายละเอียด</button>
            `;
            taskList.appendChild(taskElement);
        });
    } catch (error) {
        console.error("Error fetching tasks:", error);
    }
});

window.viewTask = function(taskId) {
    window.location.href = `task-detail.html?taskId=${taskId}`;
};
