// app.js creates an express app, connect to mongoDB, and set middlewares and routers for the app

// require external modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// require internal modules
const config = require('./utils/config');
const logger = require('./utils/logger');
const blogsRouter = require('./controllers/blogs');
const middleware = require('./utils/middleware');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');

// create an express app
const app = express();

// connect to mongoDB
mongoose
  .connect(config.mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    logger.info('connected to database');
  })
  .catch((err) => logger.error(err.message));

// set middlewares
app.use(cors());
app.use(express.json());
app.use(middleware.tokenExtractor);

// set routers
app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);
app.use('/login', loginRouter);

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing');
  app.use('/api/testing/', testingRouter);
}

// set error handler
app.use(middleware.errorHandler);

module.exports = app;
