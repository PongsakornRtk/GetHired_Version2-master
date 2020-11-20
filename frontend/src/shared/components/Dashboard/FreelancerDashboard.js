import React from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";

const FreelancerDashboard = () => {
  return (
    <div className="jobtype">
      <Link to="">
        <span id="frontendbutton">Front-end</span>
      </Link>
      <Link to="">
        <span id="backendbutton">Back-end</span>
      </Link>
      <Link to="">
        <span id="networkbutton">Network</span>
      </Link>
      <Link to="">
        <span id="dbbutton">Database</span>
      </Link>
      <Link to="">
        <span id="uibutton">UX & UI</span>
      </Link>
      <Link to="">
        <span id="otherbutton">Other</span>
      </Link>
    </div>
  );
};

export default FreelancerDashboard;
