// js/dashboard.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
    // ใส่ Firebase Config ของคุณที่นี่
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function loadDashboard() {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
        window.location.href = 'index.html';
        return;
    }

    const tasksSnapshot = await getDocs(collection(db, 'tasks'));
    let pending = 0, completed = 0, repossession = 0;

    tasksSnapshot.forEach(doc => {
        const task = doc.data();
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
    document.getElementById('income').textContent = completed * 5000; // ตัวอย่างการคำนวณรายได้
    document.getElementById('points').textContent = completed * 100; // ตัวอย่างการคำนวณคะแนน
}

loadDashboard();
