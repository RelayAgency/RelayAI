import React from 'react'
import { useStateContext } from '../../../contexts/ContextProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import '../../../App.css';

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
  const mainMessage = data.get('main-message');
  const specificInfo = data.get('specific-information');
  const postFormat = data.get('post-format');
  const tone = data.get('tone-style');
  const target = data.get('target-audience');
  let callToActionChecked = document.querySelectorAll('input[name="call-to-action"]');
  let callToActionR = [];
  callToActionChecked.forEach((checkbox) => {
    if (checkbox.checked) {
      callToActionR.push(checkbox.value);
    }
  })
  callToActionR = callToActionR.join(' and ');
  const date = data.get('date-picker');

  //Clear the form. (Optional)
  // form.reset();

  // If within the character limit when form is submitted.

  const uniqueId = generateUniqueId();

  //Create the prompt from the user input.
  let prompt;
  if (date) {
    // prompt = `Hello AI bot, I'd like to send a direct message to someone${target} on social media. The call-to-action of the message is to ${callToActionR} them and I'd like to highlight the ${valueProposition} of my company. Details of the recipient include, ${personalizationR}, and I want the tone of the message to be ${tone} tone. My company is ${companyR}. Can you help me draft a message that will get their attention and interest?`
    prompt = `Hello AI bot! I'd like you to create a promotional post about; ${mainMessage}. some more specific information; ${specificInfo}. My target audience is ${target}. I'd like the post to have ${tone} tone and include a call to action for users to ${callToActionR}. Please include relevant hashtags. The post should include ${postFormat} and should be scheduled to go live at ${date}, style it after any holidays that might take place on that date. The post will also be going on Facebook so keep that in mind. Thank you!`

  } else {
    // prompt = `Hello AI bot, I'd like to send a direct message to someone${target} on social media. The call-to-action of the message is to ${callToActionR} them. Details of the recipient include, ${personalizationR}, and I want the tone of the message to be ${tone} tone. My company is ${companyR}. Can you help me draft a message that will get their attention and interest?`
    prompt = `Hello AI bot! I'd like you to create a Facebook post about; ${mainMessage}. Some more specific information; ${specificInfo}. My target audience is ${target}. I'd like the post to have ${tone} tone and include a call to action for users to ${callToActionR}. Please include relevant hashtags. The post should include ${postFormat}. Thank you!`
    
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
          <p className="font-bold text-gray-700 dark:text-gray-200 text-left mb-2">Create The Perfect Facebook Post</p>
          <p
            className="text-s"
            style={{ color: currentColor }}
          >
            Relay AI's Facebook Post Generator Bot is the perfect tool for busy entrepreneurs, marketers and small business owners who want to quickly and easily create impactful posts on their Facebook page. Generate posts in a matter of seconds that will drive traffic, engage your followers and build your brand. Forget about spending hours crafting the perfect message - with Relay AI you can go from idea to post with lightning speed. Make your Facebook page stand out and give it a professional edge in no time at all!
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

  const dateInputStyles = "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:text-gray-200 dark:bg-main-dark-bg h-12"

  const dateValue = new Date(new Date().getFullYear(), new Date().getMonth, new Date().getDay);

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
              Main Message or theme of the post?
            </label>
            <p
              style={{ color: currentColor }}
              class={detailStyles}
            >
              This will help the AI understand what you want the post to convey.
            </p>
          </div>

          {/* User text input menu */}
          <input
            type="text"
            id="main-message"
            name="main-message"
            className={textInputStyles}
            placeholder="Enter the main message or theme of the post"
            required
          />


          {/* Labels and tooltip for user input area */}
          <div className="mt-4">
            <label
              className={labelStyles}
            >
              Specific information or details?
            </label>
            <p
              style={{ color: currentColor }}
              class={detailStyles}
            >
              For example, if you are promoting an event, you may want to include the date, time, and location.
            </p>
          </div>

          {/* User text input menu */}
          <textarea
            type="text"
            id="specific-information"
            name="specific-information"
            className={textAreaStyles}
            placeholder="Enter any specific information or details to include in the post"
          />


          {/* Labels and tooltip for user input area */}
          <div className="mt-4">
            <label
              className={labelStyles}
            >
              Format of the post?
            </label>
            <p
              style={{ color: currentColor }}
              class={detailStyles}
            >
              Do you want the AI to create a text-based post, or would you prefer a post that includes a mix of text and images?
            </p>
          </div>

          {/* User dropwdown menu */}
          <div className="inline-block relative w-full"
          >
            <select
              class={dropwdownStyles}
              name="post-format"
              id="post-format"
            >
              <option value="text">🚫 Default</option>
              <option value="text">Text</option>
              <option value="text and a visually appealing image">Text and Images</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg class="fill-current h-4 w-4 bg-white dark:text-gray-200 dark:bg-main-dark-bg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
            </div>
          </div>


          {/* Labels and tooltip for user input area */}
          <div className="mt-4">
            <label
              className={labelStyles}
            >
              Tone of the post?
            </label>
            <p
              style={{ color: currentColor }}
              class={detailStyles}
            >
              Should it be formal or casual, serious or humorous?
            </p>
          </div>

          {/* User dropwdown menu */}
          <div className="inline-block relative w-full"
          >
            <select
              class={dropwdownStyles}
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
              <svg class="fill-current h-4 w-4 bg-white dark:text-gray-200 dark:bg-main-dark-bg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
            </div>
          </div>


          {/* Labels and tooltip for user input area */}
          <div className="mt-4">
            <label
              className={labelStyles}
            >
              Target audience?
            </label>
            <p
              style={{ color: currentColor }}
              class={detailStyles}
            >
              Understanding the demographics and interests of the intended audience will help the AI create content that resonates with them.
            </p>
          </div>

          {/* User dropwdown menu */}
          <div className="inline-block relative w-full"
          >
            <select
              className={dropwdownStyles}
              name="target-audience"
              id="target-audience"
            >
              <option value=" any regular Facebook user">🚫 Default</option>
              <option value=" in the tech industry">⚙️ Technology</option>
              <option value=" in the healthcare industry">❤️‍🩹 Healthcare</option>
              <option value=" in the finance industry">💱 Finance</option>
              <option value=" in the retail industry">🛒 Retail</option>
              <option value=" in the real estate industry">🏠 Real Estate</option>
              <option value=" in the construction industry">🏗️ Construction</option>
              <option value=" in the hospitality and tourism industry">🏨 Hospitality and Tourism</option>
              <option value=" in the media and entertainment industry">📸 Media and Entertainment</option>
              <option value=" in the manufacturing industry">🏭 Manufacturing</option>
              <option value=" in the energy industry">⚡ Energy</option>
              <option value=" in the agriculture industry">🌱 Agriculture</option>
              <option value=" in the government industry">🏛️ Government</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg class="fill-current h-4 w-4 bg-white dark:text-gray-200 dark:bg-main-dark-bg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
            </div>
          </div>


          {/* Labels and tooltip for user input area */}
          <div className="mt-4">
            <label
              className={labelStyles}
            >
              Call to action?
            </label>
            <p
              style={{ color: currentColor }}
              class={detailStyles}
            >
              What kind of action should the AI encourage (e.g. liking, commenting, sharing)?
            </p>
          </div>

          {/* User Checkbox */}
          <ul
            className={checkboxMenuStyles}
          >
            <li className={checkboxDivStyles}>
              <input
                className={checkboxInputStyles}
                type="checkbox"
                id="like-and-share"
                name="call-to-action"
                value="like and share"
                required
              />
              <label
                className={checkboxLabelStyles}
                for="like-and-share"
              >
                Like & Share
              </label>
            </li>

            <li className={checkboxDivStyles}>
              <input
                className={checkboxInputStyles}
                type="checkbox"
                id="tag-a-friend"
                name="call-to-action"
                value="tag their friends"
                required
              />
              <label
                className={checkboxLabelStyles}
                for="tag-a-friend"
              >
                Tag a friend
              </label>
            </li>

            <li className={checkboxDivStyles}>
              <input
                className={checkboxInputStyles}
                type="checkbox"
                id="comment"
                name="call-to-action"
                value="comment with their thoughts"
                required
              />
              <label
                className={checkboxLabelStyles}
                for="comment"
              >
                Comment
              </label>
            </li>

            <li className={checkboxDivStyles}>
              <input
                className={checkboxInputStyles}
                type="checkbox"
                id="follow"
                name="call-to-action"
                value="follow our page"
                required
              />
              <label
                className={checkboxLabelStyles}
                for="follow"
              >
                Follow
              </label>
            </li>

            <li className={checkboxDivStyles}>
              <input
                className={checkboxInputStyles}
                type="checkbox"
                id="join-list"
                name="call-to-action"
                value="sign up for our newsletter"
                required
              />
              <label
                className={checkboxLabelStyles}
                for="join-list"
              >
                Join mailing list
              </label>
            </li>

            <li className={checkboxDivStyles}>
              <input
                className={checkboxInputStyles}
                type="checkbox"
                id="website"
                name="call-to-action"
                value="check out our website"
                required
              />
              <label
                className={checkboxLabelStyles}
                for="website"
              >
                Go to website
              </label>
            </li>

            <li className={checkboxDivStyles}>
              <input
                className={checkboxInputStyles}
                type="checkbox"
                id="store"
                name="call-to-action"
                value="visit our store"
                required
              />
              <label
                className={checkboxLabelStyles}
                for="store"
              >
                Go to store
              </label>
            </li>

            <li className={checkboxDivStyles}>
              <input
                className={checkboxInputStyles}
                type="checkbox"
                id="book"
                name="call-to-action"
                value="book a meeting/consultation"
                required
              />
              <label
                className={checkboxLabelStyles}
                for="book"
              >
                Book a meeting/consultation
              </label>
            </li>

            <li className={checkboxDivStyles}>
              <input
                className={checkboxInputStyles}
                type="checkbox"
                id="app"
                name="call-to-action"
                value="download our app"
                required
              />
              <label
                className={checkboxLabelStyles}
                for="app"
              >
                Download app
              </label>
            </li>

            <li className={checkboxDivStyles}>
              <input
                className={checkboxInputStyles}
                type="checkbox"
                id="event"
                name="call-to-action"
                value="join an event or webinar"
                required
              />
              <label
                className={checkboxLabelStyles}
                for="event"
              >
                Join event/webinar
              </label>
            </li>

            <li className={checkboxDivStyles}>
              <input
                className={checkboxInputStyles}
                type="checkbox"
                id="eBook"
                name="call-to-action"
                value="download our eBook"
                required
              />
              <label
                className={checkboxLabelStyles}
                for="eBook"
              >
                Download eBook
              </label>
            </li>

          </ul>

          {/* Labels and tooltip for user input area */}
          <div className="mt-4">
            <label
              className={labelStyles}
            >
              Scheduling
            </label>
            <p
              style={{ color: currentColor }}
              class={detailStyles}
            >
              The AI will need to know the desired time and time zone to ensure that the post is published at the appropriate time.
            </p>
          </div>

          {/* User Date picker */}
          <input
            id="date-picker"
            name="date-picker"
            type="date"
            class={dateInputStyles}
            placeholder="Select the date and time you want the post to go live"
          />


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
class FacebookPost extends React.Component {
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

export default FacebookPost;