#!/usr/bin/env node

// Default to development locally while preserving an explicitly configured
// production environment for deployments.
process.env.NODE_ENV ||= 'development';

// Start the server
import('./server/index.js');