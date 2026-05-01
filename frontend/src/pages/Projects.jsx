import React, { useState, useEffect } from "react";
import API from "../services/api.js";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [memberEmail, setMemberEmail] = useState("");

  const fetchProjects = async () => {
    try {
      const res = await API.get("/projects");
      setProjects(res.data);
    } catch (err) {
      alert(err.response?.data?.error || "Error fetching projects");
    }
  };

  const createProject = async () => {
    try {
      await API.post("/projects", { title, description });
      setTitle("");
      setDescription("");
      fetchProjects();
    } catch (err) {
      alert(err.response?.data?.error || "Error creating project");
    }
  };

  const addMember = async (projectId) => {
    try {
      await API.put(`/projects/${projectId}/add-member`, { memberEmail });
      setMemberEmail("");
      fetchProjects();
    } catch (err) {
      alert(err.response?.data?.error || "Error adding member");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div>
      <h2>Projects</h2>
      <input
        type="text"
        placeholder="Project Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button onClick={createProject}>Create Project</button>

      <ul>
        {projects.map((p) => (
          <li key={p._id}>
            <strong>{p.title}</strong> - {p.description}
            <div>
              <input
                type="text"
                placeholder="Member Email"
                value={memberEmail}
                onChange={(e) => setMemberEmail(e.target.value)}
              />
              <button onClick={() => addMember(p._id)}>Add Member</button>
            </div>
            <p>Members: {p.members?.map(m => m.name).join(", ")}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Projects;
