import React from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar,
  PieChart,
  BarChart3
} from 'lucide-react';
import { formatCurrency, formatPercentage, getGainLossColor, formatDate } from '../utils/helpers.js';

const Portfolio = () => {
  const portfolio = useSelector(state => state.portfolio.activePortfolio);
  
  if (!portfolio || (portfolio.positions || []).length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-20"
      >
        <PieChart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-600 mb-2">No Positions Yet</h2>
        <p className="text-gray-500 mb-6">Start trading to build your portfolio!</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-primary"
        >
          Start Trading
        </motion.button>
      </motion.div>
    );
  }

  const totalValue = portfolio?.totalValue || 0;
  const totalGain = totalValue - (portfolio?.startingValue || 0);
  const totalGainPercent = (portfolio?.startingValue && portfolio.startingValue > 0) ? (totalGain / portfolio.startingValue) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Portfolio Overview */}
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="card p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <h3 className="text-sm font-medium text-gray-600 mb-1">Total Value</h3>
            <p className="text-3xl font-bold text-gray-900">
              {formatCurrency(totalValue)}
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-sm font-medium text-gray-600 mb-1">Total Return</h3>
            <p className={`text-3xl font-bold ${getGainLossColor(totalGain)}`}>
              {formatCurrency(totalGain)}
            </p>
            <p className={`text-sm ${getGainLossColor(totalGain)}`}>
              {formatPercentage(totalGainPercent / 100)}
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-sm font-medium text-gray-600 mb-1">Cash</h3>
            <p className="text-3xl font-bold text-green-600">
              {formatCurrency(portfolio?.cash || 0)}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Positions */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="card p-6"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4">Your Positions</h2>
        <div className="space-y-4">
          {(portfolio?.positions || []).map((position, index) => {
            const value = position.shares * position.currentPrice;
            const gain = position.unrealizedGain;
            const gainPercent = ((position.currentPrice - position.averagePrice) / position.averagePrice) * 100;

            return (
              <motion.div
                key={`${position.symbol}-${index}`}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {position.symbol.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{position.symbol}</h3>
                    <p className="text-sm text-gray-600">
                      {position.shares} shares @ {formatCurrency(position.averagePrice)}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-semibold text-gray-800">
                    {formatCurrency(value)}
                  </p>
                  <p className={`text-sm ${getGainLossColor(gain)}`}>
                    {gain >= 0 ? '+' : ''}{formatCurrency(gain)} ({gainPercent.toFixed(1)}%)
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Portfolio;