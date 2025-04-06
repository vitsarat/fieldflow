<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>รายการงาน - DebtFlow</title>
    <link rel="stylesheet" href="styles.css"> <!-- หากคุณมีไฟล์ CSS -->
    <!-- Firebase SDK -->
    <script src="https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.6.1/firebase-auth-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore-compat.js"></script>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        .search-filter {
            margin-bottom: 20px;
            display: flex;
            gap: 10px;
            align-items: center;
        }
        .search-filter input, .search-filter select, .search-filter button {
            padding: 8px;
            font-size: 16px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
        .pagination {
            display: flex;
            gap: 10px;
            align-items: center;
            justify-content: center;
        }
        button {
            padding: 8px 16px;
            cursor: pointer;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
        }
        button:disabled {
            background-color: #cccccc;
            cursor: not-allowed;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>รายการงาน</h1>
        <div class="search-filter">
            <input type="text" id="searchInput" placeholder="ค้นหางาน (เช่น รหัสงาน, ชื่อลูกหนี้, ที่อยู่)">
            <button onclick="searchTasks()">ค้นหา</button>
            <select id="statusFilter" onchange="filterTasks()">
                <option value="">ทั้งหมด</option>
                <option value="pending">รอดำเนินการ</option>
                <option value="contacted">ติดต่อแล้ว</option>
                <option value="completed">เสร็จสิ้น</option>
            </select>
        </div>
        <div id="totalTasks">ทั้งหมด: 0 งาน</div>
        <table>
            <thead>
                <tr>
                    <th>รหัสงาน</th>
                    <th>ชื่อลูกหนี้</th>
                    <th>ที่อยู่</th>
                    <th>ยอดหนี้</th>
                    <th>สถานะ</th>
                </tr>
            </thead>
            <tbody id="taskList">
                <!-- รายการงานจะถูกเพิ่มที่นี่โดย JavaScript -->
            </tbody>
        </table>
        <div class="pagination">
            <button id="prevBtn" onclick="prevPage()" disabled>ก่อนหน้า</button>
            <span id="pageInfo">หน้า 1 / 1</span>
            <button id="nextBtn" onclick="nextPage()" disabled>ถัดไป</button>
        </div>
    </div>

    <script>
        // Firebase Configuration
        const firebaseConfig = {
            apiKey: "YOUR_API_KEY",
            authDomain: "fieldflow-b3ee5.firebaseapp.com",
            projectId: "fieldflow-b3ee5",
            storageBucket: "fieldflow-b3ee5.appspot.com",
            messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
            appId: "YOUR_APP_ID"
        };

        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
        const auth = firebase.auth();
        const db = firebase.firestore();

        // Pagination Variables
        const pageSize = 10;
        let currentPage = 1;
        let lastDoc = null;
        let firstDoc = null;
        let totalTasks = 0;
        let currentQuery = db.collection('tasks').orderBy('createdAt', 'desc');
        let isSearching = false;
        let searchTerm = '';
        let currentStatus = '';

        // ตรวจสอบสถานะการล็อกอิน
        auth.onAuthStateChanged(user => {
            if (!user) {
                window.location.href = 'login.html'; // หากไม่ได้ล็อกอิน ให้ไปที่หน้า login
            }
        });

        // ดึงจำนวนงานทั้งหมด
        async function getTotalTasks() {
            let query = db.collection('tasks');
            if (currentStatus) {
                query = query.where('status', '==', currentStatus);
            }
            const snapshot = await query.get();
            totalTasks = snapshot.size;
            document.getElementById('totalTasks').textContent = `ทั้งหมด: ${totalTasks} งาน`;
            document.getElementById('pageInfo').textContent = `หน้า ${currentPage} / ${Math.ceil(totalTasks / pageSize)}`;
        }

        // ดึงข้อมูลงานตามหน้า
        async function loadTasks() {
            const taskList = document.getElementById('taskList');
            taskList.innerHTML = ''; // ล้างรายการก่อนหน้า

            let query = currentQuery.limit(pageSize);

            if (lastDoc && currentPage > 1) {
                query = query.startAfter(lastDoc);
            }

            const snapshot = await query.get();
            if (snapshot.empty) {
                taskList.innerHTML = '<tr><td colspan="5">ไม่มีข้อมูล</td></tr>';
                return;
            }

            firstDoc = snapshot.docs[0];
            lastDoc = snapshot.docs[snapshot.docs.length - 1];

            snapshot.forEach(doc => {
                const task = doc.data();
                const row = `
                    <tr>
                        <td>${task.taskId}</td>
                        <td>${task.debtor}</td>
                        <td>${task.address}</td>
                        <td>${task.principle.toLocaleString()}</td>
                        <td>${task.status}</td>
                    </tr>
                `;
                taskList.innerHTML += row;
            });

            document.getElementById('pageInfo').textContent = `หน้า ${currentPage} / ${Math.ceil(totalTasks / pageSize)}`;
            document.getElementById('prevBtn').disabled = currentPage === 1;
            document.getElementById('nextBtn').disabled = currentPage === Math.ceil(totalTasks / pageSize);
        }

        // ฟังก์ชันค้นหางาน
        async function searchTasks() {
            const searchInput = document.getElementById('searchInput').value.toLowerCase();
            searchTerm = searchInput;
            isSearching = searchTerm !== '';

            const taskList = document.getElementById('taskList');
            taskList.innerHTML = '';

            if (!isSearching) {
                // ถ้าไม่มีการค้นหา ให้กลับไปใช้ query ปกติ
                currentQuery = db.collection('tasks').orderBy('createdAt', 'desc');
                if (currentStatus) {
                    currentQuery = currentQuery.where('status', '==', currentStatus);
                }
                currentPage = 1;
                lastDoc = null;
                firstDoc = null;
                await getTotalTasks();
                await loadTasks();
                return;
            }

            // ค้นหาตาม taskId, debtor, หรือ address
            const snapshot = await db.collection('tasks')
                .orderBy('taskId')
                .startAt(searchTerm)
                .endAt(searchTerm + '\uf8ff')
                .get();

            const debtorSnapshot = await db.collection('tasks')
                .orderBy('debtor')
                .startAt(searchTerm)
                .endAt(searchTerm + '\uf8ff')
                .get();

            const addressSnapshot = await db.collection('tasks')
                .orderBy('address')
                .startAt(searchTerm)
                .endAt(searchTerm + '\uf8ff')
                .get();

            // รวมผลลัพธ์และกำจัดรายการซ้ำ
            const tasksMap = new Map();
            snapshot.forEach(doc => tasksMap.set(doc.id, doc.data()));
            debtorSnapshot.forEach(doc => tasksMap.set(doc.id, doc.data()));
            addressSnapshot.forEach(doc => tasksMap.set(doc.id, doc.data()));

            const filteredTasks = Array.from(tasksMap.values())
                .filter(task => {
                    if (currentStatus) {
                        return task.status === currentStatus;
                    }
                    return true;
                });

            if (filteredTasks.length === 0) {
                taskList.innerHTML = '<tr><td colspan="5">ไม่พบข้อมูล</td></tr>';
                return;
            }

            // แสดงผลลัพธ์การค้นหา
            filteredTasks.forEach(task => {
                const row = `
                    <tr>
                        <td>${task.taskId}</td>
                        <td>${task.debtor}</td>
                        <td>${task.address}</td>
                        <td>${task.principle.toLocaleString()}</td>
                        <td>${task.status}</td>
                    </tr>
                `;
                taskList.innerHTML += row;
            });

            // ปิดการใช้งานปุ่ม pagination ระหว่างการค้นหา
            document.getElementById('prevBtn').disabled = true;
            document.getElementById('nextBtn').disabled = true;
            document.getElementById('pageInfo').textContent = `ผลการค้นหา: ${filteredTasks.length} รายการ`;
        }

        // ฟังก์ชันกรองตามสถานะ
        async function filterTasks() {
            currentStatus = document.getElementById('statusFilter').value;
            isSearching = false;
            document.getElementById('searchInput').value = ''; // ล้างช่องค้นหา
            searchTerm = '';

            currentQuery = db.collection('tasks').orderBy('createdAt', 'desc');
            if (currentStatus) {
                currentQuery = currentQuery.where('status', '==', currentStatus);
            }

            currentPage = 1;
            lastDoc = null;
            firstDoc = null;

            await getTotalTasks();
            await loadTasks();
        }

        // ฟังก์ชันสำหรับปุ่ม "ก่อนหน้า"
        async function prevPage() {
            if (currentPage > 1) {
                currentPage--;
                const query = currentQuery
                    .endBefore(firstDoc)
                    .limitToLast(pageSize);
                const snapshot = await query.get();
                firstDoc = snapshot.docs[0];
                lastDoc = snapshot.docs[snapshot.docs.length - 1];
                await loadTasks();
            }
        }

        // ฟังก์ชันสำหรับปุ่ม "ถัดไป"
        async function nextPage() {
            if (currentPage < Math.ceil(totalTasks / pageSize)) {
                currentPage++;
                await loadTasks();
            }
        }

        // เพิ่มการกด Enter เพื่อค้นหา
        document.getElementById('searchInput').addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                searchTasks();
            }
        });

        // โหลดข้อมูลเมื่อหน้าโหลด
        getTotalTasks();
        loadTasks();
    </script>
</body>
</html>
