import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter, withRouter } from "react-router-dom";
import { AuthProvider } from "react-use-auth";
import * as serviceWorker from './serviceWorker';
import { AppContextProvider } from '../src/context';

const Provide = withRouter((props) => (
  <AuthProvider
    navigate={props.history.push}
    auth0_domain="dev-ymyh-0n9.auth0.com"
    auth0_client_id="U9Ypez6umr0NvVSRxPfcTwEgj8WGIz6p"
    auth0_language="zh"
    auth0_params={{scope: 'openid profile email read:current_user update:current_user_metadata create:current_user_metadata'}}
  >
    <App/>
  </AuthProvider>
))

ReactDOM.render(
  <BrowserRouter>
    <AppContextProvider>
      <Provide/>
    </AppContextProvider>
  </BrowserRouter>
, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
