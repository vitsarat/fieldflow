// js/admin.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
    // ใส่ Firebase Config ของคุณที่นี่
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function loadAdminDashboard() {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail || userEmail !== 'admin@fieldflow.com') {
        window.location.href = 'index.html';
        return;
    }

    const tasksSnapshot = await getDocs(collection(db, 'tasks'));
    let total = 0, urgent = 0;

    tasksSnapshot.forEach(doc => {
        total++;
        if (doc.data().status === 'urgent') urgent++;
    });

    document.getElementById('totalTasks').textContent = total;
    document.getElementById('urgentTasks').textContent = urgent;
}

async function addTask() {
    const title = document.getElementById('newTaskTitle').value;
    const assignedTo = document.getElementById('newTaskAssignedTo').value;
    const status = document.getElementById('newTaskStatus').value;

    await addDoc(collection(db, 'tasks'), {
        title: title,
        assignedTo: assignedTo,
        status: status,
        description: ''
    });

    alert('เพิ่มงานสำเร็จ');
    loadAdminDashboard();
}

loadAdminDashboard();
