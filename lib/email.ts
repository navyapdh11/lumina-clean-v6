/**
 * Email notification service for lead submissions
 * Uses Resend API (resend.com) for transactional emails
 * Falls back to console logging if no API key configured
 */

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

interface LeadNotificationData {
  type: string;
  contactName: string;
  email: string;
  phone?: string;
  businessName?: string;
  message?: string;
  [key: string]: any;
}

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.EMAIL_FROM || 'notifications@perth-clean.com.au';
const TO_EMAIL = process.env.EMAIL_TO || 'team@perth-clean.com.au';

/**
 * Send an email notification
 * Falls back to console.log if RESEND_API_KEY is not configured
 */
export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; id?: string }> {
  // Fallback for development without API key
  if (!RESEND_API_KEY) {
    console.log('📧 Email notification (dev mode - no RESEND_API_KEY):');
    console.log(`   To: ${options.to}`);
    console.log(`   Subject: ${options.subject}`);
    console.log(`   Preview: ${options.text || options.html.substring(0, 100)}...`);
    return { success: true };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [options.to],
        subject: options.subject,
        html: options.html,
        text: options.text || options.html.replace(/<[^>]*>/g, ''),
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Failed to send email:', error);
      return { success: false };
    }

    const data = await response.json();
    console.log(`✅ Email sent to ${options.to}: ${data.id}`);
    return { success: true, id: data.id };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false };
  }
}

/**
 * Sanitize HTML to prevent XSS in email templates
 */
function sanitizeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Send notification when a new lead is submitted
 */
export async function notifyNewLead(lead: LeadNotificationData) {
  const subject = `New Lead: ${lead.type} - ${sanitizeHtml(lead.contactName)}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #06b6d4; border-bottom: 2px solid #06b6d4; padding-bottom: 10px;">
        New Lead Submission
      </h2>
      
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Type:</td><td style="padding: 8px 0;">${sanitizeHtml(lead.type)}</td></tr>
        <tr><td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Name:</td><td style="padding: 8px 0;">${sanitizeHtml(lead.contactName)}</td></tr>
        <tr><td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Email:</td><td style="padding: 8px 0;"><a href="mailto:${sanitizeHtml(lead.email)}">${sanitizeHtml(lead.email)}</a></td></tr>
        ${lead.phone ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Phone:</td><td style="padding: 8px 0;"><a href="tel:${sanitizeHtml(lead.phone)}">${sanitizeHtml(lead.phone)}</a></td></tr>` : ''}
        ${lead.businessName ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Business:</td><td style="padding: 8px 0;">${sanitizeHtml(lead.businessName)}</td></tr>` : ''}
      </table>

      ${lead.message ? `
        <div style="margin-top: 20px; padding: 15px; background: #f3f4f6; border-radius: 8px;">
          <h3 style="margin-top: 0; color: #374151;">Message:</h3>
          <p style="color: #4b5563;">${sanitizeHtml(lead.message)}</p>
        </div>
      ` : ''}

      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #9ca3af; font-size: 12px;">
        <p>This notification was sent from PerthClean Lead Management System</p>
        <p>Time: ${new Date().toLocaleString('en-AU')}</p>
      </div>
    </div>
  `;

  // Notify team
  await sendEmail({
    to: TO_EMAIL,
    subject,
    html,
    text: `New ${lead.type} lead from ${lead.contactName} (${lead.email})`,
  });

  // Send confirmation to customer
  await sendEmail({
    to: lead.email,
    subject: `Thank you for your inquiry - PerthClean`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #06b6d4;">Thank you for contacting PerthClean!</h2>
        <p>Hi ${lead.contactName},</p>
        <p>We've received your ${lead.type.replace('-', ' ')} inquiry and our team will contact you within 24 hours.</p>
        ${lead.phone ? `<p>If urgent, you can also reach us at <strong>1300-PERTHCLEAN</strong>.</p>` : ''}
        <p style="margin-top: 30px;">Best regards,<br><strong>The PerthClean Team</strong></p>
        <p style="color: #9ca3af; font-size: 12px; margin-top: 40px;">
          📞 1300-PERTHCLEAN | 🌐 perth-clean.com.au
        </p>
      </div>
    `,
    text: `Thank you for your inquiry, ${lead.contactName}. We'll contact you within 24 hours.`,
  });
}
