import React, { useEffect, useState, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import './JobsForm.css';

const UpdateJob = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedJob, setLoadedJob] = useState();
  const jobId = useParams().jobId;
  const history = useHistory();

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: '',
        isValid: false
      },
      description: {
        value: '',
        isValid: false
      },
      wage: {
        value: '',
        isValid: false
      },
      expDate: {
        value: '',
        isValid: false
      },
      categories: {
        value: '',
        isValid: false
      }
    },
    false
  );

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/jobs/${jobId}`
        );
        setLoadedJob(responseData.job);
        setFormData(
          {
            title: {
              value: responseData.job.title,
              isValid: true
            },
            description: {
              value: responseData.job.description,
              isValid: true
            },
            wage: {
              value: responseData.job.wage,
              isValid: true
            },
            expDate: {
              value: responseData.job.expDate,
              isValid: true
            },
            categories: {
              value: responseData.job.categories,
              isValid: true
            },
          },
          true
        );
      } catch (err) {}
    };
    fetchJob();
  }, [sendRequest, jobId, setFormData]);

  const jobUpdateSubmitHandler = async event => {
    event.preventDefault();
    try {
      await sendRequest(
        `http://localhost:5000/api/jobs/${jobId}`,
        'PATCH',
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
          wage: formState.inputs.wage.value,
          expDate: formState.inputs.expDate.value,
          categories: formState.inputs.categories.value,
        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token
        }
      );
      history.push('/' + auth.userId + '/jobs');
    } catch (err) {}
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedJob && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find job!</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedJob && (
        <form className="job-form" onSubmit={jobUpdateSubmitHandler}>
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title."
            onInput={inputHandler}
            initialValue={loadedJob.title}
            initialValid={true}
          />
          <Input
            id="description"
            element="textarea"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description (min. 5 characters)."
            onInput={inputHandler}
            initialValue={loadedJob.description}
            initialValid={true}
          />
          <Input
          id="wage"
          element="input"
          type="text"
          label="Wage"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid wage."
          onInput={inputHandler}
          initialValue={loadedJob.wage}
          initialValid={true}
        />
        <Input
          id="expDate"
          element="input"
          type="date"
          label="Expiration Date"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid expiration date."
          onInput={inputHandler}
          initialValue={loadedJob.expDate}
          initialValid={true}
        />
        <Input
          id="categories"
          element="input"
          type="text"
          label="Categories"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid categories."
          onInput={inputHandler}
          initialValue={loadedJob.categories}
          initialValid={true}
        />
          <Button type="submit" disabled={!formState.isValid}>
            UPDATE JOB
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdateJob;
