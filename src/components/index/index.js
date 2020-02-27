import React from 'react';
import { Link } from "react-router-dom";
import { Spin, Button } from 'antd';

function App(props) {
  const {videos, isloading} = props
  return (
    <div className="homeWrapper">
      {videos.length ? videos.map((item, index) => {
        return (<div key={index} className="videoItem">
          <div>
            <video 
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
              pathname: "/video/" + item.title,
              state: { data: item }
            }}
          >
            {item.title}
            <div  style={{fontSize: '12px'}}>{new Date(item.pubdate).toLocaleString()}</div>
          </Link>
        </div>
      )}) : <div className="loading"><Spin tip="稍等一下哦" size="large"/></div>}
      {videos.length > 0 && (
        <Button shape="round" block onClick={props.more}>
          更多 {isloading && <Spin size="small" style={{paddingLeft: '0.5rem'}}/>}
        </Button>
      )}
    </div>
  );
}

export default App;
