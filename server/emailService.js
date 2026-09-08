import sgMail from '@sendgrid/mail';

const getEmailConfig = () => Object.freeze({
  fromEmail: process.env.EMAIL_FROM?.trim() || 'noreply@fxbot.in',
  supportEmail: process.env.SUPPORT_EMAIL?.trim() || 'support@fxbot.in',
  replyToEmail: process.env.EMAIL_REPLY_TO?.trim() || process.env.SUPPORT_EMAIL?.trim() || 'support@fxbot.in',
  adminEmail: process.env.ADMIN_EMAIL?.trim() || 'support@fxbot.in',
  fromName: 'FXBOT Team'
});

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
} else {
  console.warn('Transactional email is unavailable: SendGrid credentials are not configured');
}

class EmailService {
  constructor({ mailer = sgMail } = {}) {
    const config = getEmailConfig();
    this.mailer = mailer;
    this.fromEmail = config.fromEmail;
    this.supportEmail = config.supportEmail;
    this.replyToEmail = config.replyToEmail;
    this.adminEmail = config.adminEmail;
  }

  createMessage(message, fromName = getEmailConfig().fromName) {
    return {
      ...message,
      from: {
        email: this.fromEmail,
        name: fromName
      },
      replyTo: {
        email: this.replyToEmail,
        name: 'FXBOT Support'
      }
    };
  }

  async deliver(message, emailType) {
    this.validateConfiguration();

    try {
      const [response] = await this.mailer.send(message);
      console.info('Transactional email accepted', {
        type: emailType,
        messageId: response?.headers?.['x-message-id'] || 'unavailable'
      });
      return {
        success: true,
        messageId: response?.headers?.['x-message-id']
      };
    } catch (error) {
      console.error('Transactional email delivery failed', {
        type: emailType,
        statusCode: error?.code || error?.response?.statusCode || 'unknown'
      });
      return { success: false, error: 'Email delivery failed' };
    }
  }

  validateConfiguration() {
    if (!process.env.SENDGRID_API_KEY) {
      throw new Error('Transactional email is not configured');
    }

    if (process.env.NODE_ENV === 'production' && !process.env.EMAIL_FROM?.trim()) {
      throw new Error('EMAIL_FROM must be explicitly configured in production');
    }

    this.getBaseUrl();
  }

  // Get the correct base URL for the current environment
  getBaseUrl() {
    const isDevelopment = process.env.NODE_ENV !== 'production';
    const configuredBaseUrl = process.env.APP_BASE_URL?.trim();

    if (configuredBaseUrl) {
      let parsedUrl;
      try {
        parsedUrl = new URL(configuredBaseUrl);
      } catch {
        throw new Error('APP_BASE_URL must be a valid absolute URL');
      }

      if (!isDevelopment && parsedUrl.protocol !== 'https:') {
        throw new Error('APP_BASE_URL must use HTTPS in production');
      }

      return parsedUrl.origin;
    }
    
    if (isDevelopment) {
      // Use Replit domain in development
      const replitDomain = process.env.REPLIT_DEV_DOMAIN || process.env.REPLIT_DOMAINS;
      if (replitDomain) {
        return `https://${replitDomain}`;
      }
      // Fallback to localhost if no Replit domain
      return 'http://localhost:5000';
    }
    
    throw new Error('APP_BASE_URL must be set before sending transactional email in production');
  }

  async sendWelcomeEmail(userEmail, userData) {
    try {
      const msg = this.createMessage({
        to: userEmail,
        subject: 'Welcome to FXBOT - Your Forex Investment Journey Begins!',
        html: this.generateWelcomeEmailTemplate(userData)
      });

      return await this.deliver(msg, 'welcome');
    } catch (error) {
      console.error('Transactional email preparation failed', { type: 'welcome' });
      return { success: false, error: 'Email delivery failed' };
    }
  }

  async sendPasswordResetEmail(userEmail, resetToken, userName) {
    try {
      const baseUrl = this.getBaseUrl();
      const resetLink = `${baseUrl}/reset-password?token=${resetToken}`;
      
      const msg = this.createMessage({
        to: userEmail,
        subject: 'Reset Your FXBOT Password',
        html: this.generatePasswordResetEmailTemplate(resetLink, userName)
      });

      return await this.deliver(msg, 'password_reset');
    } catch (error) {
      console.error('Transactional email preparation failed', { type: 'password_reset' });
      return { success: false, error: 'Email delivery failed' };
    }
  }

  generateWelcomeEmailTemplate(userData) {
    const baseUrl = this.getBaseUrl();
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
          </div>
          
          <p>Ready to start your investment journey?</p>
          <a href="${baseUrl}/login" class="button">Access Your Dashboard</a>
          
          <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
            <strong>Important:</strong> Keep your login credentials secure and never share them with anyone. 
            Our team will never ask for your password via email or phone.
          </p>
        </div>
        
        <div class="footer">
          <p>&copy; 2025 FXBOT. All rights reserved.</p>
          <p>Professional Forex Investment Platform</p>
          <p>Need help? Contact us at ${this.supportEmail}</p>
        </div>
      </div>
    </body>
    </html>
    `;
  }

  generatePasswordResetEmailTemplate(resetLink, userName) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your FXBOT Password</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header { background: linear-gradient(135deg, #dc2626, #b91c1c); padding: 30px; text-align: center; }
        .logo { color: #ffffff; font-size: 28px; font-weight: bold; margin: 0; }
        .content { padding: 40px 30px; }
        .reset-title { color: #111827; font-size: 24px; font-weight: bold; margin-bottom: 20px; }
        .security-notice { background-color: #fef3c7; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #f59e0b; }
        .button { background-color: #dc2626; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; margin: 25px 0; font-size: 16px; }
        .button:hover { background-color: #b91c1c; }
        .expiry-notice { background-color: #f3f4f6; border-radius: 8px; padding: 15px; margin: 20px 0; text-align: center; }
        .footer { background-color: #374151; color: #d1d5db; text-align: center; padding: 20px; font-size: 14px; }
        .link-text { word-break: break-all; color: #6b7280; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 class="logo">FXBOT</h1>
          <p style="color: #fca5a5; margin: 10px 0 0 0;">Password Reset Request</p>
        </div>
        
        <div class="content">
          <h2 class="reset-title">Reset Your Password</h2>
          
          <p>Hello ${userName},</p>
          
          <p>We received a request to reset your FXBOT account password. If you made this request, please click the button below to create a new password:</p>
          
          <div style="text-align: center;">
            <a href="${resetLink}" class="button">Reset My Password</a>
          </div>
          
          <div class="expiry-notice">
            <p style="margin: 0; color: #374151; font-weight: 600;">⏰ This link will expire in 1 hour</p>
            <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 14px;">For your security, this reset link can only be used once.</p>
          </div>
          
          <div class="security-notice">
            <h4 style="margin-top: 0; color: #92400e;">🔒 Security Notice</h4>
            <ul style="margin: 10px 0; color: #78350f;">
              <li>If you didn't request this password reset, please ignore this email</li>
              <li>Your current password will remain unchanged until you create a new one</li>
              <li>Never share your password or reset links with anyone</li>
              <li>Always log in from our official website: ${resetLink.split('/reset-password')[0]}</li>
            </ul>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            <strong>Can't click the button?</strong><br>
            Copy and paste this link into your browser:
          </p>
          <p class="link-text">${resetLink}</p>
          
          <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
             If you're having trouble or didn't request this reset, please contact our support team at ${this.supportEmail}
          </p>
        </div>
        
        <div class="footer">
          <p>&copy; 2025 FXBOT. All rights reserved.</p>
          <p>Professional Forex Investment Platform</p>
          <p>This email was sent because a password reset was requested for your account.</p>
        </div>
      </div>
    </body>
    </html>
    `;
  }


  async sendTestEmail(toEmail) {
    try {
      const msg = this.createMessage({
        to: toEmail,
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
      });

      return await this.deliver(msg, 'test');
    } catch (error) {
      console.error('Transactional email preparation failed', { type: 'test' });
      return { success: false, error: 'Email delivery failed' };
    }
  }

  // Deposit notification email to admin
  async sendDepositNotificationEmail(depositData, userData) {
    try {
      const msg = this.createMessage({
        to: this.adminEmail,
        subject: `New Deposit Request - $${depositData.amount} from ${userData.firstName} ${userData.lastName}`,
        html: this.generateDepositNotificationTemplate(depositData, userData)
      }, 'FXBOT System');

      return await this.deliver(msg, 'deposit_notification');
    } catch (error) {
      console.error('Transactional email preparation failed', { type: 'deposit_notification' });
      return { success: false, error: 'Email delivery failed' };
    }
  }

  // Deposit approval email to user
  async sendDepositApprovalEmail(userEmail, depositData, userName) {
    try {
      const msg = this.createMessage({
        to: userEmail,
        subject: 'Deposit Approved - Investment Activated - FXBOT',
        html: this.generateDepositApprovalTemplate(depositData, userName)
      });

      return await this.deliver(msg, 'deposit_approval');
    } catch (error) {
      console.error('Transactional email preparation failed', { type: 'deposit_approval' });
      return { success: false, error: 'Email delivery failed' };
    }
  }

  // Deposit rejection email to user
  async sendDepositRejectionEmail(userEmail, depositData, userName) {
    try {
      const msg = this.createMessage({
        to: userEmail,
        subject: 'Deposit Request Rejected - FXBOT',
        html: this.generateDepositRejectionTemplate(depositData, userName)
      });

      return await this.deliver(msg, 'deposit_rejection');
    } catch (error) {
      console.error('Transactional email preparation failed', { type: 'deposit_rejection' });
      return { success: false, error: 'Email delivery failed' };
    }
  }

  async sendWithdrawalOtpEmail(userEmail, withdrawalData, userName, otp) {
    try {
      const msg = this.createMessage({
        to: userEmail,
        subject: 'FXBOT - Withdrawal Verification OTP',
        html: this.generateWithdrawalOtpTemplate(withdrawalData, userName, otp)
      });

      return await this.deliver(msg, 'withdrawal_otp');
    } catch {
      console.error('Transactional email preparation failed', { type: 'withdrawal_otp' });
      return { success: false, error: 'Email delivery failed' };
    }
  }

  generateWithdrawalOtpTemplate(withdrawalData, userName, otp) {
    const { requestedAmount, serviceCharge, amount, method, walletAddress } = withdrawalData;
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1f2937; text-align: center;">Withdrawal Verification</h2>
        <p>Dear ${userName},</p>
        <p>You have requested a withdrawal of <strong>$${requestedAmount.toFixed(2)}</strong> from your FXBOT account.</p>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">Withdrawal Details:</h3>
          <p><strong>Requested Amount:</strong> $${requestedAmount.toFixed(2)}</p>
          <p><strong>Service Charge (5%):</strong> $${serviceCharge.toFixed(2)}</p>
          <p><strong>Net Amount:</strong> $${amount.toFixed(2)}</p>
          <p><strong>Method:</strong> ${method}</p>
          <p><strong>Wallet Address:</strong> ${walletAddress}</p>
        </div>
        <div style="background: #dbeafe; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
          <h3 style="color: #1e40af; margin-top: 0;">Your OTP Code</h3>
          <div style="font-size: 32px; font-weight: bold; color: #1e40af; letter-spacing: 4px;">${otp}</div>
          <p style="color: #374151; margin-bottom: 0;">This OTP is valid for 10 minutes only.</p>
        </div>
        <p style="color: #6b7280; font-size: 14px;">If you did not request this withdrawal, please contact our support team immediately.</p>
        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px; text-align: center; color: #6b7280; font-size: 12px;">
          <p>FXBOT - Professional Forex Investment Platform</p>
        </div>
      </div>
    `;
  }

  generateDepositNotificationTemplate(depositData, userData) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Deposit Request</title>
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <div style="background: linear-gradient(135deg, #f59e0b, #d97706); padding: 30px; text-align: center;">
          <h1 style="color: #ffffff; font-size: 28px; font-weight: bold; margin: 0;">FXBOT</h1>
          <p style="color: #ffffff; font-size: 16px; margin: 10px 0 0 0;">Admin Notification</p>
        </div>
        
        <div style="padding: 40px 30px;">
          <h2 style="color: #111827; font-size: 24px; font-weight: bold; margin-bottom: 20px;">New Deposit Request</h2>
          
          <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #f59e0b;">
            <h3 style="color: #f59e0b; margin: 0 0 15px 0;">User Details</h3>
            <p style="margin: 5px 0;"><strong>Name:</strong> ${userData.firstName} ${userData.lastName}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${userData.email}</p>
            <p style="margin: 5px 0;"><strong>Sponsor ID:</strong> ${userData.ownSponsorId}</p>
            <p style="margin: 5px 0;"><strong>Mobile:</strong> ${userData.mobile}</p>
          </div>

          <div style="background-color: #f0f9ff; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #3b82f6;">
            <h3 style="color: #3b82f6; margin: 0 0 15px 0;">Deposit Details</h3>
            <p style="margin: 5px 0;"><strong>Amount:</strong> $${depositData.amount}</p>
            <p style="margin: 5px 0;"><strong>Payment Method:</strong> ${depositData.paymentMethod}</p>
            <p style="margin: 5px 0;"><strong>Wallet Type:</strong> ${depositData.walletType}</p>
            <p style="margin: 5px 0;"><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
          </div>

          <div style="background-color: #f0fdf4; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #10b981;">
            <h3 style="color: #10b981; margin: 0 0 15px 0;">Action Required</h3>
            <p style="margin: 5px 0;">Please review the payment screenshot and approve or reject this deposit request from the admin dashboard.</p>
            <p style="margin: 5px 0;"><strong>Status:</strong> Pending Review</p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <p style="color: #6b7280; font-size: 14px;">
              Login to admin dashboard to review and process this deposit request.
            </p>
          </div>
        </div>

        <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 12px; margin: 0;">
            FXBOT - Professional Forex Investment Platform<br>
            This is an automated system notification.
          </p>
        </div>
      </div>
    </body>
    </html>
    `;
  }

  generateDepositApprovalTemplate(depositData, userName) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Deposit Approved</title>
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 30px; text-align: center;">
          <h1 style="color: #ffffff; font-size: 28px; font-weight: bold; margin: 0;">FXBOT</h1>
          <p style="color: #ffffff; font-size: 16px; margin: 10px 0 0 0;">Deposit Approved</p>
        </div>
        
        <div style="padding: 40px 30px;">
          <h2 style="color: #111827; font-size: 24px; font-weight: bold; margin-bottom: 20px;">Great News! Your Deposit is Approved</h2>
          <p style="color: #6b7280; font-size: 16px; margin-bottom: 20px;">Dear ${userName},</p>
          
          <div style="background-color: #f0fdf4; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #10b981;">
            <h3 style="color: #10b981; margin: 0 0 15px 0;">✓ Investment Activated</h3>
            <p style="margin: 5px 0;"><strong>Amount:</strong> $${depositData.amount}</p>
            <p style="margin: 5px 0;"><strong>Status:</strong> Approved & Active</p>
            <p style="margin: 5px 0;"><strong>Investment Package:</strong> FS Income (6% Monthly)</p>
          </div>

          <p style="color: #6b7280; font-size: 16px; line-height: 1.5;">
            Your deposit has been successfully verified and your investment is now active. You'll start earning FS Income 
            at 6% monthly, distributed daily over 22 weekdays at 11:59 PM IST.
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <p style="color: #6b7280; font-size: 14px;">
              Check your dashboard to monitor your investment performance and earnings.
            </p>
          </div>
        </div>

        <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 12px; margin: 0;">
            FXBOT - Professional Forex Investment Platform<br>
            Thank you for trusting us with your investment.
          </p>
        </div>
      </div>
    </body>
    </html>
    `;
  }

  generateDepositRejectionTemplate(depositData, userName) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Deposit Rejected</title>
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <div style="background: linear-gradient(135deg, #ef4444, #dc2626); padding: 30px; text-align: center;">
          <h1 style="color: #ffffff; font-size: 28px; font-weight: bold; margin: 0;">FXBOT</h1>
          <p style="color: #ffffff; font-size: 16px; margin: 10px 0 0 0;">Deposit Update</p>
        </div>
        
        <div style="padding: 40px 30px;">
          <h2 style="color: #111827; font-size: 24px; font-weight: bold; margin-bottom: 20px;">Deposit Request Not Approved</h2>
          <p style="color: #6b7280; font-size: 16px; margin-bottom: 20px;">Dear ${userName},</p>
          
          <div style="background-color: #fef2f2; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #ef4444;">
            <h3 style="color: #ef4444; margin: 0 0 15px 0;">Deposit Details</h3>
            <p style="margin: 5px 0;"><strong>Amount:</strong> $${depositData.amount}</p>
            <p style="margin: 5px 0;"><strong>Status:</strong> Not Approved</p>
            ${depositData.adminNotes ? `<p style="margin: 10px 0 5px 0;"><strong>Reason:</strong> ${depositData.adminNotes}</p>` : ''}
          </div>

          <p style="color: #6b7280; font-size: 16px; line-height: 1.5;">
            Unfortunately, we were unable to verify your payment. This could be due to unclear payment screenshot, 
            incorrect payment amount, or other verification issues.
          </p>

          <p style="color: #6b7280; font-size: 16px; line-height: 1.5;">
            Please contact our support team or resubmit your deposit request with a clear payment screenshot.
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <p style="color: #6b7280; font-size: 14px;">
               Contact support: ${this.supportEmail}
            </p>
          </div>
        </div>

        <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 12px; margin: 0;">
            FXBOT - Professional Forex Investment Platform<br>
            We're here to help with any questions.
          </p>
        </div>
      </div>
    </body>
    </html>
    `;
  }

  // Generic email sending method
  async sendEmail(to, subject, htmlContent) {
    try {
      const msg = this.createMessage({
        to: to,
        subject: subject,
        html: htmlContent
      });

      return await this.deliver(msg, 'generic_transactional');
    } catch (error) {
      console.error('Transactional email preparation failed', { type: 'generic_transactional' });
      return { success: false, error: 'Email delivery failed' };
    }
  }
}

export { EmailService };
export default EmailService;
export const emailService = new EmailService();