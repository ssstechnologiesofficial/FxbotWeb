import { createServer } from "http";
import { getStorage } from "./storage.js";

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

      // In a real application, you would save this to a database
      console.log("Newsletter subscription:", { email });
      
      res.json({ success: true, message: "Successfully subscribed to newsletter!" });
    } catch (error) {
      res.status(500).json({ error: "Failed to subscribe" });
    }
  });

  return server;
}