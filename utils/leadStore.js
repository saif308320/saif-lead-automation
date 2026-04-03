// ============================================
// LEAD STORE - In-memory database for leads
// ============================================

const leads = new Map(); // leadId -> leadData

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

function createLead(data) {
  const id = generateId();
  const lead = {
    id,
    name: data.name,
    email: data.email,
    phone: data.phone || null,
    message: data.message,
    service: data.service || 'General Inquiry',
    submittedAt: new Date(),
    status: 'active', // active | responded | closed
    currentStep: 0,   // which automation step we're on
    nextActionAt: null,
    history: [],
    responded: false,
  };
  leads.set(id, lead);
  console.log(`✅ New lead created: ${id} — ${lead.name} (${lead.email})`);
  return lead;
}

function getLead(id) {
  return leads.get(id);
}

function getAllLeads() {
  return Array.from(leads.values()).sort((a, b) => b.submittedAt - a.submittedAt);
}

function updateLead(id, updates) {
  const lead = leads.get(id);
  if (!lead) return null;
  Object.assign(lead, updates);
  leads.set(id, lead);
  return lead;
}

function markResponded(id) {
  const lead = leads.get(id);
  if (!lead) return false;
  lead.status = 'responded';
  lead.responded = true;
  lead.history.push({ event: 'responded', at: new Date() });
  leads.set(id, lead);
  console.log(`📩 Lead ${id} marked as responded — sequence STOPPED`);
  return true;
}

function closeLead(id) {
  const lead = leads.get(id);
  if (!lead) return false;
  lead.status = 'closed';
  lead.history.push({ event: 'closed', at: new Date() });
  leads.set(id, lead);
  console.log(`🔒 Lead ${id} closed`);
  return true;
}

function addHistory(id, event, detail = '') {
  const lead = leads.get(id);
  if (!lead) return;
  lead.history.push({ event, detail, at: new Date() });
  leads.set(id, lead);
}

module.exports = {
  createLead, getLead, getAllLeads,
  updateLead, markResponded, closeLead, addHistory
};
