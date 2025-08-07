# FXBOT - Professional Forex Investment Platform

A modern, fully responsive React application for a forex investment platform featuring investment packages, ROI calculators, and professional design.

## 🚀 Features

- **Responsive Design** - Fully responsive across all devices
- **Professional Theme** - Dark theme with gold/blue colors matching the FXBOT brand
- **Investment Packages** - Display of various investment plans and returns
- **ROI Calculator** - Interactive calculator for investment returns
- **Affiliate Income Calculator** - Calculate potential affiliate earnings
- **Contact Forms** - Professional contact and newsletter signup forms
- **FAQ Section** - Comprehensive frequently asked questions
- **Legal Pages** - Terms of service and privacy policy

## 🛠 Technology Stack

- **Frontend**: React 18, JavaScript (ES6+), Vite
- **Backend**: Node.js, Express.js
- **Styling**: Tailwind CSS with custom design system
- **Icons**: Lucide React
- **Routing**: Wouter
- **State Management**: TanStack Query (React Query)
- **Forms**: React Hook Form with Zod validation

## 📁 Project Structure

```
├── client/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/          # Utility functions
│   │   ├── App.jsx       # Main app component
│   │   └── main.jsx      # App entry point
│   └── index.html        # HTML template
├── server/
│   ├── index.js          # Express server
│   ├── routes.js         # API routes
│   ├── storage.js        # Data storage layer
│   └── vite.js          # Vite development server
├── shared/
│   └── schema.js         # Shared validation schemas
├── attached_assets/      # Logo and asset files
├── vite.config.js        # Vite configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── start.js             # JavaScript server startup script
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

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
npm run dev
```

Or manually start the JavaScript server:
```bash
node start.js
```

The application will be available at `http://localhost:5000`

### Production Build

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## 🎨 Design System

The application uses a custom design system with:
- **Primary Colors**: Gold (#F59E0B) and Blue (#3B82F6)
- **Typography**: Inter font family
- **Dark Theme**: Professional dark background with golden accents
- **Components**: Custom UI components built with Tailwind CSS

## 📱 Responsive Features

- Mobile-first design approach
- Touch-friendly navigation
- Responsive grid layouts
- Optimized images and assets
- Progressive enhancement

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server (currently uses TypeScript, use `node start.js` for JavaScript)
- `npm run build` - Build for production
- `npm start` - Start production server
- `node start.js` - Start JavaScript development server

### Project Conversion

This project has been converted from TypeScript to pure JavaScript:
- All `.ts` and `.tsx` files have been removed
- JavaScript equivalents created for all components
- Server runs on pure Node.js without TypeScript compilation
- Maintained all functionality and features

## 🌐 Deployment

The project is ready for deployment on any Node.js hosting platform:

1. **Replit**: Ready to deploy using Replit's deployment system
2. **Vercel**: Configure build commands in `vercel.json`
3. **Netlify**: Set up build and start commands
4. **Heroku**: Add `Procfile` with `web: node server/index.js`

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For support and questions, please use the contact form on the website or reach out through the provided channels.