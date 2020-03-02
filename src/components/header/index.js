import { useLocation, withRouter } from "react-router-dom";
import React from 'react'
import Login from '../login'
import { NavBar, Icon } from 'antd-mobile';

const Header = (props) => {
  let location = useLocation();

  React.useEffect(() => {
    console.log(location)
  }, [location]);

  return (
    <NavBar
      mode="dark"
      icon={location.pathname === '/' ? <Icon key="1" type="ellipsis" /> : <Icon type="left" />}
      onLeftClick={location.pathname === '/' ? props.openDock : () => props.history.goBack()}
      rightContent={[
        <Login key="0"/>
      ]}
    >ANN NEWS</NavBar>
  )
}

export default withRouter(Header)
