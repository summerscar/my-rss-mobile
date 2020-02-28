import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter, withRouter } from "react-router-dom";
import { AuthProvider } from "react-use-auth";
import * as serviceWorker from './serviceWorker';

const Provide = withRouter((props) => (
  <AuthProvider
    navigate={props.history.push}
    auth0_domain="dev-ymyh-0n9.auth0.com"
    auth0_client_id="U9Ypez6umr0NvVSRxPfcTwEgj8WGIz6p"
    auth0_language="zh"
  >
    <App/>
  </AuthProvider>
))

ReactDOM.render(
  <BrowserRouter>
    <Provide/>
  </BrowserRouter>
, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
