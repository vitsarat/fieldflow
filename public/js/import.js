const admin = require('firebase-admin');
const serviceAccount = require('./fieldflow-b3ee5-firebase-adminsdk.json');

// กำหนดค่า Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// ข้อมูลงานที่ต้องการนำเข้า (คัดลอก JSON จากขั้นตอนที่ 1)
const tasks = [
    {
        taskId: "F4013",
        status: "pending",
        address: "กรุงเทพมหานคร",
        contractNo: "2320165088081",
        debtor: "นาย สมชาย ใจดี",
        phone: "0812345678",
        principle: 1488751.59,
        note: "119 วัน ที่ 1 ค้างชำระ 2 ค้างชำระ 3 ค้างชำระ",
        brand: "Toyota",
        model: "Camry",
        chassisNo: "ABC123456789",
        engineNo: "123456789",
        financeAmount: "10000 บาท",
        createdAt: admin.firestore.Timestamp.fromDate(new Date("2025-04-05T10:00:00Z")),
        location: { lat: 13.7563, lng: 100.5018 }
    },
    {
        taskId: "F4014",
        status: "pending",
        address: "เชียงใหม่",
        contractNo: "2320165088082",
        debtor: "นางสาว สมหญิง สวยงาม",
        phone: "0898765432",
        principle: 987654.32,
        note: "90 วัน ที่ 1 ค้างชำระ",
        brand: "Honda",
        model: "Civic",
        chassisNo: "XYZ987654321",
        engineNo: "987654321",
        financeAmount: "12000 บาท",
        createdAt: admin.firestore.Timestamp.fromDate(new Date("2025-04-05T10:00:00Z")),
        location: { lat: 18.7883, lng: 98.9853 }
    }
];

// ฟังก์ชันสำหรับนำเข้าข้อมูล
async function importTasks() {
    const batch = db.batch();
    tasks.forEach(task => {
        const taskRef = db.collection('tasks').doc(task.taskId);
        batch.set(taskRef, task);
    });

    try {
        await batch.commit();
        console.log('นำเข้าข้อมูลสำเร็จ!');
    } catch (error) {
        console.error('ข้อผิดพลาดในการนำเข้าข้อมูล:', error);
    }
}

// รันฟังก์ชันนำเข้าข้อมูล
importTasks().then(() => process.exit());
