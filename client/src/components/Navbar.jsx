import React, { useEffect, useState } from 'react';
import { AiOutlineMenu } from 'react-icons/ai';
// import { FiShoppingCart } from 'react-icons/fi';
// import { BsChatLeft } from 'react-icons/bs';
// import { RiNotification3Line } from 'react-icons/ri';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';

import avatar from '../data/default-avatar.png';
// import { Cart, Chat, Notification, UserProfile } from '.';
import { UserProfile } from '.';
import { useStateContext } from '../contexts/ContextProvider';

import { useAuth0 } from '@auth0/auth0-react';
import LoginButton from './LoginButton';

const URL = "/userData"
const url1 = `http://localhost:5000${URL}`;
const url2 = `https://relayai.onrender.com${URL}`;
const urls = [url1, url2];

const NavButton = () => {
  const { currentColor, activeMenu, setActiveMenu, handleClick, isClicked, setScreenSize, screenSize } = useStateContext();

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (screenSize <= 900) {
      setActiveMenu(false);
    } else {
      setActiveMenu(true);
    }
  }, [screenSize]);

  const NavButton = ({ title, customFunc, icon, color, dotColor }) => (
    <TooltipComponent content={title} position="BottomCenter">
      <button
        type="button"
        onClick={() => customFunc()}
        style={{ color }}
        className="relative text-xl rounded-full p-3 hover:bg-light-gray"
      >
        <span
          style={{ background: dotColor }}
          className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2"
        />
        {icon}
      </button>
    </TooltipComponent>
  );

  const handleActiveMenu = () => setActiveMenu(!activeMenu);

  return (
    <><NavButton title="Menu" customFunc={handleActiveMenu} color={currentColor} icon={<AiOutlineMenu />} /></>
  )
}

const ProfileButton = () => {
  const { currentColor, activeMenu, setActiveMenu, handleClick, isClicked, setScreenSize, screenSize } = useStateContext();

  const [userData, setUserData] = useState('');

  useEffect(() => {
    fetch(urls[1], {
      method: 'POST',
      crossDomain: true,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        token: window.localStorage.getItem('token')
      })
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "userData");
        setUserData(data.data);
      });
  }, []);

  const isLoggedIn = window.localStorage.getItem("loggedIn")
  return (
    <>{isLoggedIn ?
      <TooltipComponent content="Profile" position="BottomCenter">
        <div
          className="flex items-center gap-2 cursor-pointer p-1 hover:bg-light-gray rounded-lg"
          onClick={() => handleClick('userProfile')}
        >

          <img
            className="rounded-full h-8 w-8"
            src={avatar}
            alt={avatar}
          />

          <p>
            <span className="text-gray-400 text-14">Hi,</span>{' '}
            <span className="text-gray-400 font-bold ml-1 text-14">
              {userData.fname}
            </span>

          </p>
          <MdKeyboardArrowDown className="text-gray-400 text-14" />
        </div>
      </TooltipComponent>
      : <LoginButton />
    }
      {isClicked.userProfile && (<UserProfile />)}
    </>
  )
}

// const FunctionalComponent = () => {
//   return (
//     <></>
//   )
// }

class Navbar extends React.Component {
  render() {
    return (
      <div className="flex justify-between p-2 md:ml-6 md:mr-6 relative">
        <NavButton />
        <div className="flex">
          <ProfileButton />
        </div>
      </div>
    );
  }
}

export default Navbar;