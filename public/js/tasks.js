// js/tasks.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
    // ใส่ Firebase Config ของคุณที่นี่
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function loadTasks() {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
        window.location.href = 'index.html';
        return;
    }

    const statusFilter = document.getElementById('statusFilter').value;
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    const tasksSnapshot = await getDocs(collection(db, 'tasks'));
    let taskCount = 0;

    tasksSnapshot.forEach(doc => {
        const task = doc.data();
        if (task.assignedTo === userEmail && (!statusFilter || task.status === statusFilter)) {
            taskCount++;
            const statusClass = task.status === 'pending' ? 'pending' : task.status === 'appointed' ? 'appointed' : 'completed';
            const statusText = task.status === 'pending' ? 'ติดต่อไม่ได้' : task.status === 'appointed' ? 'นัดหมาย' : 'จบงานสำเร็จ';
            const badge = taskCount === 1 ? '<span class="badge">งานเด่น</span>' : '';

            taskList.innerHTML += `
                <div class="task-card">
                    <h3><i class="fas fa-file-contract"></i> ${task.contractNumber || 'N/A'} ${badge}</h3>
                    <p><i class="fas fa-user"></i> ${task.customerName || 'N/A'}</p>
                    <p><i class="fas fa-home"></i> ${task.address || 'N/A'}</p>
                    <p><i class="fas fa-route"></i> ระยะ: 2.5 กม.</p>
                    <p>สถานะ: ${statusText}</p>
                    <div class="status-bar ${statusClass}"></div>
                    <a href="task-detail.html?taskId=${doc.id}" class="button">ดูรายละเอียด</a>
                    <a href="#" class="button green"><i class="fas fa-check"></i> รับงาน</a>
                    <a href="#" class="button yellow"><i class="fas fa-share"></i> ฝากงาน</a>
                </div>
            `;
        }
    });

    document.getElementById('taskCounter').textContent = taskCount;
}

loadTasks();
