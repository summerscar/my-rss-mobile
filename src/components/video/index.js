import React from 'react';
import {
  useLocation
} from "react-router-dom";

function Video(props) {
  let location = useLocation();
  let data = location.state.data
    
  return (
    <div className="videoWrapper">
      <div>
        <video src={data.url} width="100%" controls={true} autoPlay={true}/>
      </div>
      <div className="contentWrapper">
        <div style={{fontSize: '14px', fontWeight: 'bold'}}>{data.title}</div>
        <div style={{fontSize: '12px', textAlign: 'right'}}>{new Date(data.pubdate).toLocaleString()}</div>
        <div style={{paddingTop: '1rem'}}>{data.contentsnippet}</div>
      </div>
    </div>
  );
}

export default Video;
