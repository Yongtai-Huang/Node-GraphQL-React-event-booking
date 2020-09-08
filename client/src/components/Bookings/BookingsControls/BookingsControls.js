import React from 'react';

import './BookingsControls.css';

const bookingsControl = props => {
  return (
    <div className="bookings-control">
      <button
        className={props.activeOutputType === 'list' ? 'active' : ''}
        onClick={props.onChange.bind(this, 'list')}
      >
        List
      </button>

      <button
        className={props.activeOutputType === 'calendar' ? 'active' : ''}
        onClick={props.onChange.bind(this, 'calendar')}
      >
        Calendar
      </button>
    </div>
  );
};

export default bookingsControl;
