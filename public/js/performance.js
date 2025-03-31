// js/performance.js
import { auth, db } from './auth.js';
import { collection, query, where, getDocs } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Get current user
        const user = auth.currentUser;
        if (!user) {
            throw new Error('ผู้ใช้ไม่ได้ล็อกอิน');
        }

        const userEmail = user.email;

        // Query performance data for the current user
        const performanceQuery = query(collection(db, 'performance'), where('userEmail', '==', userEmail));
        const performanceSnapshot = await getDocs(performanceQuery);

        let totalTasks = 0;
        let successRate = 0;
        let totalPoints = 0;

        performanceSnapshot.forEach(doc => {
            const performance = doc.data();
            totalTasks += performance.totalTasks || 0;
            successRate += performance.successRate || 0;
            totalPoints += performance.points || 0;
        });

        // Update DOM (สมมติว่า performance.html มี element เหล่านี้)
        document.getElementById('totalTasks').textContent = totalTasks;
        document.getElementById('successRate').textContent = successRate.toFixed(2) + '%';
        document.getElementById('totalPoints').textContent = totalPoints;

    } catch (error) {
        console.error('Error loading performance:', error);
        alert('ไม่สามารถโหลดข้อมูลผลงานได้: ' + error.message);
    }
});
