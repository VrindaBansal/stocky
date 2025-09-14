# 🎮 Stocky - Standalone GitHub Pages Deployment

**Stocky** is now a fully standalone stock trading simulation game that runs entirely in the browser using localStorage for persistence. No backend required!

## 🚀 Live Demo

The app is available at: **https://vrindabansal.github.io/stocky**

## 📋 What Changed for Standalone Deployment

### ✅ Completed Modifications
- ✨ **Removed backend dependencies** - App now runs completely client-side
- 🔒 **localStorage-only persistence** - All user data, portfolios, and game progress saved locally
- 🏗️ **GitHub Pages configuration** - Vite config updated with correct base path (`/stocky/`)
- 🤖 **Automated deployment** - GitHub Actions workflow for automatic deployment
- 📦 **Build optimization** - Clean production builds with code splitting

### 🎯 Key Features (Standalone)
- **Simulated stock data** - Uses `stockServiceSimple.js` for realistic price movements
- **Local game progress** - All 5 levels playable with data saved in browser
- **Portfolio tracking** - Real-time charts and performance analytics
- **No registration required** - Instant play with automatic user creation
- **Responsive design** - Works perfectly on desktop and mobile devices

## 🔧 Local Development

```bash
# Install dependencies
npm install

# Start development server (runs on localhost:3004)
npm run dev

# Build for production
npm run build

# Preview production build (runs on localhost:4173/stocky/)
npm run preview
```

## 🚀 Deployment Process

### Automatic Deployment (Recommended)
1. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Source: "GitHub Actions" 
   - The workflow will automatically deploy on every push to `main`

2. **Manual Deployment** (if needed):
   ```bash
   npm run build
   npm run deploy
   ```

The GitHub Actions workflow (`.github/workflows/deploy.yml`) handles:
- ✅ Installing dependencies
- ✅ Building the production app
- ✅ Deploying to GitHub Pages
- ✅ Setting correct permissions

### 📁 Key Files for Deployment
```
stocky/
├── .github/workflows/deploy.yml    # GitHub Actions deployment
├── src/
│   ├── services/
│   │   ├── api.js                  # localStorage-based API service
│   │   └── stockServiceSimple.js   # Simulated stock data
│   └── components/charts/
│       └── PortfolioChart.jsx      # Enhanced real-time charts
├── vite.config.js                  # Configured for GitHub Pages
├── package.json                    # Updated homepage and scripts
└── DEPLOYMENT.md                   # This file
```

## 🎮 How to Play

1. **Visit https://vrindabansal.github.io/stocky** - No signup required!
2. **Start with Level 1** - Learn basics with $200 starting capital
3. **Buy and sell stocks** - Practice with realistic market simulation
4. **Track performance** - Watch your portfolio grow in real-time
5. **Progress through levels** - Unlock advanced features as you succeed
6. **Speed up time** - Use time acceleration to see faster results

## 🔥 Enhanced Game Features

### 📊 **Real-time Stock Charts**
- Interactive portfolio performance tracking
- Toggle individual stock visibility with eye/eye-off icons
- Live price updates with time acceleration
- Custom tooltips with detailed gain/loss percentages
- Professional chart styling with responsive design

### 🎯 **5 Progressive Levels**
1. **Paper Trader** ($200) - Basic stocks: AAPL, MSFT, GOOGL, TSLA, AMZN
2. **Market Explorer** ($500) - 25+ stocks with research tools
3. **Strategic Investor** ($1,000) - Advanced order types and risk management
4. **Advanced Trader** ($5,000) - Short selling and margin trading
5. **Portfolio Master** ($10,000) - Options trading and unlimited stocks

### 💾 **Local Data Persistence**
- All game progress auto-saved to localStorage
- Portfolio history and transaction logs maintained
- Achievement and level progression tracking
- User preferences and settings stored locally
- No data sent to external servers - completely private

## 🛠️ Technical Implementation

### **Frontend Stack**
- ⚛️ React 18 with modern hooks
- 📊 Recharts for interactive data visualization  
- 🎨 Tailwind CSS for responsive styling
- 🚀 Vite for lightning-fast development and optimized builds
- 📱 Mobile-first responsive design

### **Data Management**
- 🗄️ localStorage for all data persistence
- 📈 Sophisticated stock price simulation with realistic volatility
- 🔄 Redux Toolkit for efficient state management
- 📊 Real-time chart updates with performance optimization
- ⚡ Time acceleration for faster gameplay

### **Deployment Architecture**
- 🏗️ GitHub Actions for automated CI/CD
- 📦 Optimized production builds with code splitting
- 🌐 GitHub Pages hosting (free and reliable)
- 🔧 Automatic deployment on every push to main branch
- ⚡ Fast global CDN delivery

## 🎯 Game Mechanics

### **Stock Price Simulation**
- Realistic price movements with different volatility patterns
- Each stock has unique characteristics (AAPL vs GOOGL behavior)
- Time-based price evolution to help users reach goals
- Market trends and cyclical patterns

### **Level Progression**
- Automatic level advancement based on portfolio performance
- Increasing complexity and available features
- Achievement system with points and rewards
- Educational content integrated throughout

### **Portfolio Management**
- Real-time portfolio value calculation
- Detailed transaction history
- Performance analytics and charts
- Risk management tools (in advanced levels)

## 📱 Mobile Experience

- Fully responsive design works on all screen sizes
- Touch-optimized trading interface
- Mobile-friendly charts and data visualization
- Smooth animations and transitions
- Works offline after initial load

## 🔒 Privacy & Security

- **100% Client-Side** - No data sent to external servers
- **Local Storage Only** - All data stays on user's device
- **No Tracking** - No analytics or user tracking
- **Privacy First** - Users can play completely anonymously
- **Secure by Design** - No authentication or sensitive data handling

## 🚀 Performance Optimizations

- **Code Splitting** - Optimized bundle loading
- **Lazy Loading** - Components load on demand
- **Chart Optimization** - Efficient data point management (50 point limit)
- **Memory Management** - Clean state management with Redux
- **Fast Loading** - Vite's optimized production builds

## 🎉 Ready for Users!

Your Stocky app is now:
- ✅ **Deployed to GitHub Pages** - Public and accessible
- ✅ **Fully Standalone** - No backend dependencies
- ✅ **Privacy-Focused** - All data stays local
- ✅ **Mobile-Ready** - Works on all devices
- ✅ **Performance Optimized** - Fast loading and smooth gameplay
- ✅ **Educational** - Teaches real stock trading concepts

## 🔗 Live Application

**🎮 Play Now: https://vrindabansal.github.io/stocky**

Start your stock trading journey today with no registration required!