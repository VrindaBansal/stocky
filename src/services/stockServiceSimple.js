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
  updatePrices() {
    Object.keys(this.stockData).forEach(symbol => {
      const stock = this.stockData[symbol];
      const volatility = 0.001; // 0.1% per update
      const change = (Math.random() - 0.5) * 2 * volatility;
      
      const newPrice = stock.price * (1 + change);
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