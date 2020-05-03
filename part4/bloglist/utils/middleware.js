const logger = require('./logger');

const errorHandler = (err, req, res, next) => {
  logger.error(err.message);
  if (err.name === 'ValidationError') {
    res.status(400).json({ error: err.message });
  } else if (err.name === 'CastError') {
    res.status(400).json({ error: 'malformatted id' });
  } else if (err.name === 'JsonWebTokenError') {
    res.status(401).json({ error: 'invalid token' });
  } else {
    next(err);
  }
};

const tokenExtractor = (req, res, next) => {
  const authHeader = req.get('authorization');
  if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
    req.token = authHeader.slice(7);
  }
  next();
};

module.exports = { errorHandler, tokenExtractor };
