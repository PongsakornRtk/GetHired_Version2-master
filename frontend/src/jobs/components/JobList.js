import React from 'react';

import Card from '../../shared/components/UIElements/Card';
import JobItem from './JobItem';
import Button from '../../shared/components/FormElements/Button';
import './JobList.css';

const JobList = props => {
  if (props.items.length === 0) {
    return (
      <div className="place-list center">
        <Card>
          <h2>No job found. Maybe create one?</h2>
          <Button to="/jobs/new">Share JOB</Button>
        </Card>
      </div>
    );
  }

  return (
    <ul className="place-list">
      {props.items.map(job => (
        <JobItem
          key={job.id}
          id={job.id}
          image={job.image}
          title={job.title}
          description={job.description}
          address={job.address}
          creatorId={job.creator}
          coordinates={job.location}
          onDelete={job.onDeletePlace}
        />
      ))}
    </ul>
  );
};

export default JobList;
