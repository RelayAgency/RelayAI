import { useAuth0 } from '@auth0/auth0-react';
import { useStateContext } from '../contexts/ContextProvider';

import React, { useEffect } from 'react'

const LogoutButton = () => {
  // const { logout, isAuthenticated } = useAuth0();
  const { currentColor } = useStateContext();

  const logout = () => {
    window.localStorage.clear();
    window.location.href = './sign-in';
  }
  return (
    // isAuthenticated && (
      <button
        onClick={() => logout()}
        style={{
          backgroundColor: currentColor,
          color:"white",
          borderRadius:"10px",
          width: "100%",
          padding: "12px",
        }}
      >
        Sign Out
      </button>
    // )

  )
}

export default LogoutButton