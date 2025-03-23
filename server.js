require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./firebase');
const { collection, getDocs, doc, updateDoc } = require('firebase/firestore');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    console.log('Serving index.html');
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/data', async (req, res) => {
    try {
        console.log('Fetching data from Firestore...');

        // ดึงข้อมูลจาก tasks
        console.log('Fetching tasks...');
        const tasksData = { list: [], forwarded: [] };
        const tasksSnapshot = await getDocs(collection(db, 'tasks'));
        console.log('Tasks snapshot:', tasksSnapshot.size, 'documents found');
        tasksSnapshot.forEach(doc => {
            const task = { id: doc.id, ...doc.data() };
            console.log('Task:', task.id);
            if (task.id.startsWith('TSK')) {
                tasksData.list.push(task);
            } else if (task.id.startsWith('FWD')) {
                tasksData.forwarded.push({
                    id: task.id,
                    name: task.name,
                    address: task.address,
                    status: task.status,
                    distance: task.distance,
                    branch: task.branch,
                    teamName: task.teamName
                });
            }
        });

        // ดึงข้อมูลจาก income
        console.log('Fetching income...');
        const incomeData = { list: [] };
        const incomeSnapshot = await getDocs(collection(db, 'income'));
        console.log('Income snapshot:', incomeSnapshot.size, 'documents found');
        incomeSnapshot.forEach(doc => {
            incomeData.list.push({ id: doc.id, ...doc.data() });
        });

        // ดึงข้อมูลจาก performance
        console.log('Fetching performance...');
        const perfData = {};
        const perfSnapshot = await getDocs(collection(db, 'performance'));
        console.log('Performance snapshot:', perfSnapshot.size, 'documents found');
        perfSnapshot.forEach(doc => {
            const perf = doc.data();
            perfData[doc.id] = perf;
        });

        res.json({ tasks: tasksData, income: incomeData, performance: perfData });
    } catch (error) {
        console.error('Error fetching data:', error.message, error.stack);
        res.status(500).json({ error: 'Failed to fetch data', details: error.message });
    }
});

app.post('/saveTask', async (req, res) => {
    const task = req.body;
    try {
        console.log('Saving task to Firestore...');
        const taskRef = doc(db, 'tasks', task.id);
        await updateDoc(taskRef, task);
        console.log('Task saved successfully');
        res.status(200).json({ message: 'Task saved successfully' });
    } catch (error) {
        console.error('Error saving task:', error.message, error.stack);
        res.status(500).json({ error: 'Failed to save task', details: error.message });
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
});