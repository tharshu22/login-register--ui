const express = require("express");

const Task = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// =========================
// GET USER TASKS
// =========================

router.get("/", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({
      userId: req.userId,
    }).sort({
      createdAt: -1,
    });

    res.json(tasks);
  } catch (error) {
    console.log("Get Tasks Error:", error.message);

    res.status(500).json({
      message: "Failed to get tasks.",
    });
  }
});

// =========================
// ADD TASK
// =========================

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Task title is required.",
      });
    }

    const task = await Task.create({
      userId: req.userId,
      title: title.trim(),
      description: description ? description.trim() : "",
      dueDate: dueDate ? new Date(dueDate) : null,
    });

    res.status(201).json({
      message: "Task added successfully.",
      task,
    });
  } catch (error) {
    console.log("Add Task Error:", error.message);

    res.status(500).json({
      message: "Failed to add task.",
    });
  }
});

// =========================
// COMPLETE / UNDO
// =========================

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found.",
      });
    }

    task.completed = !task.completed;

    await task.save();

    res.json({
      message: "Task updated successfully.",
      task,
    });
  } catch (error) {
    console.log("Update Task Error:", error.message);

    res.status(500).json({
      message: "Failed to update task.",
    });
  }
});

// =========================
// DELETE
// =========================

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found.",
      });
    }

    res.json({
      message: "Task deleted successfully.",
    });
  } catch (error) {
    console.log("Delete Task Error:", error.message);

    res.status(500).json({
      message: "Failed to delete task.",
    });
  }
});

module.exports = router;