const app = require('./src/app');

const port = app.get('port');
const server = app.listen(port);

server.on('listening', () =>
  app.logger.info(`Reits server started on ${app.get('host')}:${port}`)
);
