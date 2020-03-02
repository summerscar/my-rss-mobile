import React from 'react';
import { Link } from "react-router-dom";
import { Button, ActivityIndicator } from 'antd-mobile';
import {useAuth} from 'react-use-auth'

function App(props) {
  const { isAuthenticated, login } = useAuth();
  const {videos, isloading} = props

  return (
    <div className="homeWrapper">
      {videos.length ? videos.map((item, index) => {
        return (<div key={index} className="videoItem">
          <div>
            <video
              className="videoRadius"
              src={item.url} 
              width="100%" 
              controls={true} 
              preload={index === 0 ? 'auto' : 'none'}
              poster={'/annnews.jpg'}
            />
          </div>
          <Link 
            className="link"
            to={{
              pathname: "/video/" + item.id,
              state: { data: item }
            }}
          >
            {item.title}
            <div  style={{fontSize: '12px'}}>{new Date(item.pubdate).toLocaleString()}</div>
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
    </div>
  );
}

export default App;
