import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs, query, where, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { auth, onAuthStateChanged } from "./auth.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const commissionRates = {
    "6090": {
        1: 750,
        2: 1100,
        3: 3000,
        4: 5000
    },
    "NPL": {
        2: 1500,
        3: 2000,
        4: 5000,
        5: 6000,
        6: 7000
    },
    "repossession": [1500, 6000, 7000, 9000, 10000, 12000]
};

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = "index.html";
        return;
    }

    const tasksQuery = query(
        collection(db, "tasks"),
        where("assignedTo", "==", user.uid),
        where("status", "==", "completed")
    );
    const tasksSnapshot = await getDocs(tasksQuery);
    const incomeTableBody = document.getElementById("incomeTableBody");
    let totalIncome = 0;
    let paid = 0;
    let pending = 0;
    let disputed = 0;

    tasksSnapshot.forEach(doc => {
        const task = doc.data();
        const taskId = doc.id;
        let commission = 0;

        if (task.group === "6090" || task.group === "NPL") {
            const installments = parseInt(task.overdueInstallments) || 0;
            commission = commissionRates[task.group][installments] || 0;
        } else if (task.group === "repossession") {
            commission = commissionRates.repossession[Math.floor(Math.random() * commissionRates.repossession.length)];
        }

        totalIncome += commission;
        if (task.paymentStatus === "paid") paid += commission;
        else if (task.paymentStatus === "pending") pending += commission;
        else if (task.paymentStatus === "disputed") disputed += commission;

        const row = `
            <tr>
                <td>${task.contractNumber}</td>
                <td>${commission.toLocaleString()} บาท</td>
                <td>${task.paymentStatus === "paid" ? "จ่ายแล้ว" : task.paymentStatus === "pending" ? "รอจ่าย" : "ระงับ"}</td>
                <td>${task.paymentDate || "N/A"}</td>
                <td><input type="text" value="${task.comment || "อนุมัติ"}" onblur="checkDispute(this, '${taskId}')"></td>
            </tr>
        `;
        incomeTableBody.innerHTML += row;
    });

    document.getElementById("totalIncome").textContent = totalIncome.toLocaleString();

    const ctx = document.getElementById("commissionChart").getContext("2d");
    new Chart(ctx, {
        type: "pie",
        data: {
            labels: ["จ่ายแล้ว", "รอจ่าย", "ระงับ"],
            datasets: [{
                data: [paid, pending, disputed],
                backgroundColor: ["#28a745", "#ff9500", "#dc3545"]
            }]
        }
    });
});

window.checkDispute = async function(input, taskId) {
    const disputeAlert = document.getElementById("disputeAlert");
    const disputeTask = document.getElementById("disputeTask");
    const taskRef = doc(db, "tasks", taskId);
    const comment = input.value;

    await updateDoc(taskRef, { comment: comment });

    if (comment.includes("โต้แย้ง")) {
        disputeAlert.style.display = "block";
        disputeTask.textContent = taskId;
    } else {
        disputeAlert.style.display = "none";
    }
};

window.exportReport = function() {
    const element = document.querySelector(".income-container");
    html2pdf().from(element).save("income_report.pdf");
};