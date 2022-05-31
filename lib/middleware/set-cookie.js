const _ = require('underscore');

function setCookie() {
  return (req, res, next) => {
    req.feathers.setHeaders = (headers = {}) => {
      _.each(headers, (value, key) => {
        res.set(key, value);
      });
    };

    next();
  };
}

module.exports = setCookie;
