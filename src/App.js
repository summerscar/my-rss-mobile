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
  const [videos, setVideos] = useState([])
  const [offset, setOffset] = useState(0)
  const [isloading, setIsloading] = useState(false)
  useEffect(() => {
    setIsloading(true)
    axios.get(`/api/youtube/ANNnewsCH?offset=${offset}`).then(res => {
      console.log(res.data)
      setVideos([...videos, ...res.data.items])
      setIsloading(false)
    })
  }, [offset])

  return (
    <BrowserRouter>
      <Layout className="layout">
        <Header></Header>
        <Content style={{ padding: '0 50px' }}>
          <Switch>
            <Route exact path="/">
              <Index videos={videos} more={() => setOffset(offset + 8)} isloading={isloading}/>
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
