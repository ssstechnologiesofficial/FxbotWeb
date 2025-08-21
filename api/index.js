import express from "express";
import { registerRoutes } from "../server/routes.js";
import path from "path";
import fs from "fs";

// Create app instance
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add CORS headers for cross-origin requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Initialize routes once
let routesInitialized = false;
async function initializeRoutes() {
  if (!routesInitialized) {
    // In Vercel, static files are handled by the routes configuration
    // Only set up static serving for API routes
    
    // Then register API routes
    await registerRoutes(app);
    
    // Remove catch-all since Vercel routes handle static files
    
    routesInitialized = true;
  }
}

// Export the handler for Vercel
export default async function handler(req, res) {
  try {
    await initializeRoutes();
    
    // Set environment variables for Vercel
    process.env.VERCEL = '1';
    process.env.NODE_ENV = 'production';
    
    // Use the app as middleware
    app(req, res);
  } catch (error) {
    console.error('Handler error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  }
}