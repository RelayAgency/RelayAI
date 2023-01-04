import React, { createContext, useContext, useEffect, useState } from 'react';

const StateContext = createContext();

const initialState = {
  chat: false,
  cart: false,
  userProfile: false,
  notification: false,
};

export const ContextProvider = ({ children }) => {
  const [screenSize, setScreenSize] = useState(undefined);
  const [currentColor, setCurrentColor] = useState(localStorage.getItem('colorMode') || '#03C9D7');
  const [currentMode, setCurrentMode] = useState(localStorage.getItem('themeMode') || 'Light');
  const [themeSettings, setThemeSettings] = useState(false);
  const [activeMenu, setActiveMenu] = useState(true);
  const [activeProfile, setActiveProfile] = useState(false);
  const [isClicked, setIsClicked] = useState(initialState);
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('loggedIn') || false);
  const [user, setUser] = useState({});

  useEffect(() => {
    localStorage.setItem('colorMode', currentColor);
    localStorage.setItem('themeMode', currentMode);

  }, [screenSize, currentColor, currentMode, themeSettings, activeMenu, isClicked, isLoggedIn, user, activeProfile]);

  const setMode = (e) => {
    setCurrentMode(e.target.value);
    localStorage.setItem('themeMode', e.target.value);
  };

  const setColor = (color) => {
    setCurrentColor(color);
    localStorage.setItem('colorMode', color);
  };

  const setLoggedIn = (e) => {
    setIsLoggedIn(e.target.value);
    localStorage.setItem('loggedIn', e.target.value);
  }

  const handleClick = (clicked) => setIsClicked({ ...initialState, [clicked]: true });

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <StateContext.Provider value={{ currentColor, currentMode, activeMenu, screenSize, setScreenSize, handleClick, isClicked, initialState, setIsClicked, setActiveMenu, setCurrentColor, setCurrentMode, setMode, setColor, themeSettings, setThemeSettings, isLoggedIn, setIsLoggedIn, user, setUser, setLoggedIn, activeProfile, setActiveProfile }}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
