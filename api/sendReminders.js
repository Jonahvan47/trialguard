import { Resend } from 'resend';

const resend = new Resend('re_RyJAYXjC_AyUwc1oVND8eLirGUWAieL9y');

export default async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const trials = req.body?.trials || [];
    const remindersSent = [];

    for (const trial of trials) {
      if (!trial.email || !trial.isPremium) continue;

      const endDate = new Date(trial.endDate);
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);

      const svc = SERVICES[trial.service] || { noticeDays: 2 };
      const safeCancel = new Date(endDate);
      safeCancel.setDate(safeCancel.getDate() - svc.noticeDays);

      const daysToSafe = Math.ceil((safeCancel - now) / 86400000);

      if (daysToSafe === 2) {
        await resend.emails.send({
          from: 'TrialGuard <reminders@mytrialguard.com>',
          to: trial.email,
          subject: `⚠️ Cancel ${trial.service} in 2 days or you'll be charged`,
          html: `
            <div style="font-family: system-ui, sans-serif; max-width: 500px; margin: 0 auto; padding: 32px 20px;">
              <div style="text-align: center; margin-bottom: 32px;">
                <div style="font-size: 48px; margin-bottom: 8px;">🛡️</div>
                <h1 style="font-size: 24px; font-weight: 800; color: #0a0a0a; margin: 0;">TrialGuard Reminder</h1>
              </div>
              <div style="background: #fff3cd; border: 1px solid #ffc107; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                <p style="font-size: 16px; font-weight: 700; color: #856404; margin: 0 0 8px;">⏰ Action required in 2 days</p>
                <p style="font-size: 14px; color: #856404; margin: 0;">Your <strong>${trial.service}</strong> free trial ends on ${new Date(trial.endDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}. Cancel by <strong>${safeCancel.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</strong> to avoid being charged.</p>
              </div>
              ${svc.cancelUrl ? `
              <div style="text-align: center; margin-bottom: 24px;">
                <a href="${svc.cancelUrl}" style="display: inline-block; background: #00aa55; color: #fff; font-size: 16px; font-weight: 700; padding: 14px 32px; border-radius: 99px; text-decoration: none;">Cancel ${trial.service} Now →</a>
              </div>
              ` : ''}
              <p style="font-size: 13px; color: #888; text-align: center; margin: 0;">You're receiving this because you're a TrialGuard Premium member.<br>Visit <a href="https://mytrialguard.com" style="color: #00aa55;">mytrialguard.com</a> to manage your trials.</p>
            </div>
          `,
        });
        remindersSent.push(trial.service);
      }
    }

    return res.status(200).json({ 
      success: true, 
      remindersSent,
      message: `Sent ${remindersSent.length} reminder(s)` 
    });

  } catch (error) {
    console.error('Error sending reminders:', error);
    return res.status(500).json({ error: error.message });
  }
}

const SERVICES = {
  "Netflix":              { cancelUrl: "https://www.netflix.com/cancelplan",              noticeDays: 1 },
  "Spotify":              { cancelUrl: "https://www.spotify.com/account/subscription/",   noticeDays: 1 },
  "Adobe Creative Cloud": { cancelUrl: "https://account.adobe.com/plans",                 noticeDays: 2 },
  "Amazon Prime":         { cancelUrl: "https://www.amazon.com/gp/primecentral",          noticeDays: 1 },
  "Apple TV+":            { cancelUrl: "https://tv.apple.com/settings",                   noticeDays: 1 },
  "Disney+":              { cancelUrl: "https://www.disneyplus.com/account/subscription", noticeDays: 1 },
  "YouTube Premium":      { cancelUrl: "https://www.youtube.com/paid_memberships",        noticeDays: 1 },
  "Hulu":                 { cancelUrl: "https://secure.hulu.com/account",                 noticeDays: 1 },
  "LinkedIn Premium":     { cancelUrl: "https://www.linkedin.com/premium/manage",         noticeDays: 2 },
  "Duolingo Plus":        { cancelUrl: "https://www.duolingo.com/settings/subscription",  noticeDays: 1 },
  "Notion":               { cancelUrl: "https://www.notion.so/profile/billing",           noticeDays: 1 },
  "Dropbox":              { cancelUrl: "https