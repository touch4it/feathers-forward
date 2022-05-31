const axios = require('axios');
const urlJoin = require('url-join');
const _ = require('underscore');
const hooks = require('./forward.hooks.js');

const ForwardService = class {
  /**
   * Forward find
   *
   * @param  {object} parameters Params for find
   * @return {object}        Result of forwarded find
   */
  async find(parameters) {
    return this.processForward('get', parameters);
  }

  /**
   * Forward create
   *
   * @param  {object} data   Data for create
   * @param  {object} parameters Params for create
   * @return {object}        Result of forwarded create
   */
  async create(data, parameters) {
    return this.processForward('post', parameters, data);
  }

  /**
   * Forward update
   *
   * @param  {string} _id     Id for update
   * @param  {object} data   Data for update
   * @param  {object} parameters Params for update
   * @return {object}        Result of forwarded update
   */
  async update(_id, data, parameters) {
    return this.processForward('put', parameters, data);
  }

  /**
   * Forward patch
   *
   * @param  {string} id     Id for patch
   * @param  {object} data   Data for patch
   * @param  {object} parameters Params for patch
   * @return {object}        Result of forwarded patch
   */
  async patch(id, data, parameters) {
    return this.processForward('patch', parameters, data);
  }

  /**
   * Forward patch
   *
   * @param  {string} _id     Id for remove
   * @param  {object} parameters Params for remove
   * @return {object}        Result of forwarded remove
   */
  async remove(_id, parameters) {
    return this.processForward('delete', parameters);
  }

  /**
   * Process forward
   *
   * @param  {string} method      Method type of forward
   * @param  {string} parameters      Params
   * @param  {object} data        Data to forward
   * @return {object}             Result of forwarded request
   */
  processForward(method, parameters, data) {
    if (parameters.provider === 'rest') {
      return this.processRest(
        method,
        _.pick(parameters, ['originalUrl', 'headers', 'setHeaders']),
        data,
      );
    }
  }

  /**
   * Process rest
   *
   * @param  {string} method      Method type of forward
   * @param  {object} options     Options to forward
   * @param  {object} data        Data to forward
   * @return {object}             Result of forwarded request
   */
  async processRest(method, options, data) {
    const response = await axios({
      method,
      data,
      url: urlJoin(this.app.get('FEATHERS_FORWARD__REMOTE_FORWARDING_URL'), options.originalUrl),
      headers: _.pick(options.headers, this.reqHeaders),
      withCredentials: true,
    });

    options.setHeaders(_.pick(response.headers, this.resHeaders));

    return response.data;
  }

  /**
   * Setup service
   *
   * @param  {object} app Reference to app
   */
  setup(app) {
    this.app = app;
    this.reqHeaders = _.union(this.app.get('FEATHERS_FORWARD__REQ_HEADERS'), ['cookie']);
    this.resHeaders = _.union(this.app.get('FEATHERS_FORWARD__RES_HEADERS'), ['set-cookie']);
  }
};

module.exports = function (app) {
  const matchAll = '[^]*';
  app.use(matchAll, new ForwardService());
  const forward = app.service(matchAll);
  forward.hooks(hooks(app));
};
