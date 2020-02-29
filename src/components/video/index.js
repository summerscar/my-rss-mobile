import React, {useState, useRef} from 'react';
import {Button, Spin, Dropdown, Menu} from 'antd'
import axios from './../../utils/requset';
import { useLocation } from "react-router-dom";

function Video(props) {
  let location = useLocation();
  let [translation, setTranslation] = useState()
  let data = location.state.data
  let [isloading, setIsloading] = useState(false)
  let [isAnotherloading, setIsAnotherloading] = useState(false)
  let [furigana, setFrigana] = useState()

  function getTranslate () {
    setIsloading(true)
    axios.post(`/api/auth/translate`, { content: data.contentsnippet })
      .then(res => {
        setTranslation(res.data.result)
        setIsloading(false)
      }).catch(e => {
        console.log(e)
        setIsloading(false)
      })
  }

  function getfurigana (grade) {
    if (grade === '0') {
      setFrigana(null)
      return
    }
    setIsAnotherloading(true)
    axios.post(`/api/auth/furigana`, { content: data.contentsnippet, grade })
      .then(res => {
        setFrigana(
          res.data.WordList.Word.map((item, index) => (
            <ruby key={index}>
              {item.Surface._text}
              {item.Furigana ? (<><rp>(</rp><rt>{item.Furigana._text}</rt><rp>)</rp></>) : null}
            </ruby>
          ))
        )
        setIsAnotherloading(false)
      }).catch(e => {
        console.log(e)
        setIsAnotherloading(false)
      })
  }

  function getMecab () {
    setIsAnotherloading(true)
    axios.post(`/api/auth/mecab`, { content: data.contentsnippet })
      .then(res => {
        setTranslation(res.data.result.join(' · '))
        setIsAnotherloading(false)
      }).catch(e => {
        console.log(e)
        setIsAnotherloading(false)
      })
  }
  function handleMenuClick (value) {
    getfurigana(value.key)
  }
  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="0">恢复</Menu.Item>
      <Menu.Item key="8">一般向け</Menu.Item>
      <Menu.Item key="1">小学1年生</Menu.Item>
      <Menu.Item key="2">小学2年生</Menu.Item>
      <Menu.Item key="3">小学3年生</Menu.Item>
      <Menu.Item key="4">小学4年生</Menu.Item>
      <Menu.Item key="5">小学5年生</Menu.Item>
      <Menu.Item key="6">小学6年生</Menu.Item>
      <Menu.Item key="7">小学7年生</Menu.Item>
    </Menu>
  );

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
            <Dropdown overlay={menu}>
              <Button size="small" style={{marginLeft: '0.2rem'}}>
                振り仮名  {isAnotherloading && <Spin size="small" style={{paddingLeft: '0.5rem'}}/>}
              </Button>
            </Dropdown>
            {/* <Button size="small" onClick={getMecab} style={{marginLeft: '0.2rem'}}>
              分词
              {isAnotherloading && <Spin size="small" style={{paddingLeft: '0.5rem'}}/>}
            </Button> */}
          </div>
          <div style={{fontSize: '12px'}}>{new Date(data.pubdate).toLocaleString()}</div>
        </div>
        <div style={{paddingTop: '1rem'}}>{furigana || data.contentsnippet}</div>
        <div style={{paddingTop: '1rem'}}>{translation}</div>
      </div>
    </div>
  );
}

export default Video;
