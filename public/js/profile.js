import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { auth, onAuthStateChanged } from "./auth.js";

const firebaseConfig = {
apiKey: "AIzaSyDyOLP6v2mw5CRPMwVwynTU-qAAq8QMrlc",
  authDomain: "fieldflow-b3ee5.firebaseapp.com",
  projectId: "fieldflow-b3ee5",
  storageBucket: "fieldflow-b3ee5.firebasestorage.app",
  messagingSenderId: "384778621124",
  appId: "1:384778621124:web:1a40999850200d49c63991"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function loadProfile() {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const userEmail = user.email;
            console.log('User Email:', userEmail);
            document.getElementById('userEmail').textContent = userEmail;

            const tasksSnapshot = await getDocs(collection(db, 'tasks'));
            console.log('Tasks Snapshot:', tasksSnapshot.docs);
            let completedTasks = 0, totalTasks = 0;

            tasksSnapshot.forEach(doc => {
                const task = doc.data();
                console.log('Task:', task);
                if (task.assignedTo === userEmail) {
                    totalTasks++;
                    if (task.status === 'completed') completedTasks++;
                }
            });

            document.getElementById('completedTasks').textContent = completedTasks;
            document.getElementById('totalTasks').textContent = totalTasks;
            document.getElementById('completionRate').textContent = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;
        } else {
            window.location.href = 'index.html';
        }
    });
}

loadProfile();
