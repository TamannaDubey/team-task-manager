import Task from "../models/Task.js";

// Get Tasks
export const getTasks = async (req, res) => {
  try {
    let tasks;
    if (req.user.role === "Admin") {
      // Admin → सभी tasks देख सकता है
      tasks = await Task.find().populate("project", "title").populate("assignedTo", "name");
    } else {
      // Member → सिर्फ अपने assigned tasks
      tasks = await Task.find({ assignedTo: req.user._id })
        .populate("project", "title")
        .populate("assignedTo", "name");
    }
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create Task (Admin only)
export const createTask = async (req, res) => {
  try {
    const { title, dueDate, assignedTo, projectId } = req.body;
    if (!title || !dueDate || !assignedTo || !projectId) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const task = new Task({
      title,
      dueDate,
      assignedTo,
      project: projectId,
      status: "Pending",
    });

    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Toggle Task Status
export const toggleTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    task.status = task.status === "Pending" ? "Completed" : "Pending";
    await task.save();

    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
