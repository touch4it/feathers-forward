const forwardService = require('./forward/forward.service.js');

module.exports = function (app) {
  app.configure(forwardService);
};
