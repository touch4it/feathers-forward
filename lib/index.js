const middleware = require('./middleware');
const services = require('./services');

/**
 * Handler for missing required paramter
 *
 * @param  {string} parameterName Name of missing required parameter
 */
function requiredParameterHandler(parameterName) {
  throw new Error(`Missing parameter: '${parameterName}' in options`);
}

/**
 * Configure forwarding to Feathers
 *
 * @param  {object} settings Forward settings
 * @return {function}        Feathers configure function
 */
function configure({
  uri = requiredParameterHandler('uri'),
  endpoint = 'feathers',
  reqHeaders = [],
  resHeaders = []
}) {
  return function () {
    const app = this;

    app.set('FEATHERS_FORWARD__REMOTE_FORWARDING_URL', uri);
    app.set('FEATHERS_FORWARD__ENDPOINT', endpoint);
    app.set('FEATHERS_FORWARD__REQ_HEADERS', reqHeaders);
    app.set('FEATHERS_FORWARD__RES_HEADERS', resHeaders);

    app.configure(services);
  };
}

module.exports = {
  middleware,
  configure
};
