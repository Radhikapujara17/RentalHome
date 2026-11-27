const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Validate JWT secret requirement early
const { getJwtSecret } = require('./utils/helpers');
getJwtSecret();

// Connect to MongoDB
const connectDB = require('./config/db');
const Property = require('./models/Property');
const seedData = require('./utils/seed');

connectDB().then(async () => {
  try {
    const count = await Property.countDocuments();
    if (count === 0) {
      console.log('🌱 Fresh database detected. Auto-seeding initial Rajkot rental properties...');
      await seedData();
    } else {
      // Backfill legacy property documents missing city or category so Explore filters match them
      await Property.updateMany(
        { $or: [{ city: { $exists: false } }, { city: null }, { city: '' }] },
        { $set: { city: 'Rajkot' } }
      );
      await Property.updateMany(
        { $or: [{ category: { $exists: false } }, { category: null }, { category: '' }] },
        { $set: { category: 'residential' } }
      );
    }
  } catch (err) {
    console.error('Auto-seed check notice:', err.message);
  }
});

// Initialize Express App & HTTP Server
const app = express();
const server = http.createServer(app);

// Disable ETags completely to prevent HTTP 304 Not Modified responses on dynamic API data
app.set('etag', false);
app.disable('etag');

// Strict CORS allowlist for Docker, Nginx proxy, local dev & configured CLIENT_URL
const allowedOrigins = new Set(
  [process.env.CLIENT_URL]
    .filter(Boolean)
    .map((u) => u.trim().replace(/\/+$/, ''))
);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const normalized = origin.trim().replace(/\/+$/, '');
    const isDevLocal =
      process.env.NODE_ENV !== 'production' &&
      (/^http:\/\/localhost(:\d+)?$/.test(normalized) ||
        /^http:\/\/127\.0\.0\.1(:\d+)?$/.test(normalized));
    if (isDevLocal || allowedOrigins.has(normalized)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
};

// Initialize Socket.io
const io = new Server(server, {
  cors: corsOptions
});

// Setup WebSockets
const chatSocket = require('./sockets/chatSocket');
chatSocket(io);

// Security & Core Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(mongoSanitize());

// Rate limiters for auth & anti-abuse endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 25 : 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many authentication attempts. Please try again later.' }
});
app.use('/api/v1/auth/login', authLimiter);
app.use('/api/v1/auth/register', authLimiter);
app.use('/api/v1/auth/send-otp', authLimiter);
app.use('/api/v1/auth/verify-otp', authLimiter);

// Prevent browser/proxy caching on API routes (resolves 304 Not Modified and stale role/user data)
app.use('/api', (req, res, next) => {
  // Strip conditional headers from client so Express never evaluates req.fresh to true or sends 304
  delete req.headers['if-none-match'];
  delete req.headers['if-modified-since'];

  res.set({
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
    'Pragma': 'no-cache',
    'Expires': '0',
    'Surrogate-Control': 'no-store'
  });
  next();
});

// Serve uploaded property photos locally with nosniff header
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads'), {
  setHeaders: (res) => {
    res.set('X-Content-Type-Options', 'nosniff');
    res.set('Content-Disposition', 'inline');
  }
}));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'RentNest Backend API',
    city: 'Rajkot, Gujarat'
  });
});

// Mount SEO Routes (robots.txt & dynamic sitemap.xml)
app.use('/', require('./routes/seoRoutes'));

// Mount API Routes
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/properties', require('./routes/propertyRoutes'));
app.use('/api/v1/visits', require('./routes/visitRoutes'));
app.use('/api/v1/chat', require('./routes/chatRoutes'));
app.use('/api/v1/tools', require('./routes/toolsRoutes'));
app.use('/api/v1/searches', require('./routes/searchRoutes'));

// Centralized Error Handling Middleware
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use by another process.`);
    console.error(`👉 Run this command in PowerShell to free port ${PORT}:`);
    console.error(`   Get-NetTCPConnection -LocalPort ${PORT} -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }`);
  } else {
    console.error('Server error:', err);
  }
  process.exit(1);
});

server.listen(PORT, () => {
  console.log(`🚀 RentNest Server running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${PORT}`);
});

module.exports = { app, server };
