const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// ─── Send email to LEAD (follow-up emails) ─────────────────────────────────
async function sendToLead(lead, subject, htmlBody) {
  try {
    await transporter.sendMail({
      from: `"Saif Ullah — Portfolio" <${process.env.GMAIL_USER}>`,
      to: lead.email,
      subject,
      html: htmlBody,
      replyTo: process.env.GMAIL_USER,
    });
    console.log(`📧 Email sent to lead ${lead.email} — "${subject}"`);
    return true;
  } catch (err) {
    console.error(`❌ Email failed to ${lead.email}:`, err.message);
    return false;
  }
}

// ─── Notify SAIF when new lead arrives ─────────────────────────────────────
async function notifySaif(lead) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #0f0f23, #1a1a3e); padding: 30px; border-radius: 12px 12px 0 0;">
        <h1 style="color: #00d4ff; margin: 0; font-size: 24px;">🔥 New Lead Alert!</h1>
        <p style="color: #aaa; margin: 5px 0 0;">Portfolio Contact Form Submission</p>
      </div>
      <div style="background: #1e1e2e; padding: 30px; border-radius: 0 0 12px 12px; border: 1px solid #333;">
        <table style="width: 100%; color: #ddd; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #888;">👤 Name</td><td style="padding: 8px 0; color: #fff; font-weight: bold;">${lead.name}</td></tr>
          <tr><td style="padding: 8px 0; color: #888;">📧 Email</td><td style="padding: 8px 0; color: #00d4ff;">${lead.email}</td></tr>
          <tr><td style="padding: 8px 0; color: #888;">📱 Phone</td><td style="padding: 8px 0; color: #fff;">${lead.phone || 'Not provided'}</td></tr>
          <tr><td style="padding: 8px 0; color: #888;">🛠 Service</td><td style="padding: 8px 0; color: #fff;">${lead.service}</td></tr>
          <tr><td style="padding: 8px 0; color: #888; vertical-align: top;">💬 Message</td><td style="padding: 8px 0; color: #ddd;">${lead.message}</td></tr>
          <tr><td style="padding: 8px 0; color: #888;">🕐 Time</td><td style="padding: 8px 0; color: #fff;">${new Date(lead.submittedAt).toLocaleString('en-PK')}</td></tr>
          <tr><td style="padding: 8px 0; color: #888;">🆔 Lead ID</td><td style="padding: 8px 0; color: #888; font-size: 12px;">${lead.id}</td></tr>
        </table>
        <hr style="border-color: #333; margin: 20px 0;">
        <p style="color: #aaa; font-size: 12px; text-align: center;">
          🤖 7-day automation sequence has started for this lead
        </p>
      </div>
    </div>
  `;
  return sendToLead({ email: process.env.GMAIL_USER }, '🔥 New Lead: ' + lead.name + ' — ' + lead.service, html);
}

// ─── Instant confirmation to lead ───────────────────────────────────────────
async function sendWelcomeEmail(lead) {
  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #0d2137 100%); padding: 40px; border-radius: 16px 16px 0 0; text-align: center;">
        <h1 style="color: #00d4ff; margin: 0; font-size: 28px; letter-spacing: -0.5px;">Got your message! 🚀</h1>
        <p style="color: #9ab; margin: 10px 0 0; font-size: 16px;">I'll be with you shortly, ${lead.name.split(' ')[0]}.</p>
      </div>
      <div style="background: #111827; padding: 35px; border-radius: 0 0 16px 16px; border: 1px solid #1f2937;">
        <p style="color: #d1d5db; line-height: 1.7; font-size: 15px;">
          Hey <strong style="color: #fff;">${lead.name.split(' ')[0]}</strong>,
        </p>
        <p style="color: #d1d5db; line-height: 1.7; font-size: 15px;">
          Thank you for reaching out! I've received your inquiry about <strong style="color: #00d4ff;">${lead.service}</strong> and I'm already reviewing your message.
        </p>
        <div style="background: #1f2937; border-left: 4px solid #00d4ff; border-radius: 8px; padding: 20px; margin: 25px 0;">
          <p style="color: #9ca3af; margin: 0 0 8px; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Your Message</p>
          <p style="color: #e5e7eb; margin: 0; font-style: italic;">"${lead.message}"</p>
        </div>
        <p style="color: #d1d5db; line-height: 1.7; font-size: 15px;">
          I typically respond within <strong style="color: #fff;">2–4 hours</strong>. Meanwhile, feel free to:
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://saifullah-portfolio.com" style="background: linear-gradient(135deg, #00d4ff, #0066cc); color: #fff; padding: 14px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 15px; display: inline-block;">
            View My Work 🎨
          </a>
        </div>
        <p style="color: #6b7280; font-size: 13px; text-align: center; margin-top: 30px; border-top: 1px solid #1f2937; padding-top: 20px;">
          Saif Ullah | GHL Expert & Web Developer<br>
          📧 ghl.expert99@gmail.com | 📱 +92 (316) 35-35206
        </p>
      </div>
    </div>
  `;
  return sendToLead(lead, '✅ Got it! I\'ll be in touch soon — Saif Ullah', html);
}

// ─── Day 1 follow-up (10 mins after form) ──────────────────────────────────
async function sendFollowUp1(lead) {
  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #0f0f23, #1a1a3e); padding: 35px; border-radius: 16px 16px 0 0;">
        <h1 style="color: #00d4ff; margin: 0; font-size: 24px;">Quick check-in! 👋</h1>
      </div>
      <div style="background: #111827; padding: 35px; border-radius: 0 0 16px 16px; border: 1px solid #1f2937;">
        <p style="color: #d1d5db; line-height: 1.7;">Hey ${lead.name.split(' ')[0]},</p>
        <p style="color: #d1d5db; line-height: 1.7;">Just wanted to make sure your message came through — I'm already looking into your <strong style="color: #00d4ff;">${lead.service}</strong> requirements.</p>
        <p style="color: #d1d5db; line-height: 1.7;">Do you have a specific budget or timeline in mind? That helps me put together the most relevant proposal for you.</p>
        <div style="text-align: center; margin: 25px 0;">
          <a href="mailto:${process.env.GMAIL_USER}?subject=Re: ${lead.service} — ${lead.name}" 
             style="background: #00d4ff; color: #0a0a1a; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
            Reply Here 💬
          </a>
        </div>
        <p style="color: #6b7280; font-size: 13px; margin-top: 25px;">— Saif Ullah | ghl.expert99@gmail.com</p>
      </div>
    </div>
  `;
  return sendToLead(lead, '👋 Quick follow-up on your inquiry — Saif Ullah', html);
}

// ─── Day 2 follow-up ────────────────────────────────────────────────────────
async function sendFollowUp2(lead) {
  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #0f0f23, #1a1a3e); padding: 35px; border-radius: 16px 16px 0 0;">
        <h1 style="color: #f59e0b; margin: 0; font-size: 24px;">Still thinking it over? 🤔</h1>
      </div>
      <div style="background: #111827; padding: 35px; border-radius: 0 0 16px 16px; border: 1px solid #1f2937;">
        <p style="color: #d1d5db; line-height: 1.7;">Hey ${lead.name.split(' ')[0]},</p>
        <p style="color: #d1d5db; line-height: 1.7;">I know choosing the right developer for your project is a big decision. I just wanted to share a couple of things that might help:</p>
        <div style="background: #1f2937; border-radius: 10px; padding: 20px; margin: 20px 0;">
          <p style="color: #9ca3af; font-size: 13px; margin: 0 0 12px; text-transform: uppercase; letter-spacing: 1px;">Why clients choose me</p>
          <p style="color: #e5e7eb; margin: 6px 0;">✅ GHL Certified Expert — full automation setup</p>
          <p style="color: #e5e7eb; margin: 6px 0;">✅ Custom portfolios & web solutions</p>
          <p style="color: #e5e7eb; margin: 6px 0;">✅ Fast turnaround, transparent pricing</p>
          <p style="color: #e5e7eb; margin: 6px 0;">✅ Ongoing support after delivery</p>
        </div>
        <p style="color: #d1d5db; line-height: 1.7;">Any questions? Just hit reply — I'm here.</p>
        <p style="color: #6b7280; font-size: 13px; margin-top: 25px;">— Saif Ullah</p>
      </div>
    </div>
  `;
  return sendToLead(lead, '🤔 Helping you decide — Saif Ullah', html);
}

// ─── Day 3 follow-up ────────────────────────────────────────────────────────
async function sendFollowUp3(lead) {
  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #0f0f23, #1a1a3e); padding: 35px; border-radius: 16px 16px 0 0;">
        <h1 style="color: #10b981; margin: 0; font-size: 24px;">Free strategy call? 📞</h1>
      </div>
      <div style="background: #111827; padding: 35px; border-radius: 0 0 16px 16px; border: 1px solid #1f2937;">
        <p style="color: #d1d5db; line-height: 1.7;">Hey ${lead.name.split(' ')[0]},</p>
        <p style="color: #d1d5db; line-height: 1.7;">Sometimes it's easier to talk than email back and forth. I'd love to offer you a <strong style="color: #10b981;">free 15-minute strategy call</strong> where we can:</p>
        <div style="background: #1f2937; border-radius: 10px; padding: 20px; margin: 20px 0;">
          <p style="color: #e5e7eb; margin: 8px 0;">🎯 Understand exactly what you need</p>
          <p style="color: #e5e7eb; margin: 8px 0;">💡 Map out the best solution for your goals</p>
          <p style="color: #e5e7eb; margin: 8px 0;">💰 Give you a clear estimate on the spot</p>
        </div>
        <div style="text-align: center; margin: 25px 0;">
          <a href="https://wa.me/923163535206?text=Hi Saif, I'd like to book a call" 
             style="background: #25D366; color: #fff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block; margin-right: 10px;">
            WhatsApp Me 💬
          </a>
          <a href="tel:+923163535206" 
             style="background: #1f2937; color: #e5e7eb; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block; border: 1px solid #374151;">
            Call Me 📞
          </a>
        </div>
        <p style="color: #6b7280; font-size: 13px; margin-top: 25px;">— Saif Ullah | +92 316 35-35206</p>
      </div>
    </div>
  `;
  return sendToLead(lead, '📞 Free 15-min call? — Saif Ullah', html);
}

// ─── Day 5 follow-up ────────────────────────────────────────────────────────
async function sendFollowUp4(lead) {
  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #0f0f23, #1a1a3e); padding: 35px; border-radius: 16px 16px 0 0;">
        <h1 style="color: #f59e0b; margin: 0; font-size: 24px;">Still here if you need me ✊</h1>
      </div>
      <div style="background: #111827; padding: 35px; border-radius: 0 0 16px 16px; border: 1px solid #1f2937;">
        <p style="color: #d1d5db; line-height: 1.7;">Hey ${lead.name.split(' ')[0]},</p>
        <p style="color: #d1d5db; line-height: 1.7;">I know life gets busy. No pressure at all — just wanted to pop back in and let you know that I'm still here whenever you're ready to move forward with <strong style="color: #00d4ff;">${lead.service}</strong>.</p>
        <p style="color: #d1d5db; line-height: 1.7;">My availability is <strong style="color: #f59e0b;">filling up this month</strong>, but I'm keeping a spot open for your project because I genuinely think we'd do great work together.</p>
        <div style="text-align: center; margin: 25px 0;">
          <a href="mailto:${process.env.GMAIL_USER}?subject=Let's talk — ${lead.name}" 
             style="background: linear-gradient(135deg, #00d4ff, #0066cc); color: #fff; padding: 14px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
            Let's Get Started 🚀
          </a>
        </div>
        <p style="color: #6b7280; font-size: 13px; margin-top: 25px;">— Saif Ullah | ghl.expert99@gmail.com</p>
      </div>
    </div>
  `;
  return sendToLead(lead, '✊ Your project is still on my radar — Saif', html);
}

// ─── Day 7 FINAL follow-up ──────────────────────────────────────────────────
async function sendFinalFollowUp(lead) {
  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #1a0010, #3a0020); padding: 35px; border-radius: 16px 16px 0 0;">
        <h1 style="color: #f87171; margin: 0; font-size: 24px;">Last message from me 👋</h1>
      </div>
      <div style="background: #111827; padding: 35px; border-radius: 0 0 16px 16px; border: 1px solid #1f2937;">
        <p style="color: #d1d5db; line-height: 1.7;">Hey ${lead.name.split(' ')[0]},</p>
        <p style="color: #d1d5db; line-height: 1.7;">I don't want to keep filling your inbox, so this will be my last follow-up. If the timing wasn't right, I completely understand — things come up.</p>
        <p style="color: #d1d5db; line-height: 1.7;">If you ever circle back and need help with <strong style="color: #00d4ff;">${lead.service}</strong> or anything else, just reach out — the door is always open.</p>
        <div style="background: #1f2937; border-radius: 10px; padding: 20px; margin: 20px 0; text-align: center;">
          <p style="color: #9ca3af; margin: 0 0 10px; font-size: 14px;">Find me anytime</p>
          <p style="color: #e5e7eb; margin: 4px 0;">📧 ghl.expert99@gmail.com</p>
          <p style="color: #e5e7eb; margin: 4px 0;">📱 +92 316 35-35206</p>
        </div>
        <p style="color: #d1d5db; line-height: 1.7;">Wishing you the best with your project either way! 🙏</p>
        <p style="color: #6b7280; font-size: 13px; margin-top: 25px;">— Saif Ullah</p>
      </div>
    </div>
  `;
  return sendToLead(lead, '👋 Last note from me — Saif Ullah', html);
}

module.exports = {
  notifySaif, sendWelcomeEmail,
  sendFollowUp1, sendFollowUp2, sendFollowUp3,
  sendFollowUp4, sendFinalFollowUp
};
