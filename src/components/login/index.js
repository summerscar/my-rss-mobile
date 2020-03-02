import React from 'react'
import { Button, ActivityIndicator } from 'antd-mobile';
import { useAuth } from "react-use-auth";


const Login = () => {
  const { isAuthenticated, login, authResult } = useAuth();
  console.log('user: ', authResult)

  
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
        <ActivityIndicator animating={!authResult} />
      </div>);
  } else {
    return <Button onClick={login} size="small">登录</Button>;
  }
};

export default Login