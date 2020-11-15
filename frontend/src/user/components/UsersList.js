import React,{useContext} from 'react';

import UserItem from './UserItem';
import Card from '../../shared/components/UIElements/Card';
import './UsersList.css';
import { AuthContext } from "../../shared/context/auth-context";

const UsersList = props => {
  console.log(JSON.parse(localStorage.getItem("userData")))
  const auth = useContext(AuthContext);
  console.log(auth)
  const getUser =()=>{
    const data = props.items.filter(item => {
      return item.id === JSON.parse(localStorage.getItem("userData")).userId
    }
    )
    return data
  } 
  if (props.items.length === 0) {
    return (
      <div className="center">
        <Card>
          <h2>No users found.</h2>
        </Card>
      </div>
    );
  }

  return (
    <ul className="users-list">
      {getUser().map(user => (
        <UserItem
          key={user.id}
          id={user.id}
          image={user.image}
          name={user.name}
          jobCount={user.jobs.length}
        />
      ))}
    </ul>
  );
};

export default UsersList;
