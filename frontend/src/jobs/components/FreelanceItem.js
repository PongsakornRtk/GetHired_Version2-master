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
            <div className="container">
              <div className="row">
                <div className="col">
                  <h1>{props.title}</h1>
                </div>
              </div>
              <br />
              <div className="row">
                <div className="col col-sm-4">
                  <h3>Categories: </h3>
                </div>

                <div className="col col-sm-8">
                  <span className="row">
                    {props.categories.map((value, index) => {
                      return (
                        <h5 key={index} className="col-sm-4">
                          {value}
                        </h5>
                      );
                    })}
                  </span>
                </div>
              </div>
              <br />
              <div className="row">
                <div className="col-8 col-sm-4">
                  <h3>Company: </h3>
                </div>

                <div className="col-8 col-sm-4">
                  <h5>{props.companyName}</h5>
                </div>
              </div>
              <br />
              <h3>Job description: </h3>
              <h5 className="jobDes">
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{props.description}
              </h5>
              <br />
              <div className="row">
                <div className="col">
                  <h3>Wage: </h3>
                </div>

                <div className="col">
                  <h5>{props.wage} ฿</h5>
                </div>
              </div>
              <br />
              <div className="row">
                <div className="col">
                  <h3>Expiration Date: </h3>
                </div>

                <div className="col">
                  <h5>
                    <Moment format="D MMM YYYY">{props.expDate}</Moment>
                  </h5>
                </div>
              </div>
              <br />
              <div className="row">
                <div className="col">
                  <h3>Company Address: </h3>
                </div>
              </div>

              <div className="row">
                <div className="col">
                  <h5 className="jobDes">{props.companyAddress}</h5>
                </div>
              </div>
            </div>
          </div>

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
