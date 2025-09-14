// Simplified Stock Service with reliable fallback data
class StockService {
  constructor() {
    this.stockData = {
      'AAPL': {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        price: 188.87,
        change: 2.15,
        changePercent: 1.15,
        volume: 48392847,
        previousClose: 186.72,
        open: 187.25,
        high: 189.95,
        low: 186.50,
        marketCap: 2900000000000,
        pe: 29.8,
        timestamp: Date.now(),
        source: 'fallback',
        // Historical price data for chart (last 30 days)
        chartData: this.generateChartData(186.72, 30)
      },
      'MSFT': {
        symbol: 'MSFT',
        name: 'Microsoft Corporation',
        price: 418.32,
        change: 5.47,
        changePercent: 1.32,
        volume: 23847392,
        previousClose: 412.85,
        open: 414.20,
        high: 419.75,
        low: 413.80,
        marketCap: 3100000000000,
        pe: 35.2,
        timestamp: Date.now(),
        source: 'fallback',
        chartData: this.generateChartData(412.85, 30)
      },
      'GOOGL': {
        symbol: 'GOOGL',
        name: 'Alphabet Inc.',
        price: 162.78,
        change: -1.23,
        changePercent: -0.75,
        volume: 31847592,
        previousClose: 164.01,
        open: 163.45,
        high: 164.20,
        low: 161.95,
        marketCap: 2000000000000,
        pe: 24.1,
        timestamp: Date.now(),
        source: 'fallback',
        chartData: this.generateChartData(164.01, 30)
      }
    };
    
    // Add missing stocks needed for the market
    this.addMissingStocks();
  }

  // Add missing stocks with generated data
  addMissingStocks() {
    const missingStocks = [
      { symbol: 'TSLA', name: 'Tesla Inc.', basePrice: 248.50 },
      { symbol: 'AMZN', name: 'Amazon.com Inc.', basePrice: 155.89 },
      { symbol: 'META', name: 'Meta Platforms Inc.', basePrice: 325.67 },
      { symbol: 'NVDA', name: 'NVIDIA Corporation', basePrice: 456.78 },
      { symbol: 'NFLX', name: 'Netflix Inc.', basePrice: 445.32 },
      { symbol: 'JPM', name: 'JPMorgan Chase & Co.', basePrice: 187.45 },
      { symbol: 'V', name: 'Visa Inc.', basePrice: 267.89 },
      { symbol: 'JNJ', name: 'Johnson & Johnson', basePrice: 156.78 },
      { symbol: 'WMT', name: 'Walmart Inc.', basePrice: 165.43 },
      { symbol: 'PG', name: 'Procter & Gamble Co.', basePrice: 156.89 },
      { symbol: 'HD', name: 'The Home Depot Inc.', basePrice: 345.67 },
      { symbol: 'DIS', name: 'The Walt Disney Co.', basePrice: 95.43 },
      { symbol: 'PYPL', name: 'PayPal Holdings Inc.', basePrice: 65.78 },
      { symbol: 'ADBE', name: 'Adobe Inc.', basePrice: 567.89 },
      { symbol: 'CRM', name: 'Salesforce Inc.', basePrice: 245.67 },
      { symbol: 'INTC', name: 'Intel Corporation', basePrice: 45.32 },
      { symbol: 'CSCO', name: 'Cisco Systems Inc.', basePrice: 52.14 },
      { symbol: 'PFE', name: 'Pfizer Inc.', basePrice: 35.67 },
      { symbol: 'ABT', name: 'Abbott Laboratories', basePrice: 112.45 },
      { symbol: 'TMO', name: 'Thermo Fisher Scientific', basePrice: 567.89 },
      { symbol: 'LLY', name: 'Eli Lilly and Company', basePrice: 789.12 },
      { symbol: 'MRK', name: 'Merck & Co. Inc.', basePrice: 105.67 },
      { symbol: 'UNH', name: 'UnitedHealth Group', basePrice: 534.78 },
      { symbol: 'ABBV', name: 'AbbVie Inc.', basePrice: 167.89 },
      { symbol: 'DHR', name: 'Danaher Corporation', basePrice: 245.67 },
      { symbol: 'BMY', name: 'Bristol Myers Squibb', basePrice: 67.89 },
      { symbol: 'AMGN', name: 'Amgen Inc.', basePrice: 278.45 },
      { symbol: 'MDT', name: 'Medtronic plc', basePrice: 89.67 },
      { symbol: 'ISRG', name: 'Intuitive Surgical', basePrice: 345.67 },
      { symbol: 'GILD', name: 'Gilead Sciences', basePrice: 78.90 },
      { symbol: 'CVS', name: 'CVS Health Corporation', basePrice: 89.45 },
      { symbol: 'MA', name: 'Mastercard Inc.', basePrice: 456.78 },
      { symbol: 'BAC', name: 'Bank of America Corp.', basePrice: 34.56 },
      { symbol: 'KO', name: 'The Coca-Cola Company', basePrice: 62.34 },
      { symbol: 'PEP', name: 'PepsiCo Inc.', basePrice: 178.90 },
      { symbol: 'COST', name: 'Costco Wholesale Corp.', basePrice: 678.90 },
      { symbol: 'AVGO', name: 'Broadcom Inc.', basePrice: 890.12 },
      { symbol: 'TXN', name: 'Texas Instruments', basePrice: 167.89 },
      { symbol: 'ORCL', name: 'Oracle Corporation', basePrice: 123.45 },
      { symbol: 'ACN', name: 'Accenture plc', basePrice: 345.67 },
      { symbol: 'NKE', name: 'Nike Inc.', basePrice: 102.34 },
      { symbol: 'BABA', name: 'Alibaba Group', basePrice: 87.65 },
      { symbol: 'XOM', name: 'Exxon Mobil Corporation', basePrice: 98.76 }
    ];

    missingStocks.forEach(stock => {
      const change = (Math.random() - 0.5) * 10; // Random change between -5 and +5
      const changePercent = (change / stock.basePrice) * 100;
      
      this.stockData[stock.symbol] = {
        symbol: stock.symbol,
        name: stock.name,
        price: Math.round((stock.basePrice + change) * 100) / 100,
        change: Math.round(change * 100) / 100,
        changePercent: Math.round(changePercent * 100) / 100,
        volume: Math.floor(Math.random() * 50000000) + 1000000, // 1M to 51M
        previousClose: stock.basePrice,
        open: Math.round((stock.basePrice + (Math.random() - 0.5) * 5) * 100) / 100,
        high: Math.round((stock.basePrice + Math.abs(change) + Math.random() * 2) * 100) / 100,
        low: Math.round((stock.basePrice - Math.abs(change) - Math.random() * 2) * 100) / 100,
        marketCap: Math.floor(Math.random() * 2000000000000) + 100000000000, // 100B to 2.1T
        pe: Math.round((Math.random() * 40 + 10) * 10) / 10, // 10 to 50
        timestamp: Date.now(),
        source: 'fallback',
        chartData: this.generateChartData(stock.basePrice, 30)
      };
    });
  }

  // Get multiple quotes at once
  async getMultipleQuotes(symbols) {
    const quotes = {};
    for (const symbol of symbols) {
      try {
        quotes[symbol] = await this.getQuote(symbol);
      } catch (error) {
        console.warn(`Failed to get quote for ${symbol}:`, error.message);
        // Continue with other stocks even if one fails
      }
    }
    return quotes;
  }

  // Generate realistic chart data for demonstration
  generateChartData(basePrice, days) {
    const data = [];
    let currentPrice = basePrice;
    
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Add some realistic volatility
      const volatility = 0.02; // 2% daily volatility
      const change = (Math.random() - 0.5) * 2 * volatility;
      currentPrice = currentPrice * (1 + change);
      
      data.push({
        date: date.toISOString().split('T')[0],
        price: Math.round(currentPrice * 100) / 100,
        timestamp: date.getTime()
      });
    }
    
    return data;
  }

  // Simulate price updates for demo purposes
  updatePrices(timeAcceleration = 1, hoursElapsed = 0.25) {
    Object.keys(this.stockData).forEach(symbol => {
      const stock = this.stockData[symbol];
      
      // Different stocks have different characteristics
      let volatility, trend;
      switch(symbol) {
        case 'AAPL':
          volatility = 0.015; // Higher volatility for growth
          trend = Math.sin(Date.now() / 1000000) * 0.003; // Slight upward bias
          break;
        case 'MSFT':
          volatility = 0.012;
          trend = 0.002; // Steady upward trend
          break;
        case 'GOOGL':
          volatility = 0.018;
          trend = Math.cos(Date.now() / 800000) * 0.002; // More volatile
          break;
        default:
          volatility = 0.01;
          trend = 0;
      }
      
      // Scale volatility based on time acceleration
      const scaledVolatility = volatility * Math.sqrt(timeAcceleration * hoursElapsed);
      const randomChange = (Math.random() - 0.5) * 2 * scaledVolatility;
      const totalChange = randomChange + trend;
      
      const newPrice = stock.price * (1 + totalChange);
      const priceChange = newPrice - stock.previousClose;
      
      stock.price = Math.round(newPrice * 100) / 100;
      stock.change = Math.round(priceChange * 100) / 100;
      stock.changePercent = Math.round((priceChange / stock.previousClose) * 10000) / 100;
      stock.timestamp = Date.now();
      
      // Add new point to chart data (keep last 30 days)
      const now = new Date();
      stock.chartData.push({
        date: now.toISOString().split('T')[0],
        price: stock.price,
        timestamp: now.getTime()
      });
      
      if (stock.chartData.length > 30) {
        stock.chartData = stock.chartData.slice(-30);
      }
    });
  }

  // Simulate time-based price evolution to help users reach their 20% goal
  simulateTimeProgression(timeSpeed, minutes = 1) {
    // Update prices based on time acceleration
    const hoursElapsed = (minutes / 60) * timeSpeed;
    this.updatePrices(timeSpeed, hoursElapsed);
    
    // Return current prices for real-time updates
    return this.stockData;
  }

  // Get helpful stock suggestion based on current portfolio
  getGrowthSuggestion(currentValue, targetValue, positions = []) {
    const shortfall = targetValue - currentValue;
    const growthNeeded = (shortfall / currentValue) * 100;
    
    if (growthNeeded <= 1) {
      return {
        type: 'success',
        message: "You're almost there! Try speeding up time or consider making one more small trade.",
        recommendedStock: 'MSFT',
        reason: 'MSFT has shown steady growth patterns.'
      };
    } else if (growthNeeded <= 3) {
      return {
        type: 'info',
        message: "You need about " + Math.ceil(growthNeeded) + "% more growth. Try different stocks or speed up time!",
        recommendedStock: 'AAPL',
        reason: 'AAPL has good growth potential for small gains.'
      };
    } else {
      return {
        type: 'warning',
        message: "You need " + Math.ceil(growthNeeded) + "% growth. Speed up time and try trading more actively!",
        recommendedStock: 'GOOGL',
        reason: 'GOOGL has higher volatility and growth potential.'
      };
    }
  }

  async getQuote(symbol) {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const quote = this.stockData[symbol];
      if (!quote) {
        throw new Error(`Stock ${symbol} not found`);
      }

      return {
        symbol: quote.symbol,
        name: quote.name,
        price: quote.price,
        change: quote.change,
        changePercent: quote.changePercent,
        volume: quote.volume,
        previousClose: quote.previousClose,
        open: quote.open,
        high: quote.high,
        low: quote.low,
        marketCap: quote.marketCap,
        pe: quote.pe,
        timestamp: quote.timestamp,
        source: 'demo'
      };
    } catch (error) {
      console.warn(`StockService.getQuote(${symbol}):`, error.message);
      throw error;
    }
  }

  async getChartData(symbol, period = '30d') {
    try {
      const stock = this.stockData[symbol];
      if (!stock) {
        throw new Error(`Stock ${symbol} not found`);
      }

      return stock.chartData;
    } catch (error) {
      console.warn(`StockService.getChartData(${symbol}):`, error.message);
      throw error;
    }
  }

  // Start price simulation
  startPriceUpdates() {
    setInterval(() => {
      this.updatePrices();
    }, 5000); // Update every 5 seconds for demo
  }

  // Get available symbols
  getAvailableSymbols() {
    return Object.keys(this.stockData);
  }

  // Search stocks (simple implementation)
  searchStocks(query) {
    const results = Object.values(this.stockData)
      .filter(stock => 
        stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
        stock.name.toLowerCase().includes(query.toLowerCase())
      )
      .map(stock => ({
        symbol: stock.symbol,
        name: stock.name,
        price: stock.price,
        change: stock.change,
        changePercent: stock.changePercent
      }));
    
    return Promise.resolve(results);
  }

  // Get trending stocks
  getTrendingStocks() {
    return Promise.resolve(
      Object.values(this.stockData)
        .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
        .slice(0, 5)
        .map(stock => ({
          symbol: stock.symbol,
          name: stock.name,
          price: stock.price,
          change: stock.change,
          changePercent: stock.changePercent
        }))
    );
  }
}

const stockService = new StockService();
stockService.startPriceUpdates(); // Start live price simulation

export default stockService;