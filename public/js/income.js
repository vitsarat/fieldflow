// js/income.js
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

        // Query income data for the current user
        const incomeQuery = query(collection(db, 'income'), where('userEmail', '==', userEmail));
        const incomeSnapshot = await getDocs(incomeQuery);

        let closedTasks = 0;
        let totalIncome = 0;
        let totalPoints = 0;

        const incomeList = document.getElementById('incomeList') || document.createElement('div');
        incomeList.innerHTML = '';

        incomeSnapshot.forEach(doc => {
            const income = doc.data();
            closedTasks++;
            totalIncome += income.amount || 0;
            totalPoints += income.points || 0;

            // Display income details (สมมติว่า income.html มี element incomeList)
            const incomeElement = document.createElement('div');
            incomeElement.className = 'income-item';
            incomeElement.innerHTML = `
                <p>วันที่: ${income.date || 'ไม่ระบุ'}</p>
                <p>จำนวน: ${income.amount.toLocaleString()} บาท</p>
                <p>คะแนน: ${income.points || 0}</p>
            `;
            incomeList.appendChild(incomeElement);
        });

        // Update DOM
        document.getElementById('closedTasks').textContent = closedTasks;
        document.getElementById('totalIncome').textContent = totalIncome.toLocaleString();
        document.getElementById('totalPoints').textContent = totalPoints;

    } catch (error) {
        console.error('Error loading income:', error);
        alert('ไม่สามารถโหลดข้อมูลรายได้ได้: ' + error.message);
    }
});
