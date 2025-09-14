// Standalone localStorage-based API service
class LocalStorageApiService {
  constructor() {
    this.initializeDefaultData();
  }

  initializeDefaultData() {
    // Initialize default user if none exists
    if (!localStorage.getItem('stocky_user')) {
      const defaultUser = {
        id: 'user_1',
        name: 'Player',
        email: 'player@stocky.app',
        currentLevel: 1,
        totalPoints: 0,
        achievements: [],
        preferences: {
          riskTolerance: 'moderate',
          theme: 'light'
        },
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('stocky_user', JSON.stringify(defaultUser));
    }

    // Initialize portfolios for each level if they don't exist
    for (let level = 1; level <= 5; level++) {
      const portfolioKey = `stocky_portfolio_level_${level}`;
      if (!localStorage.getItem(portfolioKey)) {
        const defaultPortfolio = {
          level: level,
          cash: this.getStartingCash(level),
          positions: [],
          transactions: [],
          performance: {
            totalValue: this.getStartingCash(level),
            totalGainLoss: 0,
            totalGainLossPercent: 0
          },
          completed: false,
          createdAt: new Date().toISOString()
        };
        localStorage.setItem(portfolioKey, JSON.stringify(defaultPortfolio));
      }
    }
  }

  getStartingCash(level) {
    const startingAmounts = {
      1: 200,
      2: 500, 
      3: 1000,
      4: 5000,
      5: 10000
    };
    return startingAmounts[level] || 200;
  }

  // Auth methods (simplified for standalone)
  async register(userData) {
    const user = {
      id: `user_${Date.now()}`,
      ...userData,
      currentLevel: 1,
      totalPoints: 0,
      achievements: [],
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('stocky_user', JSON.stringify(user));
    return { success: true, user };
  }

  async login(credentials) {
    const user = this.getCurrentUser();
    return { success: true, user };
  }

  getCurrentUser() {
    const userData = localStorage.getItem('stocky_user');
    return userData ? JSON.parse(userData) : null;
  }

  async getProfile() {
    return this.getCurrentUser();
  }

  // Portfolio methods
  async getPortfolios() {
    const portfolios = [];
    for (let level = 1; level <= 5; level++) {
      const portfolio = await this.getPortfolio(level);
      if (portfolio) portfolios.push(portfolio);
    }
    return portfolios;
  }

  async getPortfolio(level) {
    const portfolioKey = `stocky_portfolio_level_${level}`;
    const portfolioData = localStorage.getItem(portfolioKey);
    return portfolioData ? JSON.parse(portfolioData) : null;
  }

  async executeTrade(level, tradeData) {
    const portfolio = await this.getPortfolio(level);
    if (!portfolio) throw new Error('Portfolio not found');

    const { type, symbol, quantity, price } = tradeData;
    const totalCost = quantity * price;

    if (type === 'buy') {
      if (portfolio.cash < totalCost) {
        throw new Error('Insufficient funds');
      }

      // Deduct cash
      portfolio.cash -= totalCost;

      // Add or update position
      const existingPosition = portfolio.positions.find(p => p.symbol === symbol);
      if (existingPosition) {
        const totalShares = existingPosition.quantity + quantity;
        const totalValue = (existingPosition.quantity * existingPosition.avgPrice) + totalCost;
        existingPosition.quantity = totalShares;
        existingPosition.avgPrice = totalValue / totalShares;
      } else {
        portfolio.positions.push({
          symbol,
          quantity,
          avgPrice: price,
          currentPrice: price
        });
      }

      // Add transaction
      portfolio.transactions.push({
        id: `tx_${Date.now()}`,
        type: 'buy',
        symbol,
        quantity,
        price,
        total: totalCost,
        timestamp: new Date().toISOString()
      });
    }

    if (type === 'sell') {
      const existingPosition = portfolio.positions.find(p => p.symbol === symbol);
      if (!existingPosition || existingPosition.quantity < quantity) {
        throw new Error('Insufficient shares');
      }

      // Add cash
      portfolio.cash += totalCost;

      // Update position
      existingPosition.quantity -= quantity;
      if (existingPosition.quantity === 0) {
        portfolio.positions = portfolio.positions.filter(p => p.symbol !== symbol);
      }

      // Add transaction
      portfolio.transactions.push({
        id: `tx_${Date.now()}`,
        type: 'sell',
        symbol,
        quantity,
        price,
        total: totalCost,
        timestamp: new Date().toISOString()
      });
    }

    // Save updated portfolio
    const portfolioKey = `stocky_portfolio_level_${level}`;
    localStorage.setItem(portfolioKey, JSON.stringify(portfolio));

    return { success: true, portfolio };
  }

  // Stock methods (using stockServiceSimple for quotes)
  async getStockQuote(symbol) {
    // This will use the stockServiceSimple for actual quotes
    const stockService = await import('./stockServiceSimple.js');
    return stockService.default.getQuote(symbol);
  }

  async searchStocks(query) {
    const stockService = await import('./stockServiceSimple.js');
    return stockService.default.searchStocks(query);
  }

  async getTrendingStocks() {
    const stockService = await import('./stockServiceSimple.js');
    return stockService.default.getTrendingStocks();
  }

  async getAvailableStocks(level) {
    const availableStocks = {
      1: ['AAPL', 'MSFT', 'GOOGL', 'TSLA', 'AMZN'],
      2: ['AAPL', 'MSFT', 'GOOGL', 'TSLA', 'AMZN', 'META', 'NVDA', 'NFLX', 'JPM', 'BAC'],
      3: ['AAPL', 'MSFT', 'GOOGL'], // Will expand this list
      4: ['AAPL', 'MSFT', 'GOOGL'], // Will expand this list
      5: ['AAPL', 'MSFT', 'GOOGL']  // Will expand this list
    };
    
    return availableStocks[level] || availableStocks[1];
  }

  // User methods
  async getUserStats() {
    const user = this.getCurrentUser();
    const portfolios = await this.getPortfolios();
    
    let totalValue = 0;
    let totalGainLoss = 0;
    
    portfolios.forEach(portfolio => {
      totalValue += portfolio.performance?.totalValue || portfolio.cash;
      totalGainLoss += portfolio.performance?.totalGainLoss || 0;
    });

    return {
      user,
      totalValue,
      totalGainLoss,
      portfolios: portfolios.length
    };
  }

  async updatePreferences(preferences) {
    const user = this.getCurrentUser();
    if (user) {
      user.preferences = { ...user.preferences, ...preferences };
      localStorage.setItem('stocky_user', JSON.stringify(user));
    }
    return { success: true };
  }

  // Token management (simplified for standalone)
  setToken(token) {
    localStorage.setItem('stocky_auth_token', token);
  }

  clearToken() {
    localStorage.removeItem('stocky_auth_token');
  }

  isAuthenticated() {
    return !!this.getCurrentUser();
  }
}

export default new LocalStorageApiService();