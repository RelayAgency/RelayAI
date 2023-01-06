import React, { useEffect, useState } from 'react';

import { links } from '../../data/dummy';
import { useStateContext } from '../../contexts/ContextProvider';

const Header = () => {
  const { currentColor, activeMenu, setActiveMenu, screenSize, currentMode } = useStateContext();

  const labelStyles = "block text-gray-700 text-sm font-bold mb-2 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg capitalize"
  const detailStyles = "text-xs italic mb-2 font-bold"
  const textInputStyles = `focus:ring-2 focus:ring-[${currentColor}] focus:outline-none appearance-none w-full text-sm leading-6 text-slate-900 placeholder-slate-400 rounded-md py-2 pl-10 ring-1 ring-slate-200 shadow-sm border text-gray-700 focus:shadow-outline dark:text-gray-200 dark:bg-main-dark-bg`
  const textAreaStyles = "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:text-gray-200 dark:bg-main-dark-bg h-32"
  const dropdownStyles = "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:text-gray-200 dark:bg-main-dark-bg h-10"

  const radioMenuStyles = "flex flex-wrap -mb-4 max-w-3xl"
  const radioButtonStyles = "w-1/3 mb-4"
  const radioLabelStyles = "p-2 text-gray-700 text-sm font-bold bg-white dark:bg-secondary-dark-bg capitalize"

  const checkboxMenuStyles = "flex flex-wrap flex-row -mb-4 max-w-3xl items-center"
  const checkboxDivStyles = "w-1/2 mb-2 flex items-center"
  const checkboxInputStyles = `w-4 h-4 text-[${currentColor}] bg-gray-100 rounded border-gray-300 focus:ring-[${currentColor}] dark:focus:ring-[${currentColor}] dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 flex-none`
  const checkboxLabelStyles = "p-2 ml-2 inline-block text-gray-700 dark:text-gray-200 text-sm font-medium bg-white dark:bg-secondary-dark-bg capitalize"

  const dateInputStyles = "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:text-gray-200 dark:bg-main-dark-bg h-12"

  const newProjectButtonStyles = "hover:border-blue-500 hover:border-solid hover:bg-white hover:text-blue-500 group w-full flex flex-col items-center justify-center rounded-md border-2 border-dashed border-slate-300 text-sm leading-6 text-slate-900 font-medium py-3 dark:hover:bg-main-dark-bg"

  const newButtonStyles = `group flex items-center rounded-md text-m opacity-0.9 text-white mt-8 pl-2 pr-3 py-2 shadow-sm hover:bg-blue-400`

  return (
    <header className="bg-white space-y-4 p-4 sm:px-8 sm:py-6 lg:p-4 xl:px-8 xl:py-6  dark:text-gray-200 dark:bg-secondary-dark-bg rounded-xl m-3">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-slate-900 dark:text-gray-200 text-left">
          Projects
        </h2>
        <a
          id="new-project-button"
          href="/"
          style={{ backgroundColor: currentColor }}
          className={newButtonStyles}
        >
          <svg
            width="20"
            height="20"
            fill="white"
            className="mr-2"
            aria-hidden="true"
          >
            <path d="M10 5a1 1 0 0 1 1 1v3h3a1 1 0 1 1 0 2h-3v3a1 1 0 1 1-2 0v-3H6a1 1 0 1 1 0-2h3V6a1 1 0 0 1 1-1Z" />
          </svg>
          New
        </a>
      </div>
      <form
        id="filter"
        name="filter"
        className="group relative">
        <svg
          width="20"
          height="20"
          fill={currentColor}
          className="absolute left-3 top-1/2 -mt-2.5 text-slate-400 pointer-events-none group-focus-within:text-blue-500"
          aria-hidden="true"
        >
          <path fillRule="evenodd" clipRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
        </svg>
        <input
          // onInput={handleInput}
          id="search-filter"
          name="search-filter"
          className={textInputStyles}
          type="text"
          aria-label="Filter projects"
          placeholder="Filter projects..."
        />
      </form>
    </header>
  )
}


class UserPrompts extends React.Component {
  render() {
    return (
      <div className="mt-10">
        <Header />
      </div>
    )
  }
}

export default UserPrompts