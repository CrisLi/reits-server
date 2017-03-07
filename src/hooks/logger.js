module.exports = () => (
  (hook) => {
    const {
      method,
      app,
      path,
      type
    } = hook;
    app.logger.info(`Logger hook - ${type} ${path} ${method}`);
    return Promise.resolve(hook);
  }
);
