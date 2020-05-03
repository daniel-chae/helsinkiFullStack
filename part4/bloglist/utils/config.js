// config.js sets environment variables

// require external modules
const dotenv = require('dotenv');

// set environment variable from .env file
dotenv.config({});

// create local variables from environment varialbe
const PORT = process.env.PORT;

let mongoUrl = process.env.MONGODB_URI;

if (process.env.NODE_ENV === 'test') {
  mongoUrl = process.env.TEST_MONGODB_URI;
}

module.exports = { PORT, mongoUrl };
