import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

import formRoutes from './routes/forms.js';
import uploadRoutes from './routes/upload.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const IS_VERCEL = !!process.env.VERCEL;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    // Allow no-origin (mobile apps, curl) and same-origin
    if (!origin) return callback(null, true);
    const isDev = process.env.NODE_ENV !== 'production';
    const allowedOrigins = [
      process.env.CORS_ORIGIN,
      'http://localhost:5173',
    ].filter(Boolean);

    if (!isDev) {
      // In production on Vercel, allow any origin on same domain
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// MongoDB connection (reuse in serverless to avoid re-connecting on each invocation)
const connectToDatabase = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
  }
};
connectToDatabase().catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/forms', formRoutes);
app.use('/api/upload', uploadRoutes);

// Static serving for uploads in dev/self-hosted (not persistent on Vercel)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve frontend in production when running as a traditional server (not on Vercel)
if (process.env.NODE_ENV === 'production' && !IS_VERCEL) {
  const buildPath = path.join(__dirname, '../dist');
  app.use(express.static(buildPath));

  // For any other route, serve the index.html
  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ message: 'API route not found' });
});

// Only start a listener when running as a traditional server (not on Vercel)
if (!IS_VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;