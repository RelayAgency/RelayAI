import React, { useRef, useState, useEffect, useContext } from 'react'

import { useStateContext } from '../../contexts/ContextProvider';

import app from './firebase_config.js';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const URL = '/signup'
const url1 = `http://localhost:5000${URL}`;
const url2 = `https://relayai.onrender.com${URL}`;
const URLS = [url1, url2];

const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;



const auth = getAuth(app);

async function onCaptchaVerify(mobile) {
  console.log("captcha: ", mobile)

  window.recaptchaVerifier = await new RecaptchaVerifier(
    'recaptcha-container',
    {
      'size': 'invisible',
      'callback': (response) => {
        // onSignInSubmit(mobile)
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        // ...
        console.log("reCAPTCHA solved, allow signInWithPhoneNumber");
      },
    }, auth);
  onSignInSubmit(mobile)
}

function onSignInSubmit(mobile) {
  console.log("signInSubmit: ", mobile)
  // onCaptchaVerify(mobile);
  const phoneNumber = "+1" + mobile;
  const appVerifier = window.recaptchaVerifier;
  signInWithPhoneNumber(auth, phoneNumber, appVerifier)
    .then((confirmationResult) => {
      // SMS sent. Prompt user to type the code from the message, then sign the
      // user in with confirmationResult.confirm(code).
      window.confirmationResult = confirmationResult;

      // Create message in error container.
      createMessage("success", `Sent OTP to ${phoneNumber}`, 5);
      // ...
    }).catch((error) => {
      // Error; SMS not sent
      // ...
      // console.log("OTP send failed\n" + error);
      console.log("error: ", error);
      createMessage("error", `Please refresh the page`, 30);
      createMessage("error", `${error}`, 5);

    });
}

function createMessage(type, message, time) {
  const errorMessageStyles = "h-[6rem] p-8 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg  rounded-xl w-full lg:w-full  m-3 bg-no-repeat bg-cover bg-center text-white text-center font-bold truncate";
  let interval;
  function fadeOut(element, duration) {
    element.classList.add(`${type}-message`);

    let opacity = 1;

    interval = setInterval(function () {
      opacity -= 0.01;
      element.style.opacity = opacity;
      if (opacity <= 0) {
        clearInterval(interval);
        element.remove();
      }
    }, duration / 1000);
  }

  const errorMessage = document.getElementById(`${type}-message`);
  const copy = errorMessage.cloneNode(true);
  copy.id = "new-id";
  errorMessage.parentNode.appendChild(copy);

  copy.setAttribute("class", errorMessageStyles)
  copy.textContent = message;
  clearInterval(interval);
  copy.style.opacity = 1;
  copy.scrollIntoView({ behavior: 'smooth' });
  setTimeout(function () {
    fadeOut(copy, 5000);
  }, time * 1000);

}


async function handleSubmit(e, form, submitButton) {
  // Start by preventing the submission from reloading the page.
  e.preventDefault();

  // Get the data from the form.
  const userInfo = new FormData(document.getElementById("form"));


  // Get user input from the form.
  const data = {
    firstName: userInfo.get('firstName'),
    lastName: userInfo.get('lastName'),
    email: userInfo.get('email'),
    mobile: userInfo.get('mobile'),
    password: userInfo.get('password'),
    confirmPassword: userInfo.get('confirmPassword'),
  }

  const fname = data.firstName;
  const lname = data.lastName;
  const email = data.email;
  const mobile = data.mobile;
  const password = data.password;
  const otp = userInfo.get('otp');

  // Check if all form fields have a value.
  if (!data.firstName || !data.lastName || !data.email || !data.password || !data.mobile || !data.confirmPassword) {
    // Display a warning message if any of the fields are empty.
    createMessage("warning", "Please fill out all form fields.", 1);

  } else if (!otp) {
    createMessage("warning", "Please fill out OTP.", 1);
  } else if (data.password !== data.confirmPassword) {
    // Display a warning message if the passwords don't match.
    createMessage("warning", "Passwords do not match.", 1);

  } else if (data.password.length < 8) {
    // Display a warning message if the password is less than 8 characters.
    createMessage("warning", "The password must be more than 8 characters.", 1);

  } else if (!emailRegex.test(data.email)) {
    // Display a warning message if the email is invalid.
    createMessage("warning", "The email is not a valid email.", 1);

  } else if (!window.confirmationResult) {
    // Display a warning message if the otp is invalid.
    createMessage("warning", "Please request OTP", 1);

  } else {

    let validOtp = false;
    // Check if otp is valid
    async function checkOtpThenCreateUser() {
      if (otp && window.confirmationResult && !validOtp) {
        try {
          await window.confirmationResult.confirm(otp)
          // .then((result) => {
          // User signed in successfully.
          // const user = result.user;
          // console.log(user);
          validOtp = true;
          console.log("Valid OTP: " + validOtp)

          // ...
          // }).catch((error) => {
        } catch (error) {

          validOtp = false;
          console.log("Invalid OTP: " + validOtp)
          // User couldn't sign in (bad verification code?)
          // ...
          // });
        }
      }

      if (validOtp === false) {
        // Display a warning message if the otp is invalid.
        console.log(validOtp);
        createMessage("warning", "The OTP is not valid.", 1);
      } else {

        fetch(URLS[1], {
          method: 'POST',
          crossDomain: true,
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({
            fname,
            lname,
            email,
            mobile,
            password,
          })
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data, "userSignup");
            console.log(JSON.stringify({
              fname,
              lname,
              email,
              mobile,
              password,
            }))
            if (data.status === "ok") {
              // alert("login success");
              createMessage("success", "Sign Up Success, Please Login", 30);
              window.localStorage.setItem('token', data.data);

            } else {
              const error = data.error;
              createMessage("error", `Sign Up Failed, ${error}`, 5);
            }
          })
      }
    }
    checkOtpThenCreateUser();
  }

}

const DescriptionDiv = () => {
  const { currentColor } = useStateContext();
  return (
    <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg h-30 rounded-xl w-full lg:w-full p-8 pt-9 m-3 bg-no-repeat bg-cover bg-center">
      <div className="flex justify-between items-center ">
        <div className="w-full">
          <p className="font-bold text-gray-700 dark:text-gray-200 text-center mb-2">Sign Up</p>
          <p
            className="text-s text-center"
            style={{ color: currentColor }}
          >
            Sign Up to get started.
          </p>
        </div>
      </div>
    </div>
  )
}

const FormDiv = () => {
  const { currentColor } = useStateContext();
  const labelStyles = "block text-gray-700 text-sm font-bold  bg-white dark:text-gray-200 dark:bg-secondary-dark-bg capitalize"
  const detailStyles = "text-xs italic font-bold"
  const textInputStyles = "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:text-gray-200 dark:bg-main-dark-bg h-10 mb-2 mt-2"

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };


  const [showButton, setShowButton] = useState(false);
  const [showOtp, setShowOtp] = useState(false);

  let input;
  function handleMobileInput(event) {
    input = event.target.value;

    if (input.length === 10) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  }

  const mobileInput = useRef(null);

  function HandleVerifyButton() {
    const mobile = mobileInput.current.value;
    // console.log(mobile);

    setShowOtp(true);
    onCaptchaVerify(mobile);
  }

  return (
    <div className="flex justify-between items-center w-full">
      <div className="w-full">
        <form
          className="max-w-full"
          id="form"
        >
          {/* Labels and tooltip for user text input area */}
          <div className="mt-4">
            <label
              className={labelStyles}
            >
              First Name
              {/* <span className={validName ? "valid" : "hide"}>
                <FontAwesomeIcon icon={faCheck} />
              </span>
              <span className={validName || !user ?
                "hide" : "invalid"}>
                <FontAwesomeIcon icon={faTimes} />
              </span> */}
            </label>
            <p
              style={{ color: currentColor }}
              class={detailStyles}
            >
            </p>
          </div>

          {/* User text input area */}
          <Input
            id="firstName"
            className={textInputStyles}
            type="text"
            name="firstName"
            placeholder="First Name"
            // ref={userRef}
            autoComplete="off"
            // onChange={(e) => setUser(e.target.value)}
            required
          />

          {/* Labels and tooltip for user text input area */}
          <div className="mt-4">
            <label
              className={labelStyles}
            >
              Last Name
            </label>
            <p
              style={{ color: currentColor }}
              class={detailStyles}
            >
            </p>
          </div>

          {/* User text input area */}
          <Input
            id="lastName"
            className={textInputStyles}
            type="text"
            name="lastName"
            placeholder="Last Name"
            autoComplete="off"
            required
          />

          {/* Labels and tooltip for user text input area */}
          <div className="mt-4">
            <label
              className={labelStyles}
            >
              Email
            </label>
            <p
              style={{ color: currentColor }}
              class={detailStyles}
            >
            </p>
          </div>

          {/* User text input area */}
          <Input
            id="email"
            className={textInputStyles}
            type="email"
            name="email"
            placeholder="Email"
            autoComplete="off"
            required
          />

          {/* Labels and tooltip for user text input area */}
          <div className="mt-4">
            <label
              className={labelStyles}
            >
              Mobile Number
            </label>
            <p
              style={{ color: currentColor }}
              class={detailStyles}
            >
            </p>
          </div>

          {/* User text input area */}
          <Input
            inputRef={mobileInput}
            id="mobile"
            className={textInputStyles}
            type="tel"
            name="mobile"
            placeholder="Phone Number"
            autoComplete="off"
            required
            onChange={handleMobileInput}
          />
          {showButton ? (
            <Button
              id="verifyMobile"
              name="verifyMobile"
              type="button"
              style={{ width: '100%', backgroundColor: currentColor }}
              variant="contained"
              onClick={HandleVerifyButton}
            >
              Send OTP
            </Button>
          ) : null}

          {/* Labels and tooltip for user text input area */}
          {showOtp ? (
            <>
              <div className="mt-4">
                <label
                  className={labelStyles}
                >
                  OTP
                </label>
                <p
                  style={{ color: currentColor }}
                  class={detailStyles}
                >
                </p>
              </div>

              <Input
                id="otp"
                className={textInputStyles}
                type="number"
                name="otp"
                placeholder="OTP"
                autoComplete="off"
                required
              />
            </>) : null}

          {/* Labels and tooltip for user text input area */}
          <div className="mt-4">
            <label
              className={labelStyles}
            >
              Password
            </label>
            <p
              style={{ color: currentColor }}
              class={detailStyles}
            >
            </p>
          </div>

          {/* User text input area */}
          <Input
            id="password"
            name="password"
            className={textInputStyles}
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            autoComplete="off"
            required
          />

          {/* User text input area */}
          <Input
            id="confirmPassword"
            name="confirmPassword"
            className={textInputStyles}
            type={showPassword ? 'text' : 'password'}
            placeholder="Confirm Password"
            autoComplete="off"
            required
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  style={{ color: currentColor }}
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />



        </form>
      </div>
    </div>
  )
}

const FormSubmit = (props) => {
  const { currentColor } = useStateContext();
  const form = document.getElementById(props.formId);
  const submitButton = document.getElementById("submit-button");

  return (
    <div className="text-center">
      <button
        id="submit-button"
        color="white"
        style={{ backgroundColor: currentColor }}
        type="submit"
        className="text-m opacity-0.9 text-white hover:drop-shadow-xl rounded-xl p-4
    mt-8"
        onClick={(e) => handleSubmit(e, form, submitButton)}>
        Sign Up
      </button>
    </div>
  )

}

const ToSignIn = () => {
  const { currentColor } = useStateContext();
  const textLinkStyles = "cursor-pointer"

  const login = () => {
    window.location.href = "./sign-in";
  }

  return (
    <><div className="text-center mt-4">
      <p>Need to sign in?
        <a
          onClick={login}
          className={textLinkStyles}
          style={{ color: currentColor }}
        >
          &nbsp;&nbsp;Sign In
        </a>
      </p>
    </div></>
  )
}

const ToSignUp = () => {
  const { currentColor } = useStateContext();
  const textLinkStyles = "cursor-pointer"

  const register = () => {
    window.location.href = "./register";
  }

  return (
    <><div className="text-center mt-4">
      <p>Don't have an account?
        <a
          onClick={register}
          className={textLinkStyles}
          style={{ color: currentColor }}
        >
          &nbsp;&nbsp;Sign Up
        </a>
      </p>
    </div></>
  )
}

const ToForgotPassword = () => {
  const { currentColor } = useStateContext();
  const textLinkStyles = "cursor-pointer"

  const forgotP = () => {
    window.location.href = "./forgot-password";
  }

  return (
    <><div className="text-center mt-4">
      <p>
        <a
          onClick={forgotP}
          className={textLinkStyles}
          style={{ color: currentColor }}
        >
          Forgot your password?
        </a>
      </p>
    </div></>
  )
}

const ErrorMessageDiv = () => {
  // const { currentColor } = useStateContext();
  return (
    <div
      id="error-message"
      name="error-message"
      style={{ backgroundColor: "#ff3366" }}
      className=""
    />
  )
}

const WarningMessageDiv = () => {
  // const { currentColor } = useStateContext();
  return (
    <div
      id="warning-message"
      name="warning-message"
      style={{ backgroundColor: "#ffcc55" }}
      className=""
    />
  )
}

const SuccessMessageDiv = () => {
  const { currentColor } = useStateContext();
  return (
    <div
      id="success-message"
      name="success-message"
      style={{ backgroundColor: currentColor }}
      className=""
    />
  )
}

// Class-Based component
class UserSignUp extends React.Component {

  render() {
    return (
      <div className="mt-10">
        <div className="flex flex-wrap lg:flex-wrap max-w-xl m-auto">
          <DescriptionDiv />
          <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg h-30 rounded-xl w-full lg:w-full p-8 pt-9 m-3 bg-no-repeat bg-cover bg-center">
            <FormDiv />
            <FormSubmit
              responseContainerId="response_div"
              formId="form"
              chatContainerId="chat_container"
              openaiContainerId="openai_container"
            />
            <ToSignIn />
            <ToForgotPassword />

            {/* <section>
              <p ref={errRef} className={errMsg ? "errmsg" :
                "offscreen"} aria-live="assertive "> {errMsg}</p>
            </section> */}
          </div>
          <ErrorMessageDiv />
          <WarningMessageDiv />
          <SuccessMessageDiv />
        </div>
        <div id="recaptcha-container"></div>
      </div>
    );
  }

}

export default UserSignUp;