const express = require('express');
const admin = require('firebase-admin');
const app = express();

const serviceAccount = require('./credentials.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.post('/saveTask', async (req, res) => {
    try {
        const task = req.body;
        console.log('task', task.id);
        await db.collection('tasks').doc(task.id).set(task);
        res.status(200).json({ message: 'Task saved successfully' });
    } catch (error) {
        console.error(`Error saving task ${req.body.id}:`, error.message, error);
        res.status(500).json({
            error: 'Failed to save task to Firestore',
            details: error.message,
        });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});