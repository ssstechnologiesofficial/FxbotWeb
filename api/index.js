// Vercel serverless function entry point
import express from 'express';
import cors from 'cors';
import { registerRoutes } from '../server/routes.js';

const app = express();

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Setup routes without server creation (for serverless)
import { storage } from '../server/storage.js';
import { verifyToken } from '../server/auth.js';
import { sendEmail } from '../server/emailService.js';
import { ObjectStorageService } from '../server/objectStorage.js';

// Auth middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = verifyToken(token);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Import all routes directly
app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const user = await storage.getUserById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add all other API routes here following the same pattern...
// This is a simplified version - you may need to copy all routes from server/routes.js

export default app;