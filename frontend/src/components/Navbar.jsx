import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const role = localStorage.getItem("role");

  return (
    <nav>
      <Link to="/login">Login</Link> | 
      <Link to="/signup">Signup</Link> | 
      <Link to="/dashboard">Dashboard</Link>
      {role === "Admin" && <> | <Link to="/projects">Projects</Link></>}
    </nav>
  );
}

export default Navbar;
