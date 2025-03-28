// js/profile.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
    // ใส่ Firebase Config ของคุณที่นี่
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function loadProfile() {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('userName').textContent = userEmail.split('@')[0];

    const tasksSnapshot = await getDocs(collection(db, 'tasks'));
    const performanceData = Array(7).fill(0);
    const today = new Date();

    tasksSnapshot.forEach(doc => {
        const task = doc.data();
        if (task.assignedTo === userEmail && task.status === 'completed') {
            const taskDate = new Date(task.completedDate || today);
            const dayDiff = Math.floor((today - taskDate) / (1000 * 60 * 60 * 24));
            if (dayDiff >= 0 && dayDiff < 7) {
                performanceData[6 - dayDiff]++;
            }
        }
    });

    const ctx = document.getElementById('performanceChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['วัน 1', 'วัน 2', 'วัน 3', 'วัน 4', 'วัน 5', 'วัน 6', 'วัน 7'],
            datasets: [{
                label: '% การจบงาน',
                data: performanceData,
                borderColor: '#28A745',
                fill: false
            }]
        },
        options: { responsive: true }
    });
}

function logout() {
    localStorage.removeItem('userEmail');
    window.location.href = 'index.html';
}

loadProfile();
