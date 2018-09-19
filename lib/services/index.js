const forwardService = require('./forward/forward.service');

module.exports = function (app) {
  app.configure(forwardService);
};
