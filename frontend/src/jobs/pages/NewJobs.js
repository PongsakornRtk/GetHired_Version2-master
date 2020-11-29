import React, { useContext } from "react";
import { useHistory } from "react-router-dom";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import "./JobsForm.css";

const NewJob = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      image: {
        value: null,
        isValid: false,
      },
      companyName: {
        value: null,
        isValid: false,
      },
      wage: {
        value: null,
        isValid: false,
      },
      expDate: {
        value: null,
        isValid: false,
      },
      categories: {
        value: null,
        isValid: false,
      },
      companyAddress: {
        value: null,
        isValid: false,
      },
    },
    false
  );

  const history = useHistory();

  const jobSubmitHandler = async (event) => {
    event.preventDefault();
    //เอา id ของ checkbox มารวมกันในตัวแปรเดียวกันก่อน แล้วไปแทนค่า categories
    try {
      const formData = new FormData();
      formState.inputs.formData.append(
        "companyName",
        formState.inputs.companyName.value
      );
      formData.append("companyAddress", formState.inputs.companyAddress.value);
      formData.append("categories", formState.inputs.categories.value);
      formData.append("title", formState.inputs.title.value);
      formData.append("description", formState.inputs.description.value);
      formData.append("image", formState.inputs.image.value);
      formData.append("wage", formState.inputs.wage.value);
      formData.append("expDate", formState.inputs.expDate.value);

      await sendRequest("http://localhost:5000/api/jobs", "POST", formData, {
        Authorization: "Bearer " + auth.token,
      });
      history.push("/");
    } catch (err) {}
  };

  const mystyle = {
    fontWeight: "bold",
    marginBottom: "0.5rem",
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className="job-form" onSubmit={jobSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title."
          onInput={inputHandler}
        />
        <Input
          id="description"
          element="textarea"
          type="textarea"
          label="Description"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid description (at least 5 characters)."
          onInput={inputHandler}
        />
        <div style={mystyle}>Categories</div>
        <div>
          <input
            type="checkbox"
            id="Frontend"
            name="categories"
            value="frontend"
          />
          <label>Front-end</label>
          <br />
          <input
            type="checkbox"
            id="Backend"
            name="categories"
            value="backend"
          />
          <label for="backend">Back-end</label>
          <br />
          <input
            type="checkbox"
            id="Network"
            name="categories"
            value="network"
          />
          <label for="network">Network</label>
          <br />
          <input
            type="checkbox"
            id="Database"
            name="categories"
            value="database"
          />
          <label for="database">Database</label>
          <br />
          <input type="checkbox" id="UXnUI" name="categories" value="uxui" />
          <label for="uxui">UX & UI</label>
          <br />
          <input type="checkbox" id="Other" name="categories" value="other" />
          <label for="other">Other</label>
        </div>
        <ImageUpload
          id="image"
          onInput={inputHandler}
          errorText="Please provide an image."
        />
        <Input
          id="wage"
          element="input"
          type="text"
          label="Wage"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid wage."
          onInput={inputHandler}
        />
        <Input
          id="expDate"
          element="input"
          type="date"
          label="Expiration Date"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid expiration date."
          onInput={inputHandler}
        />
        {/* <Input
          id="categories"
          element="input"
          type="text"
          label="Categories"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid categories."
          onInput={inputHandler}
        /> */}
        <Input
          id="companyName"
          element="input"
          type="text"
          label="Company Name"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid company name."
          onInput={inputHandler}
        />
        <Input
          id="companyAddress"
          element="input"
          type="text"
          label="Company Address"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid company address."
          onInput={inputHandler}
        />
        <Button type="submit" disabled={!formState.isValid}>
          ADD JOB
        </Button>
      </form>
    </React.Fragment>
  );
};

export default NewJob;
