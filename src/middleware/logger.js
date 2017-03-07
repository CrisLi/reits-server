const logger = require('../utils/logger');

module.exports = function(app) {
  app['logger'] = logger; // eslint-disable-line

  return (error, req, res, next) => {
    if (error) {
      const message = `${error.code ? `(${error.code}) ` : ''} Route: ${req.url} - ${error.message}`;

      if (error.code === 404) {
        logger.info(message);
      } else {
        logger.error(message);
        logger.debug(error.stack);
      }
    }

    next(error);
  };
};
