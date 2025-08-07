#!/usr/bin/env node

// Simple JavaScript start script
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Start the server
import('./server/index.js');