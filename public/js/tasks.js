import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { auth, onAuthStateChanged } from "./auth.js";

async function getFirebaseConfig() {
    console.log("Fetching firebaseConfig from /firebase-config...");
    const response = await fetch('/firebase-config');
    if (!response.ok) {
        throw new Error(`Failed to fetch firebaseConfig: ${response.status} ${response.statusText}`);
    }
    const config = await response.json();
    console.log("firebaseConfig fetched:", config);
    return config;
}

(async () => {
    try {
        const firebaseConfig = await getFirebaseConfig();
        console.log("Initializing Firebase app...");
        const app = initializeApp(firebaseConfig);
        console.log("Firebase app initialized:", app);
        const db = getFirestore(app);
        console.log("Firestore initialized:", db);

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
                // ดึงข้อมูลงานทั้งหมด
                console.log("Fetching tasks...");
                const tasksQuery = query(collection(db, "tasks"), where("assignedTo", "==", user.email));
                const tasksSnapshot = await getDocs(tasksQuery);
                const taskList = document.getElementById("taskList");

                if (tasksSnapshot.empty) {
                    taskList.innerHTML = '<p class="no-tasks">ไม่มีงานในขณะนี้</p>';
                    return;
                }

                tasksSnapshot.forEach(doc => {
                    const task = doc.data();
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
    } catch (error) {
        console.error("Error initializing Firebase:", error);
    }
})();

window.viewTask = function(taskId) {
    window.location.href = `task-detail.html?taskId=${taskId}`;
};
