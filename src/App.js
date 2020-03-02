import React, { useState, useEffect } from 'react';
import './App.css';
import Index from './components/index';
import Video from './components/video';
import { Route, Switch } from "react-router-dom";
import Header from './components/header'
import axios from './utils/requset';
import AUTHCallback from "./page/AUTHCALLBACK";
import {useAuth} from 'react-use-auth'
import { Drawer, List } from 'antd-mobile';

const OFFSET = 4

function App(props) {
  const [videos, setVideos] = useState([])
  const [offset, setOffset] = useState(0)
  const [isloading, setIsloading] = useState(false)
  const { authResult, isAuthenticated, logout } = useAuth();
  const [docked, setDocked] = useState(false)

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

  function logoutAction() {
    localStorage.removeItem('accessToken')
    logout()
  }

  const sidebar = (<List>
      {
        isAuthenticated() ? 
          <List.Item onClick={logoutAction}>注销</List.Item> : 
          <List.Item>登录</List.Item>
      }
      <List.Item>收藏夹</List.Item>
  </List>);
  
  return (
    <>
      <div className="layout">
        <Header openDock={() => setDocked(docked => !docked)}></Header>
        <Drawer
          children={<></>}
          className="my-drawer"
          style={{pointerEvents: docked ? 'auto' : 'none'}}
          contentStyle={{ color: '#A6A6A6', textAlign: 'center', paddingTop: 42 }}
          sidebar={sidebar}
          open={docked}
          onOpenChange={() => setDocked(docked => !docked)}
        >
        </Drawer>
        <div className="indexWrapper">
          <Switch>
            <Route exact path="/">
              <Index videos={videos} more={() => setOffset(offset => offset + OFFSET)} isloading={isloading}/>
            </Route>
            <Route path="/video/:id">
              <Video />
            </Route>
          </Switch>
        </div>
        <div className="footer" style={{ textAlign: 'center' }}>ANN News by <a href="https://github.com/summerscar/my-rss-node">summerscar</a></div>
      </div>
      <Route path="/auth0_callback" component={AUTHCallback} />
    </>  
  );
}

export default App;
