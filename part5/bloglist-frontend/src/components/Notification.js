import React from 'react';

const Notification = ({ message }) => {
  if (!message) {
    return null;
  }

  return (
    <div className={message.type}>
      <p>{message.message}</p>
    </div>
  );
};

export default Notification;
