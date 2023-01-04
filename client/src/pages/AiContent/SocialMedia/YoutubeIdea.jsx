import React from 'react'
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

async function handleSubmit(e, currentColor, form, responseContainer, chatContainer, submitButton) {
  // Start by preventing the submission from reloading the page.
  e.preventDefault();
  // Get the data from the form.
  const data = new FormData(form);

  // Get user input from the form.
  const target = data.get('target-audience');
  let purposeChecked = document.querySelectorAll('input[name="purpose"]');
  let purposeR = [];
  purposeChecked.forEach((checkbox) => {
    if (checkbox.checked) {
      purposeR.push(checkbox.value);
    }
  })
  purposeR = purposeR.join(' and ');
  const valueProposition = data.get('value-proposition');
  const personalizationR = data.get('personalization');
  const tone = data.get('tone-style');
  const companyR = data.get('company');

  //Clear the form. (Optional)
  // form.reset();

  // If within the character limit when form is submitted.

  const uniqueId = generateUniqueId();

  //Create the prompt from the user input.
  let prompt;
  if (valueProposition) {
    prompt= `Hello AI bot, I'd like to send a direct message to someone${target} on social media. The purpose of the message is to ${purposeR} them and I'd like to highlight the ${valueProposition} of my company. Details of the recipient include, ${personalizationR}, and I want the tone of the message to be ${tone} tone. My company is ${companyR}. Can you help me draft a message that will get their attention and interest?`

  } else {
    prompt= `Hello AI bot, I'd like to send a direct message to someone${target} on social media. The purpose of the message is to ${purposeR} them. Details of the recipient include, ${personalizationR}, and I want the tone of the message to be ${tone} tone. My company is ${companyR}. Can you help me draft a message that will get their attention and interest?`
  }

  // Console log the entire prompt.
  console.log("prompt: " + prompt)

  // Append the response div with new responses
  responseContainer.insertAdjacentHTML("afterbegin", ChatStripe(currentColor, "", uniqueId));

  // Put the new response into view.
  responseContainer.scrollTop = responseContainer.scrollHeight;

  // Get the element Id of the newly created response.
  const responseDiv = document.getElementById(uniqueId);

  isLoading = true;

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

    console.log("Response: " + parseData)

    typeText(responseDiv, parseData, submitButton);
  } else {
    const err = await response.texts();

    responseDiv.innerHTML = "Something went wrong";

    alert(err);
  }
}

const DescriptionDiv = () => {
  const { currentColor } = useStateContext();

  return (
    <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg h-30 rounded-xl w-full lg:w-full p-8 pt-9 m-3 bg-no-repeat bg-cover bg-center">
      <div className="flex justify-between items-center ">
        <div>
          <p className="font-bold text-gray-700 dark:text-gray-200 text-left mb-2">[Title Goes Here]</p>
          <p
            className="text-s"
            style={{ color: currentColor }}
          >
            [Description Goes Here]
          </p>
        </div>
      </div>
    </div>
  )
}

const FormDiv = () => {
  const { currentColor } = useStateContext();
  const labelStyles = "block text-gray-700 text-sm font-bold mb-2 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg capitalize"
  const detailStyles = "text-xs italic mb-2 font-bold"
  const textInputStyles = "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:text-gray-200 dark:bg-main-dark-bg h-10"
  const textAreaStyles = "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:text-gray-200 dark:bg-main-dark-bg h-32"
  const dropwdownStyles = "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:text-gray-200 dark:bg-main-dark-bg h-10"

  const radioMenuStyles = "flex flex-wrap -mb-4 max-w-3xl"
  const radioButtonStyles = "w-1/3 mb-4"
  const radioLabelStyles = "p-2 text-gray-700 text-sm font-bold bg-white dark:bg-secondary-dark-bg capitalize"

  const checkboxMenuStyles = "flex flex-wrap flex-row -mb-4 max-w-3xl items-center"
  const checkboxDivStyles = "w-1/2 mb-2 flex items-center"
  const checkboxInputStyles = `w-4 h-4 text-[${currentColor}] bg-gray-100 rounded border-gray-300 focus:ring-[${currentColor}] dark:focus:ring-[${currentColor}] dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 flex-none`
  const checkboxLabelStyles = "p-2 ml-2 inline-block text-gray-700 dark:text-gray-200 text-sm font-medium bg-white dark:bg-secondary-dark-bg capitalize"

  return (
    <div className="flex justify-between items-center w-full">
      <div className="w-full">
        <form
          className="max-w-full"
          id="form"
        >
          
        </form>
      </div>
    </div>
  )
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
    </div>
  )

}

function ChatStripe(currentColor, value, uniqueId) {
  return (
    `
              <div class="text-base gap-4 md:gap-6 p-4 md:py-6 flex lg:px-0">
                <div class="w-[30px] flex flex-col relative items-end">
                  <div class="relative h-[30px] w-[30px] p-2 rounded-sm text-white flex items-center justify-center" style="background-color: ${currentColor};">
                    <svg id="a" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21.18 25"><defs><style>.b{fill:#fff;}</style></defs><path class="b" d="M21.18,25h-5.05l-7.01-7.42-.3-4.82h1.93c2.52,0,4.56-2.04,4.56-4.56s-2.04-4.53-4.56-4.53H3.67V25H0V0H10.76c4.56,0,8.23,3.67,8.23,8.2,0,3.86-2.6,7.05-6.16,7.97l8.35,8.83Z" /></svg>
                  </div>
                </div>
                <div class="relative flex w-[calc(100%-50px)] md:flex-col lg:w-[calc(100%-115px)]">
                  <div
                    className="message"
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
      className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg h-30 rounded-xl w-full lg:w-full p-8 pt-9 m-3 bg-no-repeat bg-cover bg-center"
    />

  )
}

// Class-Based component
class YoutubeIdea extends React.Component {
  render() {
    return (
      <div className="mt-10">
        <div className="flex flex-wrap lg:flex-wrap justify-center w-full ">
          <DescriptionDiv />
          <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg h-30 rounded-xl w-full lg:w-full p-8 pt-9 m-3 bg-no-repeat bg-cover bg-center">
            <FormDiv />
            {/* <FormSubmit
              responseContainerId="response_div"
              formId="form"
              chatContainerId="chat_container"
              openaiContainerId="openai_container"
            /> */}
          </div>
          <ResponseDiv2 />
        </div>
      </div>
    );
  }
}

export default YoutubeIdea;