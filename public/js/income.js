// js/income.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
    // ใส่ Firebase Config ของคุณที่นี่
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function loadIncome() {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
        window.location.href = 'index.html';
        return;
    }

    const tasksSnapshot = await getDocs(collection(db, 'tasks'));
    const incomeTable = document.querySelector('#incomeTable tbody');
    incomeTable.innerHTML = '';

    let paid = 0, pending = 0, disputed = 0;
    let hasDispute = false;

    tasksSnapshot.forEach(doc => {
        const task = doc.data();
        if (task.assignedTo === userEmail && task.status === 'completed') {
            const commission = calculateCommission(task);
            const status = 'จ่ายแล้ว'; // ตัวอย่างสถานะ
            const date = new Date().toISOString().split('T')[0];
            const comment = task.comment || '';

            if (comment) hasDispute = true;

            incomeTable.innerHTML += `
                <tr>
                    <td>${task.contractNumber || 'N/A'}</td>
                    <td>${commission} บาท</td>
                    <td>${status}</td>
                    <td>${date}</td>
                    <td><input type="text" value="${comment}" onchange="updateComment('${doc.id}', this.value)"></td>
                </tr>
            `;

            paid += commission;
        }
    });

    document.getElementById('disputeAlert').style.display = hasDispute ? 'block' : 'none';

    const ctx = document.getElementById('commissionChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['จ่ายแล้ว', 'รอจ่าย', 'ระงับ'],
            datasets: [{
                data: [paid, pending, disputed],
                backgroundColor: ['#28A745', '#FFD700', '#FF0000']
            }]
        },
        options: { responsive: true }
    });
}

function calculateCommission(task) {
    const overdue = parseInt(task.overdueInstallments) || 0;
    if (task.workGroup === '6090') {
        if (overdue === 1) return 750;
        if (overdue === 2) return 1100;
        if (overdue === 3) return 3000;
        if (overdue >= 4) return 5000;
    } else if (task.workGroup === 'NPL') {
        if (overdue === 2) return 1500;
        if (overdue === 3) return 2000;
        if (overdue === 4) return 5000;
        if (overdue === 5) return 6000;
        if (overdue >= 6) return 7000;
    }
    return 0;
}

async function updateComment(taskId, comment) {
    await updateDoc(doc(db, 'tasks', taskId), { comment: comment });
    loadIncome();
}

function exportReport() {
    alert('ฟังก์ชันดาวน์โหลด PDF ยังไม่พร้อมใช้งาน');
}

loadIncome();
