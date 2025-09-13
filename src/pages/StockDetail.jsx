import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, ShoppingCart, Eye } from 'lucide-react';
import stockService from '../services/stockService.js';
import { formatCurrency, formatPercentage, getGainLossColor } from '../utils/helpers.js';
import StockChart from '../components/charts/StockChart.jsx';

const StockDetail = () => {
  const { symbol } = useParams();
  const [quote, setQuote] = useState(null);
  const [companyInfo, setCompanyInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStockData();
  }, [symbol]);

  const loadStockData = async () => {
    setIsLoading(true);
    try {
      const [quoteData, companyData] = await Promise.all([
        stockService.getQuote(symbol),
        stockService.getCompanyInfo(symbol)
      ]);
      
      setQuote(quoteData);
      setCompanyInfo(companyData);
    } catch (error) {
      console.error('Error loading stock data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-gray-600">Stock not found</p>
        <Link to="/market" className="text-primary hover:underline mt-4 inline-block">
          ← Back to Market
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/market"
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold gradient-text">{symbol}</h1>
            <p className="text-gray-600">{companyInfo?.companyName || `${symbol} Inc.`}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="btn-secondary">
            <Eye className="w-4 h-4 mr-2" />
            Watch
          </button>
          <Link to={`/trading/${symbol}`} className="btn-accent">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Trade
          </Link>
        </div>
      </div>

      {/* Price Info */}
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-2">
              {formatCurrency(quote.price)}
            </h2>
            <div className="flex items-center space-x-4">
              <span className={`text-lg font-semibold ${getGainLossColor(quote.change)}`}>
                {quote.change >= 0 ? '+' : ''}{formatCurrency(quote.change)}
              </span>
              <span className={`text-lg font-semibold ${getGainLossColor(quote.change)}`}>
                ({quote.changePercent >= 0 ? '+' : ''}{formatPercentage(quote.changePercent / 100)})
              </span>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-gray-600 mb-1">Market Status</p>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">Open</span>
            </div>
          </div>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Open</p>
            <p className="font-semibold">{formatCurrency(quote.open)}</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">High</p>
            <p className="font-semibold">{formatCurrency(quote.high)}</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Low</p>
            <p className="font-semibold">{formatCurrency(quote.low)}</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Volume</p>
            <p className="font-semibold">{(quote.volume / 1000000).toFixed(1)}M</p>
          </div>
        </div>
      </motion.div>

      {/* Company Info */}
      {companyInfo && (
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="card p-6"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4">Company Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">About</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                {companyInfo.description || 'Company description not available.'}
              </p>
            </div>
            <div className="space-y-3">
              {companyInfo.industry && (
                <div>
                  <span className="text-sm text-gray-600">Industry: </span>
                  <span className="font-medium">{companyInfo.industry}</span>
                </div>
              )}
              {companyInfo.sector && (
                <div>
                  <span className="text-sm text-gray-600">Sector: </span>
                  <span className="font-medium">{companyInfo.sector}</span>
                </div>
              )}
              {companyInfo.employees && (
                <div>
                  <span className="text-sm text-gray-600">Employees: </span>
                  <span className="font-medium">{companyInfo.employees.toLocaleString()}</span>
                </div>
              )}
              {companyInfo.headquarters && (
                <div>
                  <span className="text-sm text-gray-600">Headquarters: </span>
                  <span className="font-medium">{companyInfo.headquarters}</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Interactive Chart */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="card p-6"
      >
        <StockChart symbol={symbol} height={400} showControls={true} />
      </motion.div>

      {/* Trading Actions */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="card p-6"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to={`/trading/${symbol}`}
            className="btn-primary flex-1 text-center"
          >
            Buy {symbol}
          </Link>
          <Link
            to={`/trading/${symbol}`}
            className="btn-secondary flex-1 text-center"
          >
            Sell {symbol}
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default StockDetail;