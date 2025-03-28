// js/task-detail.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
    // ใส่ Firebase Config ของคุณที่นี่
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function loadTaskDetail() {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
        window.location.href = 'index.html';
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const taskId = urlParams.get('taskId');
    if (!taskId) {
        alert('ไม่พบรหัสงาน');
        window.location.href = 'tasks.html';
        return;
    }

    const taskDoc = await getDoc(doc(db, 'tasks', taskId));
    if (taskDoc.exists()) {
        const task = taskDoc.data();
        document.getElementById('affiliation').value = task.affiliation || '';
        document.getElementById('workGroup').value = task.workGroup || '';
        document.getElementById('branch').value = task.branch || '';
        document.getElementById('contractNumber').value = task.contractNumber || '';
        document.getElementById('customerName').value = task.customerName || '';
        document.getElementById('overdueInstallments').value = task.overdueInstallments || '';
        document.getElementById('principle').value = task.principle || '';
        document.getElementById('address').value = task.address || '';
        document.getElementById('province').value = task.province || '';
        document.getElementById('installmentDetails').value = task.installmentDetails || '';
        document.getElementById('brand').value = task.brand || '';
        document.getElementById('model').value = task.model || '';
        document.getElementById('color').value = task.color || '';
        document.getElementById('licensePlate').value = task.licensePlate || '';
        document.getElementById('engineNumber').value = task.engineNumber || '';
        document.getElementById('chassisNumber').value = task.chassisNumber || '';
        document.getElementById('notes').value = task.notes || '';
    } else {
        alert('ไม่พบข้อมูลงาน');
        window.location.href = 'tasks.html';
    }
}

async function acceptTask() {
    const urlParams = new URLSearchParams(window.location.search);
    const taskId = urlParams.get('taskId');
    await updateDoc(doc(db, 'tasks', taskId), { status: 'appointed' });
    alert('รับงานสำเร็จ');
    window.location.href = 'tasks.html';
}

async function delegateTask() {
    const urlParams = new URLSearchParams(window.location.search);
    const taskId = urlParams.get('taskId');
    await updateDoc(doc(db, 'tasks', taskId), { status: 'pending' });
    alert('ฝากงานสำเร็จ');
    window.location.href = 'tasks.html';
}

function toggleDetails() {
    const details = document.getElementById('additionalDetails');
    details.style.display = details.style.display === 'none' ? 'block' : 'none';
}

async function saveDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const taskId = urlParams.get('taskId');
    await updateDoc(doc(db, 'tasks', taskId), {
        affiliation: document.getElementById('affiliation').value,
        workGroup: document.getElementById('workGroup').value,
        branch: document.getElementById('branch').value,
        contractNumber: document.getElementById('contractNumber').value,
        customerName: document.getElementById('customerName').value,
        overdueInstallments: document.getElementById('overdueInstallments').value,
        principle: document.getElementById('principle').value,
        address: document.getElementById('address').value,
        province: document.getElementById('province').value,
        installmentDetails: document.getElementById('installmentDetails').value,
        brand: document.getElementById('brand').value,
        model: document.getElementById('model').value,
        color: document.getElementById('color').value,
        licensePlate: document.getElementById('licensePlate').value,
        engineNumber: document.getElementById('engineNumber').value,
        chassisNumber: document.getElementById('chassisNumber').value,
        notes: document.getElementById('notes').value
    });
    alert('บันทึกสำเร็จ');
}

loadTaskDetail();
