import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import Path from 'path';
import { fileURLToPath } from 'url';
import { morganMiddleware } from './middleware/morgan.middleware.js';

// Import all your routes
import authRouter from './routes/auth.route.js';
import bookRouter from './routes/book.route.js';
import aiRouter from './routes/ai.route.js';
// Import your error handling utilities
import { ApiError } from './utils/api-error.js'; // Assuming you have this
import { ApiResponse } from './utils/api-response.js'; // Assuming you have this
import { errorHandler } from './middleware/error.middleware.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = Path.dirname(__filename);

// --- MIDDLEWARE SETUP ---

// 1. Logging Middleware (Ideal placement: Very early)
app.use(morganMiddleware);

// 2. CORS (Must be early to handle preflight requests)
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// 3. Body/Cookie Parsing
app.use(express.json({ limit: '16kb' }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// 4. Static File Serving
app.use('/uploads', express.static(Path.join(__dirname, 'uploads')));

// --- ROUTE MOUNTING ---

app.use('/api/auth', authRouter);
app.use('/api/book', bookRouter);
app.use('/api/ai', aiRouter);

// Default Route (Placeholder/Health Check)
app.use('/', (req, res) => {
  res.send('hi yogi bhai');
});

app.use(errorHandler);

export { app };
