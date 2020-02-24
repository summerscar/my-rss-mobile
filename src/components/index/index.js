import React, {useState, useEffect} from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';

function App() {
  const [videos, setVideos] = useState()

  useEffect(() => {
    axios.get('/api/youtube/ANNnewsCH').then(res => {
      console.log(res.data)
      setVideos(res.data.items)
    })
  }, [])

  return (
    <div className="homeWrapper">
      {videos && videos.map((item, index) => {

        let url = process.env.NODE_ENV === 'development' ? 
          `http://localhost:3000/videos/${item.url}` : 
          `/videos/${item.url}`

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
            <div>{new Date(item.pubDate).toLocaleString()}</div>
          </Link>
        </div>
      )})}
    </div>
  );
}

export default App;
