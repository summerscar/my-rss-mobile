import React, { useRef, useContext } from 'react';
import { Link, Route } from "react-router-dom";
import { Button, ActivityIndicator } from 'antd-mobile';
import {useAuth} from 'react-use-auth'
import dayjs from 'dayjs'
import Video from '../../components/video'
import { AppContext } from '../../context/index';

function App(props) {
  const { isAuthenticated, login } = useAuth();
  const {videos, isloading} = props
  const videosRef =  useRef([])
  const { channel } = useContext(AppContext)

  function watched (id, title) {

    videosRef.current.forEach(video => video.pause())
    // axios.post(`/api/auth/watched`, { id, userId, title})
    //   .then(res => {
    //     console.log(res)
    //   }).catch(e => {
    //     console.log(e)
    //   })
  }
  return (
    <div className="homeWrapper">
      {videos.length ? videos.map((item, index) => {
        return (<div key={index} className="videoItem">
          <div>
            <video
              ref={ref => videosRef.current[index] = ref}
              className="videoRadius"
              src={item.url} 
              width="100%" 
              controls={true} 
              preload={'none'}
              poster={`image/${channel}.jpg`}
            />
          </div>
          <Link 
            className="link"
            to={{
              pathname: "/video/" + item.id,
              state: { data: item }
            }}
            onClick={() => watched(item.id, item.title)}
          >
            {item.title}
            <div  style={{fontSize: '12px'}}>{dayjs(item.pubdate).format('YYYY/MM/DD HH:mm')}</div>
          </Link>
        </div>
      )}) : 
        isloading ? 
          <div className="loading">
            <ActivityIndicator size="large"/>
            <span>稍等一下哦</span>
          </div> 
          : null}
      {videos.length > 0 && (
        <Button size="small" onClick={ isAuthenticated() ? props.more : login } loading={isloading}>
          更多
        </Button>
      )}
      <Route path="/video/:id">
        <Video />
      </Route>
    </div>
  );
}

export default App;
