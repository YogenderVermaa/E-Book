import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import Path from 'path';
import { fileURLToPath } from 'url';
import { morganMiddleware } from './middleware/morgan.middleware.js';

import authRouter from './routes/auth.route.js';
import bookRouter from './routes/book.route.js';
import aiRouter from './routes/ai.route.js';
import exportRouter from './routes/export.route.js';
import { errorHandler } from './middleware/error.middleware.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = Path.dirname(__filename);

app.use(morganMiddleware);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '16kb' }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(Path.join(__dirname, 'uploads')));

app.use('/api/auth', authRouter);
app.use('/api/book', bookRouter);
app.use('/api/ai', aiRouter);

app.use('/api/export', exportRouter);

app.use('/', (req, res) => {
  res.send('hi yogi bhai');
});

app.use(errorHandler);

export { app };
