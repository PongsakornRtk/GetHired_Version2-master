import React from 'react';

import Card from '../../shared/components/UIElements/Card';
import FreelanceItem from './FreelanceItem';
import './JobList.css';

const JobList = props => {
  if (props.items.length === 0) {
    return (
      <div className="job-list center">
        <Card>
          <h2>No job found.</h2>
        </Card>
      </div>
    );
  }

  return (
    <ul className="job-list">
      {props.items.map(job => (
        <FreelanceItem
          key={job.id}
          id={job.id}
          image={job.image}
          title={job.title}
          description={job.description}
          creatorId={job.creator}
          onApply={job.confirmApplyHandler}
        />
      ))}
    </ul>
  );
};

export default JobList;
