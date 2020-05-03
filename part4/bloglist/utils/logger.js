// logger.js is a helper module for logging

// helper function to console.log
const info = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(...params);
  }
};

// helper function to console.error
const error = (...params) => {
  console.error(...params);
};

module.exports = { info, error };
