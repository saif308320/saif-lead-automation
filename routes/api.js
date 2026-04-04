const multer = require('multer');
const upload = multer();

const express = require('express');
const router = express.Router();
// ... baqi code
const { createLead, getAllLeads, getLead, markResponded, closeLead } = require('../utils/leadStore');
const { notifySaif, sendWelcomeEmail } = require('../utils/emailService');
const { notifyNewLead } = require('../utils/whatsappService');
const { startSequence, stopSequence } = require('../utils/automationEngine');

// ============================================
// POST /api/contact — Portfolio form submission
// ============================================
router.post('/contact', upload.none(), async (req, res) => {
  try {
const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
const { name, email, phone, message, service } = body;
    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'Name, email and message are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, error: 'Invalid email address' });
    }

    // Create lead in store
    const lead = createLead({ name, email, phone, message, service });

    // STEP 1: Notify Saif via email + WhatsApp simultaneously
    await Promise.allSettled([
      notifySaif(lead),
      notifyNewLead(lead),
    ]);

    // STEP 2: Send welcome email to lead
    await sendWelcomeEmail(lead);

    // STEP 3: Start 7-day automation sequence
    startSequence(lead.id);

    return res.json({
      success: true,
      message: 'Message received! You\'ll hear from Saif shortly.',
      leadId: lead.id
    });

  } catch (err) {
    console.error('❌ Contact form error:', err);
    return res.status(500).json({ success: false, error: 'Something went wrong, please try again.' });
  }
});

// ============================================
// POST /api/responded/:id — Mark lead as responded
// Call this when YOU reply to a lead email
// ============================================
router.post('/responded/:id', (req, res) => {
  const { secret } = req.body;
  if (secret !== process.env.ADMIN_PASSWORD) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  const ok = stopSequence(req.params.id);
  res.json({ success: true, message: 'Lead marked as responded, sequence stopped.' });
});

// ============================================
// GET /api/leads — All leads (admin only)
// ============================================
router.get('/leads', (req, res) => {
  const { password } = req.query;
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  const leads = getAllLeads();
  res.json({ success: true, count: leads.length, leads });
});

// ============================================
// GET /api/lead/:id — Single lead details
// ============================================
router.get('/lead/:id', (req, res) => {
  const { password } = req.query;
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  const lead = getLead(req.params.id);
  if (!lead) return res.status(404).json({ error: 'Lead not found' });
  res.json({ success: true, lead });
});

// ============================================
// POST /api/close/:id — Manually close a lead
// ============================================
router.post('/close/:id', (req, res) => {
  const { secret } = req.body;
  if (secret !== process.env.ADMIN_PASSWORD) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  closeLead(req.params.id);
  res.json({ success: true, message: 'Lead closed' });
});

// ============================================
// GET /api/health — Server health check
// ============================================
router.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), time: new Date() });
});

module.exports = router;
