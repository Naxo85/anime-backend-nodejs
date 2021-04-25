const AppError = require('../utils/AppError');

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message; // in new mongoose versions, you loose some fields when u clone the object
    // errors that automatic create mongoose dont be mark as operational, and they must be
    if (err.name === 'CastError') {
      error = handleCastErrorDB(err); // here we override it as our custom operational AppError
    }
    if (err.code === 11000) {
      error = handleUniqueFieldErrorDB(err);
    }
    if (err.name === 'ValidationError') {
      error = handleValidationErrorDB(err);
    }
    sendErrorProd(error, res);
  }
};

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};
const handleUniqueFieldErrorDB = (err) => {
  const message = `Duplicated title: ${err.keyValue.title}`;
  return new AppError(message, 400);
};
const handleValidationErrorDB = (err) => {
  const message = `Invalid input data: ${err.message}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error('Something went wrong, not operational error!: ', err);
    res.status(500).json({
      status: 'error',
      message: 'Contact with an administrator',
    });
  }
};
