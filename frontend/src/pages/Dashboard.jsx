import React, { useState, useEffect } from "react";
import API from "../services/api.js";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [members, setMembers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const role = localStorage.getItem("role");

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      alert(err.response?.data?.error || "Error fetching tasks");
    }
  };

  // Fetch members (Admin only)
  const fetchMembers = async () => {
    try {
      const res = await API.get("/users");
      setMembers(res.data);
    } catch (err) {
      console.error("Error fetching members:", err);
    }
  };

  // Fetch projects (Admin only)
  const fetchProjects = async () => {
    try {
      const res = await API.get("/projects");
      setProjects(res.data);
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };

  // Create task (Admin only)
  const createTask = async () => {
    if (!title || !dueDate || !assignedTo || !selectedProjectId) {
      alert("Please fill all fields");
      return;
    }
    try {
      await API.post("/tasks", {
        title,
        dueDate,
        assignedTo,
        projectId: selectedProjectId,
      });
      setTitle("");
      setDueDate("");
      setAssignedTo("");
      setSelectedProjectId("");
      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.error || "Error creating task");
    }
  };

  // Toggle task status (Admin + Member)
  const toggleTaskStatus = async (taskId) => {
    try {
      await API.put(`/tasks/${taskId}/toggle`);
      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.error || "Error updating task status");
    }
  };

  // Detect overdue tasks
  const isOverdue = (date) => {
    if (!date) return false;
    const today = new Date();
    const taskDate = new Date(date);
    return taskDate < today;
  };

  useEffect(() => {
    fetchTasks();
    fetchMembers();
    fetchProjects();
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <p className="mb-4 text-gray-600">
        {role === "Admin"
          ? "Admin View: Assign tasks to members."
          : "Member View: Your assigned tasks."}
      </p>

      {role === "Admin" && (
        <div className="flex flex-wrap gap-4 mb-6">
          <input
            type="text"
            placeholder="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 rounded"
          />
          <select
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">Select Member</option>
            {members.map((m) => (
              <option key={m._id} value={m._id}>
                {m.name}
              </option>
            ))}
          </select>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">Select Project</option>
            {projects.map((p) => (
              <option key={p._id} value={p._id}>
                {p.title}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="border p-2 rounded"
          />
          <button
            onClick={createTask}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add Task
          </button>
        </div>
      )}

      <div className="grid grid-cols-3 gap-6">
        {tasks.map((task) => (
          <div
            key={task._id}
            className={`p-4 rounded shadow flex flex-col items-center justify-between ${
              task.status === "Completed"
                ? "bg-green-200 border border-green-500"
                : isOverdue(task.dueDate)
                ? "bg-red-200 border border-red-500"
                : "bg-yellow-100 border border-yellow-400"
            }`}
          >
            <h2 className="text-xl font-semibold">{task.title}</h2>
            <p>
              Due:{" "}
              {task.dueDate
                ? new Date(task.dueDate).toLocaleDateString("en-IN")
                : "Invalid Date"}
            </p>
            <p>Status: {task.status}</p>

            <button
              onClick={() => toggleTaskStatus(task._id)}
              className={`mt-2 px-3 py-1 rounded ${
                task.status === "Completed"
                  ? "bg-gray-700 text-white"
                  : "bg-green-600 text-white"
              }`}
            >
              {task.status === "Completed" ? "Undo" : "Mark Done"}
            </button>

            {task.status === "Completed" ? (
              <span className="text-green-700 text-2xl font-bold mt-2">✔</span>
            ) : isOverdue(task.dueDate) ? (
              <span className="text-red-700 text-2xl font-bold mt-2">⚠</span>
            ) : (
              <span className="text-yellow-700 text-2xl font-bold mt-2">⏳</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
