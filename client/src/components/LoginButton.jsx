import { useAuth0 } from '@auth0/auth0-react';
import { useStateContext } from '../contexts/ContextProvider';

import React, { useEffect } from 'react'

const LoginButton = () => {
  // const { loginWithRedirect, isAuthenticated } = useAuth0();
  const { currentColor } = useStateContext();

  const loginWithRedirect = () => {
    window.location.href = "./sign-in";
  }
  return (
    // !isAuthenticated && (
      <button
        onClick={() => loginWithRedirect()}
        style={{
          backgroundColor: currentColor,
          color:"white",
          borderRadius:"10px",
          width: "100%",
          padding: "12px",
        }}
      >
        Sign In
      </button>
    // )

  )
}

export default LoginButton