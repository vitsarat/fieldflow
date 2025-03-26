import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";
import { auth, onAuthStateChanged } from "./auth.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

onAuthStateChanged(auth, (user) => {
    if (!user) {
        console.log("No user logged in, redirecting to index.html");
        window.location.href = "index.html";
    } else {
        console.log("Admin logged in:", user.uid);
        loadWorks();
    }
});

window.uploadWork = async function() {
    const fileInput = document.getElementById("workFile");
    const file = fileInput.files[0];
    const uploadMessage = document.getElementById("upload-message");
    const uploadError = document.getElementById("upload-error");

    if (!file) {
        uploadError.textContent = "กรุณาเลือกไฟล์ก่อนอัพโหลด";
        uploadError.style.display = "block";
        return;
    }

    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".csv")) {
        uploadError.textContent = "กรุณาอัพโหลดไฟล์ .xlsx หรือ .csv เท่านั้น";
        uploadError.style.display = "block";
        return;
    }

    try {
        const storageRef = ref(storage, `works/${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);

        await addDoc(collection(db, "works"), {
            name: file.name,
            url: downloadURL,
            uploadedBy: auth.currentUser.uid,
            uploadedAt: new Date().toISOString()
        });

        uploadMessage.textContent = "อัพโหลดงานสำเร็จ!";
        uploadMessage.style.display = "block";
        uploadError.style.display = "none";
        fileInput.value = "";
    } catch (error) {
        console.error("Upload error:", error);
        uploadError.textContent = "เกิดข้อผิดพลาดในการอัพโหลด: " + error.message;
        uploadError.style.display = "block";
        uploadMessage.style.display = "none";
    }
};

function loadWorks() {
    const workList = document.getElementById("workList");
    const worksQuery = query(collection(db, "works"), orderBy("uploadedAt", "desc"));
    onSnapshot(worksQuery, (snapshot) => {
        workList.innerHTML = "";
        snapshot.forEach((doc) => {
            const work = doc.data();
            const uploadedAt = work.uploadedAt ? new Date(work.uploadedAt).toLocaleString("th-TH") : "N/A";
            const row = `
                <tr>
                    <td>${work.name || "N/A"}</td>
                    <td>${uploadedAt}</td>
                    <td><a href="${work.url || "#"}" target="_blank">ดาวน์โหลด</a></td>
                </tr>
            `;
            workList.innerHTML += row;
        });
    }, (error) => {
        console.error("Error loading works:", error);
    });
}
