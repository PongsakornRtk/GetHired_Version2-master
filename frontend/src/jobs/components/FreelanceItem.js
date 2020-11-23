import React, { useState, useContext } from "react";
import Moment from "react-moment";

import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import "./JobItem.css";

const FreelanceItem = (props) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const showApplyWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelApplyHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmApplyHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        `http://localhost:5000/api/users/apply/${props.id}`,
        "POST",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showConfirmModal}
        onCancel={cancelApplyHandler}
        header="Are you sure?"
        footerClass="job-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelApplyHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmApplyHandler}>
              APPLY
            </Button>
          </React.Fragment>
        }
      >
        <p>
          Do you want to proceed and apply this job? Please note that it can't
          be undone thereafter.
        </p>
      </Modal>
      <li className="job-list">
        <Card className="job-item__content">
          {isLoading && <LoadingSpinner asOverlay />}
          <div className="job-item__image">
            <img
              src={`http://localhost:5000/${props.image}`}
              alt={props.title}
            />
          </div>
          <div className="job-item__info">
            <h1>{props.title}</h1>
            <h3> Categories:&nbsp;&nbsp;{props.categories}</h3>
            <h3> Company:&nbsp;&nbsp;&nbsp;&nbsp;{props.companyName}</h3>
            <h3> Job description:</h3>
            <h5> {props.description}</h5>
            <h3>
              Wage:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              {props.wage} ฿
            </h3>
            <h3>
              Expiration Date:{" "}
              <Moment format="D MMM YYYY" withTitle>
                {props.expDate}
              </Moment>
            </h3>
            <h3>Company Address:</h3>
            <h5>{props.companyAddress}</h5>
          </div>
<<<<<<< HEAD
          

=======
>>>>>>> eeb857a9ba7908f5c33fc6d41c2c735502c3035b
          <div className="job-item__actions">
            {auth.userId && !auth.employer && (
              <Button onClick={showApplyWarningHandler}>APPLY</Button>
            )}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default FreelanceItem;
