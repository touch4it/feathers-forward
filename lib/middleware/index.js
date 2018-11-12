const {exposeHeaders} = require('@feathersjs/authentication/lib/express');

const exposeUrl = require('./expose-url');
const setCookie = require('./set-cookie');

module.exports = function (app) {
  app.use(exposeUrl());
  app.use(exposeHeaders());
  app.use(setCookie());
};
