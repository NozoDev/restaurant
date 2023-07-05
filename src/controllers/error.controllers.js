const AppError = require('../utils/appError');
const logger = require('../utils/logger');

const JWTExpiredError = () => {
  return new AppError('Tu token a caducado! por favor ingresa de nuevo', 400);
};

const handleJWTError = () => {
  return new AppError('Tu token a caducado! por favor ingresa de nuevo', 401);
};

const castError23505 = () => {
  new AppError('Valor de campo duplicado: utilice otro valor', 400);
};

const sendErrorDev = (err, res) => {
  logger.info(err);
  return res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  logger.info(err);

  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    return res.status(500).json({
      status: 'fail',
      message: 'algo salio mal!',
    });
  }
};

const ErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'fail';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  }

  if (process.env.NODE_ENV === 'production') {
    let error = { ...err };

    if (!error.parent?.code) {
      error = err;
    }

    if (error.parent?.code === '23505') error = castError23505();
    if (error.name === 'TokenExpiredError') error = JWTExpiredError();
    if (error.name === 'JsonWebTokenError') error = handleJWTError();

    /* valid errors */

    sendErrorProd(error, res);
  }
};

module.exports = ErrorHandler;
