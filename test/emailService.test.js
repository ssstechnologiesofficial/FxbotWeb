import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, test } from 'node:test';
import { EmailService } from '../server/emailService.js';
import { validateAndStartApplication } from '../server/startup.js';

const ORIGINAL_ENV = { ...process.env };

const captureConsole = async (operation) => {
  const entries = [];
  const originalError = console.error;
  const originalInfo = console.info;
  console.error = (...args) => entries.push(args);
  console.info = (...args) => entries.push(args);
  try {
    await operation();
  } finally {
    console.error = originalError;
    console.info = originalInfo;
  }
  return JSON.stringify(entries);
};

describe('transactional email contract', () => {
  beforeEach(() => {
    process.env.NODE_ENV = 'test';
    process.env.SENDGRID_API_KEY = 'test-only-key';
    process.env.EMAIL_FROM = 'sender@example.test';
    process.env.EMAIL_REPLY_TO = 'replies@example.test';
    process.env.SUPPORT_EMAIL = 'support@example.test';
    process.env.ADMIN_EMAIL = 'admin@example.test';
    process.env.APP_BASE_URL = 'https://app.example.test';
  });

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  const createHarness = ({ error } = {}) => {
    const messages = [];
    const mailer = {
      send: async (message) => {
        messages.push(message);
        if (error) throw error;
        return [{ headers: { 'x-message-id': 'test-message-id' } }];
      }
    };
    return { service: new EmailService({ mailer }), messages };
  };

  test('welcome email has required headers, support address, and HTTPS dashboard link', async () => {
    const { service, messages } = createHarness();
    await service.sendWelcomeEmail('recipient@example.test', {
      firstName: 'Test',
      lastName: 'User',
      email: 'recipient@example.test',
      mobile: '0000000000',
      ownSponsorId: 'FX000001'
    });

    assert.equal(messages.length, 1);
    assert.deepEqual(messages[0].from, { email: 'sender@example.test', name: 'FXBOT Team' });
    assert.deepEqual(messages[0].replyTo, { email: 'replies@example.test', name: 'FXBOT Support' });
    assert.match(messages[0].subject, /Welcome to FXBOT/);
    assert.match(messages[0].html, /https:\/\/app\.example\.test\/login/);
    assert.match(messages[0].html, /support@example\.test/);
  });

  test('password reset email contains the HTTPS one-time link and required headers', async () => {
    const { service, messages } = createHarness();
    await service.sendPasswordResetEmail('recipient@example.test', 'secret-reset-token', 'Test User');

    assert.equal(messages[0].replyTo.email, 'replies@example.test');
    assert.match(messages[0].subject, /Reset Your FXBOT Password/);
    assert.match(messages[0].html, /https:\/\/app\.example\.test\/reset-password\?token=secret-reset-token/);
    assert.match(messages[0].html, /support@example\.test/);
  });

  test('deposit notification and decision templates use the expected recipients and content', async () => {
    const { service, messages } = createHarness();
    const deposit = { amount: 100, paymentMethod: 'USDT', walletType: 'TRC-20', adminNotes: 'Unreadable receipt' };
    const user = { firstName: 'Test', lastName: 'User', email: 'recipient@example.test', ownSponsorId: 'FX000001', mobile: '0000000000' };

    await service.sendDepositNotificationEmail(deposit, user);
    await service.sendDepositApprovalEmail(user.email, deposit, 'Test User');
    await service.sendDepositRejectionEmail(user.email, deposit, 'Test User');

    assert.equal(messages[0].to, 'admin@example.test');
    assert.equal(messages[0].from.name, 'FXBOT System');
    assert.match(messages[0].html, /New Deposit Request/);
    assert.match(messages[1].html, /Deposit Approved/);
    assert.match(messages[2].html, /Unreadable receipt/);
    for (const message of messages) assert.equal(message.replyTo.email, 'replies@example.test');
  });

  test('withdrawal OTP email uses the transactional headers and template without real delivery', async () => {
    const { service, messages } = createHarness();
    await service.sendWithdrawalOtpEmail('recipient@example.test', {
      requestedAmount: 100,
      serviceCharge: 5,
      amount: 95,
      method: 'USDT',
      walletAddress: 'wallet-secret'
    }, 'Test User', '123456');

    assert.equal(messages[0].to, 'recipient@example.test');
    assert.equal(messages[0].replyTo.email, 'replies@example.test');
    assert.match(messages[0].subject, /Withdrawal Verification OTP/);
    assert.match(messages[0].html, /123456/);
    assert.match(messages[0].html, /wallet-secret/);
  });

  test('production rejects missing authenticated sender settings and non-HTTPS base URLs', () => {
    process.env.NODE_ENV = 'production';
    delete process.env.EMAIL_FROM;
    assert.throws(() => new EmailService().validateConfiguration(), /EMAIL_FROM/);

    process.env.EMAIL_FROM = 'sender@example.test';
    process.env.APP_BASE_URL = 'http://app.example.test';
    assert.throws(() => new EmailService().validateConfiguration(), /HTTPS/);

    delete process.env.SENDGRID_API_KEY;
    assert.throws(() => new EmailService().validateConfiguration(), /not configured/);
  });

  test('production startup stops on invalid email settings and proceeds when they are valid', async () => {
    process.env.NODE_ENV = 'production';
    delete process.env.EMAIL_FROM;
    let serverLoaded = false;
    const loadServer = async () => {
      serverLoaded = true;
    };

    await assert.rejects(
      validateAndStartApplication({ loadServer }),
      /EMAIL_FROM/
    );
    assert.equal(serverLoaded, false);

    process.env.EMAIL_FROM = 'sender@example.test';
    process.env.APP_BASE_URL = 'https://app.example.test';
    await validateAndStartApplication({ loadServer });
    assert.equal(serverLoaded, true);
  });

  test('provider failures never log recipients, secrets, bodies, or provider payloads', async () => {
    const recipient = 'private-recipient@example.test';
    const token = 'private-reset-token';
    const otp = '654321';
    const bodyMarker = 'private-message-body';
    const providerMarker = 'private-provider-payload';
    const error = Object.assign(new Error(bodyMarker), {
      code: 503,
      response: { statusCode: 503, body: providerMarker }
    });
    const { service } = createHarness({ error });

    const logs = await captureConsole(async () => {
      await service.sendPasswordResetEmail(recipient, token, 'Private User');
      await service.sendWithdrawalOtpEmail(recipient, {
        requestedAmount: 100,
        serviceCharge: 5,
        amount: 95,
        method: 'USDT',
        walletAddress: bodyMarker
      }, 'Private User', otp);
    });

    assert.match(logs, /password_reset/);
    assert.match(logs, /withdrawal_otp/);
    for (const secret of [recipient, token, otp, bodyMarker, providerMarker]) {
      assert.equal(logs.includes(secret), false, `logs exposed ${secret}`);
    }
  });
});