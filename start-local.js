#!/usr/bin/env node

// Local development start script
import express from 'express';
import { createServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  
  // Create Vite server in middleware mode
  const vite = await createServer({
    configFile: path.resolve(__dirname, 'vite.config.local.js'),
    server: { middlewareMode: true },
    appType: 'spa'
  });

  // Use vite's connect instance as middleware
  app.use(vite.ssrFixStacktrace);
  app.use(vite.middlewares);

  const port = process.env.PORT || 5000;
  
  app.listen(port, '0.0.0.0', () => {
    console.log(`✅ FXBOT is running on http://localhost:${port}`);
    console.log(`📱 Open in browser: http://localhost:${port}`);
  });
}

startServer().catch(err => {
  console.error('Error starting server:', err);
  process.exit(1);
});