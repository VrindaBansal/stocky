import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Bell, Settings, TrendingUp, DollarSign, Plus } from 'lucide-react';
import { formatCurrency, getGainLossColor } from '../../utils/helpers.js';
import CustomPortfolioModal from '../CustomPortfolioModal.jsx';

const Header = () => {
  const { username, totalPoints, currentLevel } = useSelector(state => state.user);
  const { activePortfolio } = useSelector(state => state.portfolio);
  const [showCustomModal, setShowCustomModal] = useState(false);
  
  const totalValue = activePortfolio?.totalValue || 0;
  const startingValue = activePortfolio?.startingValue || 1;
  const totalGain = totalValue - startingValue;
  const totalGainPercent = ((totalValue - startingValue) / startingValue) * 100;

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-white border-b border-gray-100 px-4 lg:px-6 py-4 sticky top-0 z-40"
    >
      <div className="flex items-center justify-between">
        {/* Left side - Welcome */}
        <div className="ml-12 lg:ml-0">
          <h1 className="text-lg lg:text-xl font-semibold text-gray-900">
            Good morning, {username}
          </h1>
          <p className="text-xs lg:text-sm text-gray-500">
            Level {currentLevel} • {totalPoints.toLocaleString()} points
          </p>
        </div>

        {/* Right side - Portfolio Summary */}
        <div className="flex items-center space-x-2 lg:space-x-6">
          {/* Custom Portfolio Button - Hidden on mobile */}
          <button
            onClick={() => setShowCustomModal(true)}
            className="hidden lg:flex items-center space-x-2 px-3 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">Custom Portfolio</span>
          </button>

          {/* Mobile Custom Portfolio Button */}
          <button
            onClick={() => setShowCustomModal(true)}
            className="lg:hidden p-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>

          {/* Portfolio Value */}
          <div className="text-right">
            <p className="text-xs text-gray-500">Portfolio</p>
            <p className="text-sm lg:text-lg font-semibold text-gray-900 font-mono">
              {formatCurrency(totalValue)}
            </p>
          </div>

          {/* Total Return */}
          <div className="text-right">
            <p className="text-xs text-gray-500">Return</p>
            <p className={`text-sm lg:text-lg font-semibold font-mono ${getGainLossColor(totalGain)}`}>
              {totalGainPercent >= 0 ? '+' : ''}{totalGainPercent.toFixed(1)}%
            </p>
          </div>
        </div>

      </div>

      {/* Custom Portfolio Modal */}
      <CustomPortfolioModal
        isOpen={showCustomModal}
        onClose={() => setShowCustomModal(false)}
      />
    </motion.header>
  );
};

export default Header;