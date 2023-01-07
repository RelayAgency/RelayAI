import React, { useEffect } from 'react'
import { useStateContext } from '../../../contexts/ContextProvider';

let loadInterval;
let isLoading = false;

function loader(element) {
  element.textContent = '';
  loadInterval = setInterval(() => {
    // Update the text content of the loading indicator
    element.textContent += '.';

    // If the loading indicator has reached three dots, reset it
    if (element.textContent === '....') {
      element.textContent = '';
    }
  }, 300);
}

function typeText(element, text, submitButton) {
  let index = 0;
  let timeout;

  function printNextChar() {
    if (index < text.length) {
      element.innerHTML += text.charAt(index) === '\n' ? '<br>' : text.charAt(index);
      index++;
      timeout = setTimeout(printNextChar, 10);
    } else {
      setTimeout(() => {
        submitButton.disabled = false;
        submitButton.style.filter = "brightness(100%)";
        submitButton.style.cursor = "pointer";
      }, 1000);
    }
  }

  printNextChar();
}

function generateUniqueId() {
  // Create 'variables' with random values.
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  // Return a combination of these appended variables.
  return `id-${timestamp}-${hexadecimalString}`;
}

const DescriptionDiv = () => {
  const { currentColor } = useStateContext();
  return (
    <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg h-30 rounded-xl w-full lg:w-full p-8 pt-9 m-3 bg-no-repeat bg-cover bg-center">
      <div className="flex justify-between items-center ">
        <div>
          <p className="font-bold text-gray-700 dark:text-gray-200 text-left mb-2">Create The Perfect Cold Email Script</p>
          <p
            className="text-s"
            style={{ color: currentColor }}
          >
            Save time creating the best cold email scripts so that you can focus on other important aspects of your business. It automates the process of crafting a powerful cold email script, taking into account the recipient's preferences and interests. With its intuitive and easy-to-use interface, this tool creates high-quality emails that will help you connect with your audience and make an impact. Get ready to make a lasting impression with Relay AI!
          </p>
        </div>
      </div>
    </div>
  )
}

async function handleSubmit(e, currentColor, form, responseContainer, chatContainer, submitButton) {
  // Start by preventing the submission from reloading the page.
  e.preventDefault();
  // Get the data from the form.
  const data = new FormData(form);

  // Get user input from the form.
  const recipientNameR = data.get('recipient-name');
  const relationshipR = data.get('relationship');
  const tone = data.get('tone-style');
  let goalsChecked = document.querySelectorAll('input[name="goals"]');
  let goalsR = [];
  goalsChecked.forEach((checkbox) => {
    if (checkbox.checked) {
      goalsR.push(checkbox.value);
    }
  })
  goalsR = goalsR.join(' and ');

  const details = data.get('specific-details');
  const targetR = data.get('target-audience');
  const companyR = data.get('company');

  // console.log("Recipient Name: " + recipientNameR);
  // console.log("Relationship: " + relationshipR);
  // console.log("Tone: " + tone);
  // console.log("Goal: " + goalsR);
  // console.log("Details: " + details);
  // console.log("Target Audience: " + targetR);
  // console.log("Company: " + companyR);


  //Clear the form. (Optional)
  // form.reset();

  // If within the character limit when form is submitted.

  const uniqueId = generateUniqueId();

  //Create the prompt from the user input.
  let prompt;
  if (details) {
    // prompt = `Hello AI bot, I am looking to ${goalsR} a ${relationshipR}. The recipient is called ${recipientNameR}, they are a ${targetR}. My company is ${companyR}, ${details}. I would like the email to be professional and concise, with a clear call to action for the recipient to reply and a powerful and effective subject line. I prefer ${tone} tone. Thank you.`
    prompt = `Hello AI bot, I'd like to write a cold email to ${recipientNameR}. They are a ${relationshipR} and I'd like the tone of the email to be ${tone}. My goal is to ${goalsR} them and some relevant details are ${details}. The target audience is ${targetR} and my company is ${companyR}. Can you help me draft an email that will get their attention?`

  } else {
    // prompt = `Hello AI bot, I am looking to ${goalsR} a ${relationshipR}. The recipient is called ${recipientNameR}, they are a ${targetR}. My company is ${companyR}. I would like the email to be professional and concise, with a clear call to action for the recipient to reply and a powerful and effective subject line. I prefer ${tone} tone. Thank you.`
    prompt = `Hello AI bot, I'd like to write a cold email to ${recipientNameR}. They are a ${relationshipR} and I'd like the tone of the email to be ${tone} tone. My goal is to ${goalsR} them. The target audience is ${targetR} and my company is ${companyR}. Can you help me draft an email that will get their attention?`
  }

  // Console log the entire prompt.
  console.log("prompt: " + prompt)

  // Append the response div with new responses
  // responseContainer.innerHTML += chatStripe("", uniqueId);
  responseContainer.insertAdjacentHTML("afterbegin", ChatStripe(currentColor, "", uniqueId));

  //Console log the uniqueId
  // console.log("uniqueId: " + uniqueId)

  // Put the new response into view.
  responseContainer.scrollTop = responseContainer.scrollHeight;

  // Get the element Id of the newly created response.
  const responseDiv = document.getElementById(uniqueId);

  isLoading = true;
  // console.log("isLoading: " + isLoading)

  submitButton.disabled = true;
  submitButton.style.filter = "brightness(50%)";
  submitButton.style.cursor = "wait";

  clearInterval(loadInterval);
  loader(responseDiv);

  const response = await fetch('https://relayai.onrender.com', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: prompt
    })
  });

  clearInterval(loadInterval);
  responseDiv.innerHTML = "";

  if (response.ok) {
    const data = await response.json();
    const parseData = data.bot.trim();
    isLoading = false;

    console.log("parseData: " + parseData)
    console.log("isLoading: " + isLoading)

    typeText(responseDiv, parseData, submitButton);
  } else {
    const err = await response.texts();

    responseDiv.innerHTML = "Something went wrong";

    alert(err);
  }


}

const FormDiv = () => {
  const { currentColor } = useStateContext();
  const labelStyles = "block text-gray-700 text-sm font-bold mb-2 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg capitalize"
  const detailStyles = "text-xs italic mb-2 font-bold"
  const textInputStyles =
    `shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:text-gray-200 dark:bg-main-dark-bg h-10 focus:ring-2 focus:ring-[${currentColor}]`;
  const textAreaStyles =
    `shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:text-gray-200 dark:bg-main-dark-bg h-32 focus:ring-2 focus:ring-[${currentColor}]`;
  const dropdownStyles = `shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:text-gray-200 dark:bg-main-dark-bg h-10 focus:ring-2 focus:ring-[${currentColor}]`

  const radioMenuStyles = "flex flex-wrap -mb-4 max-w-3xl"
  const radioButtonStyles = "w-1/3 mb-4"
  const radioLabelStyles = "p-2 text-gray-700 text-sm font-bold bg-white dark:bg-secondary-dark-bg capitalize"

  const checkboxMenuStyles = "flex flex-wrap flex-row -mb-4 max-w-3xl items-center"
  const checkboxDivStyles = "w-1/2 mb-2 flex items-center"
  const temp2 = ""
  const checkboxInputStyles = `w-4 h-4 text-[${currentColor}] bg-gray-100 rounded border-gray-300 focus:ring-[${currentColor}] dark:focus:ring-[${currentColor}] dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 flex-none`
  const checkboxLabelStyles = "p-2 ml-2 inline-block text-gray-700 dark:text-gray-200 text-sm font-medium bg-white dark:bg-secondary-dark-bg capitalize"
  const temp1 = "inline-flex justify-between items-center p-2 m-2 w-full text-gray-700 bg-white rounded-lg border-2 border-gray-200 cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-blue-600 hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600 hover:bg-gray-50 dark:text-gray-200 dark:bg-secondary-dark-bg dark:hover:bg-gray-700"


  function handleInput(e) {
    const textarea = e.target.value;
    const characterCount = document.getElementById("characterCount");
    const characterCountWarning = document.getElementById("characterCountWarning");
    const submitButton = document.getElementById("submit-button");

    characterCount.textContent = `${textarea.length}/1000`;
    if (textarea.length > 1000) {
      characterCount.style.color = "#cc0000";
      characterCount.textContent = `${textarea.length}/1000`;

      disableButton(submitButton);
    }
    else if (textarea.length < 40 && textarea.length > 0) {
      characterCount.style.filter = "brightness(50%)";
      characterCount.style.color = currentColor;
      characterCountWarning.textContent = `⚠️ Short input. Try to provide more details for better copy results.`;

      enableButton(submitButton);
    } else {
      characterCountWarning.textContent = '';
      characterCount.style.color = currentColor;
      characterCount.style.filter = "brightness(100%)";
      enableButton(submitButton);
    }
  }

  return (
    <div className="flex justify-between items-center w-full">
      <div className="w-full">
        <form
          className="max-w-full"
          id="form"
        >
          {/* Labels and tooltip for user input area */}
          <div className="mt-4">
            <label
              className={labelStyles}
            >
              Recipient's Name?
            </label>
            <p
              style={{ color: currentColor }}
              className={detailStyles}
            >
              Knowing the recipient's name will allow the AI bot to personalize the email and make it more likely to be read.
            </p>
          </div>

          {/* User text input menu */}
          <input
            type="text"
            id="recipient-name"
            name="recipient-name"
            className={textInputStyles}
            placeholder="e.g. John Doe"
            required
          />

          {/* Labels and tooltip for user input area */}
          <div className="mt-4">
            <label
              className={labelStyles}
            >
              Your relationship to the recipient?
            </label>
            <p
              style={{ color: currentColor }}
              className={detailStyles}
            >
              If you have a preexisting relationship with the recipient, this could influence the tone and content of the email.
            </p>
          </div>

          {/* User dropwdown menu */}
          <div
            className="inline-block relative w-full"
          >
            <select
              id="relationship"
              name="relationship"
              className={dropdownStyles}
              required
            >
              <option value="colleague">💼 Colleague</option>
              <option value="acquaintance">🤝 Acquaintance</option>
              <option value="stranger">🫥 Stranger</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4 bg-white dark:text-gray-200 dark:bg-main-dark-bg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
            </div>
          </div>

          {/* Labels and tooltip for user input area */}
          <div className="mt-4">
            <label
              className={labelStyles}
            >
              Desired tone and style?
            </label>
            <p
              style={{ color: currentColor }}
              className={detailStyles}
            >
              You may have a particular tone or style in mind for your cold email, such as formal, casual, or friendly.
            </p>
          </div>

          {/* User dropwdown menu */}
          <div
            className="inline-block relative w-full"
          >
            <select
              className={dropdownStyles}
              name="tone-style"
              id="tone-style"
            >
              <option value="a normal">🚫 Default</option>
              <option value="a formal">🤵 Formal</option>
              <option value="a casual">👕 Casual</option>
              <option value="a friendly">😊 Friendly</option>
              <option value="a luxury">💎 Luxury</option>
              <option value="a relaxed">😌 Relaxed</option>
              <option value="a professional">💼 Professional</option>
              <option value="a bold">💪 Bold</option>
              <option value="an adventurous">⛺ Adventurous</option>
              <option value="a witty">💡 Witty</option>
              <option value="a persuasive">🧠 Persuasive</option>
              <option value="an empathetic">🤗 Empathetic</option>
              <option value="a short and snappy">🏃 In a Rush</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4 bg-white dark:text-gray-200 dark:bg-main-dark-bg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
            </div>
          </div>

          {/* Labels and tooltip for user input area */}
          <div className="mt-4">
            <label
              className={labelStyles}
            >
              Goals for the email?
            </label>
            <p
              style={{ color: currentColor }}
              className={detailStyles}
            >
              It's important to know what you hope to achieve with the cold email in order to tailor the script accordingly.
            </p>
          </div>

          {/* User Checkbox */}
          <div
            className={checkboxMenuStyles}
          >
            <div className={checkboxDivStyles}>
              <input
                className={checkboxInputStyles}
                type="checkbox"
                id="schedule-meeting"
                name="goals"
                value="schedule a meeting with"
                required
              />
              <label
                className={checkboxLabelStyles}

                htmlFor="schedule-meeting"
              >
                Schedule a meeting
              </label>
            </div>

            <div className={checkboxDivStyles}>
              <input
                className={checkboxInputStyles}
                type="checkbox"
                id="request-info"
                name="goals"
                value="make an information request from"
              />
              <label
                className={checkboxLabelStyles}

                htmlFor="request-info"
              >
                Request information
              </label>
            </div>

            <div className={checkboxDivStyles}>
              <input
                className={checkboxInputStyles}
                type="checkbox"
                id="pitch-product"
                name="goals"
                value="pitch our product to"
              />
              <label
                className={checkboxLabelStyles}

                htmlFor="pitch-product"
              >
                Pitch a product or service
              </label>
            </div>

            <div className={checkboxDivStyles}>
              <input
                className={checkboxInputStyles}
                type="checkbox"
                id="connection"
                name="goals"
                value="establish a connection with"
              />
              <label
                className={checkboxLabelStyles}

                htmlFor="connection"
              >
                Establish a connection
              </label>
            </div>

            <div className={checkboxDivStyles}>
              <input
                className={checkboxInputStyles}
                type="checkbox"
                id="referral"
                name="goals"
                value="request a referral or recommendation from"
              />
              <label
                className={checkboxLabelStyles}

                htmlFor="referral"
              >
                Request a referral or recommendation
              </label>
            </div>

            <div className={checkboxDivStyles}>
              <input
                className={checkboxInputStyles}
                type="checkbox"
                id="collaboration"
                name="goals"
                value="partner or collaborate with"
              />
              <label
                className={checkboxLabelStyles}

                htmlFor="collaboration"
              >
                Partner or collaborate
              </label>
            </div>

            <div className={checkboxDivStyles}>
              <input
                className={checkboxInputStyles}
                type="checkbox"
                id="assist"
                name="goals"
                value="offer assistance or expertise to"
              />
              <label
                className={checkboxLabelStyles}

                htmlFor="assist"
              >
                Offer assistance or expertise
              </label>
            </div>

          </div>

          {/* Labels and tooltip for user input area */}
          <div className="mt-4">
            <label
              className={labelStyles}
            >
              Specific details or information to include?
            </label>
            <p
              style={{ color: currentColor }}
              className={detailStyles}
            >
              You may have specific details or information you want to include in the email, such as your company's website or a particular product or service you are offering.
            </p>
          </div>

          {/* User text input menu */}
          <input
            type="text"
            id="specific-details"
            name="specific-details"
            className={textInputStyles}
            placeholder="e.g. Digital Marketing Services"
          />

          {/* Labels and tooltip for user input area */}
          {/* <div className="mt-4">
            <label
              className={labelStyles}
            >
              Preferences or constraints?
            </label>
            <p
              style={{ color: currentColor }}
              className={detailStyles}
            >
              You may have specific preferences or constraints, such as a preferred length for the email or a specific deadline for sending it.
            </p>
          </div> */}

          {/* Labels and tooltip for user input area */}
          <div className="mt-4">
            <label
              className={labelStyles}
            >
              Target audience?
            </label>
            <p
              style={{ color: currentColor }}
              className={detailStyles}
            >
              Knowing the recipient of the cold email will help the AI bot tailor the script to be more personalized and relevant to their needs and interests.
            </p>
          </div>

          {/* User text input menu */}
          <input
            type="text"
            id="target-audience"
            name="target-audience"
            className={textInputStyles}
            placeholder="e.g. Small Business Owner"
            required
          />

          {/* Labels and tooltip for user input area */}
          <div className="mt-4">
            <label
              className={labelStyles}
            >
              Your company or organization?
            </label>
            <p
              style={{ color: currentColor }}
              className={detailStyles}
            >
              Providing information about your company or organization will help the AI bot create a more professional and credible email.
            </p>
          </div>

          {/* User text input menu */}
          <input
            type="text"
            id="company"
            name="company"
            className={textInputStyles}
            placeholder="e.g. Tesla"
            required
          />

        </form>
      </div>
    </div>
  )
}

function waitButton(button) {
  button.disabled = true;
  button.style.filter = "brightness(50%)";
  button.style.cursor = "wait";
}

function disableButton(button) {
  button.disabled = true;
  button.style.filter = "brightness(50%)";
  button.style.cursor = "not-allowed";
}

function enableButton(button) {
  button.disabled = false;
  button.style.filter = "brightness(100%)";
  button.style.cursor = "pointer";
}

const FormSubmit = (props) => {
  const { currentColor } = useStateContext();
  const responseContainer = document.getElementById(props.responseContainerId);
  const chatContainer = document.getElementById(props.chatContainerId);
  const openaiContainer = document.getElementById(props.openaiContainerId);
  const submitButton = document.getElementById("submit-button");
  const form = document.getElementById(props.formId);


  return (
    <div>
      <button
        id="submit-button"
        color="white"
        style={{ backgroundColor: currentColor }}
        type="submit"
        className="text-m opacity-0.9 text-white hover:drop-shadow-xl rounded-xl p-4
      mt-8"
        onClick={(e) => handleSubmit(e, currentColor, form, responseContainer, chatContainer, submitButton)}>
        Get AI Suggestions
      </button>
      {/* 
      <div>
        {isLoading ? (
          <div className="flex justify-center">
            <BarLoader
              size={50}
              color={currentColor}
              id="loading-animation"
            />
          </div>
        ) : (
          <div className="flex justify-center">
          </div>
        )}
      </div> */}
    </div>
  )

}


function ChatStripe(currentColor, value, uniqueId) {
  return (
    `
    <div class="text-base gap-4 md:gap-6 md:py-6 flex bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-xl p-8 m-3 bg-no-repeat bg-cover bg-center">
      <div class="w-[30px] flex flex-col relative items-end">
        <div class="relative h-[30px] w-[30px] p-2 rounded-sm text-white flex items-center justify-center" style="background-color: ${currentColor};">
          <svg id="a" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21.18 25"><defs><style>.b{fill:#fff;}</style></defs><path class="b" d="M21.18,25h-5.05l-7.01-7.42-.3-4.82h1.93c2.52,0,4.56-2.04,4.56-4.56s-2.04-4.53-4.56-4.53H3.67V25H0V0H10.76c4.56,0,8.23,3.67,8.23,8.2,0,3.86-2.6,7.05-6.16,7.97l8.35,8.83Z"/></svg>
        </div>
      </div>
      <div class="relative flex w-[calc(100%-50px)] md:flex-col lg:w-[calc(100%-115px)]">
      <div
        class="message" 
        id=${uniqueId}
      >
        <p>
          ${value}
        </p>
      </div>
      </div>
      <br />
    </div>
    `
  );
}

const ResponseDiv2 = () => {
  return (
    <div
      id="response_div"
      name="response_div"
      className="h-30 w-full lg:w-full"
    />

  )
}

// Class-Based component
class ColdEmail extends React.Component {
  render() {
    return (
      <div className="mt-10">
        <div className="flex flex-wrap lg:flex-wrap justify-center w-full ">
          <DescriptionDiv />
          <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg h-30 rounded-xl w-full lg:w-full p-8 pt-9 m-3 bg-no-repeat bg-cover bg-center">
            <FormDiv />
            <FormSubmit
              responseContainerId="response_div"
              formId="form"
              chatContainerId="chat_container"
              openaiContainerId="openai_container"
            />
          </div>
          <ResponseDiv2 />
        </div>
      </div>
    );
  }
}

export default ColdEmail;