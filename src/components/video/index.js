import React, {useState} from 'react';
import {Button, Spin, message} from 'antd'
import axios from 'axios'
import { useLocation } from "react-router-dom";

function Video(props) {
  const accessToken = localStorage.getItem('accessToken')
  let location = useLocation();
  let [translation, setTranslation] = useState()
  let data = location.state.data
  let [isloading, setIsloading] = useState(false)
  let [isAnotherloading, setIsAnotherloading] = useState(false)

  function getTranslate () {
    if (!accessToken) {
      message.info('你需要登录哦')
      return
    }
    setIsloading(true)
    axios.post(`/api/auth/translate`,
      { content: data.contentsnippet },
      {
        headers: {Authorization: `Bearer ${accessToken}`},
        data: { content: data.contentsnippet }
      })
      .then(res => {
        setTranslation(res.data.result)
        setIsloading(false)
      }).catch(e => {
        console.log(e)
        setIsloading(false)
      })
  }

  function getMecab () {
    if (!accessToken) {
      message.info('你需要登录哦')
      return
    }
    setIsAnotherloading(true)
    axios.post(`/api/auth/mecab`,
      { content: data.contentsnippet },
      {
        headers: {Authorization: `Bearer ${accessToken}`}
      })
      .then(res => {
        setTranslation(res.data.result.join(' · '))
        setIsAnotherloading(false)
      }).catch(e => {
        console.log(e)
        setIsAnotherloading(false)
      })
  }

  return (
    <div className="videoWrapper">
      <div>
        <video src={data.url} width="100%" controls={true} autoPlay={true}/>
      </div>
      <div className="contentWrapper">
        <div style={{fontSize: '14px', fontWeight: 'bold'}}>{data.title}</div>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <div>
            <Button size="small" onClick={getTranslate}>
              翻译
              {isloading && <Spin size="small" style={{paddingLeft: '0.5rem'}}/>}
            </Button>
            {/* <Button size="small" onClick={getMecab} style={{marginLeft: '0.2rem'}}>
              分词
              {isAnotherloading && <Spin size="small" style={{paddingLeft: '0.5rem'}}/>}
            </Button> */}
          </div>
          <div style={{fontSize: '12px'}}>{new Date(data.pubdate).toLocaleString()}</div>
        </div>
        <div style={{paddingTop: '1rem'}}>{data.contentsnippet}</div>
        <div style={{paddingTop: '1rem'}}>{translation}</div>
      </div>
    </div>
  );
}

export default Video;
