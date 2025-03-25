require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./firebase");
const { collection, getDocs, doc, updateDoc } = require("firebase/firestore");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Root endpoint
app.get("/", (req, res) => {
  console.log("Serving index.html");
  res.sendFile(path.join(__dirname, "index.html"));
});

// Fetch data endpoint
app.get("/data", async (req, res) => {
  try {
    console.log("Fetching data from Firestore...");

    // Fetch tasks
    console.log("Fetching tasks...");
    const tasksData = { list: [], forwarded: [] };
    const tasksSnapshot = await getDocs(collection(db, "tasks"));
    console.log("Tasks snapshot:", tasksSnapshot.size, "documents found");
    tasksSnapshot.forEach((doc) => {
      const task = { id: doc.id, ...doc.data() };
      console.log("Task:", task.id);
      if (task.id.startsWith("TSK")) {
        tasksData.list.push(task);
      } else if (task.id.startsWith("FWD")) {
        tasksData.forwarded.push({
          id: task.id,
          name: task.name,
          address: task.address,
          status: task.status,
          distance: task.distance,
          branch: task.branch,
          teamName: task.teamName,
        });
      }
    });

    // Fetch income
    console.log("Fetching income...");
    const incomeData = { list: [] };
    const incomeSnapshot = await getDocs(collection(db, "income"));
    console.log("Income snapshot:", incomeSnapshot.size, "documents found");
    incomeSnapshot.forEach((doc) => {
      incomeData.list.push({ id: doc.id, ...doc.data() });
    });

    // Fetch performance
    console.log("Fetching performance...");
    const perfData = {};
    const perfSnapshot = await getDocs(collection(db, "performance"));
    console.log("Performance snapshot:", perfSnapshot.size, "documents found");
    perfSnapshot.forEach((doc) => {
      const perf = doc.data();
      perfData[doc.id] = perf;
    });

    // Send response
    res
      .status(200)
      .json({ tasks: tasksData, income: incomeData, performance: perfData });
  } catch (error) {
    console.error("Error fetching data:", error.message, error.stack);
    res.status(500).json({
      error: "Failed to fetch data from Firestore",
      details: error.message,
    });
  }
});

// Save task endpoint
app.post("/saveTask", async (req, res) => {
  const task = req.body;
  if (!task.id) {
    console.error("Task ID is missing in request body");
    return res.status(400).json({ error: "Task ID is required" });
  }
  try {
    console.log(`Saving task ${task.id} to Firestore...`);
    const taskRef = doc(db, "tasks", task.id);
    await updateDoc(taskRef, task);
    console.log(`Task ${task.id} saved successfully`);
    res.status(200).json({ message: "Task saved successfully" });
  } catch (error) {
    console.error(`Error saving task ${task.id}:`, error.message, error.stack);
    res.status(500).json({
      error: "Failed to save task to Firestore",
      details: error.message,
    });
  }
});

// Start server
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});