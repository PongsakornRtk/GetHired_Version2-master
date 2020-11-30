import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import ApplicationList from "../component/ApplicationList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

const Application = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedUsers, setLoadedUsers] = useState();
  const jobId = useParams().jobId;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          `https://gethired-api.herokuapp.com/api/users/application/${jobId}`
        );
        setLoadedUsers(responseData.usersList);
      } catch (err) {}
    };
    fetchUsers();
  }, [sendRequest, jobId]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedUsers && <ApplicationList items={loadedUsers} />}
    </React.Fragment>
  );
};

export default Application;
