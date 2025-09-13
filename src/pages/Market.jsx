import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, TrendingUp, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import stockService from '../services/stockService.js';
import { formatCurrency, formatPercentage, getGainLossColor } from '../utils/helpers.js';

const Market = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [trendingStocks, setTrendingStocks] = useState([]);
  const [quotes, setQuotes] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadTrendingStocks();
  }, []);

  const loadTrendingStocks = async () => {
    setIsLoading(true);
    try {
      // Show all major stocks instead of just trending
      const allMajorStocks = [
        'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX',
        'JPM', 'V', 'JNJ', 'WMT', 'PG', 'HD', 'DIS', 'PYPL', 'ADBE', 'CRM',
        'INTC', 'CSCO', 'PFE', 'KO', 'PEP', 'ABT', 'TMO', 'COST', 'AVGO', 'TXN',
        'ORCL', 'ACN', 'LLY', 'NKE', 'MRK', 'UNH', 'MA', 'BABA', 'XOM', 'BAC'
      ];
      setTrendingStocks(allMajorStocks);
      
      // Load quotes for all stocks
      const quotesData = await stockService.getMultipleQuotes(allMajorStocks);
      setQuotes(quotesData);
    } catch (error) {
      console.error('Error loading stocks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (query) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const results = await stockService.searchStocks(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching stocks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const StockCard = ({ symbol, quote, showWatchButton = true }) => {
    if (!quote) return null;

    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="card p-4 cursor-pointer"
      >
        <Link to={`/market/${symbol}`} className="block">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {symbol.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{symbol}</h3>
                <p className="text-sm text-gray-600">Stock</p>
              </div>
            </div>
            {showWatchButton && (
              <button className="p-2 rounded-lg hover:bg-gray-100">
                <Eye className="w-4 h-4 text-gray-500" />
              </button>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xl font-bold text-gray-800">
                {formatCurrency(quote.price)}
              </p>
            </div>
            <div className="text-right">
              <p className={`font-semibold ${getGainLossColor(quote.change)}`}>
                {quote.change >= 0 ? '+' : ''}{formatCurrency(quote.change)}
              </p>
              <p className={`text-sm ${getGainLossColor(quote.change)}`}>
                {quote.changePercent >= 0 ? '+' : ''}{formatPercentage(quote.changePercent / 100)}
              </p>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Stock Market</h1>
          <p className="text-gray-600">Discover and research stocks to trade</p>
        </div>
      </div>

      {/* Search */}
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="card p-6"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search stocks by symbol or company name..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              handleSearch(e.target.value);
            }}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 space-y-2 max-h-60 overflow-y-auto"
          >
            {searchResults.map((result) => (
              <Link
                key={result.symbol}
                to={`/market/${result.symbol}`}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div>
                  <p className="font-semibold text-gray-800">{result.symbol}</p>
                  <p className="text-sm text-gray-600">{result.name}</p>
                </div>
                <TrendingUp className="w-4 h-4 text-gray-400" />
              </Link>
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Trending Stocks */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="card p-6"
      >
        <div className="flex items-center space-x-2 mb-6">
          <TrendingUp className="w-6 h-6 text-accent" />
          <h2 className="text-xl font-bold text-gray-900">All Available Stocks</h2>
          <span className="text-sm text-gray-500">({trendingStocks.length} stocks)</span>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-xl h-24"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trendingStocks.map((symbol, index) => (
              <motion.div
                key={symbol}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <StockCard symbol={symbol} quote={quotes[symbol]} />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Market Status */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="card p-6 bg-gradient-to-r from-gray-50 to-green-50"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Market Status</h3>
            <p className="text-gray-600">
              Markets are currently {new Date().getHours() >= 9 && new Date().getHours() < 16 ? 'open' : 'closed'}
            </p>
          </div>
          <div className={`w-3 h-3 rounded-full ${
            new Date().getHours() >= 9 && new Date().getHours() < 16 ? 'bg-green-500' : 'bg-red-500'
          }`}></div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Market;