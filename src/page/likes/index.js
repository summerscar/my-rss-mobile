import React from 'react';
import { List } from 'antd-mobile';
import { useAuth } from "react-use-auth";
import dayjs from 'dayjs'
import { withRouter } from "react-router-dom";

const Item = List.Item;

function Likes(props) {
  const { user } = useAuth();
  const likes = user && 
                user['https://dev-ymyh-0n9:auth0:com/user_metadata'] && 
                user['https://dev-ymyh-0n9:auth0:com/user_metadata'].likes

  return (
    <div className="likes">
      <div style={{textAlign: 'center', fontSize: '20px', padding: '1rem'}}>收藏夹</div>
      <List style={{margin: '0 1rem'}}>
        {likes && likes.map((item, index) => (
          <Item key={index} onClick={() => props.history.push('/video/' + item.id)}>
            {dayjs(item.time).format('MM/DD HH:mm') + ' ' + item.title}
          </Item>
        ))}
       
      </List>
    </div>
  );
}

export default withRouter(Likes);
