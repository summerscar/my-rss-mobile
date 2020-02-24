import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Index from './components/index';
import Video from './components/video';

import * as serviceWorker from './serviceWorker';
import { BrowserRouter, Route, Link, Switch } from "react-router-dom";


ReactDOM.render(
<BrowserRouter>
  <App>
    <Switch>
      <Route exact path="/">
        <Index />
      </Route>
      <Route path="/video/:title">
        <Video />
      </Route>
    </Switch>
  </App>
</BrowserRouter>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
