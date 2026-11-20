import mongoose from 'mongoose';
import { ApiError } from '../utils/api-error.js';
import { logger } from '../logger/index.js';

// Express error-handling middleware MUST have 4 parameters (err, req, res, next)
// Otherwise Express treats it as normal middleware and passes (req, res, next)
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
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

  // Log error with details
  logger.error(error.message, {
    statusCode: error.statusCode,
    stack: error.stack,
    method: req?.method,
    path: req?.originalUrl,
  });

  const retryAfter =
    error.errors?.[0]?.retryAfter ||
    (typeof error.data?.retryAfter === 'number' ? error.data.retryAfter : undefined);

  const response = {
    statusCode: error.statusCode,
    message: error.message,
    errors: error.errors || [],
    retryAfter,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  };

  return res.status(error.statusCode).json(response);
};

export { errorHandler };
