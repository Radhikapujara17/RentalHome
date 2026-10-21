const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

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
    }
  } catch (err) {
    console.error('Auto-seed check notice:', err.message);
  }
});

// Initialize Express App & HTTP Server
const app = express();
const server = http.createServer(app);

// Flexible CORS for Docker, Nginx proxy, local dev & staging
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (
      /^http:\/\/localhost(:\d+)?$/.test(origin) ||
      /^http:\/\/127\.0\.0\.1(:\d+)?$/.test(origin) ||
      origin === process.env.CLIENT_URL
    ) {
      return callback(null, true);
    }
    return callback(null, true);
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

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded property photos locally
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

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
server.listen(PORT, () => {
  console.log(`🚀 RentNest Server running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${PORT}`);
});

module.exports = { app, server };
