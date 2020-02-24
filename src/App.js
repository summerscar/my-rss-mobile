import React, {useState, useEffect} from 'react';
import './App.css';
import { Layout, Icon } from 'antd';
import {useLocation, Link} from 'react-router-dom'
const { Header, Content, Footer } = Layout;

function App(props) {
  let location = useLocation();
  React.useEffect(() => {
   console.log(location)
  }, [location]);
  
  return (
    <Layout className="layout">
      <Header>
        {location.pathname !== '/' ? (
          <Link
            to={{pathname: '/'}}
          >
             <Icon type="left" style={{fontSize: '20px', color: 'white'}}/>
          </Link>
          ) : <div style={{color: 'white'}}>ANN NEWS</div>
        }
        
      </Header>
      <Content style={{ padding: '0 50px' }}>
        {props.children}
      </Content>
      <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
    </Layout>
  );
}

export default App;
