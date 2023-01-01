import React, { useRef, useState, useEffect, useContext } from 'react'

import { useStateContext } from '../../contexts/ContextProvider';

import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const SIGNUP_URL = '/signup'

const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

async function handleSubmit(e, form) {
  // Start by preventing the submission from reloading the page.
  e.preventDefault();

  // Get the data from the form.
  const userInfo = new FormData(document.getElementById("form"));

  // Get user input from the form.
  const data = {
    firstName: userInfo.get('firstName'),
    lastName: userInfo.get('lastName'),
    email: userInfo.get('email'),
    password: userInfo.get('password'),
    confirmPassword: userInfo.get('confirmPassword'),
  }



  const fname = data.firstName;
  const lname = data.lastName;
  const email = data.email;
  const password = data.password;

  let interval;

  function fadeOut(element, duration) {
    element.classList.add("error-message");

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

  // Check if all form fields have a value.
  if (!data.firstName || !data.lastName || !data.email || !data.password || !data.confirmPassword) {
    // Display an error message if any of the fields are empty.
    const errorMessage = document.getElementById("error-message");
    const copy = errorMessage.cloneNode(true);
    copy.id = "new-id";
    errorMessage.parentNode.appendChild(copy);

    copy.setAttribute("class", "h-[6rem] p-8 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg  rounded-xl w-full lg:w-full  m-3 bg-no-repeat bg-cover bg-center text-white text-center font-bold truncate")
    copy.textContent = "Please fill out all form fields.";
    clearInterval(interval);
    copy.style.opacity = 1;
    setTimeout(function () {
      fadeOut(copy, 5000);
    }, 5000);
  } else if (data.password !== data.confirmPassword) {
    // Display an error message if any of the fields are empty.
    const errorMessage = document.getElementById("error-message");
    const copy = errorMessage.cloneNode(true);
    copy.id = "new-id";
    errorMessage.parentNode.appendChild(copy);

    copy.setAttribute("class", "h-[6rem] p-8 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg  rounded-xl w-full lg:w-full  m-3 bg-no-repeat bg-cover bg-center text-white text-center font-bold truncate")
    copy.textContent = "Passwords do not match.";
    clearInterval(interval);
    copy.style.opacity = 1;
    setTimeout(function () {
      fadeOut(copy, 5000);
    }, 5000);
  } else if (data.password.length < 8) {
    // Display an error message if any of the fields are empty.
    const errorMessage = document.getElementById("error-message");
    const copy = errorMessage.cloneNode(true);
    copy.id = "new-id";
    errorMessage.parentNode.appendChild(copy);

    copy.setAttribute("class", "h-[6rem] p-8 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg  rounded-xl w-full lg:w-full  m-3 bg-no-repeat bg-cover bg-center text-white text-center font-bold truncate")
    copy.textContent = "The password must be more than 8 characters.";
    clearInterval(interval);
    copy.style.opacity = 1;
    setTimeout(function () {
      fadeOut(copy, 5000);
    }, 5000);
  } else if (!emailRegex.test(data.email)) {
    // Display an error message if any of the fields are empty.
    const errorMessage = document.getElementById("error-message");
    const copy = errorMessage.cloneNode(true);
    copy.id = "new-id";
    errorMessage.parentNode.appendChild(copy);

    copy.setAttribute("class", "h-[6rem] p-8 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg  rounded-xl w-full lg:w-full  m-3 bg-no-repeat bg-cover bg-center text-white text-center font-bold truncate")
    copy.textContent = "The email is not a valid email.";
    clearInterval(interval);
    copy.style.opacity = 1;
    setTimeout(function () {
      fadeOut(copy, 5000);
    }, 5000);
  }
  else {

    fetch(`https://relayai.onrender.com${SIGNUP_URL}`, {
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
          password,
        }))
        if (data.status == "ok") {
          // alert("login success");
          window.localStorage.setItem('token', data.data);
          const errorMessage = document.getElementById("error-message");
          const copy = errorMessage.cloneNode(true);
          copy.id = "new-id";
          errorMessage.parentNode.appendChild(copy);

          copy.setAttribute("class", "h-[6rem] p-8 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg  rounded-xl w-full lg:w-full  m-3 bg-no-repeat bg-cover bg-center text-white text-center font-bold truncate")
          copy.textContent = "Sign Up Success, Please Login";
          clearInterval(interval);
          copy.style.opacity = 1;
          setTimeout(function () {
            fadeOut(copy, 5000);
          }, 30000);
        } else {
          const errorMessage = document.getElementById("error-message");
          const copy = errorMessage.cloneNode(true);
          copy.id = "new-id";
          errorMessage.parentNode.appendChild(copy);

          copy.setAttribute("class", "h-[6rem] p-8 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg  rounded-xl w-full lg:w-full  m-3 bg-no-repeat bg-cover bg-center text-white text-center font-bold truncate")
          const error = data.error;
          copy.textContent = `Sign Up Failed, ${error}`;
          clearInterval(interval);
          copy.style.opacity = 1;
          setTimeout(function () {
            fadeOut(copy, 5000);
          }, 5000);
        }
      })
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
          // aria-invalid={validName ? "false" : "true"}
          // aria-describedby="uidnote"
          // onFocus={setUserFocus(true)}
          // onBlur={setUserFocus(false)}
          />

          {/* <p id="uidnote" className={userFocus && user && !validName ? "instructions" : "offscreen"}>
            <FontAwesomeIcon icon={faInfoCircle} />
            4 to 24 characters.<br />
            Must begin with a letter.<br />
            Letters, numbers, underscores, hyphens allowed.
          </p> */}


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

          {/* Labels and tooltip for user text input area */}
          {/* <div className="mt-4">
            <label
              className={labelStyles}
            >
              Confirm Password
            </label>
            <p
              style={{ color: currentColor }}
              class={detailStyles}
            >
            </p>
          </div> */}

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

  const textLinkStyles = "cursor-pointer"

  const login = () => {
    window.location.href = "./sign-in";
  }
  return (
    <div className="text-center">
      <button
        id="submit-button"
        color="white"
        style={{ backgroundColor: currentColor }}
        type="submit"
        className="text-m opacity-0.9 text-white hover:drop-shadow-xl rounded-xl p-4
    mt-8"
        onClick={(e) => handleSubmit(e, form)}>
        Sign Up
      </button>

      <div className="text-center mt-4">
        <p>Need to sign in?
          <a
            onClick={login}
            className={textLinkStyles}
            style={{ color: currentColor }}
          >
            &nbsp;&nbsp;Sign In
          </a>
        </p>
      </div>
    </div>
  )

}

const ErrorMessageDiv = () => {
  const { currentColor } = useStateContext();
  return (
    <div
      id="error-message"
      name="error-message"
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

            {/* <section>
              <p ref={errRef} className={errMsg ? "errmsg" :
                "offscreen"} aria-live="assertive "> {errMsg}</p>
            </section> */}
          </div>
          <ErrorMessageDiv />
        </div>
      </div>
    );
  }

}

export default UserSignUp;