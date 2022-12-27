import React, { useEffect } from 'react';
import { AiOutlineMenu } from 'react-icons/ai';
// import { FiShoppingCart } from 'react-icons/fi';
// import { BsChatLeft } from 'react-icons/bs';
// import { RiNotification3Line } from 'react-icons/ri';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';

// import avatar from '../data/avatar.jpg';
// import { Cart, Chat, Notification, UserProfile } from '.';
import { UserProfile } from '.';
import { useStateContext } from '../contexts/ContextProvider';

import { useAuth0 } from '@auth0/auth0-react';
import LoginButton from './LoginButton';


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

const Navbar = () => {
  const { currentColor, activeMenu, setActiveMenu, handleClick, isClicked, setScreenSize, screenSize } = useStateContext();
  const { user, isAuthenticated, isLoading, error } = useAuth0();

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

  const handleActiveMenu = () => setActiveMenu(!activeMenu);

  return (
    <div className="flex justify-between p-2 md:ml-6 md:mr-6 relative">

      <NavButton title="Menu" customFunc={handleActiveMenu} color={currentColor} icon={<AiOutlineMenu />} />
      <div className="flex">
        {/*         
        <NavButton
          title="Cart"
          customFunc={() => handleClick('cart')}
          color={currentColor}
          icon={<FiShoppingCart />}
        />
        <NavButton
          title="Chat"
          dotColor="#03C9D7"
          customFunc={() => handleClick('chat')}
          color={currentColor}
          icon={<BsChatLeft />}
        />
        <NavButton
          title="Notification"
          dotColor="rgb(254, 201, 15)"
          customFunc={() => handleClick('notification')}
          color={currentColor}
          icon={<RiNotification3Line />}
        /> */}
        {error ? <span className="text-gray-400 font-bold ml-1 text-14">
          Authentication Error</span> : <>
          {isLoading ? <span className="text-gray-400 font-bold ml-1 text-14">
            Loading...</span> : <>
            {isAuthenticated ?
              <TooltipComponent content="Profile" position="BottomCenter">
                <div
                  className="flex items-center gap-2 cursor-pointer p-1 hover:bg-light-gray rounded-lg"
                  onClick={() => handleClick('userProfile')}
                >

                  {user?.picture &&
                    <img
                      className="rounded-full h-8 w-8"
                      src={user.picture}
                      alt={user.name}
                    />
                  }
                  <p>
                    <span className="text-gray-400 text-14">Hi,</span>{' '}
                    {user.name ? <span className="text-gray-400 font-bold ml-1 text-14">
                      {user.name}
                    </span> : <span className="text-gray-400 font-bold ml-1 text-14">
                      {user.nickname}
                    </span>}

                  </p>
                  <MdKeyboardArrowDown className="text-gray-400 text-14" />
                </div>
              </TooltipComponent>
              : <LoginButton />
            }
          </>
          }
        </>
        }

        {isClicked.userProfile && (<UserProfile />)}
      </div>
    </div>
  );
};

export default Navbar;