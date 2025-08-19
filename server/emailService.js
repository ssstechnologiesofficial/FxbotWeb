import sgMail from '@sendgrid/mail';

// Initialize SendGrid
if (!process.env.SENDGRID_API_KEY) {
  console.warn('SENDGRID_API_KEY not found in environment variables');
} else {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

class EmailService {
  constructor() {
    this.fromEmail = 'noreply@fxbot.co.in'; // Default sender email
  }

  async sendWelcomeEmail(userEmail, userData) {
    try {
      const msg = {
        to: userEmail,
        from: {
          email: this.fromEmail,
          name: 'FXBOT Team'
        },
        subject: 'Welcome to FXBOT - Your Forex Investment Journey Begins!',
        html: this.generateWelcomeEmailTemplate(userData)
      };

      const result = await sgMail.send(msg);
      console.log('Welcome email sent successfully to:', userEmail);
      return { success: true, messageId: result[0].headers['x-message-id'] };
    } catch (error) {
      console.error('Error sending welcome email:', error);
      return { success: false, error: error.message };
    }
  }

  generateWelcomeEmailTemplate(userData) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to FXBOT</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header { background: linear-gradient(135deg, #f59e0b, #d97706); padding: 30px; text-align: center; }
        .logo { color: #ffffff; font-size: 28px; font-weight: bold; margin: 0; }
        .content { padding: 40px 30px; }
        .welcome-title { color: #111827; font-size: 24px; font-weight: bold; margin-bottom: 20px; }
        .user-info { background-color: #f9fafb; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #f59e0b; }
        .info-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
        .label { font-weight: 600; color: #374151; }
        .value { color: #111827; }
        .sponsor-id { background-color: #f59e0b; color: white; padding: 8px 16px; border-radius: 6px; font-weight: bold; display: inline-block; }
        .next-steps { background-color: #ecfdf5; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .step { margin-bottom: 10px; padding-left: 20px; position: relative; }
        .step:before { content: "✓"; position: absolute; left: 0; color: #059669; font-weight: bold; }
        .footer { background-color: #374151; color: #d1d5db; text-align: center; padding: 20px; font-size: 14px; }
        .button { background-color: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; margin: 20px 0; }
        .button:hover { background-color: #d97706; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 class="logo">FXBOT</h1>
          <p style="color: #fbbf24; margin: 10px 0 0 0;">Professional Forex Investment Platform</p>
        </div>
        
        <div class="content">
          <h2 class="welcome-title">Welcome to FXBOT, ${userData.firstName}!</h2>
          
          <p>Congratulations on taking the first step towards your forex investment journey. Your account has been successfully created and you're now part of the FXBOT community.</p>
          
          <div class="user-info">
            <h3 style="margin-top: 0; color: #111827;">Your Account Details</h3>
            <div class="info-row">
              <span class="label">Name:</span>
              <span class="value">${userData.firstName} ${userData.lastName}</span>
            </div>
            <div class="info-row">
              <span class="label">Email:</span>
              <span class="value">${userData.email}</span>
            </div>
            <div class="info-row">
              <span class="label">Mobile:</span>
              <span class="value">${userData.mobile || 'Not provided'}</span>
            </div>
            <div class="info-row">
              <span class="label">Your Sponsor ID:</span>
              <span class="sponsor-id">${userData.ownSponsorId}</span>
            </div>
            ${userData.sponsorId ? `
            <div class="info-row">
              <span class="label">Referred by:</span>
              <span class="value">${userData.sponsorId}</span>
            </div>
            ` : ''}
          </div>
          
          <div class="next-steps">
            <h3 style="margin-top: 0; color: #059669;">What's Next?</h3>
            <div class="step">Complete your profile verification</div>
            <div class="step">Explore our investment packages</div>
            <div class="step">Make your first deposit to start earning</div>
            <div class="step">Refer friends and earn commission rewards</div>
            <div class="step">Access the DAS program for enhanced earnings</div>
          </div>
          
          <p>Ready to start your investment journey?</p>
          <a href="https://fxbot.co.in/login" class="button">Access Your Dashboard</a>
          
          <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
            <strong>Important:</strong> Keep your login credentials secure and never share them with anyone. 
            Our team will never ask for your password via email or phone.
          </p>
        </div>
        
        <div class="footer">
          <p>&copy; 2025 FXBOT. All rights reserved.</p>
          <p>Professional Forex Investment Platform</p>
          <p>Need help? Contact us at support@fxbot.co.in</p>
        </div>
      </div>
    </body>
    </html>
    `;
  }

  async sendTestEmail(toEmail) {
    try {
      const msg = {
        to: toEmail,
        from: {
          email: this.fromEmail,
          name: 'FXBOT Team'
        },
        subject: 'FXBOT Email Service Test',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #f59e0b;">Email Service Test</h2>
            <p>This is a test email to verify that the FXBOT email service is working correctly.</p>
            <p>If you received this email, the integration is successful!</p>
            <hr>
            <p style="color: #666; font-size: 12px;">FXBOT - Professional Forex Investment Platform</p>
          </div>
        `
      };

      const result = await sgMail.send(msg);
      console.log('Test email sent successfully to:', toEmail);
      return { success: true, messageId: result[0].headers['x-message-id'] };
    } catch (error) {
      console.error('Error sending test email:', error);
      return { success: false, error: error.message };
    }
  }
}

export const emailService = new EmailService();