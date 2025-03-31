// js/dashboard.js (ปรับปรุง)
import { auth, db } from './auth.js';
import { collection, query, where, getDocs, doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Get current user
        const user = auth.currentUser;
        if (!user) {
            throw new Error('ผู้ใช้ไม่ได้ล็อกอิน');
        }

        // Get user data from Firestore
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (!userDoc.exists()) {
            throw new Error('ไม่พบข้อมูลผู้ใช้ในระบบ');
        }
        const userData = userDoc.data();
        const userEmail = userData.email;

        // Query tasks for the current user
        const tasksQuery = query(collection(db, 'tasks'), where('assignedTo', '==', userEmail));
        const tasksSnapshot = await getDocs(tasksQuery);

        let pendingTasks = 0;
        let completedTasks = 0;
        let repossessionTasks = 0;

        tasksSnapshot.forEach(doc => {
            const task = doc.data();
            if (task.status === 'pending') pendingTasks++;
            if (task.status === 'completed') completedTasks++;
            if (task.status === 'repossession') repossessionTasks++;
        });

        // Update DOM
        document.getElementById('pendingTasks').textContent = pendingTasks;
        document.getElementById('completedTasks').textContent = completedTasks;
        document.getElementById('repossessionTasks').textContent = repossessionTasks;

        // Query income for the current user
        const incomeQuery = query(collection(db, 'income'), where('userEmail', '==', userEmail));
        const incomeSnapshot = await getDocs(incomeQuery);

        let closedTasks = 0;
        let totalIncome = 0;
        let points = 0;

        incomeSnapshot.forEach(doc => {
            const income = doc.data();
            closedTasks++;
            totalIncome += income.amount || 0;
            points += income.points || 0;
        });

        // Update DOM
        document.getElementById('closedTasks').textContent = closedTasks;
        document.getElementById('income').textContent = totalIncome.toLocaleString();
        document.getElementById('points').textContent = points;

        // Update alert for urgent tasks
        const urgentTasks = tasksSnapshot.docs.filter(doc => doc.data().urgent).length;
        const alertElement = document.getElementById('alert');
        if (urgentTasks > 0) {
            alertElement.textContent = `การแจ้งเตือน: คุณมีงานด่วน ${urgentTasks} งาน`;
            alertElement.style.display = 'block';
        }

    } catch (error) {
        console.error('Error loading dashboard:', error);
        alert('ไม่สามารถโหลดข้อมูลแดชบอร์ดได้: ' + error.message);
    }
});
