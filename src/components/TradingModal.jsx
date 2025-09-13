import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, TrendingDown, ShoppingCart } from 'lucide-react';
import { buyStock, sellStock } from '../store/slices/portfolioSlice.js';
import stockService from '../services/stockServiceSimple.js';
import { formatCurrency } from '../utils/helpers.js';
import toast from 'react-hot-toast';

const TradingModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const portfolio = useSelector(state => state.portfolio.activePortfolio);
  const user = useSelector(state => state.user);
  
  // Preset stocks for Level 1 (Paper Trader)
  const presetStocks = ['AAPL', 'MSFT', 'GOOGL'];
  
  const [selectedStock, setSelectedStock] = useState('AAPL');
  const [quotes, setQuotes] = useState({});
  const [chartData, setChartData] = useState({});
  const [orderType, setOrderType] = useState('buy');
  const [shares, setShares] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadQuotes();
    }
  }, [isOpen]);

  const loadQuotes = async () => {
    setIsLoading(true);
    try {
      const quotePromises = presetStocks.map(symbol => 
        stockService.getQuote(symbol).then(quote => ({ [symbol]: quote }))
      );
      const chartPromises = presetStocks.map(symbol => 
        stockService.getChartData(symbol).then(data => ({ [symbol]: data }))
      );
      
      const [quoteResults, chartResults] = await Promise.all([
        Promise.all(quotePromises),
        Promise.all(chartPromises)
      ]);
      
      const quotesData = Object.assign({}, ...quoteResults);
      const chartsData = Object.assign({}, ...chartResults);
      
      setQuotes(quotesData);
      setChartData(chartsData);
    } catch (error) {
      console.warn('Error loading quotes:', error.message);
      // Don't show error toast, just use fallback data
    } finally {
      setIsLoading(false);
    }
  };

  const getStockInfo = (symbol) => {
    const info = {
      'AAPL': {
        name: 'Apple Inc.',
        description: 'World\'s largest technology company by revenue, known for iPhone, iPad, Mac, and services ecosystem',
        sector: 'Technology',
        price: 188.87,
        change: 2.15,
        changePercent: 1.15,
        marketCap: '$2.9T',
        pe: '29.8',
        recommendation: 'Strong Buy - Leading brand with growing services revenue'
      },
      'MSFT': {
        name: 'Microsoft Corporation', 
        description: 'Global leader in cloud computing (Azure), productivity software (Office 365), and enterprise solutions',
        sector: 'Technology',
        price: 418.32,
        change: 5.47,
        changePercent: 1.32,
        marketCap: '$3.1T',
        pe: '35.2',
        recommendation: 'Buy - Dominant in cloud computing with strong AI integration'
      },
      'GOOGL': {
        name: 'Alphabet Inc.',
        description: 'Parent company of Google, dominating search advertising with growing cloud and YouTube businesses',
        sector: 'Technology',
        price: 162.78,
        change: -1.23,
        changePercent: -0.75,
        marketCap: '$2.0T',
        pe: '24.1',
        recommendation: 'Buy - Strong advertising moat with AI and cloud growth potential'
      }
    };
    return info[symbol] || { name: symbol, description: 'Stock information', sector: 'Unknown' };
  };

  const selectedQuote = quotes[selectedStock];
  const stockInfo = getStockInfo(selectedStock);
  const currentPrice = (selectedQuote && selectedQuote.price) || stockInfo.price;
  const currentPosition = (portfolio?.positions || []).find(p => p.symbol === selectedStock);
  
  const maxBuyShares = currentPrice ? Math.floor(((portfolio?.cash || 0) / currentPrice) * 10) / 10 : 0;
  const maxSellShares = currentPosition?.shares || 0;
  const maxShares = orderType === 'buy' ? maxBuyShares : maxSellShares;

  // Simple chart component
  const MiniChart = ({ data, symbol }) => {
    if (!data || data.length < 2) return null;

    const width = 200;
    const height = 80;
    const padding = 10;

    const prices = data.map(d => d.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;

    const points = data.map((d, i) => {
      const x = (i / (data.length - 1)) * (width - 2 * padding) + padding;
      const y = height - padding - ((d.price - minPrice) / priceRange) * (height - 2 * padding);
      return `${x},${y}`;
    }).join(' ');

    const lastPrice = prices[prices.length - 1];
    const firstPrice = prices[0];
    const isPositive = lastPrice >= firstPrice;

    return (
      <div className="bg-gray-50 rounded-lg p-3">
        <div className="text-xs text-gray-600 mb-1">30-Day Chart</div>
        <svg width={width} height={height} className="w-full">
          <polyline
            points={points}
            fill="none"
            stroke={isPositive ? '#10b981' : '#ef4444'}
            strokeWidth="2"
            className="transition-all duration-300"
          />
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        <div className="text-xs text-gray-500 mt-1 flex justify-between">
          <span>${minPrice.toFixed(2)}</span>
          <span className={isPositive ? 'text-green-600' : 'text-red-600'}>
            {isPositive ? '+' : ''}{((lastPrice - firstPrice) / firstPrice * 100).toFixed(1)}%
          </span>
          <span>${maxPrice.toFixed(2)}</span>
        </div>
      </div>
    );
  };

  const handleTrade = () => {
    if (!shares || !currentPrice) {
      toast.error('Please enter number of shares');
      return;
    }

    const numShares = parseFloat(shares);
    if (numShares < 0.1) {
      toast.error('Minimum purchase is 0.1 shares');
      return;
    }

    const tradeData = {
      symbol: selectedStock,
      companyName: stockInfo.name,
      shares: numShares,
      price: currentPrice
    };

    if (orderType === 'buy') {
      const totalCost = numShares * currentPrice;
      if (totalCost > (portfolio?.cash || 0)) {
        toast.error('Insufficient funds');
        return;
      }
      dispatch(buyStock(tradeData));
      toast.success(`Bought ${numShares} shares of ${selectedStock}`);
    } else {
      if (!currentPosition || currentPosition.shares < numShares) {
        toast.error('Insufficient shares to sell');
        return;
      }
      dispatch(sellStock(tradeData));
      toast.success(`Sold ${numShares} shares of ${selectedStock}`);
    }

    setShares('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <ShoppingCart className="w-6 h-6 text-accent" />
              <div>
                <h2 className="text-xl font-bold text-gray-900">Level 1 Trading</h2>
                <p className="text-sm text-gray-600">Choose from these 3 starter stocks</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            {/* Stock Selection */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Stock</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {presetStocks.map((symbol) => {
                  const quote = quotes[symbol];
                  const stockInfo = getStockInfo(symbol);
                  const isSelected = selectedStock === symbol;
                  
                  return (
                    <motion.button
                      key={symbol}
                      onClick={() => setSelectedStock(symbol)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        isSelected
                          ? 'border-accent bg-accent/5 ring-2 ring-accent/20'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-bold text-gray-900">{symbol}</h4>
                          <p className="text-sm text-gray-600 mb-1">{stockInfo.name}</p>
                          <p className="text-xs text-gray-500">{stockInfo.description}</p>
                        </div>
                        {isLoading ? (
                          <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <div className="text-right">
                            <p className="font-bold text-lg">{formatCurrency((quote && quote.price) || stockInfo.price)}</p>
                            <p className={`text-sm ${((quote && quote.change) || stockInfo.change) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {((quote && quote.change) || stockInfo.change) >= 0 ? '+' : ''}{((quote && quote.changePercent) || stockInfo.changePercent).toFixed(2)}%
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Current Holdings (shown when selling) */}
            {orderType === 'sell' && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Holdings</h3>
                {portfolio?.positions && portfolio.positions.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {portfolio.positions.map((position) => {
                    const quote = quotes[position.symbol];
                    const currentPrice = quote?.price || 0;
                    const totalValue = currentPrice * position.shares;
                    const gainLoss = totalValue - (position.avgPrice * position.shares);
                    const gainLossPercent = position.avgPrice ? ((currentPrice - position.avgPrice) / position.avgPrice) * 100 : 0;
                    const isGain = gainLoss >= 0;
                    const isSelected = selectedStock === position.symbol;
                    
                    return (
                      <motion.button
                        key={position.symbol}
                        onClick={() => {
                          setSelectedStock(position.symbol);
                          setShares(position.shares.toString());
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          isSelected
                            ? 'border-accent bg-accent/5'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-gray-900">{position.symbol}</span>
                          <span className="text-sm text-gray-600">{position.shares} shares</span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Avg Cost:</span>
                            <span>{formatCurrency(position.avgPrice)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Current:</span>
                            <span>{formatCurrency(currentPrice)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Value:</span>
                            <span>{formatCurrency(totalValue)}</span>
                          </div>
                          <div className={`flex justify-between text-sm font-semibold ${
                            isGain ? 'text-green-600' : 'text-red-600'
                          }`}>
                            <span>Gain/Loss:</span>
                            <span>
                              {isGain ? '+' : ''}{formatCurrency(gainLoss)}
                              <br />
                              ({isGain ? '+' : ''}{gainLossPercent.toFixed(2)}%)
                            </span>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                    </div>
                    <p className="text-sm text-gray-500 mt-3">
                      💡 Click on any holding to select it for selling
                    </p>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-400 mb-3">
                      <TrendingDown className="w-12 h-12 mx-auto mb-2" />
                      <p className="text-lg font-medium text-gray-600">No holdings to sell</p>
                      <p className="text-sm text-gray-500">Buy some stocks first to see them here</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Trading Interface */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Order Form */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Place Order</h3>
                
                {/* Order Type */}
                <div>
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

                {/* Shares Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Number of Shares
                  </label>
                  <input
                    type="number"
                    value={shares}
                    onChange={(e) => setShares(e.target.value)}
                    placeholder="0.1"
                    min="0.1"
                    step="0.1"
                    max={maxShares}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Max: {maxShares.toLocaleString()} shares
                  </p>
                </div>

                {/* Order Summary */}
                {currentPrice && shares && (
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <h4 className="font-semibold text-gray-700 mb-2">Order Summary</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Stock:</span>
                        <span>{selectedStock}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shares:</span>
                        <span>{parseFloat(shares || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Price per share:</span>
                        <span>{formatCurrency(currentPrice)}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-lg border-t pt-2">
                        <span>Total:</span>
                        <span>{formatCurrency(parseFloat(shares || 0) * currentPrice)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  onClick={handleTrade}
                  disabled={!shares || !currentPrice || isLoading}
                  className={`w-full py-3 px-6 rounded-xl font-semibold transition-all ${
                    orderType === 'buy'
                      ? 'bg-green-500 hover:bg-green-600 text-white'
                      : 'bg-red-500 hover:bg-red-600 text-white'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isLoading ? 'Loading...' : `${orderType === 'buy' ? 'Buy' : 'Sell'} ${selectedStock}`}
                </button>
              </div>

              {/* Account Info & Stock Details */}
              <div className="space-y-6">
                {/* Selected Stock Details */}
                {selectedStock && (
                  <div className="p-6 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-xl border border-blue-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Stock Analysis</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-bold text-xl text-gray-900">{getStockInfo(selectedStock).name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{getStockInfo(selectedStock).description}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-white/70 p-3 rounded-lg">
                          <span className="text-gray-600">Market Cap</span>
                          <p className="font-semibold">{getStockInfo(selectedStock).marketCap}</p>
                        </div>
                        <div className="bg-white/70 p-3 rounded-lg">
                          <span className="text-gray-600">P/E Ratio</span>
                          <p className="font-semibold">{getStockInfo(selectedStock).pe}</p>
                        </div>
                      </div>
                      
                      <div className="bg-white/70 p-3 rounded-lg">
                        <span className="text-gray-600 text-xs">Investment Outlook</span>
                        <p className="text-sm font-medium text-blue-800 mt-1">{getStockInfo(selectedStock).recommendation}</p>
                      </div>
                      
                      {/* Price Chart */}
                      <div className="bg-white/70 p-3 rounded-lg">
                        <span className="text-gray-600 text-xs mb-2 block">Price Performance</span>
                        <MiniChart data={chartData[selectedStock]} symbol={selectedStock} />
                      </div>
                    </div>
                  </div>
                )}
                
                <h3 className="text-lg font-semibold text-gray-900">Account Summary</h3>
                
                {/* Cash Balance */}
                <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Available Cash</span>
                    <span className="text-xl font-bold text-green-600">
                      {formatCurrency(portfolio?.cash || 0)}
                    </span>
                  </div>
                </div>

                {/* Portfolio Value */}
                <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Portfolio Value</span>
                    <span className="text-xl font-bold text-blue-600">
                      {formatCurrency(portfolio?.totalValue || 0)}
                    </span>
                  </div>
                </div>

                {/* Current Position for Selected Stock */}
                {currentPosition && (
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                    <h4 className="font-semibold text-gray-700 mb-2">Current Position</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Stock:</span>
                        <span className="font-medium">{selectedStock}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shares:</span>
                        <span className="font-medium">{currentPosition.shares}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Current Value:</span>
                        <span className="font-medium">
                          {formatCurrency(currentPosition.shares * currentPrice)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Level Reminder */}
                <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                  <h4 className="font-semibold text-orange-800 mb-1">Level 1 Objective</h4>
                  <p className="text-sm text-orange-700">
                    Make your first stock purchase to progress in the game!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TradingModal;