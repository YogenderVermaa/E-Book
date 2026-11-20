import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { morganMiddleware } from './middleware/morgan.middleware.js';

import authRouter from './routes/auth.route.js';
import bookRouter from './routes/book.route.js';
import paymentRouter from './routes/payment.route.js';
import aiRouter from './routes/ai.route.js';
import exportRouter from './routes/export.route.js';
import { errorHandler } from './middleware/error.middleware.js';

const app = express();

app.use(morganMiddleware);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      // Allow localhost, any *.vercel.app domain, or custom CORS_ORIGIN
      if (
        origin.includes('localhost') ||
        origin.includes('vercel.app') ||
        (process.env.CORS_ORIGIN &&
          process.env.CORS_ORIGIN.split(',').some((o) => origin.includes(o.trim())))
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  })
);

app.use(express.json({ limit: '32kb' }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Core API Routes
app.use('/api/auth', authRouter);
app.use('/api/diary', bookRouter);
app.use('/api/book', bookRouter); // Alias for backwards compatibility
app.use('/api/payment', paymentRouter);
app.use('/api/ai', aiRouter);
app.use('/api/export', exportRouter);

app.use('/', (req, res, next) => {
  if (req.path === '/' || req.path === '/api/health') {
    return res.json({
      status: 'active',
      app: 'LifeLog - Written Daily Life & Vlogs API',
      version: '2.0.0',
    });
  }
  next();
});

app.use(errorHandler);

export { app };
