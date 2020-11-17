import React from 'react';

import Card from '../../shared/components/UIElements/Card';
import ApplicationItem from './ApplicationItem';
import './ApplicationList.css';

const ApplicationList = props => {
  if (props.items.length === 0) {
    return (
      <div className="app-list center">
        <Card>
          <h2>No freelancer found.</h2>
        </Card>
      </div>
    );
  }
  console.log(props.items)
  return (
    <ul className="app-list">
      {props.items.map(user => (
        <ApplicationItem
        key={user.id}
        id={user.id}
        image={user.image}
        name={user.name}
        telNo={user.telNo}
        />
      ))}
    </ul>
  );
};

export default ApplicationList;
