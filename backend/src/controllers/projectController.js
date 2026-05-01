import Project from "../models/Project.js";
import User from "../models/User.js";

// Create Project (Admin only)
export const createProject = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: "Title is required" });

    const project = new Project({ title, members: [req.user._id] });
    await project.save();

    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all Projects (Admin only)
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate("members", "name email role");
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add Member to Project (Admin only)
export const addMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { memberEmail } = req.body;

    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ error: "Project not found" });

    const member = await User.findOne({ email: memberEmail });
    if (!member) return res.status(404).json({ error: "User not found" });

    if (project.members.includes(member._id)) {
      return res.status(400).json({ error: "User already a member" });
    }

    project.members.push(member._id);
    await project.save();

    res.json({ message: "Member added successfully", project });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
