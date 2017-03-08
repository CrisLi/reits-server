const feathers = require('feathers');
const path = require('path');
const serveStatic = require('feathers').static;
const favicon = require('serve-favicon');
const morgan = require('./utils/morgan');
const helmet = require('helmet');
const compress = require('compression');
const cors = require('cors');
const configuration = require('feathers-configuration');
const hooks = require('feathers-hooks');
const rest = require('feathers-rest');
const bodyParser = require('body-parser');
const services = require('./services');
const middleware = require('./middleware');
const init = require('./init');

const app = feathers();

app.configure(configuration(path.join(__dirname, '..')));

app.use(morgan())
  .use(helmet())
  .use(compress())
  .options('*', cors())
  .use(cors())
  .use(favicon(path.join(app.get('public'), 'favicon.ico')))
  .use('/', serveStatic(app.get('public')))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .configure(hooks())
  .configure(rest())
  .configure(services)
  .configure(middleware);

module.exports = app;
