import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import FreelanceList from "../components/FreelanceList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import "../components/Dashboard.css";
const Freelance = () => {
  const [loadedJobs, setLoadedJobs] = useState();
  const [filterList, setFilterList] = useState([]);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const jobId = useParams().jobId;

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/jobs`
        );
        setLoadedJobs(responseData.jobs);
        setFilterList(responseData.jobs);
      } catch (err) {}
    };
    fetchJobs();
  }, [sendRequest, jobId]);

  const jobApplyHandler = (applyJobId) => {
    setLoadedJobs((prevJobs) =>
      prevJobs.filter((job) => job.id !== applyJobId)
    );
  };

  function filterByCategory(category) {
    const jobList = loadedJobs;
    if (category === "All") {
      setFilterList(loadedJobs);
    } else {
      let filterSuc = [];
      for (let i = 0; i < jobList.length; i++) {
        for (let j = 0; j < jobList[i].categories.length; j++) {
          if (category === jobList[i].categories[j]) {
            const jobFilted = jobList[i];
            filterSuc.push(jobFilted);
          }
          setFilterList(filterSuc);
        }
      }
    }
  }
  return (
    <React.Fragment>
      <div>
        {/* <FreelancerDashboard/> */}
        <div className="jobtype">
          <Link to="" onClick={() => filterByCategory("Frontend")}>
            <span id="frontendbutton">Front-end</span>
          </Link>
          <Link to="" onClick={() => filterByCategory("Backend")}>
            <span id="backendbutton">Back-end</span>
          </Link>
          <Link to="" onClick={() => filterByCategory("Network")}>
            <span id="networkbutton">Network</span>
          </Link>
          <Link to="" onClick={() => filterByCategory("Database")}>
            <span id="dbbutton">Database</span>
          </Link>
          <Link to="" onClick={() => filterByCategory("UX&UI")}>
            <span id="uibutton">UX & UI</span>
          </Link>
          <Link to="" onClick={() => filterByCategory("Other")}>
            <span id="otherbutton">Other</span>
          </Link>
          <Link to="" onClick={() => filterByCategory("All")}>
            <span id="otherbutton">All Jobs</span>
          </Link>
        </div>
        <ErrorModal error={error} onClear={clearError} />
        {isLoading && (
          <div className="center">
            <LoadingSpinner />
          </div>
        )}
        {!isLoading && loadedJobs && (
          <FreelanceList items={filterList} onApplyJob={jobApplyHandler} />
        )}
      </div>
    </React.Fragment>
  );
};

export default Freelance;
