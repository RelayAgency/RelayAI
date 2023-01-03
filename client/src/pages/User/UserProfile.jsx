import React, { useRef, useState, useEffect, useContext } from 'react'

import { useStateContext } from '../../contexts/ContextProvider';

import LogoutButton from '../../components/LogoutButton';

import { MdOutlineCancel } from 'react-icons/md';

import { userProfileData } from '../../data/dummy';

import { Link, NavLink } from 'react-router-dom';

import avatar from '../../data/default-avatar.png';

const URL = "/userData"
const url1 = `http://localhost:5000${URL}`;
const url2 = `https://relayai.onrender.com${URL}`;
const URLS = [url1, url2];

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
      <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg h-30 rounded-xl w-full lg:w-full p-8 pt-9 m-3 bg-no-repeat bg-cover bg-center flex">
        <div className="">
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
        </div>

        <div className="ml-3 self-center">
          <NavLink
            to={`/profile`}
            key={'profile'}
            onClick={handleCloseSideBar}
          >
            <p className={usernameStyles}>
              {userData.fname} {userData.lname}
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
    </>
  )
}

class UserProfile extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      userData: '',
      password: '',
    }

  }

  componentDidMount() {
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
        this.setState({ userData: data.data });
        if (data.data == "token expired") {
          window.localStorage.clear();
          window.location.href = './sign-in';
        }
      })
  }

  render() {
    return (
      <div className="mt-10">
        <div className="flex flex-wrap lg:flex-wrap justify-center w-full ">
          <ProfileCard />
          {/* <LogoutButton /> */}
        </div>
      </div>
    )
  }
}

export default UserProfile