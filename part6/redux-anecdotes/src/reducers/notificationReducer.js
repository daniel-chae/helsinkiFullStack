const initialState = { content: '', notificationId: '' };

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return {
        content: action.content,
        notificationId: action.notificationId,
      };
    default:
      return state;
  }
};

export const setNotification = (content, timeout) => {
  return async (dispatch, getState) => {
    const previousNotification = getState().notification.notificationId;
    clearTimeout(previousNotification);

    const notificationId = setTimeout(() => {
      dispatch({
        type: 'SET_NOTIFICATION',
        content: '',
        notificationId: '',
      });
    }, timeout * 1000);

    dispatch({
      type: 'SET_NOTIFICATION',
      content,
      notificationId,
    });
  };
};

export default notificationReducer;
