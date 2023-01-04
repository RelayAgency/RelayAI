import React, { useEffect, useState } from 'react';
import { MdOutlineCancel } from 'react-icons/md';

import { Button } from '.';
import { userProfileData } from '../data/dummy';

import LogoutButton from './LogoutButton';

import { Link, NavLink } from 'react-router-dom';

import { useStateContext } from '../contexts/ContextProvider';

import avatar from '../data/default-avatar.png';

const URL = "/userData"
const url1 = `http://localhost:5000${URL}`;
const url2 = `https://relayai.onrender.com${URL}`;
const URLS = [url1, url2];

const ProfileHeader = () => {
  const { currentColor, activeMenu, setActiveMenu, handleClick, isClicked, setScreenSize, screenSize, activeProfile, setActiveProfile } = useStateContext();
  return (
    <>
      <div className="flex justify-between items-center">
        <p className="font-semibold text-lg dark:text-gray-200">User Profile</p>
        <div onClick={() => setActiveProfile(!activeProfile)}>
          <Button
            icon={<MdOutlineCancel />}
            color="rgb(153, 171, 180)"
            bgHoverColor="light-gray"
            size="2xl"
            borderRadius="50%"
          />
        </div>
      </div></>
  )
}

const ProfileCard = () => {
  const { currentColor, activeMenu, setActiveMenu, screenSize, currentMode } = useStateContext();

  const handleCloseSideBar = () => {
    if (activeMenu !== undefined && screenSize <= 900) {
      setActiveMenu(false);
    }
  };

  const [userData, setUserData] = useState('');

  useEffect(() => {
    fetch(URLS[1], {
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
        // console.log(data, "userData");
        setUserData(data.data);
      });
  }, []);

  const userAvatarStyles = "rounded-full h-24 w-24"
  const usernameStyles = "font-semibold text-lg dark:text-gray-200"
  const userRoleStyles = "text-gray-500 text-sm dark:text-gray-400"
  const userEmailStyles = "text-gray-500 text-sm font-semibold dark:text-gray-400"

  return (
    <>
      <div>
        <div className="flex gap-5 items-center mt-6 border-color border-b-1 pb-6">

          <NavLink
            to={`/profile`}
            key={'profile'}
            onClick={handleCloseSideBar}
          >
            <img
              className={userAvatarStyles}
              src={avatar}
              alt={avatar}
            />
          </NavLink>

          <div>
            <NavLink
              to={`/profile`}
              key={'profile'}
              onClick={handleCloseSideBar}
            >
              <p className={usernameStyles}>
                {userData.fname}
              </p>
              <p className={usernameStyles}>
                {userData.lname}
              </p>

            </NavLink>

            <p className={userRoleStyles}>
              Member
            </p>

            <p className={userEmailStyles}>
              {userData.email}
            </p>

          </div>
        </div>
      </div>
    </>
  )
}

const ProfileMenuButtons = () => {
  const { currentColor, activeMenu, setActiveMenu, screenSize, currentMode, activeProfile, setActiveProfile } = useStateContext();

  const handleCloseSideBar = () => {
    if (activeMenu !== undefined && screenSize <= 900) {
      setActiveMenu(false);
    }
  };
  return (
    <>
      <div>
        {userProfileData.map((item, index) => (
          <div onClick={() => setActiveProfile(!activeProfile)}>
            <NavLink
              to={`/${item.name}`}
              key={item.name}
              onClick={handleCloseSideBar}
            >
              <div key={index}
                className="flex gap-5 border-b-1 border-color p-4 hover:bg-light-gray cursor-pointer  dark:hover:bg-[#42464D]"

              >
                <button
                  type="button"
                  style={{ color: item.iconColor, backgroundColor: item.iconBg }}
                  className=" text-xl rounded-lg p-3 hover:bg-light-gray"

                >
                  {item.icon}
                </button>

                <div>
                  <p className="font-semibold dark:text-gray-200 ">{item.title}</p>
                  <p className="text-gray-500 text-sm dark:text-gray-400"> {item.desc} </p>
                </div>
              </div>
            </NavLink>
          </div>
        ))}
      </div></>
  )
}

// const FunctionalComponent = () => {
//   return (
//     <></>
//   )
// }

class UserProfile extends React.Component {
  render() {
    return (
      <div className="nav-item absolute right-1 top-16 bg-white dark:bg-[#42464D] p-8 rounded-lg w-96">
        <ProfileHeader />
        <ProfileCard />
        <ProfileMenuButtons />


        <div className="mt-5">
          {/* <LoginButton /> */}
          <LogoutButton />

        </div>
      </div>
    );
  }
};

export default UserProfile;