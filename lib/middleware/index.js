function storeOriginalUrl(req, res, next) {
  req.feathers.originalUrl = req.originalUrl;
  next();
}

module.exports = function (app) {
  app.use(storeOriginalUrl);
};
