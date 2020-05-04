import React, { useState, useEffect, useContext } from 'react';
import './App.css';
import Index from './components/index';
import Likes from './page/likes'
import { Route, Switch, withRouter } from "react-router-dom";
import Header from './components/header'
import axios from './utils/requset';
import AUTHCallback from "./page/AUTHCALLBACK";
import {useAuth} from 'react-use-auth'
import { Drawer, List, Switch as AntSwitch, Picker } from 'antd-mobile';
import { AppContext } from '../src/context';
import { fixVideoUrl } from './utils/index'

const OFFSET = 4

function App(props) {
  const [videos, setVideos] = useState([])
  const [offset, setOffset] = useState(0)
  const [isloading, setIsloading] = useState(false)
  const { authResult, isAuthenticated, logout, login } = useAuth();
  const [docked, setDocked] = useState(false)
  const [ sequencePlay, setSequencePlay ] = useState(localStorage.getItem('sequencePlay') === 'true')
  const { ytbPlayer, setData, channels, channel } = useContext(AppContext)
  useEffect(() => {
    if (isAuthenticated()) {
      setIsloading(true)
      axios.get(`/api/auth/youtube/${channel}?offset=${offset}`).then(res => {
        res.data.items = res.data.items.map(video => fixVideoUrl(video))
        console.log(res.data)
        setVideos(videos => [...videos, ...res.data.items])
        setIsloading(false)
      })
    } else {
      if (!authResult) {
        setIsloading(true)
        axios.get(`/api/youtube/${channel}`).then(res => {
          console.log(res.data)
          setVideos(res.data.items)
          setIsloading(false)
        })
      }
    }
  }, [offset, channel])

  useEffect(() => {
    authResult && localStorage.setItem('accessToken', authResult.accessToken)
  }, [authResult])

  function logoutAction() {
    localStorage.removeItem('accessToken')
    logout()
  }
  function toLikes () {
    props.history.push('/likes')
    setDocked(false)
  }
  const sidebar = (<List>
      {!(isAuthenticated()) && <List.Item onClick={login}>登录</List.Item>}
      <List.Item onClick={toLikes}>收藏夹</List.Item>
      <List.Item
          extra={<AntSwitch
            color="#108ee9"
            checked={sequencePlay}
            onChange={() => {
              setSequencePlay(!sequencePlay)
              localStorage.setItem('sequencePlay', !sequencePlay)
            }}
          />}
      >连续播放</List.Item>
      <List.Item
        extra={<AntSwitch
          color="#108ee9"
          checked={ytbPlayer}
          onChange={() => {
            setData('ytbPlayer', !ytbPlayer)
            localStorage.setItem('ytbPlayer', !ytbPlayer)
          }}
        />}
      >Youtube播放器</List.Item>
      <Picker
        data={channels}
        cols={1}
        value={[channel]}
        onChange={(value) => {
          value = value[0]
          setData('channel', value)
          localStorage.setItem('channel', value)
          setVideos([])
          setOffset(0)
        }}
      >
        <List.Item arrow="horizontal">切换频道</List.Item>
      </Picker>
      {
        isAuthenticated() && <List.Item onClick={logoutAction}>注销</List.Item>
      }
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
            <Route path="/likes">
              <Likes />
            </Route>
            <Route path="/">
              <Index videos={videos} more={() => setOffset(offset => offset + OFFSET)} isloading={isloading}/>
            </Route>
          </Switch>
        </div>
        <div className="footer" style={{ textAlign: 'center' }}>News by <a href="https://github.com/summerscar/my-rss-node">summerscar</a></div>
      </div>
      <Route path="/auth0_callback" component={AUTHCallback} />
    </>
  );
}

export default withRouter(App);
