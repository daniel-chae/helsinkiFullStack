import axios from 'axios';

const baseUrl = 'http://localhost:3001/anecdotes';

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const createOne = async (content) => {
  const response = await axios.post(baseUrl, {
    content,
    votes: 0,
  });
  return response.data;
};

const patchOne = async (id, newContent) => {
  const response = await axios.patch(`${baseUrl}/${id}`, newContent);
  return response.data;
};

export default { getAll, createOne, patchOne };
