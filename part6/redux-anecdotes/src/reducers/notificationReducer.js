const initialState = '';

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return action.notification;
    default:
      return state;
  }
};

export const setNotification = (content, timeout) => {
  return async (dispatch) => {
    dispatch({ type: 'SET_NOTIFICATION', notification: content });

    setTimeout(() => {
      dispatch({ type: 'SET_NOTIFICATION', notification: '' });
    }, timeout * 1000);
  };
};

export default notificationReducer;
