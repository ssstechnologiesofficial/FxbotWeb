import express from "express";
import { registerRoutes } from "../server/routes.js";
import { serveStatic } from "../server/vite.js";

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

// Initialize routes but don't start server
let routesInitialized = false;
async function initializeRoutes() {
  if (!routesInitialized) {
    await registerRoutes(app);
    
    // In production, serve static files
    if (process.env.NODE_ENV === 'production') {
      serveStatic(app);
    }
    
    routesInitialized = true;
  }
}

// Export the handler for Vercel
export default async function handler(req, res) {
  await initializeRoutes();
  return app(req, res);
}