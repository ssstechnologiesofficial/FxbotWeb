# FXBOT - Professional Forex Investment Platform

## Overview

FXBOT is a modern full-stack web application for a Forex investment platform. The system provides a professional interface for users to view investment packages, track returns, and engage with Forex investment services. Built with React/JavaScript on the frontend and Express.js on the backend, it offers a comprehensive solution for Forex investment management with real-time data capabilities. 

## Recent Changes

- ✅ **Complete TypeScript to JavaScript conversion** - All components and server files converted
- ✅ **Complete Tailwind CSS to regular CSS conversion** - All styling converted to custom CSS classes
- ✅ **Fixed server configuration** - Application now properly runs on port 5000
- ✅ **Git-ready project structure** - Project prepared for version control and deployment
- ✅ **Backend foundation** - Storage interface and API routes ready for database integration
- ✅ **Registration system with referral structure** - Users get unique sponsor IDs and parent-child relationships
- ✅ **User dashboard** - Shows own sponsor ID, referral count, and referred users list
- ✅ **MongoDB Atlas integration** - Live database with user authentication and referral tracking
- ✅ **Multi-level referral tracking** - 5-tier system with parent-child relationships up to 5 levels deep
- ✅ **Reward distribution system** - Automated percentage-based rewards (1.5%, 1.0%, 0.75%, 0.50%, 0.25%)
- ✅ **Enhanced dashboard UI** - Modern card-based interface showing multi-level stats and earnings
- ✅ **Investment simulation** - Testing tool for reward distribution validation
- ✅ **Sidebar navigation system** - Dark modern sidebar matching screenshot design with Profile, Fund, Referral Tree, Deposit, Withdrawal, Logout options
- ✅ **Fixed sponsor ID copy functionality** - Resolved "undefined" issue when copying sponsor ID
- ✅ **Complete sidebar pages** - All navigation pages (Profile, Fund, ReferralTree, Deposit, Withdrawal) implemented with proper layouts
- ✅ **Dashboard redesign to match reference** - Created clean dashboard layout exactly matching the reference screenshot with correct FXBOT branding
- ✅ **Fixed branding throughout application** - Corrected from "FCX Trade" to "FXBOT" in all components and pages
- ✅ **Modern dashboard with Tailwind CSS** - Implemented complete redesign with professional sidebar, gradient cards, and perfect alignment
- ✅ **Enhanced UI features** - Added gradient backgrounds, hover animations, glassmorphism effects, professional SVG icons, and interactive elements
- ✅ **Investment simulation and commission calculator** - Real-time calculations for referral earnings across 5-tier system
- ✅ **Professional trading accounts table** - Enhanced with gradient headers, animated status indicators, and comprehensive account information
- ✅ **Complete admin dashboard system** - Full 6-tab navigation with User List, KYC Status, Deposit Requests, Withdrawal Requests, Investments, and Engagement
- ✅ **Admin authentication fixed** - Proper `isAdmin` field recognition and routing from login to admin dashboard
- ✅ **Engagement analytics tab** - User search by email/mobile with complete history display including FS Income, Smart Line Income, DRI Income, DAS status and investment volume
- ✅ **Email integration system** - SendGrid-powered welcome email service with professional HTML templates, automatic sending on registration, and admin testing interface

## User Preferences

Preferred communication style: Simple, everyday language.
Preferred language: JavaScript/JSX (not TypeScript) - all components and server files converted to JavaScript.
Preferred styling: Regular CSS (not Tailwind CSS) - all components converted to use custom CSS classes and inline styles.
Developer level: Beginner - needs detailed step-by-step instructions for local setup and Git workflow.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with JavaScript (ES6+) and Vite for fast development and hot module replacement
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Framework**: Custom components with regular CSS classes and inline styles
- **Styling**: Regular CSS with custom CSS variables for theming, responsive design, and Inter font
- **Form Handling**: React Hook Form with Zod validation for forms and API requests

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: JavaScript with ES modules (converted from TypeScript)
- **Build System**: ESBuild for production bundling, Node.js for development
- **Development Server**: Custom Vite integration with middleware mode for SSR-style development
- **Storage Interface**: Abstracted storage layer with in-memory implementation, designed for easy database integration
- **Error Handling**: Centralized error middleware with proper HTTP status codes

### Data Layer
- **Storage**: In-memory storage implementation for development (ready for database integration)
- **Schema Management**: Centralized schema definitions in shared directory with Zod validation
- **Data Validation**: Zod schemas for runtime validation and API request/response handling
- **API Design**: RESTful API endpoints for contact forms, newsletter, and investment data

### Authentication & Security
- **Session Management**: Connect-pg-simple for PostgreSQL session storage
- **CORS**: Configured for cross-origin requests with credentials support
- **Environment Variables**: Secure configuration management for database URLs and API keys

### Development Environment
- **Replit Integration**: Custom Vite plugin for Replit-specific development features
- **Hot Reload**: Full-stack hot reloading with Vite middleware integration
- **JavaScript**: ES6+ modules with path aliases for clean imports
- **Code Organization**: Monorepo structure with shared schemas and utilities
- **Git Ready**: All TypeScript files removed, project ready for Git deployment

## External Dependencies

### Database & Storage
- **Neon Database**: PostgreSQL-compatible serverless database with @neondatabase/serverless driver
- **Connect-pg-Simple**: PostgreSQL session store for Express sessions

### UI & Styling
- **Custom CSS**: Regular CSS classes with CSS variables for consistent theming
- **Lucide React**: Modern icon library for React components
- **Responsive Design**: Mobile-first approach with media queries
- **CSS Grid & Flexbox**: Modern layout techniques for responsive design

### Development Tools
- **Vite**: Next-generation frontend build tool with plugin ecosystem
- **ESBuild**: Fast JavaScript bundler for production builds
- **Drizzle Kit**: Database migration and introspection toolkit

### Data & Forms
- **TanStack Query**: Server state management with caching and synchronization
- **React Hook Form**: Performant forms with minimal re-renders
- **Zod**: TypeScript-first schema validation library
- **Date-fns**: Modern JavaScript date utility library

### Utilities
- **Class Variance Authority**: Utility for creating variant-based component APIs
- **CLSX**: Conditional className utility for dynamic styling
- **Nanoid**: Secure URL-friendly unique string ID generator