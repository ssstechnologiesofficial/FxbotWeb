import { createServer } from "http";
import { z } from "zod";
import { getStorage } from "./storage.js";
import { generateToken, authenticateToken, requireAdmin } from "./auth.js";
import { DasService } from "./dasService.js";
import { ObjectStorageService, ObjectNotFoundError } from "./objectStorage.js";
import { InvestmentService } from "./investmentService.js";

// User registration validation schema
const userRegistrationSchema = z.object({
  sponsorId: z.string().min(1, "Sponsor ID is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  mobile: z.string().min(10, "Valid mobile number is required"),
  email: z.string().email("Valid email is required"),
  password: z.string().min(8, "Password must be at least 8 characters")
});

export async function registerRoutes(app) {
  const storage = getStorage();
  const server = createServer(app);

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "FXBOT API is running" });
  });

  // Investment packages endpoint
  app.get("/api/packages", async (req, res) => {
    try {
      const packages = [
        {
          id: 1,
          name: "FS Income (FixSix)",
          type: "fixed",
          return: "6% Monthly until 2x",
          minimum: 250,
          duration: "~17 months"
        },
        {
          id: 2,
          name: "SmartLine Income",
          type: "affiliate",
          levels: 5,
          commission: "1.5% to 0.25%"
        },
        {
          id: 3,
          name: "DRI Income",
          type: "direct",
          commission: "6%",
          frequency: "Per Investment"
        },
        {
          id: 4,
          name: "DAS Income",
          type: "salary",
          tiers: 3,
          rewards: "$300 to 2% CTO"
        }
      ];
      res.json(packages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch packages" });
    }
  });

  // Contact form endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const { firstName, lastName, email, subject, message } = req.body;
      
      if (!firstName || !lastName || !email || !message) {
        return res.status(400).json({ error: "All fields are required" });
      }

      // In a real application, you would save this to a database
      console.log("Contact form submission:", { firstName, lastName, email, subject, message });
      
      res.json({ success: true, message: "Thank you for your message! We will get back to you soon." });
    } catch (error) {
      res.status(500).json({ error: "Failed to send message" });
    }
  });

  // Newsletter subscription endpoint
  app.post("/api/newsletter", async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      await storage.createSubscriber(email);
      
      res.json({ success: true, message: "Successfully subscribed to newsletter!" });
    } catch (error) {
      if (error.code === 11000) {
        res.status(400).json({ error: "Email already subscribed" });
      } else {
        res.status(500).json({ error: "Failed to subscribe" });
      }
    }
  });

  // Authentication endpoints
  app.post("/api/auth/register", async (req, res) => {
    try {
      const result = userRegistrationSchema.safeParse(req.body);
      if (!result.success) {
        const errorMessage = result.error.errors?.[0]?.message || 'Validation failed';
        return res.status(400).json({ error: errorMessage });
      }

      const { sponsorId, firstName, lastName, mobile, email, password } = result.data;
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: "User with this email already exists" });
      }

      // Validate sponsor ID format (FX + 6 digits)
      const sponsorIdPattern = /^FX\d{6}$/;
      if (!sponsorIdPattern.test(sponsorId)) {
        return res.status(400).json({ error: "Sponsor ID must be in format FX123456 (FX followed by 6 digits)" });
      }

      // Verify sponsor ID exists in the system
      const sponsor = await storage.findSponsor(sponsorId);
      if (!sponsor) {
        return res.status(400).json({ error: "Invalid sponsor ID. Please check the sponsor ID and try again." });
      }

      // Create new user
      const userData = {
        sponsorId,
        firstName,
        lastName,
        mobile,
        email,
        password,
        role: 'user'
      };

      const newUser = await storage.createUser(userData);
      
      // Send welcome email
      try {
        const { emailService } = await import('./emailService.js');
        await emailService.sendWelcomeEmail(newUser.email, {
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          mobile: newUser.mobile,
          ownSponsorId: newUser.ownSponsorId,
          sponsorId: sponsorId
        });
        console.log('Welcome email sent to:', newUser.email);
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
        // Don't fail registration if email fails
      }
      
      res.status(201).json({ 
        success: true, 
        message: "Account created successfully! Please check your email for welcome message and login to continue.",
        user: newUser
      });
    } catch (error) {
      console.error('Registration error:', error);
      if (error.code === 11000) {
        if (error.message.includes('email')) {
          res.status(400).json({ error: "Email already exists" });
        } else {
          res.status(400).json({ error: "Registration failed - duplicate entry" });
        }
      } else {
        res.status(500).json({ error: "Registration failed" });
      }
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Basic validation
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }
      const user = await storage.getUserByEmail(email);
      
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const isValidPassword = await storage.verifyPassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      if (!user.isActive) {
        return res.status(401).json({ error: "Account is disabled" });
      }

      const token = generateToken(user._id);
      const { password: _, ...userWithoutPassword } = user.toObject();
      
      res.json({ 
        success: true, 
        token, 
        user: userWithoutPassword,
        message: "Login successful" 
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  // Get current user
  app.get("/api/auth/me", authenticateToken, async (req, res) => {
    try {
      const user = await storage.getUserById(req.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to get user data" });
    }
  });

  // Get user referral information
  app.get("/api/user/referrals", authenticateToken, async (req, res) => {
    try {
      const user = await storage.getUserById(req.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Get children (referred users)
      const children = await storage.getUserReferrals(req.userId);
      
      // Get detailed referral statistics
      const { referralService } = await import('./referralService.js');
      const referralStats = await referralService.getReferralStats(req.userId);
      
      res.json({
        ownSponsorId: user.ownSponsorId,
        referralCount: user.referralCount || 0,
        children: children.map(child => ({
          id: child._id,
          name: `${child.firstName} ${child.lastName}`,
          email: child.email,
          registeredAt: child.createdAt
        })),
        stats: referralStats
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to get referral information" });
    }
  });

  // Get referral tree
  app.get("/api/user/referral-tree", authenticateToken, async (req, res) => {
    try {
      const { referralService } = await import('./referralService.js');
      const tree = await referralService.getReferralTree(req.userId);
      res.json(tree);
    } catch (error) {
      res.status(500).json({ error: "Failed to get referral tree" });
    }
  });

  // User investment summary endpoint
  app.get("/api/user/investment-summary", authenticateToken, async (req, res) => {
    try {
      const summary = await InvestmentService.getUserInvestmentSummary(req.userId);
      res.json(summary);
    } catch (error) {
      console.error("Error fetching investment summary:", error);
      res.status(500).json({ error: "Failed to fetch investment summary" });
    }
  });

  // User transaction history endpoint
  app.get("/api/user/transactions", authenticateToken, async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 50;
      const filter = req.query.filter || 'all';
      
      const history = await InvestmentService.getUserTransactionHistory(req.userId, page, limit);
      res.json(history);
    } catch (error) {
      console.error("Error fetching transaction history:", error);
      res.status(500).json({ error: "Failed to fetch transaction history" });
    }
  });

  // Simulate investment for testing rewards (remove in production)
  app.post("/api/user/simulate-investment", authenticateToken, async (req, res) => {
    try {
      const { amount } = req.body;
      if (!amount || amount <= 0) {
        return res.status(400).json({ error: "Invalid investment amount" });
      }

      const { referralService } = await import('./referralService.js');
      const rewards = await referralService.distributeRewards(req.userId, amount);
      
      res.json({
        message: "Investment processed and rewards distributed",
        amount: amount,
        rewards: rewards
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to process investment" });
    }
  });



  // Deposit endpoint
  // Get deposit screenshot upload URL
  app.post("/api/deposit/upload-url", authenticateToken, async (req, res) => {
    try {
      const objectStorageService = new ObjectStorageService();
      const uploadURL = await objectStorageService.getDepositScreenshotUploadURL();
      res.json({ uploadURL });
    } catch (error) {
      console.error('Error generating upload URL:', error);
      res.status(500).json({ error: "Failed to generate upload URL" });
    }
  });

  // Submit deposit request with screenshot
  app.post("/api/deposit", authenticateToken, async (req, res) => {
    try {
      const { amount, walletType, walletAddress, screenshotUrl } = req.body;
      const userId = req.userId;

      // Basic validation
      if (!amount || amount < 250 || amount % 250 !== 0) {
        return res.status(400).json({ error: "Invalid deposit amount. Minimum $250 in multiples of $250." });
      }

      if (!screenshotUrl) {
        return res.status(400).json({ error: "Payment screenshot is required." });
      }

      // Normalize screenshot path
      const objectStorageService = new ObjectStorageService();
      const screenshotPath = objectStorageService.normalizeDepositScreenshotPath(screenshotUrl);

      // Create deposit record
      const depositData = {
        userId,
        amount: parseInt(amount),
        walletType,
        walletAddress,
        paymentMethod: 'USDT TRC-20',
        screenshotUrl,
        screenshotPath,
        status: 'pending'
      };

      // Store deposit request
      const deposit = await storage.createDeposit(depositData);
      
      // Send admin notification email
      try {
        const user = await storage.getUserById(userId);
        const { EmailService } = await import('./emailService.js');
        const emailInstance = new EmailService();
        
        await emailInstance.sendDepositNotificationEmail(deposit, user);
      } catch (emailError) {
        console.error('Error sending admin notification:', emailError);
        // Continue even if email fails
      }
      
      res.json({
        success: true,
        message: "Deposit request submitted successfully! Admin will review your transaction and update your account within 24 hours.",
        depositId: deposit._id
      });
    } catch (error) {
      console.error("Deposit submission error:", error);
      res.status(500).json({ error: "Failed to submit deposit request" });
    }
  });

  // Get deposit screenshot for admin viewing
  app.get("/deposits/screenshot/:objectPath(*)", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const objectStorageService = new ObjectStorageService();
      const objectPath = `/deposits/${req.params.objectPath}`;
      const objectFile = await objectStorageService.getDepositScreenshotFile(objectPath);
      await objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error serving deposit screenshot:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.sendStatus(404);
      }
      return res.sendStatus(500);
    }
  });

  // Admin deposit approval/rejection
  app.post("/api/admin/deposits/:depositId/action", requireAdmin, async (req, res) => {
    try {
      const { depositId } = req.params;
      const { action, notes } = req.body;
      const adminUserId = req.userId;

      if (!action || !['approve', 'reject'].includes(action)) {
        return res.status(400).json({ error: "Valid action (approve/reject) is required" });
      }

      if (!notes?.trim()) {
        return res.status(400).json({ error: "Notes are required" });
      }

      // Get deposit details
      const deposit = await storage.getDepositById(depositId);
      if (!deposit) {
        return res.status(404).json({ error: "Deposit not found" });
      }

      if (deposit.status !== 'pending') {
        return res.status(400).json({ error: "Deposit is not pending approval" });
      }

      // Get user details
      const user = await storage.getUserById(deposit.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const status = action === 'approve' ? 'confirmed' : 'rejected';

      // Update deposit status
      const updatedDeposit = await storage.updateDepositStatus(depositId, {
        status,
        adminNotes: notes.trim(),
        adminActionAt: new Date(),
        adminActionBy: adminUserId
      });

      if (action === 'approve') {
        // Create investment record and process referral income
        const investmentService = new InvestmentService(storage);
        await investmentService.createInvestment({
          userId: deposit.userId,
          amount: deposit.amount,
          packageType: 'fs_income'
        });

        // Create deposit transaction
        await storage.createTransaction({
          userId: deposit.userId,
          type: 'deposit',
          amount: deposit.amount,
          description: `Deposit confirmed - Investment activated ($${deposit.amount})`,
          status: 'completed'
        });

        // Send approval email
        try {
          const emailService = await import('./emailService.js');
          const emailInstance = new emailService.default();
          await emailInstance.sendDepositApprovalEmail(
            user.email,
            updatedDeposit,
            `${user.firstName} ${user.lastName}`
          );
        } catch (emailError) {
          console.error('Error sending approval email:', emailError);
        }
      } else {
        // Send rejection email
        try {
          const emailService = await import('./emailService.js');
          const emailInstance = new emailService.default();
          await emailInstance.sendDepositRejectionEmail(
            user.email,
            updatedDeposit,
            `${user.firstName} ${user.lastName}`
          );
        } catch (emailError) {
          console.error('Error sending rejection email:', emailError);
        }
      }

      res.json({
        success: true,
        message: `Deposit ${action}d successfully`,
        deposit: updatedDeposit
      });
    } catch (error) {
      console.error("Deposit error:", error);
      res.status(500).json({ error: "Failed to submit deposit request" });
    }
  });

  // Submit withdrawal request (Step 1 - Initial request)
  app.post("/api/withdrawal", authenticateToken, async (req, res) => {
    try {
      const { amount, method, walletAddress } = req.body;
      const { Withdrawal, User, OTP } = await import('./database.js');
      const { emailService } = await import('./emailService.js');
      
      // Validation
      if (!amount || amount < 15) {
        return res.status(400).json({ error: "Minimum withdrawal amount is $15" });
      }

      if (!method || !walletAddress) {
        return res.status(400).json({ error: "Method and wallet address are required" });
      }

      const userId = req.userId;
      const user = await User.findById(userId);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Get user's available balance from investment summary
      const { InvestmentService } = await import('./investmentService.js');
      const summary = await InvestmentService.getUserInvestmentSummary(userId);
      const availableBalance = summary.walletBalance || 0;

      if (availableBalance < amount) {
        return res.status(400).json({ error: `Insufficient balance. Available: $${availableBalance.toFixed(2)}` });
      }

      // Calculate service charge (5%)
      const serviceCharge = amount * 0.05;
      const netAmount = amount - serviceCharge;

      // Create withdrawal request
      const withdrawal = new Withdrawal({
        userId: userId,
        requestedAmount: amount,
        serviceCharge: serviceCharge,
        amount: netAmount, // Amount after service charge
        method,
        walletAddress,
        status: 'pending_otp'
      });

      await withdrawal.save();

      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Save OTP
      const otpRecord = new OTP({
        userId: userId,
        withdrawalId: withdrawal._id,
        otp: otp,
        purpose: 'withdrawal',
        expiresAt: expiresAt
      });

      await otpRecord.save();

      // Send OTP via email
      const emailSent = await emailService.sendEmail(user.email, 'FXBOT - Withdrawal Verification OTP',
        `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1f2937; text-align: center;">Withdrawal Verification</h2>
            <p>Dear ${user.firstName} ${user.lastName},</p>
            <p>You have requested a withdrawal of <strong>$${amount.toFixed(2)}</strong> from your FXBOT account.</p>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #374151; margin-top: 0;">Withdrawal Details:</h3>
              <p><strong>Requested Amount:</strong> $${amount.toFixed(2)}</p>
              <p><strong>Service Charge (5%):</strong> $${serviceCharge.toFixed(2)}</p>
              <p><strong>Net Amount:</strong> $${netAmount.toFixed(2)}</p>
              <p><strong>Method:</strong> ${method}</p>
              <p><strong>Wallet Address:</strong> ${walletAddress}</p>
            </div>
            
            <div style="background: #dbeafe; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <h3 style="color: #1e40af; margin-top: 0;">Your OTP Code</h3>
              <div style="font-size: 32px; font-weight: bold; color: #1e40af; letter-spacing: 4px;">${otp}</div>
              <p style="color: #374151; margin-bottom: 0;">This OTP is valid for 10 minutes only.</p>
            </div>
            
            <p style="color: #6b7280; font-size: 14px;">
              If you did not request this withdrawal, please contact our support team immediately.
            </p>
            
            <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px; text-align: center; color: #6b7280; font-size: 12px;">
              <p>FXBOT - Professional Forex Investment Platform</p>
            </div>
          </div>
        `);

      if (!emailSent.success) {
        // Clean up if email failed
        await Withdrawal.findByIdAndDelete(withdrawal._id);
        await OTP.findByIdAndDelete(otpRecord._id);
        return res.status(500).json({ error: "Failed to send OTP email. Please try again." });
      }

      res.json({
        success: true,
        withdrawalId: withdrawal._id,
        message: `Withdrawal request created. OTP sent to ${user.email}. Please verify within 10 minutes.`,
        withdrawalDetails: {
          requestedAmount: amount,
          serviceCharge: serviceCharge,
          netAmount: netAmount,
          method: method,
          walletAddress: walletAddress
        }
      });
    } catch (error) {
      console.error("Withdrawal error:", error);
      res.status(500).json({ error: "Failed to submit withdrawal request" });
    }
  });

  // Verify withdrawal OTP (Step 2 - OTP verification)
  app.post("/api/withdrawal/verify-otp", authenticateToken, async (req, res) => {
    try {
      const { withdrawalId, otp } = req.body;
      const { Withdrawal, User, OTP } = await import('./database.js');
      
      if (!withdrawalId || !otp) {
        return res.status(400).json({ error: "Withdrawal ID and OTP are required" });
      }

      // Find the withdrawal request
      const withdrawal = await Withdrawal.findById(withdrawalId);
      if (!withdrawal || withdrawal.userId.toString() !== req.userId) {
        return res.status(404).json({ error: "Withdrawal request not found" });
      }

      if (withdrawal.status !== 'pending_otp') {
        return res.status(400).json({ error: "This withdrawal request is no longer pending OTP verification" });
      }

      // Find and verify OTP
      const otpRecord = await OTP.findOne({
        withdrawalId: withdrawalId,
        otp: otp,
        isUsed: false,
        expiresAt: { $gt: new Date() }
      });

      if (!otpRecord) {
        return res.status(400).json({ error: "Invalid or expired OTP" });
      }

      // Mark OTP as used and update withdrawal status
      otpRecord.isUsed = true;
      await otpRecord.save();

      withdrawal.status = 'pending_admin';
      withdrawal.otpVerified = true;
      withdrawal.otpVerifiedAt = new Date();
      withdrawal.updatedAt = new Date();
      await withdrawal.save();

      res.json({
        success: true,
        message: "OTP verified successfully. Your withdrawal request has been forwarded to admin for approval."
      });
    } catch (error) {
      console.error("OTP verification error:", error);
      res.status(500).json({ error: "Failed to verify OTP" });
    }
  });

  // Get user withdrawals
  app.get("/api/withdrawals", authenticateToken, async (req, res) => {
    try {
      // For demo, return empty array
      // In real app, fetch from withdrawals collection
      res.json([]);
    } catch (error) {
      console.error("Get withdrawals error:", error);
      res.status(500).json({ error: "Failed to fetch withdrawals" });
    }
  });

  // Admin endpoints
  app.get("/api/admin/users", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const users = await storage.getUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Failed to get users" });
    }
  });

  app.get("/api/admin/deposits", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const deposits = await storage.getAllDeposits();
      res.json(deposits);
    } catch (error) {
      res.status(500).json({ error: "Failed to get deposits" });
    }
  });

  app.post("/api/admin/deposits/:id/approve", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const deposit = await storage.updateDepositStatus(req.params.id, 'confirmed');
      res.json({ success: true, deposit });
    } catch (error) {
      res.status(500).json({ error: "Failed to approve deposit" });
    }
  });

  app.post("/api/admin/deposits/:id/reject", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const deposit = await storage.updateDepositStatus(req.params.id, 'rejected');
      res.json({ success: true, deposit });
    } catch (error) {
      res.status(500).json({ error: "Failed to reject deposit" });
    }
  });

  app.get("/api/admin/user-history/:searchTerm", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const { searchTerm } = req.params;
      
      // Search by email or mobile number
      let user = await storage.getUserByEmail(searchTerm);
      if (!user) {
        user = await storage.getUserByMobile(searchTerm);
      }
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Add mock income data for now (to be replaced with real data later)
      const userHistory = {
        ...user.toObject(),
        fsIncome: 0, // Will be calculated from actual FS income system
        smartLineIncome: 0, // Will be calculated from smart line system
        driIncome: 0 // Will be calculated from DRI system
      };

      res.json(userHistory);
    } catch (error) {
      console.error('Error fetching user history:', error);
      res.status(500).json({ error: "Failed to fetch user history" });
    }
  });

  app.get("/api/admin/contacts", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const contacts = await storage.getContacts();
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ error: "Failed to get contacts" });
    }
  });

  app.get("/api/admin/subscribers", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const subscribers = await storage.getSubscribers();
      res.json(subscribers);
    } catch (error) {
      res.status(500).json({ error: "Failed to get subscribers" });
    }
  });

  // Admin endpoint to get withdrawal requests
  app.get("/api/admin/withdrawals", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const { Withdrawal, User } = await import('./database.js');
      
      const withdrawals = await Withdrawal.find({ status: { $in: ['pending_admin', 'approved', 'rejected'] } })
        .populate('userId', 'firstName lastName email ownSponsorId')
        .populate('adminActionBy', 'firstName lastName email')
        .sort({ createdAt: -1 });

      const formattedWithdrawals = withdrawals.map(withdrawal => ({
        _id: withdrawal._id,
        user: {
          name: `${withdrawal.userId.firstName} ${withdrawal.userId.lastName}`,
          email: withdrawal.userId.email,
          sponsorId: withdrawal.userId.ownSponsorId
        },
        requestedAmount: withdrawal.requestedAmount,
        serviceCharge: withdrawal.serviceCharge,
        netAmount: withdrawal.amount,
        method: withdrawal.method,
        walletAddress: withdrawal.walletAddress,
        status: withdrawal.status,
        otpVerified: withdrawal.otpVerified,
        otpVerifiedAt: withdrawal.otpVerifiedAt,
        createdAt: withdrawal.createdAt,
        updatedAt: withdrawal.updatedAt,
        adminNotes: withdrawal.adminNotes,
        adminActionAt: withdrawal.adminActionAt,
        adminActionBy: withdrawal.adminActionBy ? {
          name: `${withdrawal.adminActionBy.firstName} ${withdrawal.adminActionBy.lastName}`,
          email: withdrawal.adminActionBy.email
        } : null
      }));

      res.json(formattedWithdrawals);
    } catch (error) {
      console.error("Error fetching withdrawals:", error);
      res.status(500).json({ error: "Failed to fetch withdrawal requests" });
    }
  });

  // Admin endpoint to approve/reject withdrawal
  app.post("/api/admin/withdrawals/:id/action", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const { action, notes } = req.body; // action: 'approve' or 'reject'
      const withdrawalId = req.params.id;
      const { Withdrawal, User } = await import('./database.js');
      const { emailService } = await import('./emailService.js');
      
      if (!['approve', 'reject'].includes(action)) {
        return res.status(400).json({ error: "Action must be 'approve' or 'reject'" });
      }

      const withdrawal = await Withdrawal.findById(withdrawalId).populate('userId');
      if (!withdrawal) {
        return res.status(404).json({ error: "Withdrawal request not found" });
      }

      if (withdrawal.status !== 'pending_admin') {
        return res.status(400).json({ error: "This withdrawal request is not pending admin approval" });
      }

      // Update withdrawal status
      const newStatus = action === 'approve' ? 'approved' : 'rejected';
      withdrawal.status = newStatus;
      withdrawal.adminNotes = notes || '';
      withdrawal.adminActionAt = new Date();
      withdrawal.adminActionBy = req.userId;
      withdrawal.updatedAt = new Date();

      await withdrawal.save();

      // Send notification email to user
      const user = withdrawal.userId;
      const emailSubject = action === 'approve' 
        ? 'FXBOT - Withdrawal Request Approved'
        : 'FXBOT - Withdrawal Request Rejected';

      const emailContent = action === 'approve' 
        ? `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #10b981; text-align: center;">Withdrawal Approved</h2>
            <p>Dear ${user.firstName} ${user.lastName},</p>
            <p>Great news! Your withdrawal request has been <strong style="color: #10b981;">APPROVED</strong>.</p>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #374151; margin-top: 0;">Withdrawal Details:</h3>
              <p><strong>Requested Amount:</strong> $${withdrawal.requestedAmount.toFixed(2)}</p>
              <p><strong>Service Charge (5%):</strong> $${withdrawal.serviceCharge.toFixed(2)}</p>
              <p><strong>Net Amount to be Sent:</strong> $${withdrawal.amount.toFixed(2)}</p>
              <p><strong>Method:</strong> ${withdrawal.method}</p>
              <p><strong>Wallet Address:</strong> ${withdrawal.walletAddress}</p>
              <p><strong>Approval Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
            
            ${notes ? `
            <div style="background: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4 style="color: #1e40af; margin-top: 0;">Admin Notes:</h4>
              <p style="margin-bottom: 0;">${notes}</p>
            </div>
            ` : ''}
            
            <p style="color: #10b981; font-weight: 600;">
              Your funds will be processed within 24-48 hours.
            </p>
            
            <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px; text-align: center; color: #6b7280; font-size: 12px;">
              <p>FXBOT - Professional Forex Investment Platform</p>
            </div>
          </div>
        `
        : `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #ef4444; text-align: center;">Withdrawal Request Rejected</h2>
            <p>Dear ${user.firstName} ${user.lastName},</p>
            <p>We regret to inform you that your withdrawal request has been <strong style="color: #ef4444;">REJECTED</strong>.</p>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #374151; margin-top: 0;">Withdrawal Details:</h3>
              <p><strong>Requested Amount:</strong> $${withdrawal.requestedAmount.toFixed(2)}</p>
              <p><strong>Method:</strong> ${withdrawal.method}</p>
              <p><strong>Wallet Address:</strong> ${withdrawal.walletAddress}</p>
              <p><strong>Rejection Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
            
            ${notes ? `
            <div style="background: #fee2e2; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4 style="color: #dc2626; margin-top: 0;">Reason for Rejection:</h4>
              <p style="margin-bottom: 0;">${notes}</p>
            </div>
            ` : ''}
            
            <p style="color: #6b7280;">
              If you have any questions about this decision, please contact our support team.
            </p>
            
            <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px; text-align: center; color: #6b7280; font-size: 12px;">
              <p>FXBOT - Professional Forex Investment Platform</p>
            </div>
          </div>
        `;

      await emailService.sendEmail(user.email, emailSubject, emailContent);

      res.json({
        success: true,
        message: `Withdrawal request ${action}d successfully`,
        withdrawal: {
          _id: withdrawal._id,
          status: withdrawal.status,
          adminNotes: withdrawal.adminNotes,
          adminActionAt: withdrawal.adminActionAt
        }
      });
    } catch (error) {
      console.error("Error processing withdrawal action:", error);
      res.status(500).json({ error: "Failed to process withdrawal action" });
    }
  });

  // Email testing endpoint for admin
  app.post("/api/admin/test-email", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: "Email address is required" });
      }

      const { emailService } = await import('./emailService.js');
      const result = await emailService.sendTestEmail(email);
      
      if (result.success) {
        res.json({ 
          success: true, 
          message: "Test email sent successfully",
          messageId: result.messageId 
        });
      } else {
        res.status(500).json({ 
          success: false, 
          error: "Failed to send test email: " + result.error 
        });
      }
    } catch (error) {
      console.error('Email test error:', error);
      res.status(500).json({ error: "Email test failed" });
    }
  });

  // Password Reset Routes
  app.post("/api/auth/forgot-password", async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      // Check if user exists
      const user = await storage.getUserByEmail(email);
      if (!user) {
        // Don't reveal if user exists or not for security
        return res.json({ 
          success: true, 
          message: "If an account with that email exists, a password reset link has been sent." 
        });
      }

      // Generate reset token
      const resetToken = await storage.generateResetToken();
      
      // Save token to user
      await storage.setResetToken(email, resetToken);

      // Send password reset email
      try {
        const { emailService } = await import('./emailService.js');
        await emailService.sendPasswordResetEmail(
          user.email, 
          resetToken, 
          `${user.firstName} ${user.lastName}`
        );
        console.log('Password reset email sent to:', user.email);
      } catch (emailError) {
        console.error('Failed to send password reset email:', emailError);
        // Don't fail the request if email fails
      }

      res.json({ 
        success: true, 
        message: "If an account with that email exists, a password reset link has been sent to your email address." 
      });
    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({ error: "Password reset failed" });
    }
  });

  app.post("/api/auth/reset-password", async (req, res) => {
    try {
      const { token, newPassword } = req.body;
      
      if (!token || !newPassword) {
        return res.status(400).json({ error: "Token and new password are required" });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({ error: "Password must be at least 8 characters long" });
      }

      // Verify reset token
      const user = await storage.getUserByResetToken(token);
      if (!user) {
        return res.status(400).json({ error: "Invalid or expired reset token" });
      }

      // Update password and clear reset token
      await storage.updatePassword(user._id, newPassword);

      res.json({ 
        success: true, 
        message: "Password has been successfully reset. You can now login with your new password." 
      });
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({ error: "Password reset failed" });
    }
  });

  // DAS Program API Routes
  app.post("/api/das/enroll", authenticateToken, async (req, res) => {
    try {
      const { userId } = req.body;
      const result = await DasService.enrollUserInDas(userId);
      
      if (result) {
        res.json({ success: true, message: "Successfully enrolled in DAS program" });
      } else {
        res.status(400).json({ error: "Failed to enroll in DAS program" });
      }
    } catch (error) {
      console.error("DAS enrollment error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/das/countdown/:userId", authenticateToken, async (req, res) => {
    try {
      const { userId } = req.params;
      
      // Check if the authenticated user is requesting their own data or is admin
      if (req.userId !== userId && req.user?.role !== 'admin') {
        return res.status(403).json({ error: "Access denied" });
      }
      
      const countdownData = await DasService.getDasCountdown(userId);
      res.json(countdownData);
    } catch (error) {
      console.error("DAS countdown error:", error);
      res.status(500).json({ error: "Failed to fetch countdown data" });
    }
  });

  app.post("/api/das/complete-task", authenticateToken, async (req, res) => {
    try {
      const { userId, taskNumber } = req.body;
      const result = await DasService.updateTaskCompletion(userId, taskNumber);
      
      if (result) {
        res.json({ success: true, message: `Task ${taskNumber} completed successfully` });
      } else {
        res.status(400).json({ error: "Task requirements not met or already completed" });
      }
    } catch (error) {
      console.error("DAS task completion error:", error);
      res.status(500).json({ error: "Failed to complete task" });
    }
  });

  app.post("/api/das/add-investment", authenticateToken, async (req, res) => {
    try {
      const { userId, amount, packageType } = req.body;
      const result = await DasService.addInvestment(userId, amount, packageType);
      
      if (result) {
        res.json({ success: true, message: "Investment added successfully" });
      } else {
        res.status(400).json({ error: "Failed to add investment" });
      }
    } catch (error) {
      console.error("DAS investment error:", error);
      res.status(500).json({ error: "Failed to add investment" });
    }
  });

  // KYC Document Upload Routes
  app.post('/api/kyc/upload-url', authenticateToken, async (req, res) => {
    try {
      const objectStorageService = new ObjectStorageService();
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      res.json({ uploadURL });
    } catch (error) {
      console.error('Error getting KYC upload URL:', error);
      res.status(500).json({ error: 'Failed to get upload URL' });
    }
  });

  app.post('/api/kyc/submit', authenticateToken, async (req, res) => {
    try {
      const { documentUrl, fileName, fileType } = req.body;
      const userId = req.userId;

      if (!documentUrl || !fileName) {
        return res.status(400).json({ error: 'Document URL and file name are required' });
      }

      const objectStorageService = new ObjectStorageService();
      const normalizedPath = objectStorageService.normalizeObjectEntityPath(documentUrl);

      // Submit KYC document using storage method
      const updatedUser = await storage.submitKycDocument(userId, normalizedPath, fileName, fileType);
      
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ 
        message: 'KYC document submitted successfully',
        status: 'pending',
        submittedAt: updatedUser.kycSubmittedAt
      });
    } catch (error) {
      console.error('Error submitting KYC document:', error);
      res.status(500).json({ error: 'Failed to submit KYC document' });
    }
  });

  // KYC Document Download Route (for admin viewing)
  app.get('/api/kyc/document/:userId', authenticateToken, requireAdmin, async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await storage.getUserById(userId);
      
      if (!user || !user.kycDocumentUrl) {
        return res.status(404).json({ error: 'KYC document not found' });
      }

      const objectStorageService = new ObjectStorageService();
      const objectFile = await objectStorageService.getObjectEntityFile(user.kycDocumentUrl);
      await objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error('Error downloading KYC document:', error);
      if (error instanceof ObjectNotFoundError) {
        return res.status(404).json({ error: 'KYC document not found' });
      }
      res.status(500).json({ error: 'Failed to download KYC document' });
    }
  });

  // Get all KYC submissions for admin
  app.get('/api/admin/kyc', authenticateToken, requireAdmin, async (req, res) => {
    try {
      const kycSubmissions = await storage.getKycSubmissions();
      res.json(kycSubmissions);
    } catch (error) {
      console.error('Error fetching KYC submissions:', error);
      res.status(500).json({ error: 'Failed to fetch KYC submissions' });
    }
  });

  // KYC Document Approval/Rejection Routes
  app.post('/api/admin/kyc/:userId/approve', authenticateToken, requireAdmin, async (req, res) => {
    try {
      const { userId } = req.params;
      await storage.updateKycStatus(userId, 'approved', req.userId);
      res.json({ message: 'KYC document approved successfully' });
    } catch (error) {
      console.error('Error approving KYC document:', error);
      res.status(500).json({ error: 'Failed to approve KYC document' });
    }
  });

  app.post('/api/admin/kyc/:userId/reject', authenticateToken, requireAdmin, async (req, res) => {
    try {
      const { userId } = req.params;
      const { reason } = req.body;
      
      await storage.updateKycStatus(userId, 'rejected', req.userId, reason || 'Document not acceptable');
      res.json({ message: 'KYC document rejected successfully' });
    } catch (error) {
      console.error('Error rejecting KYC document:', error);
      res.status(500).json({ error: 'Failed to reject KYC document' });
    }
  });

  return server;
}