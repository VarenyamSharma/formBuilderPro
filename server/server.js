import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import mongoose from 'mongoose';

import authRouter from './src/routes/auth.js';
import formRouter from './src/routes/forms.js';
import responseRouter from './src/routes/responses.js';

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(morgan('dev'));

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use('/api/auth', authRouter);
app.use('/api/forms', formRouter);
app.use('/api/responses', responseRouter);

const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.error('Missing MONGODB_URI in environment');
  process.exit(1);
}

mongoose
  .connect(mongoUri)
  .then(() => {
    const port = Number(process.env.PORT) || 4000;
    app.listen(port, () => console.log(`API listening on :${port}`));
  })
  .catch((err) => {
    console.error('Mongo connection error', err);
    process.exit(1);
  });


