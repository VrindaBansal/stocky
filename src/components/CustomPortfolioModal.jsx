import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { X, DollarSign, TrendingUp } from 'lucide-react';
import { createCustomPortfolio } from '../store/slices/portfolioSlice.js';
import { formatCurrency } from '../utils/helpers.js';

const CustomPortfolioModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [startingCapital, setStartingCapital] = useState(10000);
  const [portfolioName, setPortfolioName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const presetAmounts = [1000, 5000, 10000, 25000, 50000, 100000];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (startingCapital < 100) return;

    setIsLoading(true);
    
    try {
      const customLevel = `custom_${Date.now()}`;
      
      dispatch(createCustomPortfolio({
        startingCapital,
        level: customLevel,
        name: portfolioName || 'Custom Portfolio'
      }));
      
      onClose();
      setStartingCapital(10000);
      setPortfolioName('');
    } catch (error) {
      console.error('Error creating custom portfolio:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAmountChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setStartingCapital(Math.max(0, value));
  };

  const selectPresetAmount = (amount) => {
    setStartingCapital(amount);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Create Custom Portfolio</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Portfolio Name (Optional)
                </label>
                <input
                  type="text"
                  value={portfolioName}
                  onChange={(e) => setPortfolioName(e.target.value)}
                  placeholder="My Custom Portfolio"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Starting Capital
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    min="100"
                    max="1000000"
                    step="100"
                    value={startingCapital}
                    onChange={handleAmountChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent text-lg font-mono"
                    required
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Minimum: {formatCurrency(100)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Quick Presets
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {presetAmounts.map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => selectPresetAmount(amount)}
                      className={`p-2 text-sm rounded-lg border transition-all ${
                        startingCapital === amount
                          ? 'border-accent bg-accent text-white'
                          : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                      }`}
                    >
                      {formatCurrency(amount)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-accent" />
                  <span className="text-sm font-medium text-gray-700">Portfolio Preview</span>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Starting Cash:</span>
                    <span className="font-mono">{formatCurrency(startingCapital)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Available Stocks:</span>
                    <span>All Markets</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Order Types:</span>
                    <span>Market, Limit, Stop-Loss</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || startingCapital < 100}
                  className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Creating...' : 'Create Portfolio'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CustomPortfolioModal;