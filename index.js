const app = require('./src/app');

const port = app.get('port');
const server = app.listen(port);

server.on('listening', () =>
  console.log(`Reits server started on ${app.get('host')}:${port}`)
);
