const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');

router.post('/', async (req, res, next) => {
  const body = req.body;

  const user = await User.findOne({ username: body.username });
  const passwordCorrect =
    user === null
      ? false
      : await bcrypt.compare(body.password, user.hashedPassword);

  if (!(user && passwordCorrect)) {
    return res.status(401).json({ error: 'username or password is incorrect' });
  }

  const tokenBody = {
    username: user.username,
    id: user._id,
  };

  const token = jwt.sign(tokenBody, process.env.SECRET);

  res.status(200).json({ token, username: user.username, name: user.name });
});

module.exports = router;
