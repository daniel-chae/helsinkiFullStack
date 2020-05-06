// blog.js creates an express router and set routes with route controllers

// require external modules
const router = require('express').Router();
require('express-async-errors');
const jwt = require('jsonwebtoken');

// require internal modules
const Blog = require('../models/blog');
const User = require('../models/user');

// Set route handlers

// Create a blog
router.post('/', async (request, response) => {
  const body = request.body;

  const decodedToken =
    request.token === undefined
      ? false
      : jwt.verify(request.token, process.env.SECRET);

  if (!(request.token && decodedToken)) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }

  const user = await User.findById(decodedToken.id);

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id,
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  return response.status(201).json(savedBlog);
});

// Read blogs
router.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  return response.json(blogs);
});

// Read a blog
router.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate('user', {
    username: 1,
    name: 1,
  });
  return response.json(blog);
});

// Update a blog
router.put('/:id', async (request, response) => {
  const decodedToken =
    request.token === undefined
      ? false
      : jwt.verify(request.token, process.env.SECRET);

  if (!(request.token && decodedToken)) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }

  const blogToUpdate = await Blog.findById(request.params.id);

  if (!blogToUpdate) {
    return response.status(204).json({ error: 'No matching blog found' });
  }

  if (blogToUpdate.user.toString() !== decodedToken.id) {
    return response
      .status(401)
      .json({ error: 'The owner of the token is not the owner of the blog' });
  }

  const user = await User.findById(decodedToken.id);

  request.body.user = user._id;
  request.body.__v = blogToUpdate.__v;

  const updatedBlog = await Blog.findOneAndReplace(
    { _id: request.params.id },
    request.body,
    {
      new: true,
      runValidators: true,
    }
  ).populate('user', {
    username: 1,
    name: 1,
  });

  response.status(200).json(updatedBlog);
});

// Delete a blog
router.delete('/:id', async (request, response) => {
  const decodedToken =
    request.token === undefined
      ? false
      : jwt.verify(request.token, process.env.SECRET);

  console.log('token', decodedToken);

  if (!(request.token && decodedToken)) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }

  const blogToDelete = await Blog.findById(request.params.id);

  if (!blogToDelete) {
    return response.status(204).json({ error: 'No matching blog found' });
  }

  if (blogToDelete.user.toString() !== decodedToken.id) {
    return response
      .status(401)
      .json({ error: 'The owner of the token is not the owner of the blog' });
  }

  const user = await User.findById(decodedToken.id);

  await Blog.findByIdAndDelete(request.params.id);
  user.blogs = user.blogs.filter(
    (blogId) => blogId.toString() !== request.params.id
  );

  await user.save();
  response.status(204).end();
});

module.exports = router;
