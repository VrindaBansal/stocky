import axios from 'axios';
import { API_ENDPOINTS } from '../utils/constants.js';
import StorageService from './storageService.js';

class StockService {
  constructor() {
    this.alphaVantageKey = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;
    this.fmpKey = import.meta.env.VITE_FMP_API_KEY;
    this.finnhubKey = import.meta.env.VITE_FINNHUB_API_KEY || 'sandbox_c6bqcm2ad3icth1dk9n0'; // Free sandbox key
    this.requestQueue = [];
    this.isProcessingQueue = false;
  }

  // Yahoo Finance API (Primary - Free, no key required)
  async getYahooQuote(symbol) {
    try {
      const cacheKey = `yahoo_quote_${symbol}`;
      const cached = StorageService.getCacheItem(cacheKey);
      if (cached) return cached;

      const url = `${API_ENDPOINTS.YAHOO_FINANCE.QUOTE}${symbol}`;
      const response = await axios.get(url);
      
      const result = response.data?.chart?.result?.[0];
      if (!result) throw new Error('Invalid response format');

      const meta = result.meta;
      const quote = {
        symbol: meta.symbol,
        price: meta.regularMarketPrice || meta.previousClose,
        change: meta.regularMarketPrice - meta.previousClose,
        changePercent: ((meta.regularMarketPrice - meta.previousClose) / meta.previousClose) * 100,
        volume: meta.regularMarketVolume,
        previousClose: meta.previousClose,
        open: meta.regularMarketOpen || meta.previousClose,
        high: meta.regularMarketDayHigh || meta.regularMarketPrice,
        low: meta.regularMarketDayLow || meta.regularMarketPrice,
        marketCap: null, // Not available in this endpoint
        timestamp: Date.now(),
        source: 'yahoo'
      };

      StorageService.setCacheItem(cacheKey, quote, 60000); // 1 minute cache
      return quote;
    } catch (error) {
      console.error('Yahoo Finance API error:', error);
      return null;
    }
  }

  async searchYahooStocks(query) {
    try {
      const cacheKey = `yahoo_search_${query}`;
      const cached = StorageService.getCacheItem(cacheKey);
      if (cached) return cached;

      const url = `${API_ENDPOINTS.YAHOO_FINANCE.SEARCH}?q=${encodeURIComponent(query)}`;
      const response = await axios.get(url);
      
      const results = response.data?.quotes?.slice(0, 10).map(item => ({
        symbol: item.symbol,
        name: item.longname || item.shortname,
        type: item.type,
        exchange: item.exchange
      })) || [];

      StorageService.setCacheItem(cacheKey, results, 300000); // 5 minutes cache
      return results;
    } catch (error) {
      console.error('Yahoo Search API error:', error);
      return [];
    }
  }

  // Financial Modeling Prep API (Secondary - 250 requests/day free)
  async getFMPQuote(symbol) {
    if (!this.fmpKey) return null;

    try {
      const cacheKey = `fmp_quote_${symbol}`;
      const cached = StorageService.getCacheItem(cacheKey);
      if (cached) return cached;

      const url = `${API_ENDPOINTS.FMP.BASE}${API_ENDPOINTS.FMP.QUOTE}${symbol}?apikey=${this.fmpKey}`;
      const response = await axios.get(url);
      
      const data = response.data?.[0];
      if (!data) throw new Error('No data received');

      const quote = {
        symbol: data.symbol,
        price: data.price,
        change: data.change,
        changePercent: data.changesPercentage,
        volume: data.volume,
        previousClose: data.previousClose,
        open: data.open,
        high: data.dayHigh,
        low: data.dayLow,
        marketCap: data.marketCap,
        timestamp: Date.now(),
        source: 'fmp'
      };

      StorageService.setCacheItem(cacheKey, quote, 60000); // 1 minute cache
      return quote;
    } catch (error) {
      console.error('FMP API error:', error);
      return null;
    }
  }

  async getFMPCompanyProfile(symbol) {
    if (!this.fmpKey) return null;

    try {
      const cacheKey = `fmp_profile_${symbol}`;
      const cached = StorageService.getCacheItem(cacheKey);
      if (cached) return cached;

      const url = `${API_ENDPOINTS.FMP.BASE}${API_ENDPOINTS.FMP.COMPANY}${symbol}?apikey=${this.fmpKey}`;
      const response = await axios.get(url);
      
      const data = response.data?.[0];
      if (!data) return null;

      const profile = {
        symbol: data.symbol,
        companyName: data.companyName,
        description: data.description,
        industry: data.industry,
        sector: data.sector,
        website: data.website,
        ceo: data.ceo,
        employees: data.fullTimeEmployees,
        headquarters: `${data.city}, ${data.state}, ${data.country}`,
        founded: data.ipoDate,
        logo: data.image
      };

      StorageService.setCacheItem(cacheKey, profile, 3600000); // 1 hour cache
      return profile;
    } catch (error) {
      console.error('FMP Profile API error:', error);
      return null;
    }
  }

  async searchFMPStocks(query) {
    if (!this.fmpKey) return [];

    try {
      const cacheKey = `fmp_search_${query}`;
      const cached = StorageService.getCacheItem(cacheKey);
      if (cached) return cached;

      const url = `${API_ENDPOINTS.FMP.BASE}${API_ENDPOINTS.FMP.SEARCH}?query=${encodeURIComponent(query)}&apikey=${this.fmpKey}`;
      const response = await axios.get(url);
      
      const results = response.data?.slice(0, 10).map(item => ({
        symbol: item.symbol,
        name: item.name,
        currency: item.currency,
        stockExchange: item.stockExchange
      })) || [];

      StorageService.setCacheItem(cacheKey, results, 300000); // 5 minutes cache
      return results;
    } catch (error) {
      console.error('FMP Search API error:', error);
      return [];
    }
  }

  // Alpha Vantage API (Backup - 500 requests/day free)
  async getAlphaVantageQuote(symbol) {
    if (!this.alphaVantageKey) return null;

    try {
      const cacheKey = `av_quote_${symbol}`;
      const cached = StorageService.getCacheItem(cacheKey);
      if (cached) return cached;

      const url = `${API_ENDPOINTS.ALPHA_VANTAGE.BASE}?function=${API_ENDPOINTS.ALPHA_VANTAGE.QUOTE}&symbol=${symbol}&apikey=${this.alphaVantageKey}`;
      const response = await axios.get(url);
      
      const data = response.data?.['Global Quote'];
      if (!data) throw new Error('No data received');

      const quote = {
        symbol: data['01. symbol'],
        price: parseFloat(data['05. price']),
        change: parseFloat(data['09. change']),
        changePercent: parseFloat(data['10. change percent'].replace('%', '')),
        volume: parseInt(data['06. volume']),
        previousClose: parseFloat(data['08. previous close']),
        open: parseFloat(data['02. open']),
        high: parseFloat(data['03. high']),
        low: parseFloat(data['04. low']),
        marketCap: null,
        timestamp: Date.now(),
        source: 'alphavantage'
      };

      StorageService.setCacheItem(cacheKey, quote, 60000); // 1 minute cache
      return quote;
    } catch (error) {
      console.error('Alpha Vantage API error:', error);
      return null;
    }
  }

  // Finnhub API (Real-time data with CORS support)
  async getFinnhubQuote(symbol) {
    try {
      const cacheKey = `finnhub_quote_${symbol}`;
      const cached = StorageService.getCacheItem(cacheKey);
      if (cached) return cached;

      const url = `${API_ENDPOINTS.FINNHUB.BASE}${API_ENDPOINTS.FINNHUB.QUOTE}?symbol=${symbol}&token=${this.finnhubKey}`;
      const response = await axios.get(url);
      
      const data = response.data;
      if (!data || !data.c) throw new Error('Invalid response format');

      // Get company profile for additional info
      const profileUrl = `${API_ENDPOINTS.FINNHUB.BASE}${API_ENDPOINTS.FINNHUB.PROFILE}?symbol=${symbol}&token=${this.finnhubKey}`;
      let companyName = symbol;
      try {
        const profileResponse = await axios.get(profileUrl);
        companyName = profileResponse.data?.name || symbol;
      } catch (e) {
        // Ignore profile errors
      }

      const quote = {
        symbol: symbol.toUpperCase(),
        price: parseFloat(data.c), // Current price
        change: parseFloat((data.c - data.pc).toFixed(2)), // Change from previous close
        changePercent: parseFloat(((data.c - data.pc) / data.pc * 100).toFixed(2)),
        volume: data.v || 0,
        previousClose: data.pc,
        open: data.o,
        high: data.h,
        low: data.l,
        marketCap: null,
        companyName: companyName,
        timestamp: Date.now(),
        source: 'finnhub',
        isReal: true
      };

      StorageService.setCacheItem(cacheKey, quote, 60000); // 1 minute cache
      return quote;
    } catch (error) {
      console.error('Finnhub API error:', error);
      return null;
    }
  }

  async getFinnhubHistoricalData(symbol, resolution = 'D', days = 365) {
    try {
      const cacheKey = `finnhub_historical_${symbol}_${resolution}_${days}`;
      const cached = StorageService.getCacheItem(cacheKey);
      if (cached) return cached;

      const to = Math.floor(Date.now() / 1000);
      const from = to - (days * 24 * 60 * 60);
      
      const url = `${API_ENDPOINTS.FINNHUB.BASE}${API_ENDPOINTS.FINNHUB.CANDLES}?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}&token=${this.finnhubKey}`;
      const response = await axios.get(url);
      
      const data = response.data;
      if (!data || !data.c || data.s === 'no_data') {
        throw new Error('No historical data available');
      }

      const historicalData = data.t.map((timestamp, index) => ({
        date: new Date(timestamp * 1000).toISOString().split('T')[0],
        open: data.o[index],
        high: data.h[index],
        low: data.l[index],
        close: data.c[index],
        volume: data.v[index]
      }));

      StorageService.setCacheItem(cacheKey, historicalData, 300000); // 5 minute cache
      return historicalData;
    } catch (error) {
      console.error('Finnhub historical data error:', error);
      return null;
    }
  }

  // Main methods that try multiple APIs
  async getQuote(symbol) {
    symbol = symbol.toUpperCase();
    
    // Try Finnhub first (real-time data with CORS support)
    let quote = await this.getFinnhubQuote(symbol);
    if (quote) return quote;
    
    // Try Yahoo Finance as backup
    quote = await this.getYahooQuote(symbol);
    if (quote) return quote;
    
    // Try FMP if available
    quote = await this.getFMPQuote(symbol);
    if (quote) return quote;
    
    // Try Alpha Vantage as backup
    quote = await this.getAlphaVantageQuote(symbol);
    if (quote) return quote;
    
    // Return realistic mock data if all APIs fail
    return this.getRealTimeStyleMockQuote(symbol);
  }

  async getMultipleQuotes(symbols) {
    const quotes = {};
    const promises = symbols.map(async (symbol) => {
      const quote = await this.getQuote(symbol);
      if (quote) quotes[symbol] = quote;
    });
    
    await Promise.all(promises);
    return quotes;
  }

  async searchStocks(query) {
    if (!query || query.trim().length < 2) return [];
    
    query = query.trim();
    
    // Try Yahoo first
    let results = await this.searchYahooStocks(query);
    if (results && results.length > 0) return results;
    
    // Try FMP
    results = await this.searchFMPStocks(query);
    if (results && results.length > 0) return results;
    
    // Return empty if no results
    return [];
  }

  async getCompanyInfo(symbol) {
    symbol = symbol.toUpperCase();
    
    // Try FMP for company profile
    let profile = await this.getFMPCompanyProfile(symbol);
    if (profile) return profile;
    
    // Return basic info if no detailed profile available
    return {
      symbol,
      companyName: `${symbol} Inc.`,
      description: 'Company information not available.',
      industry: 'Unknown',
      sector: 'Unknown'
    };
  }

  // Mock data generator for demo purposes
  getRealTimeStyleMockQuote(symbol) {
    // Realistic base prices for popular stocks
    const mockPrices = {
      'AAPL': 200.00,
      'MSFT': 200.00,
      'GOOGL': 200.00,
      'TSLA': 200.00,
      'AMZN': 200.00,
      'META': 200.00,
      'NVDA': 200.00,
      'NFLX': 200.00,
      'JPM': 200.00,
      'JNJ': 200.00,
      'BAC': 50.00,
      'WMT': 150.00,
      'HD': 300.00,
      'PG': 120.00,
      'KO': 60.00,
      'PEP': 180.00,
      'XOM': 100.00,
      'CVX': 140.00
    };

    const basePrice = mockPrices[symbol.toUpperCase()] || (50 + Math.random() * 150);
    const change = (Math.random() - 0.5) * (basePrice * 0.05); // ±2.5% daily change
    const price = basePrice + change;
    
    return {
      symbol: symbol.toUpperCase(),
      price: parseFloat(price.toFixed(2)),
      change: parseFloat(change.toFixed(2)),
      changePercent: parseFloat(((change / basePrice) * 100).toFixed(2)),
      volume: Math.floor(Math.random() * 50000000) + 5000000, // 5M-55M volume
      previousClose: parseFloat(basePrice.toFixed(2)),
      open: parseFloat((basePrice + (Math.random() - 0.5) * (basePrice * 0.02)).toFixed(2)),
      high: parseFloat((price + Math.random() * (basePrice * 0.03)).toFixed(2)),
      low: parseFloat((price - Math.random() * (basePrice * 0.03)).toFixed(2)),
      marketCap: Math.floor(basePrice * 5000000000), // Realistic market cap
      timestamp: Date.now(),
      source: 'mock',
      isMock: true
    };
  }

  // Enhanced historical data with real API fallback
  async getHistoricalData(symbol, period = '1year') {
    const cacheKey = `historical_${symbol}_${period}`;
    const cached = StorageService.getCacheItem(cacheKey);
    if (cached) return cached;

    // Map period to days
    const periodDays = {
      '1D': 1,
      '1W': 7,
      '1M': 30,
      '3M': 90,
      '6M': 180,
      '1Y': 365,
      '5Y': 1825
    };

    const days = periodDays[period] || 365;

    // Try Finnhub first for real historical data
    let historicalData = await this.getFinnhubHistoricalData(symbol, 'D', days);
    if (historicalData && historicalData.length > 0) {
      StorageService.setCacheItem(cacheKey, historicalData, 300000); // 5 minute cache
      return historicalData;
    }

    // Fallback to realistic mock data generation
    const data = this.generateRealisticHistoricalData(symbol, days);
    StorageService.setCacheItem(cacheKey, data, 3600000); // 1 hour cache
    return data;
  }

  generateRealisticHistoricalData(symbol, days) {
    // Get base price from current quote or use realistic defaults
    const basePrice = this.getRealTimeStyleMockQuote(symbol).price;
    
    const data = [];
    let currentPrice = basePrice;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      // Realistic daily volatility (0.5% to 3% daily movement)
      const volatility = 0.005 + Math.random() * 0.025;
      const change = (Math.random() - 0.5) * 2 * volatility;
      currentPrice *= (1 + change);
      
      const open = currentPrice * (1 + (Math.random() - 0.5) * 0.01);
      const close = currentPrice;
      const high = Math.max(open, close) * (1 + Math.random() * 0.02);
      const low = Math.min(open, close) * (1 - Math.random() * 0.02);
      
      data.push({
        date: date.toISOString().split('T')[0],
        open: parseFloat(open.toFixed(2)),
        high: parseFloat(high.toFixed(2)),
        low: parseFloat(low.toFixed(2)),
        close: parseFloat(close.toFixed(2)),
        volume: Math.floor(Math.random() * 10000000) + 1000000
      });
    }

    return data;
  }

  // Get trending/popular stocks
  getTrendingStocks() {
    return [
      'AAPL', 'MSFT', 'GOOGL', 'TSLA', 'AMZN', 
      'META', 'NVDA', 'NFLX', 'JPM', 'JNJ'
    ];
  }

  // Validate stock symbol
  isValidSymbol(symbol) {
    return /^[A-Z]{1,5}$/.test(symbol.toUpperCase());
  }

  // Clear all cached data
  clearCache() {
    const cache = StorageService.getCache();
    const stockKeys = Object.keys(cache).filter(key => 
      key.includes('quote_') || key.includes('search_') || key.includes('profile_')
    );
    
    stockKeys.forEach(key => {
      const cacheData = StorageService.getCache();
      delete cacheData[key];
      StorageService.set('stocky_cache', cacheData);
    });
  }
}

export default new StockService();