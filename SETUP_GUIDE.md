# FXBOT Local Setup Guide for Mac

## Prerequisites (One-time setup)

### 1. Install Required Software

**Install Homebrew (Package Manager for Mac):**
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

**Install Node.js:**
```bash
brew install node
```

**Install Git:**
```bash
brew install git
```

**Download VS Code:**
- Go to https://code.visualstudio.com/
- Download for Mac
- Install the application

### 2. VS Code Extensions (Recommended)
Open VS Code and install these extensions:
- **ES7+ React/Redux/React-Native snippets**
- **Prettier - Code formatter**
- **Auto Rename Tag**
- **Bracket Pair Colorizer**
- **GitLens**

## Project Setup

### Step 1: Download and Extract Project
1. Download the ZIP file from Replit
2. Extract it to your desired folder (e.g., `~/Documents/Projects/`)
3. Rename the folder to `fxbot` if needed

### Step 2: Open in VS Code
```bash
# Navigate to your project folder
cd ~/Documents/Projects/fxbot

# Open in VS Code
code .
```

### Step 3: Install Dependencies
In VS Code terminal (Terminal → New Terminal):
```bash
npm install
```

### Step 4: Run the Project
```bash
node start.js
```

Your project will be available at: http://localhost:5000

## Git Setup and Hosting

### Step 1: Create GitHub Account
1. Go to https://github.com
2. Sign up for a free account
3. Verify your email

### Step 2: Create New Repository
1. Click "+" in top right → "New repository"
2. Name it: `fxbot`
3. Description: "Professional Forex Investment Platform"
4. Keep it **Private** (for business projects)
5. Don't initialize with README (we already have one)
6. Click "Create repository"

### Step 3: Configure Git (First time only)
```bash
# Set your name and email
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Step 4: Connect Local Project to GitHub
```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Make first commit
git commit -m "Initial FXBOT project setup"

# Add GitHub repository as remote (replace with your actual repo URL)
git remote add origin https://github.com/yourusername/fxbot.git

# Push to GitHub
git push -u origin main
```

## Daily Development Workflow

### Starting Work
```bash
# Navigate to project
cd ~/Documents/Projects/fxbot

# Open in VS Code
code .

# Start development server
node start.js
```

### Making Changes and Saving to Git
```bash
# Check what files changed
git status

# Add changes
git add .

# Commit with descriptive message
git commit -m "Add user authentication system"

# Push to GitHub
git push
```

## Project Structure Overview

```
fxbot/
├── client/                 # Frontend React app
│   ├── src/components/     # UI components
│   ├── src/pages/         # Main pages
│   └── public/            # Static files
├── server/                # Backend API
│   ├── index.js          # Main server
│   ├── routes.js         # API endpoints
│   └── storage.js        # Database interface
├── package.json          # Project dependencies
├── start.js              # Application starter
└── README.md            # Project documentation
```

## Common Commands Reference

### Development
```bash
node start.js              # Start the application
npm install                # Install dependencies
npm run build             # Build for production
```

### Git
```bash
git status                # Check file changes
git add .                 # Stage all changes
git commit -m "message"   # Save changes with message
git push                  # Upload to GitHub
git pull                  # Download latest changes
```

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

### Node Modules Issues
```bash
# Delete and reinstall dependencies
rm -rf node_modules
npm install
```

### Git Permission Issues
```bash
# Use personal access token instead of password
# Go to GitHub → Settings → Developer settings → Personal access tokens
```

## Next Steps for Backend Development

1. **Database Setup**: Choose PostgreSQL, MySQL, or MongoDB
2. **Authentication**: Implement user login/registration
3. **Payment Integration**: Add Stripe or PayPal
4. **Admin Panel**: Create management dashboard
5. **Deployment**: Deploy to Heroku, Vercel, or DigitalOcean

## Getting Help

- **VS Code**: Press `Cmd+Shift+P` for command palette
- **Terminal**: Press `Ctrl+C` to stop running server
- **Git Issues**: Use VS Code's built-in Git panel (Source Control)
- **Node.js Docs**: https://nodejs.org/docs/
- **React Docs**: https://react.dev/

## Security Note

Never commit sensitive information like:
- API keys
- Database passwords
- User data
- `.env` files with secrets

Always use environment variables for sensitive data.