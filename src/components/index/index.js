import React from 'react';
import { Link } from "react-router-dom";
import { Spin } from 'antd';

function App(props) {
  const {videos} = props
  return (
    <div className="homeWrapper">
      {videos ? videos.map((item, index) => {

        let url = `https://myrssvideo.s3.jp-tok.cloud-object-storage.appdomain.cloud/${item.url}`

        return (<div key={index} className="videoItem">
          <div>
            <video 
              src={url} 
              width="100%" 
              controls={true} 
              preload={index === 0 ? 'auto' : 'none'}
              poster={'/annnews.jpg'}
            />
          </div>
          <Link 
            className="link"
            to={{
              pathname: "/video/" + item.title,
              state: { data: item }
            }}
          >
            {item.title}
            <div  style={{fontSize: '12px'}}>{new Date(item.pubdate).toLocaleString()}</div>
          </Link>
        </div>
      )}) : <Spin tip="稍等一下哦" size="large"/>}
    </div>
  );
}

export default App;
