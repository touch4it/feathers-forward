const middleware = require('./middleware/index.js');
const services = require('./services/index.js');

/**
 * Handler for missing required parameter
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
  resHeaders = [],
}) {
  return function () {
    this.set('FEATHERS_FORWARD__REMOTE_FORWARDING_URL', uri);
    this.set('FEATHERS_FORWARD__ENDPOINT', endpoint);
    this.set('FEATHERS_FORWARD__REQ_HEADERS', reqHeaders);
    this.set('FEATHERS_FORWARD__RES_HEADERS', resHeaders);

    this.configure(services);
  };
}

module.exports = {
  middleware,
  configure,
};
