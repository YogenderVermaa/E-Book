import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { morganMiddleware } from './middleware/morgan.middleware.js';

const app = express();

app.use(express.json({ limit: '16kb' }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(morganMiddleware);

export { app };
