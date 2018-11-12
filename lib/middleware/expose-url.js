function exposeUrl() {
  return (req, res, next) => {
    req.feathers.originalUrl = req.originalUrl;
    next();
  };
}

module.exports = exposeUrl;
