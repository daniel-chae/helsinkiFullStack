import anecdotesServices from '../services/anecdotes';

const sortAnecdotesDesc = (anecArray) => {
  return anecArray.sort((a, b) => b.votes - a.votes);
};

const reducer = (state = [], action) => {
  switch (action.type) {
    case 'PATCH_ANECDOTE':
      const id = action.data.id;
      const updated = state.map((anecdote) =>
        anecdote.id !== id ? anecdote : action.data
      );
      return sortAnecdotesDesc(updated);
    case 'CREATE_ANECDOTE':
      return [...state, action.data];
    case 'INITIALIZE_ANECDOTES':
      return sortAnecdotesDesc(action.data);
    default:
      return state;
  }
};

export const voteCreator = (anecdote) => {
  return async (dispatch) => {
    const newAnecdote = await anecdotesServices.patchOne(anecdote.id, {
      votes: anecdote.votes + 1,
    });
    dispatch({ type: 'PATCH_ANECDOTE', data: newAnecdote });
  };
};

export const createAnecdote = (newAnecdote) => {
  return async (dispatch) => {
    const data = await anecdotesServices.createOne(newAnecdote);
    dispatch({
      type: 'CREATE_ANECDOTE',
      data,
    });
  };
};

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const data = await anecdotesServices.getAll();
    dispatch({
      type: 'INITIALIZE_ANECDOTES',
      data,
    });
  };
};

export default reducer;
