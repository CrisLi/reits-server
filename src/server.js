const app = require('./app');
const init = require('./init');

const port = app.get('port');

process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection at: Promise ', p, ' reason: ', reason);
});

module.exports = {
  startup() {
    const server = app.listen(port);

    server.on('listening', () => {
      app.logger.info(`Reits server started on ${app.get('host')}:${port}`);
      init(app)
        .then(() => {
          app.logger.info('Reits server data setup finished.');
          server.emit('startup', app);
        })
        .catch((error) => {
          app.logger.error(`${error.message} - ${error.stack}`);
          if (error.errors && Object.keys(error.errors).length > 0) {
            app.logger.debug(error.errors);
          }
          process.exit(500);
        });
    });

    return server;
  }
};
