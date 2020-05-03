const Blog = require('../models/blog');
const User = require('../models/user');

const initialBlogs = [
  {
    title: 'testBlog1',
    author: 'testAuthor1',
    url: 'testUrl1',
    likes: 1,
  },
  {
    title: 'testBlog2',
    author: 'testAuthor2',
    url: 'testUrl2',
    likes: 2,
  },
];

const nonExistingId = async () => {
  const newBlog = new Blog({
    title: 'toBeDeletedSoon',
    author: 'toBeDeletedSoon',
    url: 'tobeDeletedSoon.com',
  });

  await newBlog.save();
  await newBlog.remove();
  return newBlog.id.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

const setCreateUserBlock = async () => {
  await User.deleteMany();
  const newUser = new User({ username: 'root', password: 'password' });
  await newUser.save();
};

const setLoginUserBlock = async (api) => {
  await User.deleteMany();
  await api.post('/api/users').send({ username: 'root', password: 'sekret' });
};

const setCreateBlogBlock = async (api) => {
  await Blog.deleteMany();
  await User.deleteMany();
  await api.post('/api/users').send({ username: 'root', password: 'sekret' });
};

const setReadDeleteBlogBlock = async (api) => {
  // Delete all users and blogs
  await Blog.deleteMany();
  await User.deleteMany();

  // Create a user
  await api.post('/api/users').send({ username: 'root', password: 'sekret' });

  // Login with created user
  const response = await api
    .post('/login')
    .send({ username: 'root', password: 'sekret' });

  // Set token
  const token = response.body.token;

  let container = [];
  // Create initial blogs
  for (const blog of initialBlogs) {
    container = container.concat(
      await api
        .post('/api/blogs/')
        .set('Authorization', `Bearer ${token}`)
        .send(blog)
    );
  }
};

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb,
  setCreateUserBlock,
  setLoginUserBlock,
  setCreateBlogBlock,
  setReadDeleteBlogBlock,
};
