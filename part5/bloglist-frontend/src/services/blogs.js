import axios from 'axios';
const baseUrl = 'http://localhost:3003/api/blogs';

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const create = async (data) => {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.post(baseUrl, data, config);
  return response.data;
};

const deleteBlog = async (id) => {
  const config = {
    headers: { Authorization: token },
  };

  await axios.delete(`${baseUrl}/${id}`, config);
};

const updateBlog = async (id, content) => {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.put(`${baseUrl}/${id}`, content, config);
  return response.data;
};

export default { getAll, create, setToken, deleteBlog, updateBlog };
