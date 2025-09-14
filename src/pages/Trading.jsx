import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { ShoppingCart, TrendingUp, DollarSign } from 'lucide-react';
import { buyStock, sellStock } from '../store/slices/portfolioSlice.js';
import stockService from '../services/stockServiceSimple.js';
import { formatCurrency } from '../utils/helpers.js';
import toast from 'react-hot-toast';

const Trading = () => {
  const { symbol: urlSymbol } = useParams();
  const dispatch = useDispatch();
  const portfolio = useSelector(state => state.portfolio.activePortfolio);
  
  const [selectedSymbol, setSelectedSymbol] = useState(urlSymbol || '');
  const [quote, setQuote] = useState(null);
  const [orderType, setOrderType] = useState('buy');
  const [shares, setShares] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const popularStocks = [
    'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX',
    'JPM', 'V', 'JNJ', 'WMT', 'PG', 'HD', 'DIS', 'PYPL', 'ADBE', 'CRM',
    'INTC', 'CSCO', 'PFE', 'KO', 'PEP', 'ABT', 'TMO', 'COST', 'AVGO', 'TXN'
  ].sort();

  useEffect(() => {
    if (selectedSymbol) {
      loadQuote();
    }
  }, [selectedSymbol]);

  const loadQuote = async () => {
    setIsLoading(true);
    try {
      const quoteData = await stockService.getQuote(selectedSymbol);
      setQuote(quoteData);
    } catch (error) {
      console.error('Error loading quote:', error);
      toast.error('Failed to load stock quote');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSymbolSearch = (value) => {
    setSelectedSymbol(value);
    if (value.length > 0) {
      const filtered = popularStocks.filter(stock => 
        stock.toLowerCase().includes(value.toLowerCase())
      );
      setSearchResults(filtered);
      setShowDropdown(true);
    } else {
      setSearchResults(popularStocks);
      setShowDropdown(true);
    }
  };

  const selectStock = (symbol) => {
    setSelectedSymbol(symbol);
    setShowDropdown(false);
  };

  const handleTrade = () => {
    if (!selectedSymbol || !shares || !quote) {
      toast.error('Please fill in all fields');
      return;
    }

    const numShares = parseFloat(shares);
    if (numShares < 0.1) {
      toast.error('Minimum purchase is 0.1 shares');
      return;
    }

    const tradeData = {
      symbol: selectedSymbol,
      companyName: `${selectedSymbol} Inc.`,
      shares: numShares,
      price: quote.price
    };

    if (orderType === 'buy') {
      const totalCost = numShares * quote.price;
      if (totalCost > (portfolio?.cash || 0)) {
        toast.error('Insufficient funds');
        return;
      }
      dispatch(buyStock(tradeData));
      toast.success(`Bought ${numShares} shares of ${selectedSymbol}`);
    } else {
      const position = (portfolio?.positions || []).find(p => p.symbol === selectedSymbol);
      if (!position || position.shares < numShares) {
        toast.error('Insufficient shares to sell');
        return;
      }
      dispatch(sellStock(tradeData));
      toast.success(`Sold ${numShares} shares of ${selectedSymbol}`);
    }

    setShares('');
  };

  const maxShares = orderType === 'buy' 
    ? Math.floor(((portfolio?.cash || 0) / (quote?.price || 1)) * 10) / 10 // Allow fractional
    : (portfolio?.positions || []).find(p => p.symbol === selectedSymbol)?.shares || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center space-x-3">
        <ShoppingCart className="w-8 h-8 text-accent" />
        <div>
          <h1 className="text-3xl font-bold gradient-text">Trading Desk</h1>
          <p className="text-gray-600">Buy and sell stocks with virtual money</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Form */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="card p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Place Order</h2>

          {/* Order Type */}
          <div className="mb-6">
            <div className="flex rounded-xl bg-gray-100 p-1">
              <button
                onClick={() => setOrderType('buy')}
                className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                  orderType === 'buy'
                    ? 'bg-green-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Buy
              </button>
              <button
                onClick={() => setOrderType('sell')}
                className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                  orderType === 'sell'
                    ? 'bg-red-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Sell
              </button>
            </div>
          </div>

          {/* Symbol Input with Dropdown */}
          <div className="mb-4 relative">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Stock Symbol
            </label>
            <input
              type="text"
              value={selectedSymbol}
              onChange={(e) => handleSymbolSearch(e.target.value.toUpperCase())}
              onFocus={() => {
                setSearchResults(popularStocks);
                setShowDropdown(true);
              }}
              placeholder="Search or type symbol (e.g. AAPL)"
              className="input-field"
              maxLength={5}
            />
            
            {/* Dropdown */}
            {showDropdown && (
              <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-lg">
                <div className="p-2">
                  <div className="text-xs text-gray-500 mb-2">Popular Stocks</div>
                  {searchResults.slice(0, 10).map((symbol) => (
                    <button
                      key={symbol}
                      onClick={() => selectStock(symbol)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded transition-colors"
                    >
                      {symbol}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Overlay to close dropdown */}
            {showDropdown && (
              <div
                className="fixed inset-0 z-5"
                onClick={() => setShowDropdown(false)}
              />
            )}
          </div>

          {/* Shares Input */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Number of Shares (Fractional Allowed)
            </label>
            <input
              type="number"
              value={shares}
              onChange={(e) => setShares(e.target.value)}
              placeholder="0.1"
              min="0.1"
              step="0.1"
              max={maxShares}
              className="input-field"
            />
            <p className="text-sm text-gray-500 mt-1">
              Min: 0.1 shares • Max: {maxShares.toLocaleString()} shares
            </p>
          </div>

          {/* Quote Display */}
          {quote && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-green-50 rounded-xl"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800">{quote.symbol}</h3>
                  <p className="text-2xl font-bold text-primary">
                    {formatCurrency(quote.price)}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${quote.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {quote.change >= 0 ? '+' : ''}{formatCurrency(quote.change)}
                  </p>
                  <p className={`text-sm ${quote.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {quote.changePercent >= 0 ? '+' : ''}{quote.changePercent.toFixed(2)}%
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Order Summary */}
          {quote && shares && (
            <div className="mb-6 p-4 bg-gray-50 rounded-xl">
              <h4 className="font-semibold text-gray-700 mb-2">Order Summary</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Shares:</span>
                  <span>{parseFloat(shares || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Price per share:</span>
                  <span>{formatCurrency(quote.price)}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span>{formatCurrency(parseFloat(shares || 0) * quote.price)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleTrade}
            disabled={!selectedSymbol || !shares || !quote || isLoading}
            className={`w-full py-3 px-6 rounded-xl font-semibold transition-all ${
              orderType === 'buy'
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-red-500 hover:bg-red-600 text-white'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isLoading ? 'Loading...' : `${orderType === 'buy' ? 'Buy' : 'Sell'} ${selectedSymbol}`}
          </motion.button>
        </motion.div>

        {/* Portfolio Summary */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="space-y-6"
        >
          {/* Account Balance */}
          <div className="card p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Account Balance</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Available Cash</span>
                <span className="text-xl font-bold text-green-600">
                  {formatCurrency(portfolio?.cash || 0)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Portfolio Value</span>
                <span className="text-xl font-bold text-primary">
                  {formatCurrency(portfolio?.totalValue || 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Current Positions */}
          <div className="card p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Your Positions</h3>
            {(portfolio?.positions || []).length > 0 ? (
              <div className="space-y-3">
                {(portfolio?.positions || []).slice(0, 5).map((position) => (
                  <div key={position.symbol} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold">{position.symbol}</p>
                      <p className="text-sm text-gray-600">{position.shares} shares</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(position.shares * position.currentPrice)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No positions yet</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Trading;