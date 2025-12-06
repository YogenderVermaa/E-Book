import mongoose from 'mongoose';
import { logger } from '../logger/index.js';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Fail fast
    });

    logger.info(`MongoDB Connected - Host: ${conn.connection.host} | DB: ${conn.connection.name}`);
  } catch (error) {
    logger.error(`MongoDB Connection Failed: ${error.message}`);
    logger.error(error.stack);
    process.exit(1);
  }
};
