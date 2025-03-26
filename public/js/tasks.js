import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs, query, where, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { auth, onAuthStateChanged } from "./auth.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = "index.html";
        return;
    }

    const tasksQuery = query(collection(db, "tasks"), where("assignedTo", "==", user.uid));
    const tasksSnapshot = await getDocs(tasksQuery);
    const tasksContainer = document.getElementById("tasksContainer");
    tasksContainer.innerHTML = "";

    tasksSnapshot.forEach(doc => {
        const task = doc.data();
        const taskId = doc.id;
        const taskCard = `
            <div class="task-card">
                <h3><i class="fas fa-file-contract"></i> ${task.contractNumber}</h3>
                <p><i class="fas fa-user"></i> ${task.fullName}</p>
                <p><i class="fas fa-home"></i> ${task.address}</p>
                <p><i class="fas fa-map-marker-alt"></i> ระยะ: ${task.distance || "N/A"} กม.</p>
                <p><span class="status ${task.status === "ติดต่อไม่ได้" ? "status-contact-fail" : "status-success"}">${task.status}</span></p>
                <button class="btn btn-details" onclick="showDetails('${taskId}')">ดูรายละเอียด</button>
            </div>
            <div class="task-details" id="${taskId}-details" style="display: none;">
                <p><i class="fas fa-building"></i> สังกัด: <select id="${taskId}-team">
                    <option ${task.team === "F4012 รุ่งเรือง" ? "selected" : ""}>F4012 รุ่งเรือง</option>
                    <option ${task.team === "F3574 เอสดี" ? "selected" : ""}>F3574 เอสดี</option>
                    <option ${task.team === "F3988 บียอนด์" ? "selected" : ""}>F3988 บียอนด์</option>
                </select></p>
                <p><i class="fas fa-layer-group"></i> กลุ่มงาน: <select id="${taskId}-group">
                    <option ${task.group === "6090" ? "selected" : ""}>6090</option>
                    <option ${task.group === "NPL" ? "selected" : ""}>NPL</option>
                </select></p>
                <p><i class="fas fa-map-marker-alt"></i> สาขารับงาน: <input type="text" id="${taskId}-branch" value="${task.branch}"></p>
                <p><i class="fas fa-file-contract"></i> เลขที่สัญญา: <input type="text" id="${taskId}-contractNumber" value="${task.contractNumber}"></p>
                <p><i class="fas fa-user"></i> ชื่อ-นามสกุล: <input type="text" id="${taskId}-fullName" value="${task.fullName}"></p>
                <p><i class="fas fa-coins"></i> จำนวนค้างค่างวด: <input type="text" id="${taskId}-overdueInstallments" value="${task.overdueInstallments}"></p>
                <p><i class="fas fa-money-bill"></i> Principle ยอดคงเหลือ: <input type="text" id="${taskId}-principle" value="${task.principle}"></p>
                <p><i class="fas fa-home"></i> ที่อยู่: <input type="text" id="${taskId}-address" value="${task.address}"></p>
                <button class="btn btn-accept" onclick="acceptTask('${taskId}')"><i class="fas fa-check"></i> รับงาน</button>
                <button class="btn btn-delegate" onclick="delegateTask('${taskId}')"><i class="fas fa-share"></i> ฝากงาน</button>
                <button class="btn btn-details" onclick="toggleAdditionalDetails('${taskId}')">แนบรายละเอียด</button>
                <div class="additional-details" id="${taskId}-additional">
                    <p>ค่างวด: <input type="text" id="${taskId}-installments" placeholder="เช่น 4 งวด" value="${task.installments || ""}"></p>
                    <p>ยี่ห้อ: <input type="text" id="${taskId}-brand" placeholder="เช่น Toyota" value="${task.brand || ""}"></p>
                    <p>รุ่น: <input type="text" id="${taskId}-model" placeholder="เช่น Camry" value="${task.model || ""}"></p>
                    <p>สีรถยนต์: <input type="text" id="${taskId}-color" placeholder="เช่น ขาว" value="${task.color || ""}"></p>
                    <p>เลขทะเบียน: <input type="text" id="${taskId}-licensePlate" placeholder="เช่น กข 1234" value="${task.licensePlate || ""}"></p>
                    <p>เลขเครื่องยนต์: <input type="text" id="${taskId}-engineNumber" placeholder="เช่น 123456" value="${task.engineNumber || ""}"></p>
                    <p>เลขตัวถัง: <input type="text" id="${taskId}-chassisNumber" placeholder="เช่น ABC123" value="${task.chassisNumber || ""}"></p>
                    <p>หมายเหตุ: <input type="text" id="${taskId}-note" placeholder="เช่น รถจอดที่บ้าน" value="${task.note || ""}"></p>
                    <button class="btn btn-save" onclick="saveTaskDetails('${taskId}')"><i class="fas fa-save"></i> บันทึก</button>
                </div>
            </div>
        `;
        tasksContainer.innerHTML += taskCard;
    });
});

window.showDetails = function(taskId) {
    document.querySelectorAll(".task-details").forEach(detail => detail.style.display = "none");
    document.getElementById(`${taskId}-details`).style.display = "block";
};

window.toggleAdditionalDetails = function(taskId) {
    const additional = document.getElementById(`${taskId}-additional`);
    additional.style.display = additional.style.display === "none" ? "block" : "none";
};

window.acceptTask = async function(taskId) {
    const taskRef = doc(db, "tasks", taskId);
    await updateDoc(taskRef, { status: "accepted" });
    alert("รับงานสำเร็จ");
};

window.delegateTask = async function(taskId) {
    const taskRef = doc(db, "tasks", taskId);
    await updateDoc(taskRef, { status: "delegated" });
    alert("ฝากงานสำเร็จ");
};

window.saveTaskDetails = async function(taskId) {
    const taskRef = doc(db, "tasks", taskId);
    const updatedTask = {
        team: document.getElementById(`${taskId}-team`).value,
        group: document.getElementById(`${taskId}-group`).value,
        branch: document.getElementById(`${taskId}-branch`).value,
        contractNumber: document.getElementById(`${taskId}-contractNumber`).value,
        fullName: document.getElementById(`${taskId}-fullName`).value,
        overdueInstallments: document.getElementById(`${taskId}-overdueInstallments`).value,
        principle: document.getElementById(`${taskId}-principle`).value,
        address: document.getElementById(`${taskId}-address`).value,
        installments: document.getElementById(`${taskId}-installments`).value,
        brand: document.getElementById(`${taskId}-brand`).value,
        model: document.getElementById(`${taskId}-model`).value,
        color: document.getElementById(`${taskId}-color`).value,
        licensePlate: document.getElementById(`${taskId}-licensePlate`).value,
        engineNumber: document.getElementById(`${taskId}-engineNumber`).value,
        chassisNumber: document.getElementById(`${taskId}-chassisNumber`).value,
        note: document.getElementById(`${taskId}-note`).value,
    };
    await updateDoc(taskRef, updatedTask);
    alert("บันทึกข้อมูลสำเร็จ");
};