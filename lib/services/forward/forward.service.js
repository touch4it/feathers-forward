const axios = require('axios');
const urlJoin = require('url-join');
const _ = require('underscore');
const hooks = require('./forward.hooks');

const ForwardService = class {
  /**
   * Forward find
   *
   * @param  {object} params Params for find
   * @return {object}        Result of forwarded find
   */
  find(params) {
    return this.processForward('get', params);
  }

  /**
   * Forward create
   *
   * @param  {object} data   Data for create
   * @param  {object} params Params for create
   * @return {object}        Result of forwarded create
   */
  create(data, params) {
    return this.processForward('post', params, data);
  }

  /**
   * Forward update
   *
   * @param  {string} id     Id for update
   * @param  {object} data   Data for update
   * @param  {object} params Params for update
   * @return {object}        Result of forwarded update
   */
  update(id, data, params) {
    return this.processForward('put', params, data);
  }

  /**
   * Forward patch
   *
   * @param  {string} id     Id for patch
   * @param  {object} data   Data for patch
   * @param  {object} params Params for patch
   * @return {object}        Result of forwarded patch
   */
  patch(id, data, params) {
    return this.processForward('patch', params, data);
  }

  /**
   * Forward patch
   *
   * @param  {string} id     Id for remove
   * @param  {object} params Params for remove
   * @return {object}        Result of forwarded remove
   */
  remove(id, params) {
    return this.processForward('delete', params);
  }

  /**
   * Process forward
   *
   * @param  {string} method      Method type of forward
   * @param  {string} params      Params
   * @param  {object} data        Data to forward
   * @return {object}             Result of forwarded request
   */
  processForward(method, params, data) {
    if (params.provider === 'rest') {
      return this.processRest(
        method,
        _.pick(params, ['originalUrl', 'headers', 'setHeaders']),
        data
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
      withCredentials: true
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
  forward.hooks(hooks);
};
