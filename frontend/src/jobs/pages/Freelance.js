import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import FreelanceList from "../components/FreelanceList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

const Freelance = () => {
  const [loadedJobs, setLoadedJobs] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [filterList, setFilterList] = useState();
  const jobId = useParams().jobId;

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/jobs`
        );
        setLoadedJobs(responseData.jobs);
      } catch (err) {}
    };
    fetchJobs();
  }, [sendRequest, jobId]);

  const filter = (categories) => {
    if (categories === "All") {
      setLoadedJobs([]);
    }
    const jobList = loadedJobs;
    filterList = jobList.filter((item) => item.categories === categories);
    setLoadedJobs(filterList);
  };

  const jobApplyHandler = (applyJobId) => {
    setLoadedJobs((prevJobs) =>
      prevJobs.filter((job) => job.id !== applyJobId)
    );
  };

  return (
    <React.Fragment>
      <div>
        <ErrorModal error={error} onClear={clearError} />
        {isLoading && (
          <div className="center">
            <LoadingSpinner />
          </div>
        )}
        {!isLoading && loadedJobs && (
          <FreelanceList items={loadedJobs} onApplyJob={jobApplyHandler} />
        )}
      </div>
    </React.Fragment>
  );
};

export default Freelance;
