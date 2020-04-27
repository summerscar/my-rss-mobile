import React, { useState, useEffect, useContext, useRef } from 'react';
import { Button, Popover, ActivityIndicator } from 'antd-mobile';
import axios from './../../utils/requset';
import { useLocation, useParams, withRouter, Link } from "react-router-dom";
import { useAuth } from "react-use-auth";
import dayjs from 'dayjs'
import { AppContext } from '../../context';

const Item = Popover.Item;
function Video({ videos, ...props }) {
  const { user, ytbPlayer, channel, setData } = useContext(AppContext);

  const location = useLocation();
  const [translation, setTranslation] = useState('')
  const { id } = useParams()
  const [videoData, setVideoData] = useState(location.state && location.state.data)
  const [isloading, setIsloading] = useState(false)
  const [isAnotherloading, setIsAnotherloading] = useState(false)
  const [isAnanotherloading, setIsAnanotherloading] = useState(false)
  const [furigana, setFrigana] = useState('')
  const [visiable, setVisiable] = useState(false)
  const { userId, isAuthenticated, login } = useAuth();

  console.log('videos', props.videos)
  let likes = user &&
    ((user['https://dev-ymyh-0n9:auth0:com/user_metadata'] && user['https://dev-ymyh-0n9:auth0:com/user_metadata'].likes) ||
      (user.user_metadata && user.user_metadata.likes))

  function getTranslate() {
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

  const prevID = useRef(0)
  useEffect(() => {
    if (prevID.current && prevID.current !== id) {
      setTranslation('')
      setFrigana('')
      setVideoData(null)
    }
    prevID.current = id

    if (videoData) return
    axios.get(`/api/auth/videoSearch/${id}`)
      .then(res => {
        setVideoData(res.data)
        console.log('setvodedata', videoData)
      }).catch(e => {
        console.log(e)
      })
  }, [videoData, id])

  const videoRef = useRef()
  useEffect(() => {
    if (videoRef.current && localStorage.getItem('sequencePlay') === 'true') {
      async function next() {
        let { data } = await axios.post(`/api/auth/videoPrev`, { name: channel, isodate: videoData.isodate })
        props.history.push(`/video/${data.id}`)
      }
      let video = videoRef.current
      video.addEventListener('ended', next)
      return () => video.removeEventListener('ended', next)
    }
  }, [videoData])

  function getfurigana(grade) {
    if (grade === '0') {
      setFrigana(null)
      return
    }
    setIsAnotherloading(true)
    axios.post(`/api/auth/furigana`, { content: videoData.contentsnippet.replace(/<br>/g, '\n'), grade })
      .then(res => {
        setFrigana(
          res.data.WordList.Word.map((item, index) => (
            item.Surface._cdata ? '\n' :
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
  function like() {
    setIsAnanotherloading(true)
    axios.post(`/api/auth/like`, { id: videoData.id, userId, title: videoData.title })
      .then(res => {
        setData('user', res.data)

        setIsAnanotherloading(false)
        // Toast.info('成功')
      }).catch(e => {
        console.log(e)
        setIsAnanotherloading(false)
      })
  }

  function handleMenuClick(value) {
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

  return (
    <div className="videoWrapper">
      {videoData ?
        <div className="wrapper">
          <div>
            {!ytbPlayer && videoData.url ?
              <video ref={videoRef} src={videoData.url} width="100%" controls={true} autoPlay={true} /> :
              <iframe
                src={`https://www.youtube.com/embed/${(new URL(videoData.link)).searchParams.get('v')}`}
                style={{ width: '100vw', height: 'calc(9 / 16 * 100vw)' }}
                title={videoData.title}
                frameBorder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen>
              </iframe>
            }
          </div>
          <div className="contentWrapper">
            <div style={{ fontSize: '14px', fontWeight: 'bold', padding: '0.5rem 0' }}>{videoData.title}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex' }}>
                <Button size="small" onClick={like} loading={isAnanotherloading} inline>
                  {likes && likes.find(item => item.id === videoData.id) ? '已收藏' : '收藏'}
                </Button>
                <Button size="small" style={{ marginLeft: '0.4rem' }} onClick={getTranslate} loading={isloading} inline>
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
                  <Button size="small" style={{ marginLeft: '0.4rem' }} loading={isAnotherloading} inline>
                    振り仮名
              </Button>
                </Popover>
              </div>
              <div style={{ fontSize: '12px', lineHeight: '30px' }}>{dayjs(videoData.pubdate).format('MM/DD HH:mm')}</div>
            </div>
            <div style={{ paddingTop: '1rem', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>{furigana || videoData.contentsnippet.replace(/<br>/g, '\n')}</div>
            <div style={{ paddingTop: '1rem', whiteSpace: 'pre-wrap', lineHeight: '1.3', color: 'rgb(58, 58, 58)' }}>{translation.replace(/<br><br>/g, '<br>').replace(/<br>/g, '\n')}</div>
          </div>
          <div className="footer" style={{ textAlign: 'center' }}>News by <a href="https://github.com/summerscar/my-rss-node">summerscar</a></div>
        </div> :
        <div className="wrapper">
          <div className="loading">
            <ActivityIndicator size="large" />
            <span>稍等一下哦</span>
          </div>
        </div>
      }
      <div className="listwrapper">
        {videos.length ? videos.map((item, index) => {
          return (<div key={index} className={`videoItem ${Number(id) === item.id ? 'activity' : ''}`}>
            <Link
              className="link"
              to={{
                pathname: "/video/" + item.id,
                state: { data: item }
              }}
            >
              <div>
                <img
                  alt="video"
                  src={`/image/${channel}.jpg`}
                />
              </div>

              {item.title}
              <div style={{ fontSize: '12px' }}>{dayjs(item.pubdate).format('YYYY/MM/DD HH:mm')}</div>
            </Link>
          </div>
          )
        }) : null}
        <i className="video" /><i className="video" /><i className="video" /><i className="video" /><i className="video" />
        {videos.length > 0 && (
          <Button style={{ width: '100%' }} size="small" onClick={isAuthenticated() ? props.more : login} loading={isloading}>
            更多
          </Button>
        )}
      </div>
    </div>
  );
}

export default withRouter(Video);
