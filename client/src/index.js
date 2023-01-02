import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './App';
import { ContextProvider } from './contexts/ContextProvider';

import { Auth0Provider } from '@auth0/auth0-react';

ReactDOM.render(
  // <React.StrictMode>
    
      <ContextProvider>
        <App />
      </ContextProvider>
    
  // </React.StrictMode>
  ,
  document.getElementById('root'),
)