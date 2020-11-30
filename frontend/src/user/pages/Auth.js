import React, { useState, useContext } from "react";

import Card from "../../shared/components/UIElements/Card";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
// import ResumeUpload from "../../shared/components/FormElements/ResumeUpload";
// import PDFUpload from "../../shared/components/FormElements/PDFUpload";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
  VALIDATOR_TEL,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import "./Auth.css";
import ghLogo from "../../pictures/Logo/Get Hired Dark logo.png";

const Auth = () => {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isAddressable, setIsAddressable] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },

      password: {
        value: "",
        isValid: false,
      },
    },
    true
  );
  const checkValid = (formState) => {
    if (!isLoginMode) {
      if (formState.inputs.name) {
        if (
          formState.inputs.name.value &&
          formState.inputs.image.value &&
          formState.inputs.email.value &&
          formState.inputs.password.value &&
          formState.inputs.telNo.value &&
          formState.inputs.website &&
          formState.inputs.companyAddress &&
          // formState.inputs.resume &&
          formState.inputs.dob &&
          formState.inputs.employer !== ""
        ) {
          return false;
        } else {
          return true;
        }
      } else {
        return false;
      }
    } else {
      if (formState.inputs.email.value && formState.inputs.password.value) {
        return false;
      } else {
        return true;
      }
    }
  };
  const switchModeHandler = () => {
    if (!isLoginMode) {
      console.log("Switch to log in");
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          image: undefined,
        },
        true
      );
    } else {
      console.log("Switch to register");
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
          image: {
            value: null,
            isValid: false,
          },
          companyAddress: {
            value: "",
            isValid: false,
          },
          telNo: {
            value: "",
            isValid: false,
          },
          website: {
            value: "",
            isValid: false,
          },
          dob: {
            value: "",
            isValid: false,
          },
          // resume: {
          //   value: "",
          //   isValid: false,
          // },
        },
        false
      );
    } 
  };

  const authSubmitHandler = async (event) => {
    event.preventDefault();

    if (isLoginMode) {
      console.log("login");
      try {
        const responseData = await sendRequest(
          "https://gethired-api.herokuapp.com/api/users/login",
          "POST",
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        auth.login(
          responseData.userId,
          responseData.token,
          responseData.employer
        );
      } catch (err) {}
    } else {
      try {
        const formData = new FormData();
        formData.append("email", formState.inputs.email.value);
        formData.append("name", formState.inputs.name.value);
        formData.append("password", formState.inputs.password.value);
        formData.append("image", formState.inputs.image.value);
        formData.append("website", formState.inputs.website.value);
        // formData.append("resume", formState.inputs.resume.value);
        formData.append("dob", formState.inputs.dob.value);
        formData.append(
          "companyAddress",
          formState.inputs.companyAddress.value
        );
        formData.append("telNo", formState.inputs.telNo.value);
        formData.append("employer", isAddressable);

        const responseData = await sendRequest(
          "https://gethired-api.herokuapp.com/api/users/signup",
          "POST",
          formData
        );
        console.log(responseData);

        auth.login(
          responseData.userId,
          responseData.token,
          responseData.employer
        );
      } catch (err) {
        console.log(err);
      }
    }
  };

  const switchAddressHandler = () => {
    if (isAddressable) {
      console.log("Switch to freelance");
      setFormData(
        {
          ...formState.inputs,
        },
        true
      );
    } else {
      console.log("Switch to employer");
      console.log(formState.inputs);
      setFormData(
        {
          ...formState.inputs,
          companyAddress: {
            value: "",
            isValid: false,
          },
          ...formState.inputs,
          website: {
            value: "",
            isValid: false,
          },
        },
        true
      );
    }
    setIsAddressable((prevMode) => !prevMode);
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <img src={ghLogo} height="50px" alt="ghLogo" />
        <h2>Login Required</h2>
        <hr />
        <form onSubmit={authSubmitHandler}>
          {!isLoginMode && (
            <Button type="button" inverse onClick={switchAddressHandler}>
              IF YOU{" "}
              {isAddressable ? <u>A FREELANCER ? </u> : <u>AN EMPLOYER ?</u>}{" "}
              <br />
              Please Click This Button
            </Button>
          )}
          {!isLoginMode && (
            <Input
              element="input"
              id="name"
              type="text"
              label="Your Name"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a name."
              onInput={inputHandler}
            />
          )}
          {!isLoginMode && (
            <ImageUpload
              center
              id="image"
              onInput={inputHandler}
              errorText="Please provide a profile picture."
            />
          )}
          <Input
            element="input"
            id="email"
            type="email"
            label="E-Mail"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email address."
            onInput={inputHandler}
          />
          <Input
            element="input"
            id="password"
            type="password"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText="Please enter a valid password, at least 6 characters."
            onInput={inputHandler}
          />
          {!isLoginMode && (
            <Input
              element="input"
              id="telNo"
              type="text"
              label="Your Telephone Number (only number)"
              validators={[VALIDATOR_TEL(9)]}
              errorText="Please enter a correct telephone number."
              onInput={inputHandler}
            />
          )}

          {!isLoginMode && !isAddressable && (
            <Input
              element="input"
              id="dob"
              type="date"
              label="Your Date of birth"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a date of birth"
              onInput={inputHandler}
            />
          )}

          {/* {!isLoginMode && !isAddressable && (
           <ResumeUpload
           center
           id="resume"
           onInput={inputHandler}
           errorText="Please provide an resume."
         />
          )} */}

          {isAddressable && !isLoginMode && (
            <Input
              element="input"
              id="companyAddress"
              type="text"
              label="Company Address"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter your company address"
              onInput={inputHandler}
            />
          )}

          {isAddressable && !isLoginMode && (
            <Input
              element="input"
              id="website"
              type="text"
              label="Company Website"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a website"
              onInput={inputHandler}
            />
          )}

          <Button type="submit" disabled={checkValid(formState)}>
            {isLoginMode ? "LOGIN" : "REGISTER"}
          </Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
          SWITCH TO {isLoginMode ? "REGISTER" : "LOGIN"}
        </Button>
      </Card>
    </React.Fragment>
  );
};

export default Auth;
