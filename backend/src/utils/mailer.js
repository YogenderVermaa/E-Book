import nodemailer from 'nodemailer';

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;

  const emailUser = process.env.EMAIL_USER || 'yogender.tech@gmail.com';
  const emailPass = process.env.EMAIL_PASS;

  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT, 10) || 465,
    secure: process.env.EMAIL_SECURE !== 'false', // true for 465
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });

  return transporter;
};

/**
 * Send 6-digit OTP to user email
 * @param {string} toEmail
 * @param {string} otp
 */
export const sendOtpEmail = async (toEmail, otp) => {
  const fromEmail = process.env.EMAIL_USER || 'yogender.tech@gmail.com';
  const hasValidPass =
    process.env.EMAIL_PASS &&
    process.env.EMAIL_PASS !== 'your_app_password_here' &&
    process.env.EMAIL_PASS.trim().length > 0;

  const subject = `Your LifeLog Login OTP: ${otp}`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
        .card { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        .logo-wrap { text-align: center; margin-bottom: 24px; }
        .logo-badge { display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #ffffff; padding: 10px 20px; border-radius: 12px; font-weight: 700; font-size: 20px; letter-spacing: -0.5px; }
        .title { font-size: 22px; font-weight: 700; text-align: center; margin-bottom: 8px; color: #0f172a; }
        .subtitle { font-size: 14px; text-align: center; color: #64748b; margin-bottom: 28px; }
        .otp-box { background: #f1f5f9; border: 2px dashed #cbd5e1; border-radius: 12px; text-align: center; padding: 20px; margin: 24px 0; }
        .otp-code { font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #4f46e5; font-family: 'Courier New', monospace; }
        .otp-expiry { font-size: 13px; color: #64748b; margin-top: 8px; }
        .note { font-size: 13px; color: #94a3b8; text-align: center; margin-top: 24px; line-height: 1.5; }
        .footer { text-align: center; font-size: 12px; color: #94a3b8; margin-top: 32px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="logo-wrap">
          <div class="logo-badge">LifeLog</div>
        </div>
        <h1 class="title">Verification Code</h1>
        <p class="subtitle">Enter this 6-digit OTP to access your written daily life diaries and vlogs.</p>
        
        <div class="otp-box">
          <div class="otp-code">${otp}</div>
          <div class="otp-expiry">Valid for 10 minutes. Do not share this code with anyone.</div>
        </div>

        <p class="note">If you didn't request this code, you can safely ignore this email.</p>
        <div class="footer">
          &copy; ${new Date().getFullYear()} LifeLog Inc. Written Daily Vlogs & Personal Diaries.
        </div>
      </div>
    </body>
    </html>
  `;

  // Always log in development/console for instant testing
  console.log(`\n==================================================`);
  console.log(`[LifeLog AUTH OTP]`);
  console.log(`Recipient: ${toEmail}`);
  console.log(`OTP Code : ${otp}`);
  console.log(`Expires in: 10 minutes`);
  console.log(`==================================================\n`);

  if (!hasValidPass) {
    console.warn(
      `[Mailer Note] EMAIL_PASS is not set yet in backend/.env. OTP has been logged to console above. Put your Gmail App Password in backend/.env to send live emails to inboxes.`
    );
    return { success: true, loggedToConsole: true };
  }

  try {
    const client = getTransporter();
    const info = await client.sendMail({
      from: `"LifeLog" <${fromEmail}>`,
      to: toEmail,
      subject,
      html,
    });
    console.log(`[Mailer Success] Email sent to ${toEmail}: messageId=${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[Mailer Error] Failed to send email to ${toEmail}:`, error.message);
    // Return gracefully so user can still test with console OTP during development/configuration
    return { success: false, error: error.message, loggedToConsole: true };
  }
};
