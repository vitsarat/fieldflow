const express = require('express');
const admin = require('firebase-admin');
const path = require('path');
const app = express();

const serviceAccount = require('./credentials.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API to save task
app.post('/saveTask', async (req, res) => {
    try {
        const task = req.body;
        await db.collection('tasks').doc(task.id).set(task);
        res.status(200).json({ message: 'Task saved successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save task', details: error.message });
    }
});

// Serve index.html for root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});