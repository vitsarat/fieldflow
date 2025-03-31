// js/tasks.js
import { auth, db } from './auth.js';
import { collection, query, where, getDocs } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

async function loadTasks() {
    try {
        // Get current user
        const user = auth.currentUser;
        if (!user) {
            throw new Error('ผู้ใช้ไม่ได้ล็อกอิน');
        }

        const userEmail = user.email;

        // Get status filter
        const statusFilter = document.getElementById('statusFilter').value;

        // Query tasks for the current user
        let tasksQuery = query(collection(db, 'tasks'), where('assignedTo', '==', userEmail));
        if (statusFilter) {
            tasksQuery = query(collection(db, 'tasks'), where('assignedTo', '==', userEmail), where('status', '==', statusFilter));
        }

        const tasksSnapshot = await getDocs(tasksQuery);
        const taskList = document.getElementById('taskList');
        taskList.innerHTML = '';

        // Update task counter
        document.getElementById('taskCounter').textContent = tasksSnapshot.size;

        // Display tasks
        tasksSnapshot.forEach(doc => {
            const task = doc.data();
            const taskElement = document.createElement('div');
            taskElement.className = 'task-card';
            taskElement.innerHTML = `
                <h3><i class="fas fa-file-contract"></i> ${task.taskId}</h3>
                <p>สถานะ: ${task.status}</p>
                <p>ลูกค้า: ${task.customerName || 'ไม่ระบุ'}</p>
                <p>วันที่ครบกำหนด: ${task.dueDate || 'ไม่ระบุ'}</p>
            `;
            taskList.appendChild(taskElement);
        });

        if (tasksSnapshot.empty) {
            taskList.innerHTML = '<p>ไม่มีงานในขณะนี้</p>';
        }

    } catch (error) {
        console.error('Error loading tasks:', error);
        alert('ไม่สามารถโหลดรายการงานได้: ' + error.message);
    }
}

// Load tasks when the page loads
document.addEventListener('DOMContentLoaded', loadTasks);

// Export loadTasks for use in the HTML
window.loadTasks = loadTasks;
