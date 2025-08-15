import { createServer } from "http";
import { getStorage } from "./storage.js";
import { generateToken, authenticateToken, requireAdmin } from "./auth.js";
import { loginSchema, forgotPasswordSchema } from "../shared/schema.js";

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
  app.post("/api/auth/login", async (req, res) => {
    try {
      const result = loginSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: result.error.errors[0].message });
      }

      const { email, password } = result.data;
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

  // Forgot password (placeholder for now)
  app.post("/api/auth/forgot-password", async (req, res) => {
    try {
      const result = forgotPasswordSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: result.error.errors[0].message });
      }

      const { email } = result.data;
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

  // Admin endpoints
  app.get("/api/admin/users", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const users = await storage.getUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Failed to get users" });
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

  return server;
}