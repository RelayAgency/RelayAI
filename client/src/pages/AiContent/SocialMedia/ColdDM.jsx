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
  const platform = document.getElementById('mediaPlatform').value;
  const conversationContextArea = document.getElementById('conversationContext').value;
  const recieverContextArea = document.getElementById('receiverContext').value;
  const intention = document.getElementById('intentionsInput').value;
  const tonality = document.getElementById('messageTone').value;

  console.log(recieverContextArea)
  //Clear the form. (Optional)
  // form.reset();

  // If within the character limit when form is submitted.
  if (recieverContextArea.length > 0) {

    const uniqueId = generateUniqueId();

    //Create the prompt from the user input.
    let prompt;
    if (intention && conversationContextArea) {
      prompt = "Write " + tonality + " chat reply" + platform + ", for this conversation: " + conversationContextArea + ".\n With the intention " + intention + ". To the recipient " + recieverContextArea + "|END";
    } else if (conversationContextArea) {
      prompt = "Write " + tonality + " chat reply" + platform + ", for this conversation: " + conversationContextArea + ". To the recipient " + recieverContextArea + "|END";
    } else if (intention) {
      prompt = "Write " + tonality + " greeting chat message" + platform + ".\n With the intention " + intention + ". To the recipient " + recieverContextArea + "|END";
    }
    else {
      prompt = "Write " + tonality + " greeting chat message" + platform + ". To the recipient " + recieverContextArea + "|END";
    }

    // Console log the entire prompt.
    console.log("prompt: " + prompt)

    // Append the response div with new responses
    // responseContainer.innerHTML += chatStripe("", uniqueId);
    responseContainer.innerHTML += ChatStripe(currentColor, "", uniqueId);

    //Console log the uniqueId
    console.log("uniqueId: " + uniqueId)

    // Put the new response into view.
    responseContainer.scrollTop = responseContainer.scrollHeight;
    let responseDiv;

    // Get the element Id of the newly created response.
    responseDiv = document.getElementById(uniqueId);
    console.log("responseDiv: " + responseDiv);


    isLoading = true;
    console.log("isLoading: " + isLoading)

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


}

const DescriptionDiv = () => {
  const { currentColor } = useStateContext();
  return (
    <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg h-30 rounded-xl w-full lg:w-full p-8 pt-9 m-3 bg-no-repeat bg-cover bg-center">
      <div className="flex justify-between items-center ">
        <div>
          <p className="font-bold text-gray-700 dark:text-gray-200 text-left mb-2">Generate DMs</p>
          <p
            className="text-s"
            style={{ color: currentColor }}
          >
            Create effective replies to any conversation and craft engaging dialogue. Easily customize AI-generated copy to fit your unique style, and never worry about awkward pauses or missed opportunities in conversations again!
          </p>
        </div>
      </div>
    </div>
  )
}

const FormDiv = () => {
  const { currentColor } = useStateContext();
  function handleInput() {
    // const conversationContextArea = document.getElementById("conversationContext");
    // const characterCount = document.getElementById("characterCount");
    // const characterCountWarning = document.getElementById("characterCountWarning");

    // characterCount.textContent = `${conversationContextArea.value.length}/1000`;
    // if (conversationContextArea.value.length > 1000) {
    //   characterCount.style.color = "#cc0000";
    //   characterCount.textContent = `${conversationContextArea.value.length}/1000`;
    // }
    // else if (conversationContextArea.value.length < 40 && conversationContextArea.value.length > 0) {
    //   characterCount.style.filter = "brightness(50%)";
    //   characterCount.style.color = currentColor;
    //   characterCountWarning.textContent = `⚠️ Short input. Try to provide more details for better copy results.
    // `;

    // } else {
    //   characterCountWarning.textContent = '';
    //   characterCount.style.color = currentColor;
    //   characterCount.style.filter = "brightness(100%)";
    // }
  }
  return (
    <div className="flex justify-between items-center w-full">
      <div className="w-full">
        <form
          className="max-w-full"
          id="form"
        >
          {/* Labels and tooltips for user dropwdown menu */}
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg">
              What Social Media Platform Were You Using?
            </label>
            <p
              style={{ color: currentColor }}
              class="text-xs italic mb-2 font-bold">
              Choose a platform
            </p>
          </div>

          {/* User dropwdown menu */}
          <div
            class="inline-block relative w-full"
          >
            <select
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:text-gray-200 dark:bg-main-dark-bg h-10 mb-4"
              name="mediaPlatform"
              id="mediaPlatform"
            >
              <option value="">🚫 Default</option>
              <option value=" on facebook">Facebook</option>
              <option value=" on instagram">Instagram</option>
              <option value=" on twitter">Twitter</option>
              <option value=" on linkedin">Linkedin</option>
              <option value=" on discord">Discord</option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg class="fill-current h-4 w-4 bg-white dark:text-gray-200 dark:bg-main-dark-bg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
            </div>
          </div>

          {/* Labels and tooltip for user text input area */}
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg">
              Give Some Context of The Conversation.
            </label>
            <p
              style={{ color: currentColor }}
              class="text-xs italic mb-2 font-bold">
              You can describe the conversation in your own words or just paste the entire conversation. *Optional
            </p>
          </div>

          {/* User text input area */}
          <textarea onInput={handleInput}
            id="conversationContext"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:text-gray-200 dark:bg-main-dark-bg h-32"
            type="text"
            name="conversationContext"
            placeholder="e.g. 
            Elon Gated: Have you heard about Relay AI, it's a brilliant software that generates AI content
            John Doe: Can you tell me more about it?"
          />

          {/* Tooltips below text input area */}
          <div
            className="flex justify-between items-center mb-4"
          >
            {/* <div
              id="characterCountWarning"
              name="characterCountWarning"

              class="text-xs font-bold text-left"
            />
            <div
              id="characterCount"
              class="text-xs font-bold text-right"
              style={{ color: currentColor }}
            >
              0/1000
            </div> */}
          </div>

          {/* Labels and tooltip for user text input area */}
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg">
              Give Some Context of The Reciever.
            </label>
            <p
              style={{ color: currentColor }}
              class="text-xs italic mb-2 font-bold">
              Describe who you're chatting with for a more personalized response.
            </p>
          </div>

          {/* User text input area */}
          <textarea onInput={handleInput}
            id="receiverContext"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:text-gray-200 dark:bg-main-dark-bg h-32"
            type="text"
            name="receiverContext"
            placeholder="e.g. John Doe, he's a copy writer who's been trying to save time writing copy."
            required
          />

          {/* Tooltips below text input area */}
          <div
            className="flex justify-between items-center mb-4"
          >
            {/* <div
              id="characterCountWarning"
              name="characterCountWarning"

              class="text-xs font-bold text-left"
            />
            <div
              id="characterCount"
              class="text-xs font-bold text-right"
              style={{ color: currentColor }}
            >
              0/1000
            </div> */}
          </div>

          {/* Labels and tooltip for user text input area */}
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg">
              What's Your Intention?
            </label>
            <p
              style={{ color: currentColor }}
              class="text-xs italic mb-2 font-bold">
              Briefly describe your intentions in this conversation.
            </p>
          </div>

          {/* User text input area */}
          <input onInput={handleInput}
            id="intentionsInput"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:text-gray-200 dark:bg-main-dark-bg h-10"
            type="text"
            name="intentionsInput"
            placeholder="e.g. To tell a friend the benefits of Relay AI, an AI content generator."
          />

          {/* Tooltips below text input area */}
          <div
            className="flex justify-between items-center mb-4"
          >
            {/* <div
              id="characterCountWarning"
              name="characterCountWarning"

              class="text-xs font-bold text-left"
            />
            <div
              id="characterCount"
              class="text-xs font-bold text-right"
              style={{ color: currentColor }}
            >
              0/1000
            </div> */}
          </div>

          {/* Labels and tooltips for user dropwdown menu */}
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg">
              Choose your reply tone
            </label>
            <p
              style={{ color: currentColor }}
              class="text-xs italic mb-2 font-bold">
              Choose a preset tone
            </p>
          </div>

          {/* User dropwdown menu */}
          <div
            class="inline-block relative w-full"
          >
            <select
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:text-gray-200 dark:bg-main-dark-bg h-10"
              name="messageTone"
              id="messageTone"
            >
              <option value="a normal">🚫 Default</option>
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
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg class="fill-current h-4 w-4 bg-white dark:text-gray-200 dark:bg-main-dark-bg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
            </div>
          </div>
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
    <div class="text-base gap-4 md:gap-6 p-4 md:py-6 flex lg:px-0">
      <div class="w-[30px] flex flex-col relative items-end">
        <div class="relative h-[30px] w-[30px] p-2 rounded-sm text-white flex items-center justify-center" style="background-color: ${currentColor};">
          <svg id="a" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21.18 25"><defs><style>.b{fill:#fff;}</style></defs><path class="b" d="M21.18,25h-5.05l-7.01-7.42-.3-4.82h1.93c2.52,0,4.56-2.04,4.56-4.56s-2.04-4.53-4.56-4.53H3.67V25H0V0H10.76c4.56,0,8.23,3.67,8.23,8.2,0,3.86-2.6,7.05-6.16,7.97l8.35,8.83Z"/></svg>
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
class ColdDM extends React.Component {
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

export default ColdDM;