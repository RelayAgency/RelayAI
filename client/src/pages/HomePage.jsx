import React, { useEffect, useState } from 'react';
import { links } from '../data/dummy';
import { useStateContext } from '../contexts/ContextProvider';

const divStyles = "bg-white dark:text-gray-200 dark:bg-secondary-dark-bg h-30 rounded-xl w-full lg:w-full p-8 pt-9 m-3 bg-no-repeat bg-cover bg-center";

const DescriptionDiv = () => {
  const { currentColor } = useStateContext();
  return (
    <div className={divStyles}>
      <div className="flex justify-between items-center ">
        <div>
          <p className="font-bold text-gray-700 dark:text-gray-200 text-left mb-2">Get Started</p>
          <p
            className="text-s"
            style={{ color: currentColor }}
          >
            [INSERT TEXT]
          </p>
        </div>
      </div>
    </div>
  )
}

const ProjectList = () => {
  const { currentColor, activeMenu, setActiveMenu, screenSize, currentMode } = useStateContext();

  const newProjectButtonStyles = "hover:border-blue-500 hover:border-solid hover:bg-white hover:text-blue-500 group w-full flex flex-col items-center justify-center rounded-md border-2 border-dashed border-slate-300 text-sm leading-6 text-slate-900 font-medium py-3 dark:hover:bg-main-dark-bg"

  const [brightness, setBrightness] = useState(50);


  return (
    <div
      className="w-full"
    >
      {links.map((item, index) => (
        <div
          key={index}
        >
          {item.title != 'User' &&
            <>
              <p className="text-gray-400 dark:text-gray-400 m-3 mt-8 uppercase">
                {item.title}
              </p>

              <ul className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 grid-flow-row auto-cols-max">
                {item.links.map((link) => (

                  <div
                    className="p-4 bg-white sm:px-8 sm:pt-6 sm:pb-8 lg:p-4 xl:px-8 xl:pt-6 xl:pb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4 text-sm leading-6  dark:text-gray-200 dark:bg-secondary-dark-bg h-30 rounded-xl m-3"
                  >


                    <li x-for="project in projects">
                      <div className=" justify-left ">
                        <div
                          style={{ color: currentColor }}
                          className="w-full text-3xl h-10"
                        >
                          {link.icon} &nbsp;
                        </div>
                        <p className="font-bold text-gray-700 dark:text-gray-200 text-left mb-2 capitalize">
                          {link.name}
                        </p>
                      </div>
                      <p
                        className="text-s text-gray-700 dark:text-gray-200"
                      // style={{ color: currentColor }}
                      >
                        {link.description}
                      </p>
                    </li>


                    <li className="flex pt-4">
                      <a
                        style={{ backgroundColor: currentColor, filter: `brightness(${brightness}%)` }}
                        href={`/${link.link}`}
                        className={newProjectButtonStyles}
                        // onMouseEnter={() => setBrightness(100)}
                        // onMouseLeave={() => setBrightness(50)}
                      >
                        <svg
                          className="group-hover:text-blue-500 mb-1 text-slate-400"
                          width="20"
                          height="20"
                          fill="white"
                          aria-hidden="true"
                        >
                          <path d="M10 5a1 1 0 0 1 1 1v3h3a1 1 0 1 1 0 2h-3v3a1 1 0 1 1-2 0v-3H6a1 1 0 1 1 0-2h3V6a1 1 0 0 1 1-1Z" />
                        </svg>
                        <p
                          style={{ color: "white" }}
                        >
                          New project
                        </p>
                      </a>
                    </li>
                  </div>
                ))}
              </ul>
            </>
          }
        </div>
      ))}
    </div >
  )
}

// Class-Based component
class HomePage extends React.Component {
  render() {
    return (
      <div className="mt-10">
        <div className="flex flex-wrap lg:flex-wrap justify-center w-full ">
          <DescriptionDiv />

          <ProjectList />


        </div>
      </div>
    );
  }
}

export default HomePage;