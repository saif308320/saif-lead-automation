const {
  getLead, updateLead, markResponded, closeLead, addHistory
} = require('./leadStore');

const {
  sendFollowUp1, sendFollowUp2, sendFollowUp3,
  sendFollowUp4, sendFinalFollowUp
} = require('./emailService');

const { remindSaif } = require('./whatsappService');

// ============================================
// AUTOMATION SEQUENCE DEFINITION
// ============================================
// Steps run AFTER welcome email is sent immediately on form submit
const SEQUENCE = [
  {
    step: 1,
    name: 'First Follow-up',
    delayMs: 10 * 60 * 1000,         // 10 minutes
    action: sendFollowUp1,
  },
  {
    step: 2,
    name: 'Day 1 Evening',
    delayMs: 24 * 60 * 60 * 1000,    // 1 day
    action: sendFollowUp2,
  },
  {
    step: 3,
    name: 'Day 2 - Strategy Call Offer',
    delayMs: 48 * 60 * 60 * 1000,    // 2 days
    action: sendFollowUp3,
  },
  {
    step: 4,
    name: 'Day 3 - Remind Saif (WhatsApp)',
    delayMs: 72 * 60 * 60 * 1000,    // 3 days
    action: async (lead) => {
      await remindSaif(lead);
      return true;
    },
  },
  {
    step: 5,
    name: 'Day 5 - Urgency Email',
    delayMs: 5 * 24 * 60 * 60 * 1000, // 5 days
    action: sendFollowUp4,
  },
  {
    step: 6,
    name: 'Day 7 - Final Email',
    delayMs: 7 * 24 * 60 * 60 * 1000, // 7 days
    action: sendFinalFollowUp,
    isLast: true,
  },
];

// ============================================
// SCHEDULE NEXT STEP FOR A LEAD
// ============================================
function scheduleNextStep(leadId, stepIndex = 0) {
  if (stepIndex >= SEQUENCE.length) {
    console.log(`✅ Sequence complete for lead ${leadId}`);
    closeLead(leadId);
    return;
  }

  const stepDef = SEQUENCE[stepIndex];

  // Schedule this step
  const timer = setTimeout(async () => {
    const lead = getLead(leadId);

    // STOP if lead responded or closed
    if (!lead || lead.status !== 'active') {
      console.log(`⛔ Skipping step ${stepDef.step} for ${leadId} — status: ${lead?.status}`);
      return;
    }

    console.log(`▶️  Running step ${stepDef.step} (${stepDef.name}) for lead ${leadId}`);

    try {
      const ok = await stepDef.action(lead);
      addHistory(leadId, `step_${stepDef.step}`, stepDef.name + (ok ? ' ✅' : ' ❌'));

      if (stepDef.isLast) {
        closeLead(leadId);
        console.log(`🏁 Sequence finished for ${leadId}`);
      } else {
        // Schedule next step
        scheduleNextStep(leadId, stepIndex + 1);
      }
    } catch (err) {
      console.error(`❌ Error in step ${stepDef.step} for ${leadId}:`, err.message);
      addHistory(leadId, `step_${stepDef.step}_error`, err.message);
      // Still continue to next step even if this one fails
      if (!stepDef.isLast) {
        scheduleNextStep(leadId, stepIndex + 1);
      }
    }
  }, stepDef.delayMs);

  // Save next action time
  updateLead(leadId, {
    currentStep: stepIndex,
    nextActionAt: new Date(Date.now() + stepDef.delayMs),
    nextStepName: stepDef.name,
  });

  console.log(`⏰ Step ${stepDef.step} (${stepDef.name}) scheduled for lead ${leadId} — in ${Math.round(stepDef.delayMs / 60000)} mins`);

  return timer;
}

// ============================================
// START SEQUENCE FOR NEW LEAD
// ============================================
function startSequence(leadId) {
  console.log(`🚀 Starting 7-day sequence for lead: ${leadId}`);
  scheduleNextStep(leadId, 0);
}

// ============================================
// STOP SEQUENCE (when lead responds)
// ============================================
function stopSequence(leadId) {
  markResponded(leadId);
  // The timer callbacks check lead status before running — so they auto-skip
  console.log(`🛑 Sequence stopped for lead: ${leadId}`);
}

module.exports = { startSequence, stopSequence, SEQUENCE };
