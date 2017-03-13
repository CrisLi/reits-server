const logger = require('../utils/logger');

module.exports = function(app) {
  app['logger'] = logger; // eslint-disable-line

  return (error, req, res, next) => {
    if (error) {
      const message = `${error.code ? `(${error.code}) ` : ''} Route: ${req.method} ${req.url} - ${error.message}`;

      logger.error(message);

      if (error.code !== 404) {
        logger.debug(error.stack);
        if (error.errors && Object.keys(error.errors).length > 0) {
          app.logger.debug(error.errors);
        }
      }
    }

    next(error);
  };
};
