# FieldFlow

FieldFlow เป็นแอปพลิเคชันสำหรับจัดการงานติดตามหนี้และยึดรถ ช่วยให้ทีมภาคสนามและแอดมินทำงานได้อย่างมีประสิทธิภาพ ด้วยฟีเจอร์ที่ทันสมัย เช่น การแจ้งเตือนอัจฉริยะ แผนที่เรียลไทม์ และระบบรางวัล

## คุณสมบัติหลัก
- **แดชบอร์ด (Dashboard)**: ภาพรวมงาน รายได้ และการแจ้งเตือน
- **งาน (Tasks)**: จัดการงานด้วยการ์ดงานที่ใช้งานง่าย
- **รายได้ (Income)**: ดูรายได้และดาวน์โหลดรายงาน
- **โปรไฟล์ (Profile)**: ข้อมูลส่วนตัว ผลงาน และรางวัล
- **ผลงาน (Performance Analytics)**: วิเคราะห์ผลงานด้วยกราฟ

## เทคโนโลยีที่ใช้
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js
- **Database**: Firebase Firestore
- **Libraries**: Chart.js, jsPDF

## การติดตั้ง
1. โคลน repository:
   ```bash
   git clone https://github.com/vitsarat/fieldflow.git
   
---

### **การตรวจสอบเพิ่มเติม**

#### **ไฟล์ที่ถูกลบ (`firebase-config.js`)**
- จากภาพ GitHub เห็นว่ามีการลบไฟล์ `public/js/firebase-config.js`
- **คำแนะนำ**: หากคุณย้ายการกำหนดค่า Firebase ไปไว้ในไฟล์อื่น (เช่น `firebase.js`) ตรวจสอบให้แน่ใจว่าไฟล์ JavaScript ทั้งหมดเรียกใช้ `firebaseConfig` จากไฟล์ที่ถูกต้อง

#### **ภาษาที่ใช้**
- จากภาพ GitHub ภาษาที่ใช้ในโปรเจกต์:
  - JavaScript: 45.2%
  - HTML: 44.7%
  - CSS: 10.1%
- **คำอธิบาย**: สัดส่วนนี้สอดคล้องกับโปรเจกต์ที่เน้น Frontend และใช้ HTML/CSS/JavaScript เป็นหลัก

#### **Suggested Tech Stack**
- GitHub แนะนำให้ใช้ **Webpack** และ **Gulp**
- **คำแนะนำ**:
  - หากต้องการใช้ Webpack เพื่อจัดการโมดูลและบีบอัดไฟล์ สามารถเพิ่ม Webpack ได้โดยติดตั้ง:
    ```bash
    npm install --save-dev webpack webpack-cli
