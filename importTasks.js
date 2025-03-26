const admin = require("firebase-admin");
const fs = require("fs");
const csv = require("csv-parse");

// ตั้งค่า Firebase Admin SDK
const serviceAccount = require("./service-account-key.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// อ่านไฟล์ CSV
const tasks = [];
fs.createReadStream("tasks.csv")
  .pipe(csv.parse({ columns: true }))
  .on("data", (row) => {
    tasks.push({
      id: row.id,
      name: row.name,
      address: row.address,
      lat: parseFloat(row.lat),
      lng: parseFloat(row.lng),
      contractId: row.contractId,
      principle: parseFloat(row.principle),
      installment: parseFloat(row.installment),
      licensePlate: row.licensePlate,
      postedTime: row.postedTime,
      scheduledDate: row.scheduledDate,
      group: row.group,
      urgent: row.urgent === "true",
      assignedTo: row.assignedTo,
      teamName: row.teamName,
      status: row.status || "รอดำเนินการ",
    });
  })
  .on("end", async () => {
    console.log("CSV file successfully processed");

    // ตรวจสอบ id ซ้ำ
    const existingTasksSnapshot = await db.collection("tasks").get();
    const existingTaskIds = existingTasksSnapshot.docs.map((doc) => doc.id);
    const duplicateTasks = tasks.filter((task) =>
      existingTaskIds.includes(task.id)
    );
    if (duplicateTasks.length > 0) {
      console.error(
        `พบรหัสงานซ้ำ: ${duplicateTasks.map((t) => t.id).join(", ")}`
      );
      process.exit(1);
    }

    // นำเข้าข้อมูลไปยัง Firestore
    const batch = db.batch();
    tasks.forEach((task) => {
      const taskRef = db.collection("tasks").doc(task.id);
      batch.set(taskRef, task);
    });
    await batch.commit();
    console.log(`${tasks.length} tasks imported successfully`);
    process.exit();
  })
  .on("error", (err) => {
    console.error("Error reading CSV:", err);
    process.exit(1);
  });
