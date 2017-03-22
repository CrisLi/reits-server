const Service = require('feathers-mongoose').Service;
const event = require('./event-modal');
const hooks = require('./hooks');
const _ = require('lodash');

class EventService extends Service {

  log(target, params) {
    const { user, tenantId, comments = '', type } = params;
    const createdBy = _.pick(user, '_id', 'username');
    const data = {
      type,
      target,
      createdBy,
      tenantId,
      comments
    };
    return super.create(data);
  }

}

const targetServices = ['/projects', '/tenants', '/users'];

const addListenerToServices = (eventService, targetService) => {
  const logEvent = type => (data, hook) => {
    const { params: { user, tenantId } } = hook;

    if (user === undefined || tenantId === undefined) {
      return;
    }

    const { modelName } = targetService.Model;

    eventService.log({
      type: modelName,
      data
    }, {
      type: `${type} ${modelName}`,
      user,
      tenantId
    });
  };

  targetService.on('created', logEvent('create'));
  targetService.on('updated', logEvent('update'));
  targetService.on('removed', logEvent('remove'));
  targetService.on('patched', logEvent('patch'));
};

module.exports = function() {
  const app = this;
  const options = app.get('service');
  options['Model'] = event;

  app.use('/events', new EventService(options));

  const eventService = app.service('/events');

  eventService.before(hooks.before);
  eventService.after(hooks.after);

  targetServices.forEach((service) => {
    const targetService = app.service(service);
    if (targetService) {
      addListenerToServices(eventService, targetService);
    } else {
      app.logger.warn(`Service ${service} can't be found, ignore it.`);
    }
  });
};
