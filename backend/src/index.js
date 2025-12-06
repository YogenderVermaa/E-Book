import dotenv from 'dotenv';
dotenv.config();

import { app } from './app.js';
import { logger } from './logger/index.js';
import { connectDB } from './db/index.js';

const port = process.env.PORT || 4000;

let server;

process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION:', err);
  process.exit(1);
});

connectDB()
  .then(() => {
    server = app.listen(port, () => {
      logger.info(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    logger.error('FAILED TO CONNECT DB:', err);
    process.exit(1);
  });

process.on('unhandledRejection', async (err) => {
  logger.error('UNHANDLED REJECTION:', err);

  try {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
      logger.warn('HTTP server closed gracefully');
    }

    await mongoose.connection.close();
    logger.warn('MongoDB connection closed');

    process.exit(1);
  } catch (shutdownErr) {
    logger.error('Error during shutdown:', shutdownErr);
    process.exit(1);
  }
});
