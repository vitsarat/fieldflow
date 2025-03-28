// js/performance.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
    // ใส่ Firebase Config ของคุณที่นี่
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function loadPerformance() {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
        window.location.href = 'index.html';
        return;
    }

    const tasksSnapshot = await getDocs(collection(db, 'tasks'));
    let completed6090 = 0, total6090 = 0, completedNPL = 0, totalNPL = 0;
    let totalPrinciple = 0, completedPrinciple = 0;

    tasksSnapshot.forEach(doc => {
        const task = doc.data();
        if (task.assignedTo === userEmail) {
            const principle = parseFloat(task.principle) || 0;
            totalPrinciple += principle;

            if (task.workGroup === '6090') {
                total6090++;
                if (task.status === 'completed') {
                    completed6090++;
                    completedPrinciple += principle;
                }
            } else if (task.workGroup === 'NPL') {
                totalNPL++;
                if (task.status === 'completed') {
                    completedNPL++;
                    completedPrinciple += principle;
                }
            }
        }
    });

    const percent6090 = total6090 ? (completed6090 / total6090) * 100 : 0;
    const percentNPL = totalNPL ? (completedNPL / totalNPL) * 100 : 0;
    const target6090 = 88, targetNPL = 40;
    const remainingTasks6090 = Math.ceil((target6090 - percent6090) * total6090 / 100);

    document.getElementById('completedTasks').textContent = completed6090 + completedNPL;
    document.getElementById('remainingPrinciple').textContent = (totalPrinciple - completedPrinciple).toLocaleString();
    document.getElementById('remainingTasks').textContent = remainingTasks6090;
    document.getElementById('targetAlert').style.display = remainingTasks6090 > 0 ? 'block' : 'none';

    const ctx6090 = document.getElementById('chart6090').getContext('2d');
    new Chart(ctx6090, {
        type: 'pie',
        data: {
            labels: ['จบแล้ว', 'คงเหลือ'],
            datasets: [{
                data: [percent6090, 100 - percent6090],
                backgroundColor: ['#28A745', '#FF0000']
            }]
        },
        options: { responsive: true }
    });

    const ctxNPL = document.getElementById('chartNPL').getContext('2d');
    new Chart(ctxNPL, {
        type: 'pie',
        data: {
            labels: ['จบแล้ว', 'คงเหลือ'],
            datasets: [{
                data: [percentNPL, 100 - percentNPL],
                backgroundColor: ['#28A745', '#FF0000']
            }]
        },
        options: { responsive: true }
    });
}

loadPerformance();
