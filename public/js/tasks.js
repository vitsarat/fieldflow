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

            const tasksContainer = document.getElementById("tasksContainer");
            const tasksQuery = query(collection(db, "tasks"), where("assignedTo", "==", user.email));
            const tasksSnapshot = await getDocs(tasksQuery);

            tasksContainer.innerHTML = "";
            tasksSnapshot.forEach(doc => {
                const task = doc.data();
                const taskCard = document.createElement("div");
                taskCard.className = `task-card ${task.status.toLowerCase()}`;
                taskCard.innerHTML = `
                    <p><strong>งาน:</strong> ${task.title}</p>
                    <p><strong>สถานะ:</strong> <span class="status">${task.status}</span></p>
                `;
                tasksContainer.appendChild(taskCard);
            });
        });
    } catch (error) {
        console.error("Error in tasks.js:", error);
    }
})();
