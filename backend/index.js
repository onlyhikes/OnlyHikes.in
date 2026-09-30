// ====================================================================
// ONLYHIKES.IN — BACKEND API SERVER
// Express + Supabase / PostgreSQL Architecture
// ====================================================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

// Route Handlers
const hikeRoutes = require('./routes/hikeRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const couponRoutes = require('./routes/couponRoutes');
const voteRoutes = require('./routes/voteRoutes');
const pickupRoutes = require('./routes/pickupRoutes');
const userRoutes = require('./routes/userRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const brandRoutes = require('./routes/brandRoutes');
const contentRoutes = require('./routes/contentRoutes');
const mediaRoutes = require('./routes/mediaRoutes');
const routeRoutes = require('./routes/routeRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend and development tooling
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-key']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'OnlyHikes API',
    brand: 'OnlyHikes.in',
    tagline: 'YOUR WEEKEND JUST GOT WILDER.',
    city: 'Jaipur, India',
    timestamp: new Date().toISOString()
  });
});

// Mount Resource Routes
app.use('/api/hikes', hikeRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/votes', voteRoutes);
app.use('/api/pickups', pickupRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/brand', brandRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/reviews', reviewRoutes);

// Catch-all 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.originalUrl}' not found on OnlyHikes backend.`
  });
});

// Centralized Error Handler
app.use(errorHandler);

// Start Server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🌲 ONLYHIKES.IN API SERVER RUNNING ON PORT ${PORT}`);
    console.log(`⚡ Tagline: "YOUR WEEKEND JUST GOT WILDER."`);
    console.log(`📍 City: Jaipur, Rajasthan`);
    console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`====================================================`);
  });
}

module.exports = app;
