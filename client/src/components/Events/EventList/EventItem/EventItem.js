import React from 'react';
import moment from 'moment';

import './EventItem.css';

const eventItem = props => (
  <li key={props.eventId} className="events__list-item">
    <div>
      <h1>{props.title}</h1>
      { props.creatorUsername && 
        <p>By { props.creatorUsername }</p>
      }
      <p>
        {moment(props.startTime).format('LLL')} - {moment(props.endTime).format('LLL')}
      </p>
      <p>
        ${props.price}
      </p>
    </div>

    <button className="btn" onClick={props.onDetail.bind(this, props.eventId)}>
      View Details
    </button>
  </li>
);

export default eventItem;
