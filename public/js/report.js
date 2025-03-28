// public/js/report.js
import { jsPDF } from "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.es.min.js";

function exportReport() {
    const doc = new jsPDF();
    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);
    doc.text("รายงานรายได้ - FieldFlow", 20, 20);

    doc.setFontSize(12);
    doc.text("วันที่: " + new Date().toLocaleDateString('th-TH'), 20, 30);

    const table = document.getElementById('incomeTable');
    const rows = table.querySelectorAll('tbody tr');
    let y = 40;

    doc.setFontSize(10);
    doc.text("เลขที่สัญญา    Commission    สถานะ    วันที่จ่าย    คอมเมนต์", 20, y);
    y += 10;

    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        const rowData = [
            cells[0].textContent,
            cells[1].textContent,
            cells[2].textContent,
            cells[3].textContent,
            cells[4].querySelector('input').value
        ];
        doc.text(rowData.join("    "), 20, y);
        y += 10;
    });

    doc.save('income-report.pdf');
}
