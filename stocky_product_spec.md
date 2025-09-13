# Stocky - Product Specification
## Gamified Stock Investment Learning Platform (Web Application)

### Overview
Stocky is a React web application that teaches users how to invest in stocks through gamified learning experiences. Users progress through multiple levels, starting with small amounts of virtual money and basic concepts, gradually unlocking advanced features like short selling, options, and portfolio management. Everything is completely free to use.

### Color Palette
- **Primary Dark**: #042A2B (Deep teal - navigation, headers)
- **Primary**: #5EB1BF (Medium teal - primary buttons, active states)
- **Secondary**: #CDEDF6 (Light blue - backgrounds, cards)
- **Accent**: #EF7B45 (Orange - call-to-action buttons, highlights)
- **Danger/Loss**: #D84727 (Red-orange - losses, warnings, sell actions)

---

## Technical Architecture

### Frontend
- **Framework**: React 18+ with Vite
- **Routing**: React Router v6
- **State Management**: Redux Toolkit with RTK Query
- **UI Framework**: Tailwind CSS
- **Charts**: Chart.js with react-chartjs-2
- **Icons**: Lucide React (free, lightweight)
- **Animations**: Framer Motion
- **HTTP Client**: Axios
- **Local Storage**: Browser localStorage (no external database needed)

### Backend/Data Storage
- **NO BACKEND NEEDED**: Everything runs client-side
- **Data Persistence**: Browser localStorage
- **User Data**: Stored locally in browser
- **Stock Data**: Fetched directly from free APIs
- **No Authentication**: Simple username storage in localStorage
- **Export/Import**: JSON download/upload for data portability

### Stock Market Data APIs (All Free)
- **Primary**: Yahoo Finance API (via yfinance proxy) - Completely free, no limits
- **Secondary**: Financial Modeling Prep API - 250 requests/day free
- **Backup**: Alpha Vantage API - 500 requests/day free (if user provides key)
- **Real-time simulation**: Use delayed data (15-20 minutes) which is freely available

### Third-Party Libraries (All Free)
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0",
    "@reduxjs/toolkit": "^1.9.7",
    "react-redux": "^8.1.3",
    "axios": "^1.6.0",
    "chart.js": "^4.4.0",
    "react-chartjs-2": "^5.2.0",
    "lucide-react": "^0.294.0",
    "framer-motion": "^10.16.0",
    "moment": "^2.29.4",
    "react-hot-toast": "^2.4.1",
    "tailwindcss": "^3.3.6"
  }
}
```

---

## Game Structure & Levels

### Level Progression System

#### Level 1: "Paper Trader" (Beginner)
- **Starting Capital**: $100 virtual money
- **Available Stocks**: 5 pre-selected stocks (AAPL, MSFT, GOOGL, TSLA, AMZN)
- **Features Unlocked**: Buy stocks only, basic portfolio view
- **Learning Objectives**: Understanding buy/sell, stock prices, basic gains/losses
- **Win Condition**: Achieve $120 (20% gain) or complete 5 successful trades
- **Duration**: No time limit (user-paced)

#### Level 2: "Market Explorer" (Novice)
- **Starting Capital**: $500
- **Available Stocks**: 25 popular stocks from different sectors
- **Features Unlocked**: Market research, company info, basic charts
- **Learning Objectives**: Sector diversification, reading charts, market research
- **Win Condition**: Achieve $600 (20% gain) with at least 3 different stocks
- **Duration**: User-paced

#### Level 3: "Strategic Investor" (Intermediate)
- **Starting Capital**: $1,000
- **Available Stocks**: 100+ stocks, search functionality
- **Features Unlocked**: Limit orders, stop-loss orders, portfolio analytics
- **Learning Objectives**: Order types, risk management, portfolio balance
- **Win Condition**: Achieve $1,300 (30% gain) with max 15% loss tolerance
- **Duration**: User-paced

#### Level 4: "Advanced Trader" (Advanced)
- **Starting Capital**: $5,000
- **Available Stocks**: 500+ stocks, ETFs, indices
- **Features Unlocked**: Short selling, margin simulation, advanced charts
- **Learning Objectives**: Short selling, leveraged trading, technical analysis
- **Win Condition**: Achieve $6,500 (30% gain) using both long and short positions
- **Duration**: User-paced

#### Level 5: "Portfolio Master" (Expert)
- **Starting Capital**: $10,000
- **Available Stocks**: Full market access, options simulation
- **Features Unlocked**: Options trading simulator, portfolio optimization
- **Learning Objectives**: Options basics, portfolio theory, advanced strategies
- **Win Condition**: Achieve $15,000 (50% gain) with diversified portfolio
- **Duration**: User-paced

### Gamification Elements

#### Points System
- **Successful Trade**: 10-50 points (based on % gain)
- **Completing Level**: 500 points
- **Daily Login**: 5 points (tracked in localStorage)
- **Reading Educational Content**: 20 points
- **Achieving Milestones**: 100-1000 points

#### Achievements/Badges
- "First Purchase" - Buy your first stock
- "Diversified" - Own stocks in 5+ different sectors
- "Diamond Hands" - Hold a stock simulation for 30+ days with 20%+ gain
- "Risk Manager" - Successfully use stop-loss orders 10 times
- "Short Seller" - Complete first successful short trade
- "Day Trader" - Complete 10 trades in one day

#### Local Leaderboards
- Personal best records
- Level completion times
- Best performing portfolios
- Achievement progress

---

## Core Features & User Experience

### Onboarding Flow
1. **Welcome Screen**
   - Simple username input (stored in localStorage)
   - Investment experience level selection
   - Quick tutorial overview

2. **Interactive Tutorial**
   - "What is a stock?" animated explanation
   - Mock trading interface walkthrough
   - First simulated purchase with guided steps

3. **Level 1 Setup**
   - Profile customization (avatar selection)
   - Initial $100 virtual money allocation
   - Introduction to starter stocks

### Main App Screens

#### 1. Dashboard/Home
- **Layout**: Card-based design with color palette
- **Components**:
  - Current level progress bar (#5EB1BF)
  - Total portfolio value with gain/loss indicator
  - Quick stats (day change, total gain/loss)
  - Recent activity feed
  - Level-specific challenges/objectives
  - Market summary (top gainers/losers)

#### 2. Portfolio
- **Portfolio Overview**: 
  - Donut chart showing stock allocation
  - List view of holdings with live prices
  - Performance metrics (total return, day change, etc.)
- **Individual Stock Details**:
  - Price charts (1D, 1W, 1M, 1Y)
  - Company information
  - Buy/Sell interface
  - Transaction history for that stock

#### 3. Market/Explore
- **Stock Search & Browse**:
  - Search functionality with autocomplete
  - Trending stocks
  - Sector-based browsing
  - Popular stocks list
- **Stock Detail Pages**:
  - Interactive price chart
  - Key statistics (market cap, volume, etc.)
  - Recent price movements
  - Related stocks

#### 4. Trading Interface
- **Order Types**:
  - Market orders (Level 1+)
  - Limit orders (Level 3+)
  - Stop-loss orders (Level 3+)
  - Short selling (Level 4+)
- **Trade Confirmation**:
  - Clear summary of order details
  - Impact on portfolio
  - Educational tips for each order type

#### 5. Learning Center
- **Educational Content**:
  - Interactive articles with embedded quizzes
  - Video tutorials (embedded YouTube)
  - Glossary of terms
  - Level-appropriate lessons
- **Progress Tracking**:
  - Completed lessons
  - Quiz scores
  - Knowledge badges earned

#### 6. Profile/Progress
- **User Stats**:
  - Level progression
  - Achievement gallery
  - Performance history
  - Learning progress
- **Settings**:
  - Theme preferences
  - Data export/import
  - Reset progress option

---

## Data Models (localStorage Schema)

### User Profile
```javascript
// localStorage key: 'stocky_user'
{
  username: string,
  avatar: string,
  createdAt: timestamp,
  currentLevel: number,
  totalPoints: number,
  preferences: {
    theme: 'light' | 'dark',
    soundEffects: boolean,
    animations: boolean
  },
  stats: {
    totalTrades: number,
    successfulTrades: number,
    totalReturn: number,
    currentStreak: number,
    longestStreak: number,
    daysActive: number
  }
}
```

### Portfolio Data
```javascript
// localStorage key: 'stocky_portfolio_level{X}'
{
  level: number,
  cash: number,
  totalValue: number,
  startingValue: number,
  positions: [{
    symbol: string,
    companyName: string,
    shares: number,
    averagePrice: number,
    currentPrice: number,
    purchaseDate: timestamp,
    unrealizedGain: number,
    type: 'long' | 'short'
  }],
  transactions: [{
    id: string,
    symbol: string,
    type: 'buy' | 'sell' | 'short_buy' | 'short_sell',
    shares: number,
    price: number,
    timestamp: timestamp,
    fee: number
  }],
  performance: [{
    date: string,
    totalValue: number,
    dailyReturn: number
  }]
}
```

### Level Progress
```javascript
// localStorage key: 'stocky_progress'
{
  currentLevel: number,
  levelStartDate: timestamp,
  levelsCompleted: [{
    level: number,
    completedAt: timestamp,
    finalValue: number,
    performance: number,
    timeToComplete: number
  }],
  objectives: [{
    id: string,
    description: string,
    completed: boolean,
    progress: number,
    target: number
  }],
  unlockedFeatures: [string]
}
```

### Achievements
```javascript
// localStorage key: 'stocky_achievements'
{
  badges: [{
    id: string,
    name: string,
    description: string,
    earnedAt: timestamp,
    icon: string
  }],
  points: number,
  pointsHistory: [{
    source: string,
    amount: number,
    timestamp: timestamp
  }]
}
```

---

## API Integration (Free Services Only)

### Stock Data Service
```javascript
// src/services/stockService.js
class StockService {
  constructor() {
    // Using free Yahoo Finance proxy
    this.baseURL = 'https://query1.finance.yahoo.com/v8/finance/chart/';
    this.searchURL = 'https://query1.finance.yahoo.com/v1/finance/search';
  }

  async getQuote(symbol) {
    try {
      const response = await axios.get(`${this.baseURL}${symbol}`);
      return this.parseYahooData(response.data);
    } catch (error) {
      console.error('Error fetching quote:', error);
      return null;
    }
  }

  async getHistoricalData(symbol, period = '1y') {
    // Free historical data from Yahoo Finance
  }

  async searchStocks(query) {
    // Free stock search via Yahoo Finance
  }

  parseYahooData(data) {
    // Parse Yahoo Finance response format
  }
}
```

### Cache Management
```javascript
// src/utils/cacheManager.js
class CacheManager {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 60000; // 1 minute cache
  }

  get(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }

  set(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }
}
```

---

## File Structure
```
stocky/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── charts/
│   │   │   ├── PortfolioChart.jsx
│   │   │   ├── StockChart.jsx
│   │   │   └── PerformanceChart.jsx
│   │   ├── common/
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   └── Toast.jsx
│   │   ├── portfolio/
│   │   │   ├── PortfolioSummary.jsx
│   │   │   ├── PositionCard.jsx
│   │   │   └── TransactionHistory.jsx
│   │   ├── trading/
│   │   │   ├── OrderForm.jsx
│   │   │   ├── OrderConfirmation.jsx
│   │   │   └── StockSelector.jsx
│   │   ├── education/
│   │   │   ├── LessonCard.jsx
│   │   │   ├── Quiz.jsx
│   │   │   └── ProgressBar.jsx
│   │   └── layout/
│   │       ├── Header.jsx
│   │       ├── Sidebar.jsx
│   │       └── Footer.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Portfolio.jsx
│   │   ├── Market.jsx
│   │   ├── Trading.jsx
│   │   ├── Education.jsx
│   │   ├── Profile.jsx
│   │   ├── Onboarding.jsx
│   │   └── StockDetail.jsx
│   ├── services/
│   │   ├── stockService.js
│   │   ├── portfolioService.js
│   │   ├── storageService.js
│   │   └── gameService.js
│   ├── store/
│   │   ├── index.js
│   │   └── slices/
│   │       ├── userSlice.js
│   │       ├── portfolioSlice.js
│   │       ├── marketSlice.js
│   │       └── gameSlice.js
│   ├── utils/
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   ├── formatters.js
│   │   ├── validators.js
│   │   └── cacheManager.js
│   ├── styles/
│   │   └── index.css
│   ├── App.jsx
│   └── main.jsx
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

---

## Development Setup Commands

### Initial Setup
```bash
# Create new Vite React project
npm create vite@latest stocky -- --template react
cd stocky

# Install dependencies
npm install react-router-dom @reduxjs/toolkit react-redux
npm install axios chart.js react-chartjs-2
npm install lucide-react framer-motion moment
npm install react-hot-toast
npm install -D tailwindcss postcss autoprefixer
npm install -D @types/node

# Initialize Tailwind CSS
npx tailwindcss init -p

# Start development server
npm run dev
```

### Tailwind Configuration
```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          dark: '#042A2B',
          DEFAULT: '#5EB1BF',
          light: '#CDEDF6'
        },
        accent: '#EF7B45',
        danger: '#D84727'
      }
    },
  },
  plugins: [],
}
```

### Environment Configuration
```bash
# Create .env.local file (optional, for API keys if user wants)
cat > .env.local << EOF
# Optional: Add your own API keys for better rate limits
VITE_ALPHA_VANTAGE_API_KEY=your_key_here
VITE_FMP_API_KEY=your_key_here
EOF
```

### Build Commands
```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to GitHub Pages (after setup)
npm run build && npm run deploy
```

---

## Deployment (Free Options)

### Netlify (Recommended)
1. **Connect GitHub repository**
2. **Build settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. **Deploy automatically** on every push

### Vercel
1. **Connect GitHub repository**
2. **Auto-detected React settings**
3. **Deploy automatically** on every push

### GitHub Pages
1. **Install gh-pages**: `npm install -D gh-pages`
2. **Add to package.json**:
   ```json
   {
     "scripts": {
       "deploy": "gh-pages -d dist"
     },
     "homepage": "https://yourusername.github.io/stocky"
   }
   ```
3. **Deploy**: `npm run build && npm run deploy`

---

## Features Implementation Priority

### Phase 1 (MVP - 2-3 weeks)
- Basic user onboarding
- Level 1 & 2 implementation
- Simple buy/sell functionality
- Portfolio tracking
- Basic charts
- localStorage persistence

### Phase 2 (Full Game - 3-4 weeks)
- All 5 levels implemented
- Advanced order types
- Short selling simulation
- Achievement system
- Educational content
- Advanced charts

### Phase 3 (Polish - 1-2 weeks)
- Animations and transitions
- Mobile responsiveness
- Performance optimization
- User testing and bug fixes
- Documentation

---

## Success Metrics & Analytics (Free)

### Google Analytics 4 (Free)
- Page views and user sessions
- User engagement events
- Level completion rates
- Feature usage tracking

### Custom Analytics (localStorage)
- Track user progress locally
- Generate usage reports
- Performance metrics
- Learning effectiveness

### User Feedback
- Simple feedback form
- GitHub issues for bug reports
- User suggestions and feature requests

---

## Legal & Compliance (Free/Low Cost)

### Educational Disclaimer
**Clear messaging throughout app**:
- "This is a simulation for educational purposes only"
- "No real money is involved"
- "Past performance does not predict future results"
- "Always consult financial advisors for real investments"

### Privacy Policy (Free Template)
- No personal data collection
- Only localStorage usage
- No cookies except functional ones
- No third-party tracking

### Open Source License
- **MIT License** (free and permissive)
- **Host on GitHub** (free public repositories)
- **Community contributions** welcome

---

## Future Enhancements (All Free)

### Community Features
- Share portfolios via JSON export/import
- GitHub-based leaderboards (using issues/wiki)
- Community challenges and competitions

### Advanced Features
- More complex options strategies
- Cryptocurrency simulation
- Forex trading simulation
- Economic indicator integration

### Educational Content
- Video tutorials (YouTube embeds)
- Interactive quizzes
- Market news integration
- Technical analysis tools

---

This specification provides a comprehensive foundation for building Stocky as a completely free web application with no ongoing costs. The entire application runs client-side with free APIs and free hosting options, making it accessible to everyone while providing a rich learning experience.