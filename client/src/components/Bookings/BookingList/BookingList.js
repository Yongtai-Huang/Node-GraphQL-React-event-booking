import React from 'react';
import moment from 'moment';

import './BookingList.css';

const bookingList = props => (
  <ul className="bookings__list">
    {props.bookings.map(booking => {
      return (
        <li key={booking._id} className="bookings__item">
          <div className="bookings__item-data">
            <div>
              <h1>{booking.event.title}</h1>
              { booking.event.creator && booking.event.creator.username && 
                <p>By { booking.event.creator.username }</p>
              }
              <p>
                {moment(booking.event.startTime).format('LLL')} - {moment(booking.event.endTime).format('LLL')}
              </p>
              <p>Booked at: {new Date(booking.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="bookings__item-actions">
            <button className="btn" onClick={props.onDelete.bind(this, booking._id)}>Cancel</button>
          </div>
        </li>
      );
    })}
  </ul>
);

export default bookingList;
