const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const taskController = require("../controllers/taskController")

// GET all tasks
router.get("/", taskController.getAll);

// GET a single task
router.get("/:id", taskController.getTask);

// POST Create a task
router.post("/", taskController.createTask);

// PATCH update a task can choose what to be updated
router.patch("/:id", taskController.updateTaskInfo);

// DELETE a task
router.delete("/:id", taskController.delete)

module.exports = router;
