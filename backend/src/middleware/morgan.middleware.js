import morgan from 'morgan';
import { logger } from '../logger/index.js';

const stream = {
  write: (message) => logger.info(message.trim()),
};

export const morganMiddleware = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
  { stream }
);
