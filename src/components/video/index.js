import React, {useState, useEffect, useContext} from 'react';
import { Button, Popover, ActivityIndicator  } from 'antd-mobile';
import axios from './../../utils/requset';
import { useLocation, useParams } from "react-router-dom";
import { useAuth } from "react-use-auth";
import dayjs from 'dayjs'
import { AppContext } from '../../context';

const Item = Popover.Item;
function Video(props) {
  const { user, setData } = useContext(AppContext);

  let location = useLocation();
  let [translation, setTranslation] = useState()
  const { id } = useParams()
  let [videoData, setVideoData] = useState(location.state && location.state.videoData)

  let [isloading, setIsloading] = useState(false)
  let [isAnotherloading, setIsAnotherloading] = useState(false)
  let [isAnanotherloading, setIsAnanotherloading] = useState(false)
  let [furigana, setFrigana] = useState()
  let [visiable, setVisiable] = useState(false)
  let { userId } = useAuth();

  let likes = user && 
      ((user['https://dev-ymyh-0n9:auth0:com/user_metadata'] && user['https://dev-ymyh-0n9:auth0:com/user_metadata'].likes) || 
      (user.user_metadata && user.user_metadata.likes))

  function getTranslate () {
    setIsloading(true)
    axios.post(`/api/auth/translate`, { content: videoData.contentsnippet })
      .then(res => {
        setTranslation(res.data.result)
        setIsloading(false)
      }).catch(e => {
        console.log(e)
        setIsloading(false)
      })
  }
  useEffect(() => {
    if (videoData) return
    axios.get(`/api/auth/videoSearch/${id}`)
      .then(res => {
        setVideoData(res.data)
      }).catch(e => {
        console.log(e)
      })
  }, [])

  function getfurigana (grade) {
    if (grade === '0') {
      setFrigana(null)
      return
    }
    setIsAnotherloading(true)
    axios.post(`/api/auth/furigana`, { content: videoData.contentsnippet, grade })
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
  function like () {
    setIsAnanotherloading(true)
    axios.post(`/api/auth/like`, { id: videoData.id, userId, title: videoData.title})
      .then(res => {
        setData('user', res.data)

        setIsAnanotherloading(false)
        // Toast.info('成功')
      }).catch(e => {
        console.log(e)
        setIsAnanotherloading(false)
      })
  }

  function handleMenuClick (value) {
    getfurigana(value.key)
    setVisiable(!visiable)
  }
  const menu = (
    <>
      <Item key="0">恢复</Item>
      <Item key="8">一般向け</Item>
      <Item key="1">小学1年生</Item>
      <Item key="2">小学2年生</Item>
      <Item key="3">小学3年生</Item>
      <Item key="4">小学4年生</Item>
      <Item key="5">小学5年生</Item>
      <Item key="6">小学6年生</Item>
      <Item key="7">小学7年生</Item>
    </>
  );

  return (videoData ?
    (<div className="videoWrapper">
      <div>
        <video src={videoData.url} width="100%" controls={true} autoPlay={true}/>
      </div>
      <div className="contentWrapper">
        <div style={{fontSize: '14px', fontWeight: 'bold'}}>{videoData.title}</div>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <div style={{display: 'flex'}}>
            <Button size="small" onClick={like} loading={isAnanotherloading} inline>
              {likes && likes.find(item => item.id === videoData.id) ? '已收藏' : '收藏'}
            </Button>
            <Button size="small" style={{marginLeft: '0.5rem'}} onClick={getTranslate} loading={isloading} inline>
              翻译
            </Button>
            <Popover
              overlayClassName="fortest"
              overlayStyle={{ color: 'currentColor' }}
              visible={visiable}
              overlay={menu}
              align={{
                overflow: { adjustY: 0, adjustX: 0 },
                offset: [-10, 0],
              }}
              onVisibleChange={() => setVisiable(!visiable)}
              onSelect={handleMenuClick}
            >
              <Button size="small" style={{marginLeft: '0.5rem'}} loading={isAnotherloading} inline>
                振り仮名
              </Button>
            </Popover>
          </div>
          <div style={{fontSize: '12px', lineHeight: '30px'}}>{dayjs(videoData.pubdate).format('YYYY/MM/DD HH:mm')}</div>
        </div>
        <div style={{paddingTop: '1rem'}}>{furigana || videoData.contentsnippet}</div>
        <div style={{paddingTop: '1rem'}}>{translation}</div>
      </div>
    </div>) :  
    <div className="loading">
      <ActivityIndicator size="large"/>
      <span>稍等一下哦</span>
    </div>
  );
}

export default Video;
