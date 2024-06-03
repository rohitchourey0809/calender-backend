const express = require("express");
const moment = require("moment");
const Task = require("../models/task");

const router = express.Router();

// GET tasks for a specific week
router.get("/", async (req, res) => {
  const startDate = req.query.start_date;
  const endDate = moment(startDate).endOf("week").toDate();

  try {
    const tasks = await Task.find({
      date: {
        $gte: new Date(startDate),
        $lte: endDate,
      },
    });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADD a new task
router.post("/", async (req, res) => {
  const task = new Task({
    title: req.body.title,
    date: req.body.date,
  });

  try {
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// TOGGLE task completion
router.patch("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    task.completed = !task.completed;
    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a task
router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    await task.deleteOne();;
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
