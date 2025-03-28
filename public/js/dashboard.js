// public/js/dashboard.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { auth, onAuthStateChanged } from "./auth.js";

const firebaseConfig = {
    // ใส่ Firebase Config ของคุณที่นี่
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function loadDashboard() {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const userEmail = user.email;
            console.log('User Email:', userEmail);

            const tasksSnapshot = await getDocs(collection(db, 'tasks'));
            console.log('Tasks Snapshot:', tasksSnapshot.docs);
            let pending = 0, completed = 0, repossession = 0;

            tasksSnapshot.forEach(doc => {
                const task = doc.data();
                console.log('Task:', task);
                if (task.assignedTo === userEmail) {
                    if (task.status === 'pending') pending++;
                    if (task.status === 'completed') completed++;
                    if (task.status === 'repossession') repossession++;
                }
            });

            document.getElementById('pendingTasks').textContent = pending;
            document.getElementById('completedTasks').textContent = completed;
            document.getElementById('repossessionTasks').textContent = repossession;
            document.getElementById('closedTasks').textContent = completed;
            document.getElementById('income').textContent = completed * 5000;
            document.getElementById('points').textContent = completed * 100;

            const alert = document.getElementById('alert');
            if (pending > 0) {
                alert.style.display = 'block';
                alert.textContent = `การแจ้งเตือน: คุณมีงานด่วน ${pending} งาน`;
            }
        } else {
            window.location.href = 'index.html';
        }
    });
}

loadDashboard();
