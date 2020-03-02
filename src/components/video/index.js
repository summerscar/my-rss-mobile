import React, {useState, useEffect} from 'react';
import { Button, Popover, Toast  } from 'antd-mobile';
import axios from './../../utils/requset';
import { useLocation, useParams } from "react-router-dom";
import { useAuth } from "react-use-auth";
import dayjs from 'dayjs'

const Item = Popover.Item;
function Video(props) {
  let location = useLocation();
  let [translation, setTranslation] = useState()
  const { id } = useParams()
  let [data, setData] = useState(location.state && location.state.data)

  let [isloading, setIsloading] = useState(false)
  let [isAnotherloading, setIsAnotherloading] = useState(false)
  let [isAnanotherloading, setIsAnanotherloading] = useState(false)
  let [furigana, setFrigana] = useState()
  let [visiable, setVisiable] = useState(false)
  let { userId, user } = useAuth();

  let [likes, setLikes] = useState(user && 
              user['https://dev-ymyh-0n9:auth0:com/user_metadata'] && 
              user['https://dev-ymyh-0n9:auth0:com/user_metadata'].likes)

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
  useEffect(() => {
    if (data) return
    axios.get(`/api/auth/videoSearch/${id}`)
      .then(res => {
        setData(res.data)
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
  function like () {
    setIsAnanotherloading(true)
    axios.post(`/api/auth/like`, { id: data.id, userId, title: data.title})
      .then(res => {
        setLikes(res.data && 
          res.data.user_metadata && 
          res.data.user_metadata.likes)
        setIsAnanotherloading(false)
        // Toast.info('成功')
      }).catch(e => {
        console.log(e)
        setIsAnanotherloading(false)
      })
  }
  // function getMecab () {
  //   setIsAnotherloading(true)
  //   axios.post(`/api/auth/mecab`, { content: data.contentsnippet })
  //     .then(res => {
  //       setTranslation(res.data.result.join(' · '))
  //       setIsAnotherloading(false)
  //     }).catch(e => {
  //       console.log(e)
  //       setIsAnotherloading(false)
  //     })
  // }
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

  return (!!data ?
    (<div className="videoWrapper">
      <div>
        <video src={data.url} width="100%" controls={true} autoPlay={true}/>
      </div>
      <div className="contentWrapper">
        <div style={{fontSize: '14px', fontWeight: 'bold'}}>{data.title}</div>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <div style={{display: 'flex'}}>
            <Button size="small" onClick={like} loading={isAnanotherloading} inline>
              {likes && likes.find(item => item.id === data.id) ? '已收藏' : '收藏'}
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
            {/* <Button size="small" onClick={getMecab} style={{marginLeft: '0.2rem'}}>
              分词
              {isAnotherloading && <Spin size="small" style={{paddingLeft: '0.5rem'}}/>}
            </Button> */}
          </div>
          <div style={{fontSize: '12px', lineHeight: '30px'}}>{dayjs(data.pubdate).format('YY/MM/DD HH:mm')}</div>
        </div>
        <div style={{paddingTop: '1rem'}}>{furigana || data.contentsnippet}</div>
        <div style={{paddingTop: '1rem'}}>{translation}</div>
      </div>
    </div>) : null
  );
}

export default Video;
