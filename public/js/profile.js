// js/profile.js
import { auth, db } from './auth.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Get current user
        const user = auth.currentUser;
        if (!user) {
            throw new Error('ผู้ใช้ไม่ได้ล็อกอิน');
        }

        // Get user data from Firestore
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            throw new Error('ไม่พบข้อมูลผู้ใช้ในระบบ');
        }

        const userData = userDoc.data();

        // Update DOM (สมมติว่า profile.html มี element เหล่านี้)
        document.getElementById('employeeId').textContent = userData.employeeId || 'ไม่ระบุ';
        document.getElementById('name').textContent = userData.name || 'ไม่ระบุ';
        document.getElementById('email').textContent = userData.email || 'ไม่ระบุ';
        document.getElementById('role').textContent = userData.role || 'ไม่ระบุ';

    } catch (error) {
        console.error('Error loading profile:', error);
        alert('ไม่สามารถโหลดข้อมูลโปรไฟล์ได้: ' + error.message);
    }
});
