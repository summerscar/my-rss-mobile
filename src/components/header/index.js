import { Link, useLocation } from "react-router-dom";
import React from 'react'
import { Layout, Icon } from 'antd';
import Login from '../login'
const { Header } = Layout;

const NewHeader = () => {
  let location = useLocation();

  React.useEffect(() => {
    console.log(location)
  }, [location]);

  return (
    <Header>
      {location.pathname !== '/' ? (
        <Link
          to={{ pathname: '/' }}
        >
          <Icon type="left" style={{ fontSize: '20px', color: 'white' }} />
          <div style={{display: 'inline', float: 'right'}}>
            <Login/>
          </div>
        </Link>
      ) : <div style={{ color: 'white' }}>
        ANN NEWS
        <div style={{display: 'inline', float: 'right'}}>
          <Login/>
        </div>
      </div>
      }
    </Header>
  )
}

export default NewHeader
