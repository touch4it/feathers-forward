function storeRest(req, res, next) {
  req.feathers.originalUrl = req.originalUrl;
  req.feathers.headers = req.headers;
  next();
}

module.exports = function (app) {
  app.use(storeRest);
};
