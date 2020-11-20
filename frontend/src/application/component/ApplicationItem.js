import React, { useState, useContext } from "react";

import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
import Avatar from '../../shared/components/UIElements/Avatar';
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import "./ApplicationItem.css";

const ApplicationItem = (props) => {
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
        footerClass="app-item__modal-actions"
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
          Do you want to proceed and apply this freelancer? Please note that it can't
          be undone thereafter.
        </p>
      </Modal>
      <li className="app-list">
        <Card className="app-item__content">
          {isLoading && <LoadingSpinner asOverlay />}
          <div className="app-item__image">
            <Avatar image={`http://localhost:5000/${props.image}`} alt={props.name} />
          </div>
          <div className="app-item__info">
            <h2> Name: {props.name}</h2>
            <h2> E-mail: {props.email}</h2>
            <h2> Tel No.:{props.telNo}</h2>
          </div>

          <div className="app-item__actions">
            {auth.userId && (
              <Button onClick={showApplyWarningHandler}>APPLY</Button>
            )}
            {auth.userId && (
              <Button onClick={cancelApplyHandler}>REJECT</Button>
            )}
          </div>

        </Card>
      </li>
    </React.Fragment>
  );
};

export default ApplicationItem;
