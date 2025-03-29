// public/js/tasks.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { auth, onAuthStateChanged } from "./auth.js";
import { firebaseConfig } from "./firebase.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function loadTasks() {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const userEmail = user.email;
            console.log('User Email:', userEmail);
            localStorage.setItem('userEmail', userEmail);

            const statusFilter = document.getElementById('statusFilter').value;
            const taskList = document.getElementById('taskList');
            taskList.innerHTML = '';

            const tasksSnapshot = await getDocs(collection(db, 'tasks'));
            console.log('Tasks Snapshot:', tasksSnapshot.docs);
            let taskCount = 0;

            tasksSnapshot.forEach(doc => {
                const task = doc.data();
                console.log('Task:', task);
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
                            <a href="#" class="button green" onclick="acceptTask('${doc.id}')"><i class="fas fa-check"></i> รับงาน</a>
                            <a href="#" class="button yellow" onclick="delegateTask('${doc.id}')"><i class="fas fa-share"></i> ฝากงาน</a>
                        </div>
                    `;
                }
            });

            document.getElementById('taskCounter').textContent = taskCount;
        } else {
            window.location.href = 'index.html';
        }
    });
}

window.acceptTask = async function(taskId) {
    try {
        const taskRef = doc(db, 'tasks', taskId);
        await updateDoc(taskRef, {
            status: 'appointed'
        });
        alert('รับงานสำเร็จ');
        loadTasks(); // รีเฟรชรายการงาน
    } catch (error) {
        console.error('Error accepting task:', error);
        alert('เกิดข้อผิดพลาดในการรับงาน: ' + error.message);
    }
};

window.delegateTask = async function(taskId) {
    try {
        const taskRef = doc(db, 'tasks', taskId);
        await updateDoc(taskRef, {
            status: 'pending',
            assignedTo: 'admin@fieldflow.com' // ฝากงานให้แอดมิน
        });
        alert('ฝากงานสำเร็จ');
        loadTasks(); // รีเฟรชรายการงาน
    } catch (error) {
        console.error('Error delegating task:', error);
        alert('เกิดข้อผิดพลาดในการฝากงาน: ' + error.message);
    }
};

document.getElementById('statusFilter').addEventListener('change', loadTasks);
loadTasks();
