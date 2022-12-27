import React, { useState } from 'react'
import { BarLoader } from 'react-spinners'
import { useStateContext } from '../../contexts/ContextProvider';
import bot from '../../data/bot.svg';

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

// function chatStripe(value, uniqueId) {
//   return (
//     `
//           <div
//             id=${uniqueId}
//             className="message relative flex w-[calc(100%-50px)] md:flex-col lg:w-[calc(100%-115px)]"
//           >
//             <p
//               className="text-m p-3"
//               style={{ color: currentColor }}
//             >
//               ${value}
//             </p>
//           </div>
//           <br>
//     `
//   )
// }

async function handleSubmit(e, currentColor, form, responseContainer, chatContainer, submitButton) {
  // Start by preventing the submission from reloading the page.
  e.preventDefault();
  // Get the data from the form.
  const data = new FormData(form);

  // Get user input from the form.
  const textarea = data.get('productName');
  const tonality = data.get('productTone');

  // console.log(textarea, tonality, uniqueId);

  //Clear the form. (Optional)
  // form.reset();

  // If within the character limit when form is submitted.
  if (textarea.length <= 1000 && textarea.length > 0) {
    const uniqueId = generateUniqueId();

    // Get AI response container.
    // responseContainer.innerHTML = "Success";

    // console.log("currentColor: " + currentColor);

    // console.log("chatContainer: ");
    // console.log(chatContainer);

    // console.log("responseConatiner: ");
    // console.log(responseContainer);

    //Create the prompt from the user input.
    const prompt = "Write " + tonality + " product description for " + textarea;

    // Console log the entire prompt.
    console.log("prompt: " + prompt)

    // Append the response div with new responses
    // responseContainer.innerHTML += chatStripe("", uniqueId);
    responseContainer.innerHTML += ChatStripe(currentColor, "", uniqueId);

    //Console log the uniqueId
    console.log("uniqueId: " + uniqueId)

    // Put the new response into view.
    responseContainer.scrollTop = responseContainer.scrollHeight;

    // Get the element Id of the newly created response.
    const responseDiv = document.getElementById(uniqueId);

    isLoading = true;
    console.log("isLoading: " + isLoading)

    submitButton.disabled = true;
    submitButton.style.filter = "brightness(50%)";
    submitButton.style.cursor = "wait";

    clearInterval(loadInterval);
    responseDiv.innerHTML = responseDiv.innerHTML;
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

const DescriptionDiv = (props) => {
  const { currentColor } = useStateContext();
  return (
    <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg h-30 rounded-xl w-full lg:w-full p-8 pt-9 m-3 bg-no-repeat bg-cover bg-center">
      <div className="flex justify-between items-center ">
        <div>
          <p className="font-bold text-gray-700 dark:text-gray-200 text-left mb-2">Generate Product Descriptions</p>
          <p
            className="text-s"
            style={{ color: currentColor }}
          >
            Generate product descriptions for any type of products, simply enter the name and product description to get started.
          </p>
        </div>
      </div>
    </div>
  )
}

const FormDiv = (props) => {
  const { currentColor } = useStateContext();
  function handleInput() {
    const textarea = document.getElementById("productName");
    const characterCount = document.getElementById("characterCount");
    const characterCountWarning = document.getElementById("characterCountWarning");

    characterCount.textContent = `${textarea.value.length}/1000`;
    if (textarea.value.length > 1000) {
      characterCount.style.color = "#cc0000";
      characterCount.textContent = `${textarea.value.length}/1000`;
    }
    else if (textarea.value.length < 40 && textarea.value.length > 0) {
      characterCount.style.filter = "brightness(50%)";
      characterCount.style.color = currentColor;
      characterCountWarning.textContent = `⚠️ Short input. Try to provide more details for better copy results.
    `;

    } else {
      characterCountWarning.textContent = '';
      characterCount.style.color = currentColor;
      characterCount.style.filter = "brightness(100%)";
    }
  }
  return (
    <div className="flex justify-between items-center w-full">
      <div className="w-full">
        <form
          className="max-w-full"
          id="form"
        >
          {/* Labels and tooltip for user text input area */}
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg">
              What Product Would You Like to get a description for?
            </label>
            <p
              style={{ color: currentColor }}
              class="text-xs italic mb-2 font-bold">
              Enter as much information as possible for more accurate descriptions
            </p>
          </div>

          {/* User text input area */}
          <textarea onInput={handleInput}
            id="productName"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:text-gray-200 dark:bg-main-dark-bg h-32"
            type="text"
            name="productName"
            placeholder="e.g. Relay AI"
          />

          {/* Tooltips below text input area */}
          <div
            className="flex justify-between items-center mb-4"
          >
            <div
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
            </div>
          </div>

          {/* Labels and tooltips for user dropwdown menu */}
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg">
              Choose a tone
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
              name="productTone"
              id="productTone"
            >
              <option value="a detailed, smart, informative and professional">🚫 Default</option>
              <option value="a friendly">😊 Friendly</option>
              <option value="a luxury">💎 Luxury</option>
              <option value="a relaxed">😌 Relaxed</option>
              <option value="a professional">💼 Professional</option>
              <option value="a bold">💪 Bold</option>
              <option value="an adventurous">⛺ Adventurous</option>
              <option value="a witty">💡 Witty</option>
              <option value="a persuasive">🧠 Persuasive</option>
              <option value="an empathetic">🤗 Empathetic</option>
              <option value="a short, snappy, and effective">🏃 In a Rush</option>
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
  const [state, setState] = useState({
    heading: 'The response from the AI will be Shown here',
    response: '',
    isLoading: false
  });
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

// function ChatStripe(avatarImage, currentColor, value, uniqueId) {
//   let avatarStyle = {
//     position: 'relative',
//     height: '30px',
//     width: '30px',
//     padding: '1px',
//     borderRadius: '0.25rem',
//     color: 'white',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: currentColor,
//   };

//   let imageStyle = {
//     borderTopLeftRadius: '0.375rem',
//     borderBottomLeftRadius: '0.375rem',
//     height: '5px',
//     width: '5px',
//   };
//   return (
//     `
//     <div class="flex text-base gap-4 md:gap-6 md:max-w-full lg:max-w-full xl:max-w-full  lg:px-0">
//       <div class="w-[30px] flex flex-col relative">
//         <div
//         style=${avatarStyle}
//         >
//           <img
//             id="avatarId"
//             name="avatarId"
//             style=${imageStyle}      
//             src="${avatarImage}"
//             alt="bot-avatar"
//           />
//         </div>
//       </div>
//       <div
//         class="message" 
//         id=${uniqueId}
//       >
//         ${value}
//       </div>
//       <br>
//     </div>
//     `
//   );
// }

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


const ResponseDiv = (props) => {
  const { currentColor } = useStateContext();
  return (
    <div
      id="response-div"
      name="response-div"
      className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg h-30 rounded-xl w-full lg:w-full p-8 pt-9 m-3 bg-no-repeat bg-cover bg-center"
    >
      <div className="flex text-base gap-4 md:gap-6 md:max-w-full lg:max-w-full xl:max-w-full  lg:px-0">
        <div className="w-[30px] flex flex-col relative ">
          <button
            style={{ background: currentColor, userSelect: 'none' }}
            className="relative h-[30px] w-[30px] p-1 rounded-sm text-white flex items-center justify-center"
          >
            <img
              id="avatarId"
              nam="avatarId"
              className="rounded-tl-md rounded-bl-md h-5 w-5"
              src={bot}
              alt="bot-avatar"
            />
          </button>
        </div>
        <div
          id="response_container"
          name="response_container"
        />
      </div>
    </div>
  )
}

const ResponseDiv2 = (props) => {
  return (
    <div
      id="response_div"
      name="response_div"
      className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg h-30 rounded-xl w-full lg:w-full p-8 pt-9 m-3 bg-no-repeat bg-cover bg-center"
    />

  )
}

// Class-Based component
class ProductDescription extends React.Component {
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


export default ProductDescription;