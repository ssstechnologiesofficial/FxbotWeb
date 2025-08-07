# FXBOT - Professional Forex Investment Platform

## Overview

FXBOT is a modern full-stack web application for a Forex investment platform. The system provides a professional interface for users to view investment packages, track returns, and engage with Forex investment services. Built with React/JavaScript on the frontend and Express.js on the backend, it offers a comprehensive solution for Forex investment management with real-time data capabilities. The project has been fully converted from TypeScript to JavaScript as requested.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with JavaScript (ES6+) and Vite for fast development and hot module replacement
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Framework**: Custom components with Tailwind CSS and Radix UI patterns
- **Styling**: Tailwind CSS with custom CSS variables for theming, dark mode support, and Inter font
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
- **Radix UI**: Complete set of accessible UI primitives (@radix-ui/react-*)
- **Tailwind CSS**: Utility-first CSS framework with PostCSS integration
- **Lucide React**: Modern icon library for React components
- **Embla Carousel**: Touch-friendly carousel component library

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