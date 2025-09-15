import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Trophy, Star, TrendingUp, ArrowRight, X } from 'lucide-react';
import { completeLevel, resetLevelCompletion } from '../store/slices/gameSlice.js';
import { setActiveLevel } from '../store/slices/portfolioSlice.js';
import { formatCurrency } from '../utils/helpers.js';
import { LEVELS } from '../utils/constants.js';

const LevelCompletionModal = ({ isOpen, level, portfolioValue, performance, timeToComplete }) => {
  const dispatch = useDispatch();
  const { currentLevel } = useSelector(state => state.game);
  
  const levelConfig = LEVELS[level];
  const nextLevelConfig = LEVELS[level + 1];
  const hasNextLevel = level < 5;

  useEffect(() => {
    if (isOpen) {
      // Trigger confetti animation
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      
      const randomInRange = (min, max) => Math.random() * (max - min) + min;
      
      const confettiInterval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        
        if (timeLeft <= 0) {
          clearInterval(confettiInterval);
          return;
        }
        
        const particleCount = 50 * (timeLeft / duration);
        
        // Left side
        confetti({
          particleCount,
          startVelocity: 30,
          spread: 360,
          origin: {
            x: randomInRange(0.1, 0.3),
            y: Math.random() - 0.2
          }
        });
        
        // Right side
        confetti({
          particleCount,
          startVelocity: 30,
          spread: 360,
          origin: {
            x: randomInRange(0.7, 0.9),
            y: Math.random() - 0.2
          }
        });
      }, 250);

      return () => clearInterval(confettiInterval);
    }
  }, [isOpen]);

  const handleContinueToNextLevel = () => {
    if (hasNextLevel) {
      // Complete current level
      dispatch(completeLevel({
        level,
        finalValue: portfolioValue,
        performance,
        timeToComplete
      }));
      
      // Switch to next level
      dispatch(setActiveLevel(level + 1));
    }
    
    dispatch(resetLevelCompletion());
  };

  const handleStayAtCurrentLevel = () => {
    dispatch(resetLevelCompletion());
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={handleStayAtCurrentLevel}
        />
        
        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={handleStayAtCurrentLevel}
            className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>

          {/* Header with trophy */}
          <div className="bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 px-8 py-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-pattern opacity-10"></div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="relative"
            >
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Trophy className="w-10 h-10 text-yellow-500" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Level {level} Complete! 🎉
              </h2>
              <p className="text-white/90 text-lg">
                {levelConfig.name}
              </p>
            </motion.div>
          </div>

          {/* Stats */}
          <div className="px-8 py-6">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(portfolioValue)}
                </div>
                <div className="text-sm text-gray-600">Final Value</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <Star className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">
                  +{performance.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">Return</div>
              </div>
            </div>

            {/* Achievement summary */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Achievements Unlocked:</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">
                    Reached ${levelConfig.winCondition} portfolio value
                  </span>
                </div>
                {level === 1 && (
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Completed 5 trades</span>
                  </div>
                )}
                {level === 2 && (
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Diversified across 3+ stocks</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">+500 points earned</span>
                </div>
              </div>
            </div>

            {/* Next level preview */}
            {hasNextLevel && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-semibold text-gray-900 mb-3">Ready for the next challenge?</h3>
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">{nextLevelConfig.icon}</span>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Level {level + 1}: {nextLevelConfig.name}
                      </h4>
                      <p className="text-sm text-gray-600">{nextLevelConfig.description}</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-700 space-y-1">
                    <div>💰 Starting Capital: {formatCurrency(nextLevelConfig.startingCapital)}</div>
                    <div>🎯 Target: {formatCurrency(nextLevelConfig.winCondition)}</div>
                    <div>🔥 New Features: {nextLevelConfig.features.slice(-2).join(', ')}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex space-x-3">
              {hasNextLevel ? (
                <>
                  <button
                    onClick={handleStayAtCurrentLevel}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Stay Here
                  </button>
                  <button
                    onClick={handleContinueToNextLevel}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center space-x-2"
                  >
                    <span>Next Level</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <button
                  onClick={handleStayAtCurrentLevel}
                  className="w-full px-4 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-medium hover:from-yellow-600 hover:to-orange-600 transition-all"
                >
                  🏆 Congratulations - You've mastered all levels!
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default LevelCompletionModal;