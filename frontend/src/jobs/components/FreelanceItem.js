import React, { useState, useContext } from 'react';

import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import Modal from '../../shared/components/UIElements/Modal';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';
import './JobItem.css';

const FreelanceItem = props => {
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
        'POST',
        null,
        {
          Authorization: 'Bearer ' + auth.token
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
          Do you want to proceed and apply this job? Please note that it
          can't be undone thereafter.
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
            <h2>{props.title}</h2>
            <p>{props.description}</p>
          </div>
          <div className="job-item__actions">
            {auth.userId && !auth.employer &&(
              <Button onClick={showApplyWarningHandler}>APPLY</Button>
            )}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default FreelanceItem;
