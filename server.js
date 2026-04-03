require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');

const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ───────────────────────────────────────────────
app.use(cors({
  origin: '*', // In production, restrict to your portfolio domain
  methods: ['GET', 'POST'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limit form submissions (max 5 per 15 mins per IP)
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, error: 'Too many submissions. Please wait 15 minutes.' },
});

// ─── Routes ──────────────────────────────────────────────────
app.use('/api', apiRoutes);
app.post('/api/contact', contactLimiter); // Apply rate limit specifically

// ─── Admin Dashboard ─────────────────────────────────────────
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});

// ─── Root ────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Saif Lead Automation Server',
    status: 'running',
    endpoints: {
      'POST /api/contact': 'Submit contact form',
      'GET /dashboard': 'Admin dashboard',
      'GET /api/health': 'Health check',
    }
  });
});

// ─── Start ───────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════╗
║   🚀 Saif Lead Automation Server          ║
║   Port: ${PORT}                              ║
║   Dashboard: /dashboard                   ║
║   Time: ${new Date().toLocaleString('en-PK')}  ║
╚═══════════════════════════════════════════╝
  `);
});

module.exports = app;
