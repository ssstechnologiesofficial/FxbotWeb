# FXBOT - Professional Forex Investment Platform

A modern full-stack web application for Forex investment management with real-time data capabilities and professional trading solutions.

## 🚀 Features

- **Investment Packages**: Multiple diversified Forex investment plans
- **ROI Calculator**: Real-time return calculations
- **Affiliate System**: Multi-level referral program with commission tracking
- **Professional UI**: Modern dark theme with gold accents
- **Responsive Design**: Mobile-first approach with CSS Grid and Flexbox
- **Contact System**: Professional contact forms and information

## 🛠 Tech Stack

### Frontend
- **React 18** with JavaScript (ES6+)
- **Vite** for fast development and hot module replacement
- **Custom CSS** with CSS variables for consistent theming
- **Lucide React** for modern icons
- **Responsive Design** with mobile-first approach

### Backend
- **Node.js** with Express.js framework
- **JavaScript** with ES modules
- **In-memory storage** (ready for database integration)
- **RESTful API** endpoints
- **Centralized error handling**

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd fxbot
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
node start.js
```

The application will be available at `http://localhost:5000`

## 🏗 Project Structure

```
fxbot/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility libraries
│   │   └── index.css      # Global styles
│   ├── public/            # Static assets
│   └── index.html         # Main HTML template
├── server/                # Backend Express server
│   ├── index.js          # Main server file
│   ├── routes.js         # API routes
│   ├── storage.js        # Storage interface
│   └── vite.js           # Vite integration
├── shared/               # Shared schemas and types
└── attached_assets/      # Project assets
```

## 🎯 Investment Packages

- **FS Income**: $100-$999 with 6% monthly returns
- **FS Premium**: $1000-$4999 with 7% monthly returns  
- **FS Elite**: $5000-$24999 with 8% monthly returns
- **SmartLine Affiliate**: Multi-level commission system

## 🔧 Development

### Available Scripts

- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `node start.js` - Start full-stack application

### Backend Development

The backend is ready for database integration:

1. **Storage Interface**: Abstract storage layer in `server/storage.js`
2. **API Routes**: RESTful endpoints in `server/routes.js`
3. **Schema Management**: Centralized schemas in `shared/schema.js`

### Adding Database

To integrate a database:

1. Install your preferred database driver
2. Implement the storage interface in `server/storage.js`
3. Update environment variables for database connection
4. Run migrations if needed

## 🚀 Deployment

### Production Build

```bash
npm run build
NODE_ENV=production node start.js
```

### Environment Variables

- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 5000)

## 📝 License

This project is proprietary software for FXBOT investment platform.

## 🤝 Contributing

This is a private project. For internal development only.