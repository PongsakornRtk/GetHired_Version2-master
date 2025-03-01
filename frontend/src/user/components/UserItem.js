import React from 'react';
import { Link } from 'react-router-dom';

import Avatar from '../../shared/components/UIElements/Avatar';
import Card from '../../shared/components/UIElements/Card';
import './UserItem.css';

const UserItem = props => {
  return (
    <li className="user-item">
      <Card className="user-item__content">
        <Link to={`/${props.id}/jobs`}>
          <div className="user-item__image">
            <Avatar image={`https://gethired-api.herokuapp.com/${props.image}`} alt={props.name} />
          </div>
          <div className="user-item__info">
            <h2>{props.name}</h2>
            <h3>
              {props.jobCount} {props.jobCount > 1 ? 'jobs' : 'job'}
            </h3>
          </div>
        </Link>
      </Card>
    </li>
  );
};

export default UserItem;
