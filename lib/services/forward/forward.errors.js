const feathersErrors = require('@feathersjs/errors');

/**
 * Parse feathers error
 *
 * @param  {object} ctx   Hook context
 * @param  {Error}  error Error thrown
 */
const parseFeathersError = function (ctx, error) {
  const {message} = error.response.data;

  const options = error.response.data.data || {};
  options.errors = error.response.data.errors;

  if (feathersErrors[error.response.data.name]) {
    ctx.error = new feathersErrors[error.response.data.name](message, options);
    return;
  }

  ctx.error = new feathersErrors.GeneralError(message, options);
};

/**
 * Parse default error
 *
 * @param  {object} ctx   Hook context
 * @param  {Error}  error Error thrown
 */
const parseDefaultError = function (ctx, error) {
  const {status, data} = error.response;

  const options = {};

  if (feathersErrors[status]) {
    ctx.error = new feathersErrors[status](data, options);
    return;
  }

  ctx.error = new feathersErrors.GeneralError(data, options);
};

/**
 * Forward error
 *
 * @param  {string} type Forward type
 * @return {function}    Hook forward function
 */
function forwardError(type) {
  return ctx => {
    const {error} = ctx;

    if (error.response) {
      switch (type) {
        case 'feathers':
          parseFeathersError(ctx, error);
          break;
        default:
          parseDefaultError(ctx, error);
          break;
      }
      return;
    }

    ctx.error = new feathersErrors.Unavailable(error.message);
  };
}

module.exports = {
  parseFeathersError,
  parseDefaultError,
  forwardError
};
