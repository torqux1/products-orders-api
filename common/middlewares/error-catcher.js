const errors = require('../config/errors');

module.exports = function (err, req, res, next) {
  console.error(err.stack)
  if (!err.code && !err.description) {
    return res.status(errors.SERVER_ERROR.code).send({ message: errors.SERVER_ERROR.description });
  }
  res.status(err.code).send({message: err.description});

};