const bcrypt = require('bcrypt');
require('express-async-errors');
const router = require('express').Router();
const User = require('../models/user');

// Create a user
router.post('/', async (req, res, next) => {
  const body = req.body;

  if (!body.password || body.password.length < 3) {
    return res.status(400).json({
      error:
        'User validation failed: password is shorter than the minimum allowed length (3)',
    });
  }

  const hashedPassword = await bcrypt.hash(body.password, 10);

  const user = new User({
    username: body.username,
    name: body.name,
    hashedPassword,
  });

  const savedUser = await user.save();
  res.json(savedUser);
});

// Read users
router.get('/', async (req, res, next) => {
  const users = await User.find({}).populate('blogs', {
    title: 1,
    author: 1,
    url: 1,
    likes: 1,
  });
  res.json(users);
});

module.exports = router;
