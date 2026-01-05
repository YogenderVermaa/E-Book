import mongoose from 'mongoose';
import { ApiError } from '../utils/api-error.js';
import { logger } from '../logger/index.js';

const errorHandler = (err, req, res) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode
      ? error.statusCode
      : error instanceof mongoose.Error
        ? 400
        : 500;

    const message = error.message || 'Something went wrong';

    error = new ApiError(statusCode, message, error?.errors || [], err.stack);
  }

  // 🔥 LOG ERROR HERE
  logger.error(error.message, {
    statusCode: error.statusCode,
    stack: error.stack,
    method: req.method,
    path: req.originalUrl,
  });

  const response = {
    statusCode: error.statusCode,
    message: error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  };

  return res.status(error.statusCode).json(response);
};

export { errorHandler };
