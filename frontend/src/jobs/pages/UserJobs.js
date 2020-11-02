import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import JobList from '../components/JobList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';

const UserJobs = () => {
  const [loadedJobs, setLoadedJobs] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const userId = useParams().userId;

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/jobs/user/${userId}`
        );
        setLoadedJobs(responseData.jobs);
      } catch (err) {}
    };
    fetchJobs();
  }, [sendRequest, userId]);

  const jobDeletedHandler = deletedJobId => {
    setLoadedJobs(prevJobs =>
      prevJobs.filter(job => job.id !== deletedJobId)
    );
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedJobs && (
        <JobList items={loadedJobs} onDeleteJob={jobDeletedHandler} />
      )}
    </React.Fragment>
  );
};

export default UserJobs;
