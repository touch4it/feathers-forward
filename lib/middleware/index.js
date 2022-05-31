// eslint-disable-next-line node/no-missing-require
const {exposeHeaders} = require('@feathersjs/authentication/lib/express');

const exposeUrl = require('./expose-url.js');
const setCookie = require('./set-cookie.js');

module.exports = function (app) {
  app.use(exposeUrl());
  app.use(exposeHeaders());
  app.use(setCookie());
};
