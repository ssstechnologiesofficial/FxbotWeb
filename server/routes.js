import { createServer } from "http";
import { z } from "zod";
import { getStorage } from "./storage.js";
import { generateToken, authenticateToken, requireAdmin } from "./auth.js";
import { DasService } from "./dasService.js";

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

  // Forgot password (placeholder for now)
  app.post("/api/auth/forgot-password", async (req, res) => {
    try {
      const { email } = req.body;
      
      // Basic validation
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }
      const user = await storage.getUserByEmail(email);
      
      if (!user) {
        // Don't reveal if email exists or not for security
        return res.json({ 
          success: true, 
          message: "If an account with that email exists, we've sent password reset instructions." 
        });
      }

      // TODO: Implement actual password reset logic with email
      console.log('Password reset requested for:', email);
      
      res.json({ 
        success: true, 
        message: "If an account with that email exists, we've sent password reset instructions." 
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to process password reset request" });
    }
  });

  // Deposit endpoint
  app.post("/api/deposit", authenticateToken, async (req, res) => {
    try {
      const { amount, walletType, walletAddress } = req.body;
      const userId = req.userId;

      // Basic validation
      if (!amount || amount < 250 || amount % 250 !== 0) {
        return res.status(400).json({ error: "Invalid deposit amount. Minimum $250 in multiples of $250." });
      }

      // Create deposit record
      const depositData = {
        userId,
        amount: parseInt(amount),
        walletType,
        walletAddress,
        status: 'pending',
        createdAt: new Date(),
        paymentMethod: 'USDT TRC-20'
      };

      // Store deposit request
      await storage.createDeposit(depositData);
      
      res.json({
        success: true,
        message: "Deposit request submitted successfully. Admin will review and confirm your transaction.",
        depositData
      });
    } catch (error) {
      console.error("Deposit error:", error);
      res.status(500).json({ error: "Failed to submit deposit request" });
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

  return server;
}