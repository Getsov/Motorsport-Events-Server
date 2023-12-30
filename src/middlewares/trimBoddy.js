module.exports = () => (req, res, next) => {
  for (let key in req.body) {
    if (typeof req.body[key] == "string") {
      req.body[key] = req.body[key].trim();
    }
  }

  next();
};
