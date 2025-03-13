const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

// Get all tasks
router.get("/", async (req, res) => {
	try {
		const tasks = await Task.find().sort({ createdAt: -1 });
		res.json(tasks);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// Get a single task
router.get("/:id", async (req, res) => {
	try {
		const task = await Task.findById(req.params.id);
		if (!task) return res.status(404).json({ message: "Task not found" });
		res.json(task);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// Create a task
router.post("/", async (req, res) => {
	const task = new Task({
		title: req.body.title,
        description : req.body.description,
	});

	try {
		const newTask = await task.save();
		res.status(20).json(newTask);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
});

// Update a task can choose what to be updated
router.patch("/:id", async (req, res) => {
	try {
        //can use "model" as repo also
		const task = await Task.findById(req.params.id);
		if (!task) return res.status(404).json({ message: "Task not found" });

		if (req.body.title != null) {
			task.title = req.body.title;
		}

		if (req.body.description != null) {
			task.description = req.body.description;
		}

		if (req.body.completed != null) {
			task.completed = req.body.completed;
		}

		const updatedTask = await task.save();
		res.json(updatedTask);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
});


// Delete a task
router.delete("/:id", async (req, res) => {
	try {
		const task = await Task.findById(req.params.id);
		if (!task) return res.status(404).json({ message: "Task not found" });

		await Task.findByIdAndDelete(req.params.id);
		res.json({ message: "Task deleted" });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

module.exports = router;
