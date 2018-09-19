const feathersErrors = require('@feathersjs/errors');

/**
 * Forward error
 *
 * @param  {object} ctx Context
 */
function forwardError(ctx) {
  const {error} = ctx;

  if (error.response) {
    const {message} = error.response.data;

    const options = error.response.data.data || {};
    options.errors = error.response.data.errors;

    if (feathersErrors[error.response.data.name]) {
      ctx.error = new feathersErrors[error.response.data.name](message, options);
      return;
    }

    ctx.error = new feathersErrors.GeneralError(message, options);
    return;
  }

  ctx.error = new feathersErrors.Unavailable(error.message);
}

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [forwardError],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
