import React, { useState, useEffect } from 'react';
import './App.css';
import { Layout } from 'antd';
import Index from './components/index';
import Video from './components/video';
import { Route, Switch } from "react-router-dom";
import Header from './components/header'
import axios from './utils/requset';
import AUTHCallback from "./page/AUTHCALLBACK";
import {useAuth} from 'react-use-auth'
const OFFSET = 4
const { Content, Footer } = Layout;

function App(props) {
  const [videos, setVideos] = useState([])
  const [offset, setOffset] = useState(0)
  const [isloading, setIsloading] = useState(false)
  const { authResult, isAuthenticated } = useAuth();

  useEffect(() => {
      if (isAuthenticated()) {
        setIsloading(true)
        axios.get(`/api/auth/youtube/ANNnewsCH?offset=${offset}`).then(res => {
          console.log(res.data)
          setVideos(videos => [...videos, ...res.data.items])
          setIsloading(false)
        })
      } else {
        if (!authResult) {
          setIsloading(true)
          axios.get(`/api/youtube/ANNnewsCH`).then(res => {
            console.log(res.data)
            setVideos(res.data.items)
            setIsloading(false)
          })
        } 
      }
    }, [offset])

    useEffect(() => {
      authResult && localStorage.setItem('accessToken', authResult.accessToken)
    }, [authResult])
  return (
    <>
      <Layout className="layout">
        <Header></Header>
        <Content style={{ padding: '0 50px' }}>
          <Switch>
            <Route exact path="/">
              <Index videos={videos} more={() => setOffset(offset => offset + OFFSET)} isloading={isloading}/>
            </Route>
            <Route path="/video/:title">
              <Video />
            </Route>
          </Switch>
        </Content>
        <Footer style={{ textAlign: 'center' }}>ANN News by <a href="https://github.com/summerscar/my-rss-node">summerscar</a></Footer>
      </Layout>
      <Route path="/auth0_callback" component={AUTHCallback} />
    </>  
  );
}

export default App;
