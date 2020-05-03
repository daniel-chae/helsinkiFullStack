// index.js is entry point. It creates a server and listen to a port

// require core modules
const http = require('http');

// require internal moudles
const config = require('./utils/config'); // Set environment variables
const app = require('./app'); // load express app with configurations
const logger = require('./utils/logger'); // load logger

// creates a http server
const server = http.createServer(app);

// listen to a port
server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
