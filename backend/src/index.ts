import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Load env
dotenv.config();

// Routes
import authRoutes from './routes/auth.routes';
import destinationsRoutes from './routes/destinations.routes';
import toursRoutes from './routes/tours.routes';
import homestaysRoutes from './routes/homestays.routes';
import bookingsRoutes from './routes/bookings.routes';
import paymentsRoutes from './routes/payments.routes';
import aiRoutes from './routes/ai.routes';
import reviewsRoutes from './routes/reviews.routes';
import wishlistRoutes from './routes/wishlist.routes';
import searchRoutes from './routes/search.routes';
import uploadRoutes from './routes/upload.routes';
import adminRoutes from './routes/admin.routes';

// Middlewares
import { errorHandler, notFound } from './middlewares/error.middleware';

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Security Middlewares ──────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://localhost:3001',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-sepay-signature'],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 200,
  message: { success: false, message: 'Quá nhiều request, vui lòng thử lại sau' },
});
app.use('/api', limiter);

// Stricter limit cho auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Quá nhiều lần thử đăng nhập' },
});
app.use('/api/auth', authLimiter);

// ─── Body Parsers ────────────────────────────────────────
// Note: /api/payments/sepay/webhook uses raw body (defined in route)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Logger ─────────────────────────────────────────────
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ─── Health Check ────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: '🌿 EthnoDiscovery API is running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ──────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/destinations', destinationsRoutes);
app.use('/api/tours', toursRoutes);
app.use('/api/homestays', homestaysRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);

// ─── Error Handling ──────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Start Server ────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🌿 EthnoDiscovery API`);
  console.log(`📡 Running on: http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  console.log(`❤️  Health: http://localhost:${PORT}/health\n`);
});

export default app;
