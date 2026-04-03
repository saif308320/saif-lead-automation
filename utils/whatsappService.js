const axios = require('axios');

// ============================================
// CALLMEBOT - Free WhatsApp API
// Setup: https://www.callmebot.com/blog/free-api-whatsapp-messages/
// 1. WhatsApp mein +34 644 59 79 87 pe message bhejo: "I allow callmebot to send me messages"
// 2. Wo API key bhejenge
// 3. .env mein CALLMEBOT_APIKEY set karo
// ============================================

async function sendWhatsApp(message) {
  try {
    const phone = process.env.YOUR_WHATSAPP.replace('+', '').replace(/\s/g, '');
    const apiKey = process.env.CALLMEBOT_APIKEY;

    if (!apiKey || apiKey === 'your_callmebot_key_here') {
      console.log('⚠️  WhatsApp skipped — CallMeBot API key not set');
      return false;
    }

    const encodedMessage = encodeURIComponent(message);
    const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodedMessage}&apikey=${apiKey}`;

    const response = await axios.get(url, { timeout: 10000 });
    console.log('📱 WhatsApp notification sent');
    return true;
  } catch (err) {
    console.error('❌ WhatsApp failed:', err.message);
    return false;
  }
}

// Notify Saif instantly when new lead comes in
async function notifyNewLead(lead) {
  const msg = `🔥 *New Lead Alert!*\n\n👤 *${lead.name}*\n📧 ${lead.email}\n📱 ${lead.phone || 'No phone'}\n🛠 ${lead.service}\n\n💬 "${lead.message.substring(0, 100)}${lead.message.length > 100 ? '...' : ''}"\n\n⏰ 7-day automation started ✅`;
  return sendWhatsApp(msg);
}

// Remind Saif to follow up manually if lead hasn't responded Day 4
async function remindSaif(lead) {
  const msg = `⚡ *Follow-up Reminder*\n\n${lead.name} still hasn't responded after 4 days.\n\nEmail: ${lead.email}\nService: ${lead.service}\n\nConsider a personal outreach! 🎯`;
  return sendWhatsApp(msg);
}

module.exports = { sendWhatsApp, notifyNewLead, remindSaif };
