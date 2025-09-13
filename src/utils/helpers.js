import moment from 'moment';

// Format currency values
export const formatCurrency = (amount, showCents = true) => {
  if (amount === null || amount === undefined) return '$0.00';
  
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: showCents ? 2 : 0,
    maximumFractionDigits: showCents ? 2 : 0
  }).format(amount);
  
  return formatted;
};

// Format percentage values
export const formatPercentage = (value, decimals = 2) => {
  if (value === null || value === undefined) return '0%';
  return `${(value * 100).toFixed(decimals)}%`;
};

// Format large numbers (1K, 1M, 1B)
export const formatLargeNumber = (num) => {
  if (num === null || num === undefined) return '0';
  
  if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
  return num.toFixed(0);
};

// Calculate gain/loss percentage
export const calculateGainLoss = (currentValue, originalValue) => {
  if (!originalValue || originalValue === 0) return 0;
  return (currentValue - originalValue) / originalValue;
};

// Calculate portfolio value
export const calculatePortfolioValue = (positions, prices) => {
  let totalValue = 0;
  
  positions.forEach(position => {
    const currentPrice = prices[position.symbol] || position.averagePrice;
    totalValue += position.shares * currentPrice;
  });
  
  return totalValue;
};

// Generate unique ID
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Get color for gain/loss display
export const getGainLossColor = (value) => {
  if (value > 0) return 'text-success';
  if (value < 0) return 'text-danger';
  return 'text-gray-600';
};

// Get arrow icon for gain/loss
export const getGainLossIcon = (value) => {
  if (value > 0) return '↗️';
  if (value < 0) return '↘️';
  return '➡️';
};

// Format time periods
export const formatTimePeriod = (date) => {
  return moment(date).fromNow();
};

// Format date for display
export const formatDate = (date, format = 'MMM DD, YYYY') => {
  return moment(date).format(format);
};

// Validate stock symbol
export const isValidSymbol = (symbol) => {
  const pattern = /^[A-Z]{1,5}$/;
  return pattern.test(symbol);
};

// Calculate position size based on portfolio percentage
export const calculatePositionSize = (portfolioValue, percentage) => {
  return portfolioValue * (percentage / 100);
};

// Calculate shares from dollar amount
export const calculateShares = (dollarAmount, pricePerShare) => {
  if (!pricePerShare || pricePerShare <= 0) return 0;
  return Math.floor(dollarAmount / pricePerShare);
};

// Check if market is open (simplified)
export const isMarketOpen = () => {
  const now = moment();
  const day = now.day(); // 0 = Sunday, 6 = Saturday
  const hour = now.hour();
  
  // Market closed on weekends
  if (day === 0 || day === 6) return false;
  
  // Market hours: 9:30 AM - 4:00 PM EST
  // Simplified check (doesn't account for holidays or timezone)
  return hour >= 9 && hour < 16;
};

// Animate number changes
export const animateNumber = (start, end, duration, callback) => {
  const startTime = performance.now();
  const diff = end - start;
  
  const animate = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
    const current = start + (diff * easeOutQuart);
    
    callback(current);
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };
  
  requestAnimationFrame(animate);
};

// Deep clone object
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
};

// Random number between min and max
export const randomBetween = (min, max) => {
  return Math.random() * (max - min) + min;
};

// Get stock sector (simplified mapping)
export const getStockSector = (symbol) => {
  const sectorMap = {
    // Technology
    'AAPL': 'Technology', 'MSFT': 'Technology', 'GOOGL': 'Technology', 
    'TSLA': 'Technology', 'META': 'Technology', 'NVDA': 'Technology',
    'NFLX': 'Technology', 'CRM': 'Technology', 'ORCL': 'Technology',
    
    // Healthcare
    'JNJ': 'Healthcare', 'PFE': 'Healthcare', 'UNH': 'Healthcare',
    'ABBV': 'Healthcare', 'TMO': 'Healthcare', 'ABT': 'Healthcare',
    
    // Financial
    'JPM': 'Financial Services', 'BAC': 'Financial Services', 'WFC': 'Financial Services',
    'GS': 'Financial Services', 'MS': 'Financial Services', 'C': 'Financial Services',
    
    // Consumer
    'AMZN': 'Consumer Discretionary', 'HD': 'Consumer Discretionary', 'MCD': 'Consumer Discretionary',
    'DIS': 'Consumer Discretionary', 'SBUX': 'Consumer Discretionary',
    'KO': 'Consumer Staples', 'PEP': 'Consumer Staples', 'WMT': 'Consumer Staples',
    
    // Energy
    'XOM': 'Energy', 'CVX': 'Energy', 'COP': 'Energy',
    
    // Industrial
    'CAT': 'Industrials', 'BA': 'Industrials', 'GE': 'Industrials'
  };
  
  return sectorMap[symbol] || 'Unknown';
};

// Calculate moving average
export const calculateMovingAverage = (prices, period) => {
  if (prices.length < period) return [];
  
  const result = [];
  for (let i = period - 1; i < prices.length; i++) {
    const sum = prices.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
    result.push(sum / period);
  }
  return result;
};

// Calculate RSI (Relative Strength Index)
export const calculateRSI = (prices, period = 14) => {
  if (prices.length < period + 1) return [];
  
  const gains = [];
  const losses = [];
  
  for (let i = 1; i < prices.length; i++) {
    const difference = prices[i] - prices[i - 1];
    gains.push(difference > 0 ? difference : 0);
    losses.push(difference < 0 ? -difference : 0);
  }
  
  const result = [];
  
  for (let i = period - 1; i < gains.length; i++) {
    const avgGain = gains.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0) / period;
    const avgLoss = losses.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0) / period;
    
    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    const rsi = 100 - (100 / (1 + rs));
    result.push(rsi);
  }
  
  return result;
};

// Validate trade parameters
export const validateTrade = (type, symbol, shares, price, availableCash) => {
  const errors = [];
  
  if (!symbol || symbol.trim() === '') {
    errors.push('Symbol is required');
  }
  
  if (!shares || shares <= 0) {
    errors.push('Shares must be greater than 0');
  }
  
  if (!price || price <= 0) {
    errors.push('Price must be greater than 0');
  }
  
  if (type === 'buy') {
    const totalCost = shares * price;
    if (totalCost > availableCash) {
      errors.push('Insufficient funds for this trade');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Generate mock historical data for demonstration
export const generateMockHistoricalData = (symbol, days = 30) => {
  const data = [];
  let basePrice = randomBetween(50, 200);
  const startDate = moment().subtract(days, 'days');
  
  for (let i = 0; i < days; i++) {
    const date = startDate.clone().add(i, 'days');
    const volatility = 0.02; // 2% daily volatility
    const change = (Math.random() - 0.5) * 2 * volatility;
    basePrice *= (1 + change);
    
    data.push({
      date: date.format('YYYY-MM-DD'),
      open: basePrice * (1 + (Math.random() - 0.5) * 0.01),
      high: basePrice * (1 + Math.random() * 0.02),
      low: basePrice * (1 - Math.random() * 0.02),
      close: basePrice,
      volume: Math.floor(randomBetween(1000000, 10000000))
    });
  }
  
  return data;
};

export default {
  formatCurrency,
  formatPercentage,
  formatLargeNumber,
  calculateGainLoss,
  calculatePortfolioValue,
  generateId,
  getGainLossColor,
  getGainLossIcon,
  formatTimePeriod,
  formatDate,
  isValidSymbol,
  calculatePositionSize,
  calculateShares,
  isMarketOpen,
  animateNumber,
  deepClone,
  debounce,
  throttle,
  randomBetween,
  getStockSector,
  calculateMovingAverage,
  calculateRSI,
  validateTrade,
  generateMockHistoricalData
};