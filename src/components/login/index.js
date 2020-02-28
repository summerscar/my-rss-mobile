import React from 'react'
import {  Button } from 'antd';
import { useAuth } from "react-use-auth";


const Login = () => {
  const { isAuthenticated, login, logout, authResult } = useAuth();
  console.log('user: ', authResult)

  function logoutAction() {
    localStorage.removeItem('accessToken')
    logout()
  }
  
  if (isAuthenticated()) {
    return (
      <div>
        {authResult && 
          (
            authResult.idTokenPayload.picture ? 
              <img style={{marginRight: '0.5rem'}} width="20px" src={authResult.idTokenPayload.picture} alt={authResult.idTokenPayload.name}/> : 
              <span style={{paddingRight: '0.5rem'}}>{authResult.idTokenPayload.name}</span>
          )
        }
        <Button
          size="small"
          icon="poweroff"
          loading={!authResult}
          onClick={logoutAction}
        >
        </Button>
      </div>);
  } else {
    return <Button onClick={login}>登录</Button>;
  }
};

export default Login