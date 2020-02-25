import React, { useState, useEffect } from 'react';
import './App.css';
import { Layout } from 'antd';
import Index from './components/index';
import Video from './components/video';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Header from './components/header'
import axios from 'axios';
const { Content, Footer } = Layout;


function App() {
  const [videos, setVideos] = useState()

  useEffect(() => {
    axios.get('/api/youtube/ANNnewsCH').then(res => {
      console.log(res.data)
      setVideos(res.data.items)
    })
  }, [])

  return (
    <BrowserRouter>
      <Layout className="layout">
        <Header></Header>
        <Content style={{ padding: '0 50px' }}>
          <Switch>
            <Route exact path="/">
              <Index videos={videos} />
            </Route>
            <Route path="/video/:title">
              <Video />
            </Route>
          </Switch>
        </Content>
        <Footer style={{ textAlign: 'center' }}>ANN News by <a href="https://github.com/summerscar/my-rss-node">summerscar</a></Footer>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
