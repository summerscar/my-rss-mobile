import React, {useState, useEffect} from 'react';
import {
  useLocation
} from "react-router-dom";

function Video(props) {
  let location = useLocation();
  let data = location.state.data

  let url = process.env.NODE_ENV === 'development' ? 
    `http://localhost:3000/videos/${data.url}` : 
    `/videos/${data.url}`
    
  return (
    <>
      <div className="videoItem">
        <div>
          <video src={url} width="100%" controls={true} autoPlay={true}/>
        </div>
        <div className="contentWrapper">
          <div>{data.title}</div>
          <div>{new Date(data.pubDate).toLocaleString()}</div>
          <div>{data.contentSnippet}</div>
        </div>
      </div>
    </>
  );
}

export default Video;
