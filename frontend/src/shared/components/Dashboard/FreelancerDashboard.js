import React from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";

const FreelancerDashboard = () => {
  return (
    <div className="jobtype">
      <Link to="/categories/Front-end">
        <span id="frontendbutton">Front-end</span>
      </Link>
      <Link to="/categories/Back-end">
        <span id="backendbutton">Back-end</span>
      </Link>
      <Link to="/categories/Network">
        <span id="networkbutton">Network</span>
      </Link>
      <Link to="/categories/Database">
        <span id="dbbutton">Database</span>
      </Link>
      <Link to="/categories/UXnUI">
        <span id="uibutton">UX & UI</span>
      </Link>
      <Link to="/categories/Other">
        <span id="otherbutton">Other</span>
      </Link>
    </div>
  );
};

export default FreelancerDashboard;
