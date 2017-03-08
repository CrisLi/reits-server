const app = require('./src/app');
const init = require('./src/init');

const port = app.get('port');
const server = app.listen(port);

server.on('listening', () => {
  app.logger.info(`Reits server started on ${app.get('host')}:${port}`);
  init(app)
    .then(() => app.logger.info('Reits server data setup finished.'))
    .catch((error) => {
      app.logger.error(error);
      process.exit(500);
    });
});
