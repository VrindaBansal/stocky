// Game Configuration
export const LEVELS = {
  1: {
    name: 'Paper Trader',
    description: 'Master the basics of buying and selling stocks',
    startingCapital: 200,
    availableStocks: ['AAPL', 'MSFT', 'GOOGL', 'TSLA', 'AMZN'],
    winCondition: 210, // $210 (5% gain)
    features: ['buy', 'sell', 'portfolio'],
    requiredTrades: 5,
    icon: '📝'
  },
  2: {
    name: 'Market Explorer',
    description: 'Explore different sectors and learn market research',
    startingCapital: 500,
    availableStocks: 25, // 25 popular stocks
    winCondition: 600, // $600 (20% gain)
    features: ['buy', 'sell', 'portfolio', 'research', 'charts'],
    requiredStocks: 3,
    icon: '🔍'
  },
  3: {
    name: 'Strategic Investor',
    description: 'Learn advanced order types and risk management',
    startingCapital: 1000,
    availableStocks: 100, // 100+ stocks
    winCondition: 1300, // $1300 (30% gain)
    maxLossPercent: 15,
    features: ['buy', 'sell', 'portfolio', 'research', 'charts', 'limit_orders', 'stop_loss'],
    icon: '🎯'
  },
  4: {
    name: 'Advanced Trader',
    description: 'Master short selling and margin trading',
    startingCapital: 5000,
    availableStocks: 500, // 500+ stocks
    winCondition: 6500, // $6500 (30% gain)
    features: ['buy', 'sell', 'portfolio', 'research', 'charts', 'limit_orders', 'stop_loss', 'short_selling', 'margin'],
    requiredShortTrades: 1,
    icon: '🚀'
  },
  5: {
    name: 'Portfolio Master',
    description: 'Options trading and portfolio optimization',
    startingCapital: 10000,
    availableStocks: 'unlimited',
    winCondition: 15000, // $15000 (50% gain)
    features: ['all', 'options'],
    requiredDiversification: 5,
    icon: '👑'
  }
};

// Popular stocks for different levels
export const STOCK_POOLS = {
  level1: ['AAPL', 'MSFT', 'GOOGL', 'TSLA', 'AMZN'],
  level2: [
    // Tech
    'AAPL', 'MSFT', 'GOOGL', 'TSLA', 'AMZN', 'META', 'NVDA', 'NFLX',
    // Finance
    'JPM', 'BAC', 'WFC', 'GS',
    // Healthcare
    'JNJ', 'PFE', 'UNH', 'ABBV',
    // Consumer
    'KO', 'PEP', 'WMT', 'HD', 'MCD', 'DIS',
    // Energy
    'XOM', 'CVX', 'COP'
  ],
  level3: 'search_enabled', // Allow search for 100+ stocks
  level4: 'search_enabled', // Allow search for 500+ stocks
  level5: 'unlimited' // All stocks available
};

// Achievement definitions
export const ACHIEVEMENTS = {
  FIRST_PURCHASE: {
    id: 'first_purchase',
    name: 'First Purchase',
    description: 'Buy your first stock',
    icon: '🎉',
    points: 100
  },
  DIVERSIFIED: {
    id: 'diversified',
    name: 'Diversified',
    description: 'Own stocks in 5+ different sectors',
    icon: '🌟',
    points: 200
  },
  DIAMOND_HANDS: {
    id: 'diamond_hands',
    name: 'Diamond Hands',
    description: 'Hold a stock for 30+ days with 20%+ gain',
    icon: '💎',
    points: 300
  },
  RISK_MANAGER: {
    id: 'risk_manager',
    name: 'Risk Manager',
    description: 'Successfully use stop-loss orders 10 times',
    icon: '🛡️',
    points: 250
  },
  SHORT_SELLER: {
    id: 'short_seller',
    name: 'Short Seller',
    description: 'Complete first successful short trade',
    icon: '📉',
    points: 400
  },
  DAY_TRADER: {
    id: 'day_trader',
    name: 'Day Trader',
    description: 'Complete 10 trades in one day',
    icon: '⚡',
    points: 300
  },
  PROFIT_MASTER: {
    id: 'profit_master',
    name: 'Profit Master',
    description: 'Achieve 50%+ returns in any level',
    icon: '🏆',
    points: 500
  },
  LEVEL_SPEEDRUN: {
    id: 'level_speedrun',
    name: 'Speed Runner',
    description: 'Complete a level in under 1 hour',
    icon: '🏃',
    points: 350
  }
};

// Stock sectors
export const SECTORS = {
  TECHNOLOGY: 'Technology',
  HEALTHCARE: 'Healthcare',
  FINANCIAL: 'Financial Services',
  CONSUMER_DISCRETIONARY: 'Consumer Discretionary',
  CONSUMER_STAPLES: 'Consumer Staples',
  ENERGY: 'Energy',
  INDUSTRIALS: 'Industrials',
  MATERIALS: 'Basic Materials',
  REAL_ESTATE: 'Real Estate',
  UTILITIES: 'Utilities',
  COMMUNICATION: 'Communication Services'
};

// API endpoints
export const API_ENDPOINTS = {
  YAHOO_FINANCE: {
    QUOTE: 'https://query1.finance.yahoo.com/v8/finance/chart/',
    SEARCH: 'https://query1.finance.yahoo.com/v1/finance/search',
    NEWS: 'https://query1.finance.yahoo.com/v1/finance/search'
  },
  FMP: {
    BASE: 'https://financialmodelingprep.com/api/v3',
    QUOTE: '/quote/',
    SEARCH: '/search',
    COMPANY: '/profile/',
    NEWS: '/stock_news',
    HISTORICAL: '/historical-price-full/'
  },
  ALPHA_VANTAGE: {
    BASE: 'https://www.alphavantage.co/query',
    QUOTE: 'GLOBAL_QUOTE',
    SEARCH: 'SYMBOL_SEARCH',
    INTRADAY: 'TIME_SERIES_INTRADAY',
    DAILY: 'TIME_SERIES_DAILY'
  },
  FINNHUB: {
    BASE: 'https://finnhub.io/api/v1',
    QUOTE: '/quote',
    PROFILE: '/stock/profile2',
    CANDLES: '/stock/candle',
    NEWS: '/company-news',
    SEARCH: '/search'
  }
};

// Game settings
export const GAME_SETTINGS = {
  REFRESH_INTERVAL: 60000, // 1 minute
  CACHE_DURATION: 300000, // 5 minutes
  ANIMATION_DURATION: 300, // 300ms
  TOAST_DURATION: 4000, // 4 seconds
  POINTS: {
    SUCCESSFUL_TRADE: 10,
    LEVEL_COMPLETION: 500,
    DAILY_LOGIN: 5,
    READING_EDUCATION: 20,
    MILESTONE: 100
  }
};

// Local storage keys
export const STORAGE_KEYS = {
  USER: 'stocky_user',
  PORTFOLIO: 'stocky_portfolio_level',
  PROGRESS: 'stocky_progress',
  ACHIEVEMENTS: 'stocky_achievements',
  SETTINGS: 'stocky_settings',
  CACHE: 'stocky_cache',
  TUTORIAL: 'stocky_tutorial'
};

// Order types
export const ORDER_TYPES = {
  MARKET: 'market',
  LIMIT: 'limit',
  STOP_LOSS: 'stop_loss'
};

// Transaction types
export const TRANSACTION_TYPES = {
  BUY: 'buy',
  SELL: 'sell',
  SHORT_BUY: 'short_buy',
  SHORT_SELL: 'short_sell'
};

// Chart time periods
export const TIME_PERIODS = {
  '1D': '1day',
  '1W': '5day',
  '1M': '1month',
  '3M': '3month',
  '6M': '6month',
  '1Y': '1year',
  '5Y': '5year'
};

// Educational content topics
export const EDUCATION_TOPICS = {
  BASICS: {
    id: 'basics',
    title: 'Stock Market Basics',
    lessons: [
      'what-is-a-stock',
      'how-markets-work',
      'buying-and-selling',
      'reading-charts',
      'market-hours'
    ]
  },
  ANALYSIS: {
    id: 'analysis',
    title: 'Stock Analysis',
    lessons: [
      'fundamental-analysis',
      'technical-analysis',
      'financial-statements',
      'valuation-metrics',
      'market-trends'
    ]
  },
  RISK: {
    id: 'risk',
    title: 'Risk Management',
    lessons: [
      'diversification',
      'position-sizing',
      'stop-losses',
      'risk-reward-ratio',
      'emotional-control'
    ]
  },
  ADVANCED: {
    id: 'advanced',
    title: 'Advanced Strategies',
    lessons: [
      'short-selling',
      'margin-trading',
      'options-basics',
      'portfolio-theory',
      'market-psychology'
    ]
  }
};

// Color schemes for different themes
export const COLORS = {
  PRIMARY_DARK: '#042A2B',
  PRIMARY: '#5EB1BF',
  PRIMARY_LIGHT: '#CDEDF6',
  ACCENT: '#EF7B45',
  DANGER: '#D84727',
  SUCCESS: '#10B981',
  WARNING: '#F59E0B'
};

export default {
  LEVELS,
  STOCK_POOLS,
  ACHIEVEMENTS,
  SECTORS,
  API_ENDPOINTS,
  GAME_SETTINGS,
  STORAGE_KEYS,
  ORDER_TYPES,
  TRANSACTION_TYPES,
  TIME_PERIODS,
  EDUCATION_TOPICS,
  COLORS
};