import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import TutorialOverlay from '../components/tutorial/TutorialOverlay.jsx';
import CustomPortfolioModal from '../components/CustomPortfolioModal.jsx';
import TradingModal from '../components/TradingModal.jsx';
import PortfolioChart from '../components/charts/PortfolioChart.jsx';
import { startTutorial, closeTutorial, completeTutorial } from '../store/slices/tutorialSlice.js';
import { updatePrices } from '../store/slices/portfolioSlice.js';
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowRight,
  PieChart,
  ArrowLeftRight,
  BarChart3,
  GraduationCap,
  DollarSign,
  Briefcase,
  ShoppingCart,
  BookOpen,
  Plus,
  Clock,
  FastForward
} from 'lucide-react';

// Utils
import { formatCurrency, formatPercentage, getGainLossColor } from '../utils/helpers.js';
import { LEVELS } from '../utils/constants.js';
import stockService from '../services/stockServiceSimple.js';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(state => state.user);
  const portfolio = useSelector(state => state.portfolio.activePortfolio);
  const tutorial = useSelector(state => state.tutorial);
  const [greeting, setGreeting] = useState('');
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [showTradingModal, setShowTradingModal] = useState(false);
  const [timeSpeed, setTimeSpeed] = useState(1);
  const [gameTime, setGameTime] = useState(new Date());
  const [growthSuggestion, setGrowthSuggestion] = useState(null);
  const [isSimulatingTime, setIsSimulatingTime] = useState(false);


  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  useEffect(() => {
    // Auto-start tutorial for new users who haven't completed it
    if (user && !tutorial.hasCompletedTutorial && portfolio?.transactions?.length === 0) {
      dispatch(startTutorial());
    }
  }, [user, tutorial.hasCompletedTutorial, portfolio?.transactions?.length, dispatch]);

  // Memoize expensive calculations
  const portfolioStats = useMemo(() => {
    const currentLevel = user?.currentLevel || 1;
    const currentLevelConfig = LEVELS[currentLevel] || LEVELS[1];
    const totalValue = portfolio?.totalValue || 0;
    const startingValue = portfolio?.startingValue || 1;
    const totalGain = totalValue - startingValue;
    const totalGainPercent = ((totalValue - startingValue) / startingValue) * 100;
    const progressToNext = (totalValue / currentLevelConfig.winCondition) * 100;

    return {
      currentLevel,
      currentLevelConfig,
      totalValue,
      startingValue,
      totalGain,
      totalGainPercent,
      progressToNext
    };
  }, [user?.currentLevel, portfolio?.totalValue, portfolio?.startingValue]);

  // Time acceleration effect for Level 1
  useEffect(() => {
    if (portfolioStats.currentLevel === 1 && timeSpeed > 1 && isSimulatingTime) {
      const interval = setInterval(async () => {
        setGameTime(prev => new Date(prev.getTime() + (timeSpeed * 60000))); // Accelerate time
        
        // Simulate price changes based on time acceleration
        const updatedStockData = stockService.simulateTimeProgression(timeSpeed, 1);
        
        // Update portfolio prices with the new stock prices
        const quotes = {};
        Object.keys(updatedStockData).forEach(symbol => {
          quotes[symbol] = {
            price: updatedStockData[symbol].price,
            change: updatedStockData[symbol].change,
            changePercent: updatedStockData[symbol].changePercent
          };
        });
        
        // Dispatch the updated prices to the portfolio
        dispatch(updatePrices(quotes));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timeSpeed, portfolioStats.currentLevel, isSimulatingTime, dispatch]);

  // Generate growth suggestions for Level 1 portfolio growth objective
  useEffect(() => {
    if (portfolioStats.currentLevel === 1) {
      const suggestion = stockService.getGrowthSuggestion(
        portfolioStats.totalValue,
        portfolioStats.currentLevelConfig.winCondition,
        portfolio?.positions || []
      );
      setGrowthSuggestion(suggestion);
    }
  }, [portfolioStats.totalValue, portfolioStats.currentLevel, portfolioStats.currentLevelConfig.winCondition, portfolio?.positions]);

  // Memoize callback functions to prevent unnecessary re-renders
  const handleTutorialClose = useCallback(() => {
    dispatch(closeTutorial());
  }, [dispatch]);

  const handleTutorialComplete = useCallback(() => {
    dispatch(completeTutorial());
  }, [dispatch]);

  const handleShowTradingModal = useCallback(() => {
    setShowTradingModal(true);
  }, []);

  const handleCloseTradingModal = useCallback(() => {
    setShowTradingModal(false);
  }, []);

  const handleStartTimeSimulation = useCallback(() => {
    setIsSimulatingTime(true);
  }, []);

  const handleStopTimeSimulation = useCallback(() => {
    setIsSimulatingTime(false);
  }, []);

  const handleSpeedChange = useCallback((speed) => {
    setTimeSpeed(speed);
    if (speed === 1) {
      setIsSimulatingTime(false);
    } else {
      setIsSimulatingTime(true);
    }
  }, []);

  // Handle loading or error states
  if (!user || !portfolio || !user.isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Redirect to onboarding if not completed
  if (user.isOnboarding) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to onboarding...</p>
        </div>
      </div>
    );
  }

  // Recent achievements (mock data for demo)
  const recentAchievements = [
    { id: 1, name: 'First Purchase', icon: '🎉', date: 'Today' },
    { id: 2, name: 'Day Trader', icon: '⚡', date: 'Yesterday' }
  ];

  // Memoize level-specific objectives/tasks
  const levelObjectives = useMemo(() => {
    const level = portfolioStats.currentLevel;
    const transactions = portfolio?.transactions || [];
    const positions = portfolio?.positions || [];
    const uniqueSymbols = [...new Set(positions.map(p => p.symbol))];
    
    switch (level) {
      case 1: // Paper Trader
        return [
          {
            title: 'Make Your First Stock Purchase',
            description: 'Buy shares of any available stock (AAPL, MSFT, GOOGL, TSLA, AMZN)',
            completed: transactions.length > 0,
            action: {
              label: 'Start Trading',
              onClick: handleShowTradingModal
            }
          },
          {
            title: 'Complete 5 Successful Trades',
            description: 'Buy and sell stocks to understand market mechanics',
            completed: transactions.length >= 5,
            progress: {
              current: Math.min(transactions.length, 5),
              target: 5
            },
            action: transactions.length > 0 ? {
              label: 'Continue Trading',
              onClick: handleShowTradingModal
            } : null
          },
          {
            title: 'Achieve 5% Portfolio Growth',
            description: `Grow your portfolio from $${portfolioStats.currentLevelConfig.startingCapital} to $${portfolioStats.currentLevelConfig.winCondition}`,
            completed: portfolioStats.totalValue >= portfolioStats.currentLevelConfig.winCondition,
            progress: {
              current: Math.max(portfolioStats.totalValue, portfolioStats.currentLevelConfig.startingCapital),
              target: portfolioStats.currentLevelConfig.winCondition
            },
            hint: growthSuggestion,
            action: portfolioStats.totalValue < portfolioStats.currentLevelConfig.winCondition ? {
              label: '📈 Help Me Reach 5%',
              onClick: () => {
                if (timeSpeed === 1) {
                  handleSpeedChange(10); // Speed up time to see stock changes
                } else {
                  handleShowTradingModal(); // Open trading modal for more actions
                }
              }
            } : {
              label: '🎉 Goal Achieved!',
              onClick: () => {} // Disabled when completed
            }
          },
          {
            title: 'Learn the Basics',
            description: 'Read about stock fundamentals in the Education Center',
            completed: false, // Would need to track education progress
            action: {
              label: 'Learn More',
              onClick: () => window.location.href = '/education'
            }
          }
        ];
        
      case 2: // Market Explorer
        return [
          {
            title: 'Diversify Your Portfolio',
            description: 'Invest in at least 3 different stocks from different sectors',
            completed: uniqueSymbols.length >= 3,
            progress: {
              current: uniqueSymbols.length,
              target: 3
            },
            action: {
              label: 'Explore Market',
              onClick: () => window.location.href = '/market'
            }
          },
          {
            title: 'Research Companies',
            description: 'Use market research tools to analyze company fundamentals',
            completed: false,
            action: {
              label: 'Research Stocks',
              onClick: () => window.location.href = '/market'
            }
          },
          {
            title: 'Achieve $600 Portfolio Value',
            description: 'Grow your $500 starting capital by 20%',
            completed: portfolioStats.totalValue >= portfolioStats.currentLevelConfig.winCondition,
            progress: {
              current: Math.max(portfolioStats.totalValue, portfolioStats.currentLevelConfig.startingCapital),
              target: portfolioStats.currentLevelConfig.winCondition
            }
          }
        ];
        
      case 3: // Strategic Investor
        return [
          {
            title: 'Use Advanced Order Types',
            description: 'Place limit orders and stop-loss orders to manage risk',
            completed: false,
            action: {
              label: 'Advanced Trading',
              onClick: () => window.location.href = '/trading'
            }
          },
          {
            title: 'Master Risk Management',
            description: 'Keep portfolio losses below 15% at all times',
            completed: false,
            action: {
              label: 'Learn Risk Management',
              onClick: () => window.location.href = '/education'
            }
          },
          {
            title: 'Achieve $1,300 Portfolio Value',
            description: 'Grow your $1,000 starting capital by 30%',
            completed: portfolioStats.totalValue >= portfolioStats.currentLevelConfig.winCondition,
            progress: {
              current: Math.max(portfolioStats.totalValue, portfolioStats.currentLevelConfig.startingCapital),
              target: portfolioStats.currentLevelConfig.winCondition
            }
          }
        ];
        
      case 4: // Advanced Trader
        return [
          {
            title: 'Execute Short Selling',
            description: 'Learn to profit from declining stock prices',
            completed: false,
            action: {
              label: 'Learn Short Selling',
              onClick: () => window.location.href = '/education'
            }
          },
          {
            title: 'Use Technical Analysis',
            description: 'Analyze charts and use technical indicators for trading decisions',
            completed: false,
            action: {
              label: 'View Charts',
              onClick: () => window.location.href = '/market'
            }
          },
          {
            title: 'Achieve $6,500 Portfolio Value',
            description: 'Grow your $5,000 starting capital by 30% using advanced strategies',
            completed: portfolioStats.totalValue >= portfolioStats.currentLevelConfig.winCondition,
            progress: {
              current: Math.max(portfolioStats.totalValue, portfolioStats.currentLevelConfig.startingCapital),
              target: portfolioStats.currentLevelConfig.winCondition
            }
          }
        ];
        
      case 5: // Portfolio Master
        return [
          {
            title: 'Options Trading Simulation',
            description: 'Learn and practice options trading strategies',
            completed: false,
            action: {
              label: 'Learn Options',
              onClick: () => window.location.href = '/education'
            }
          },
          {
            title: 'Portfolio Optimization',
            description: 'Create a well-balanced, diversified portfolio across multiple asset classes',
            completed: uniqueSymbols.length >= 5,
            progress: {
              current: uniqueSymbols.length,
              target: 5
            }
          },
          {
            title: 'Achieve $15,000 Portfolio Value',
            description: 'Grow your $10,000 starting capital by 50% - the ultimate challenge!',
            completed: portfolioStats.totalValue >= portfolioStats.currentLevelConfig.winCondition,
            progress: {
              current: Math.max(portfolioStats.totalValue, portfolioStats.currentLevelConfig.startingCapital),
              target: portfolioStats.currentLevelConfig.winCondition
            }
          }
        ];
        
      default:
        return [];
    }
  }, [portfolioStats.currentLevel, portfolio?.transactions, portfolio?.positions, portfolioStats.totalValue, portfolioStats.currentLevelConfig]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-8"
    >
      {/* Time Control (Level 1 only) */}
      {portfolioStats.currentLevel === 1 && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`rounded-xl p-6 border-2 transition-all ${
            portfolioStats.totalValue >= portfolioStats.currentLevelConfig.winCondition
              ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
              : 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Clock className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Portfolio Growth Challenge</h3>
                <p className="text-sm text-gray-600">
                  {portfolioStats.totalValue >= portfolioStats.currentLevelConfig.winCondition 
                    ? "🎉 Congratulations! You reached your growth target!"
                    : "Speed up time to see how your investments perform"
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Time Speed:</span>
              <div className="flex space-x-1">
                {[1, 5, 10, 30].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => handleSpeedChange(speed)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                      timeSpeed === speed
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-gray-600 hover:bg-blue-100'
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
              {isSimulatingTime && (
                <FastForward className="w-4 h-4 text-blue-600 animate-pulse" />
              )}
            </div>
          </div>

          {/* Growth Suggestion */}
          {growthSuggestion && portfolioStats.totalValue < portfolioStats.currentLevelConfig.winCondition && (
            <div className={`p-4 rounded-lg border ${
              growthSuggestion.type === 'success' ? 'bg-green-50 border-green-200' :
              growthSuggestion.type === 'info' ? 'bg-blue-50 border-blue-200' :
              'bg-orange-50 border-orange-200'
            }`}>
              <div className="flex items-start space-x-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  growthSuggestion.type === 'success' ? 'bg-green-500' :
                  growthSuggestion.type === 'info' ? 'bg-blue-500' :
                  'bg-orange-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm text-gray-700 mb-2">{growthSuggestion.message}</p>
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-medium text-gray-600">💡 Try:</span>
                    <span className="text-sm font-semibold text-gray-800">{growthSuggestion.recommendedStock}</span>
                    <span className="text-xs text-gray-600">{growthSuggestion.reason}</span>
                    <button
                      onClick={handleShowTradingModal}
                      className="text-xs bg-white px-2 py-1 rounded border hover:bg-gray-50 transition-colors"
                    >
                      Trade Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {timeSpeed > 1 && (
            <div className="mt-3 text-xs text-blue-600 bg-blue-100 px-3 py-1 rounded-full inline-block">
              Game Time: {gameTime.toLocaleTimeString()} (accelerated {timeSpeed}x)
            </div>
          )}
        </motion.div>
      )}

      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, ease: "easeOut" }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Portfolio Value</h3>
            <TrendingUp className="w-4 h-4 text-gray-400" />
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900 font-mono">
              {formatCurrency(portfolioStats.totalValue)}
            </p>
            <p className="text-sm text-gray-500">
              Starting: {formatCurrency(portfolioStats.startingValue)}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, ease: "easeOut" }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Total Return</h3>
            <div className={`w-4 h-4 ${portfolioStats.totalGain >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {portfolioStats.totalGain >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            </div>
          </div>
          <div className="space-y-1">
            <p className={`text-2xl font-bold font-mono ${getGainLossColor(portfolioStats.totalGain)}`}>
              {portfolioStats.totalGainPercent >= 0 ? '+' : ''}{portfolioStats.totalGainPercent.toFixed(1)}%
            </p>
            <p className={`text-sm ${getGainLossColor(portfolioStats.totalGain)}`}>
              {portfolioStats.totalGain >= 0 ? '+' : ''}{formatCurrency(portfolioStats.totalGain)}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, ease: "easeOut" }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Level Progress</h3>
            <div className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
              {portfolioStats.currentLevel}/5
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold text-gray-900">
                {portfolioStats.currentLevelConfig.name}
              </p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(portfolioStats.progressToNext, 100)}%` }}
                transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                className="bg-gray-900 h-2 rounded-full"
              ></motion.div>
            </div>
            <p className="text-xs text-gray-500">
              Target: {formatCurrency(portfolioStats.currentLevelConfig.winCondition)}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Live Stock Performance Chart */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, ease: "easeOut" }}
      >
        <PortfolioChart 
          portfolio={portfolio} 
          timeSpeed={timeSpeed}
          isSimulatingTime={isSimulatingTime}
          height={window.innerWidth < 1024 ? 250 : 350}
        />
      </motion.div>

      {/* Game-like Level Progression */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, ease: "easeOut" }}
        className="card p-8"
      >
        {/* Level Selector Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((level) => {
              const isUnlocked = level <= portfolioStats.currentLevel;
              const isActive = level === portfolioStats.currentLevel;
              
              return (
                <div
                  key={level}
                  className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-sm transition-all ${
                    isActive
                      ? 'bg-accent text-white shadow-lg ring-4 ring-accent/20'
                      : isUnlocked
                      ? 'bg-green-500 text-white cursor-pointer hover:bg-green-600'
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {isUnlocked && level < portfolioStats.currentLevel ? '✓' : level}
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Current Level Info */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Level {portfolioStats.currentLevel}: {portfolioStats.currentLevelConfig.name}
          </h2>
          <p className="text-gray-600 mb-4">{portfolioStats.currentLevelConfig.description}</p>
          <div className="inline-flex items-center space-x-4 text-sm">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
              Capital: {formatCurrency(portfolioStats.currentLevelConfig.startingCapital)}
            </span>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
              Target: {formatCurrency(portfolioStats.currentLevelConfig.winCondition)}
            </span>
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
              Stocks: {Array.isArray(portfolioStats.currentLevelConfig.availableStocks) 
                ? portfolioStats.currentLevelConfig.availableStocks.length 
                : portfolioStats.currentLevelConfig.availableStocks}
            </span>
          </div>
        </div>
        
        {/* Level Tasks/Objectives */}
        <div className="max-w-2xl mx-auto">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            Level Objectives
          </h3>
          
          <div className="space-y-4">
            {levelObjectives.map((objective, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`flex items-start space-x-3 p-4 rounded-lg border ${
                  objective.completed 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                  objective.completed 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  {objective.completed ? '✓' : index + 1}
                </div>
                <div className="flex-1">
                  <h4 className={`font-medium ${
                    objective.completed ? 'text-green-800' : 'text-gray-900'
                  }`}>
                    {objective.title}
                  </h4>
                  <p className={`text-sm mt-1 ${
                    objective.completed ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    {objective.description}
                  </p>
                  {objective.progress && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{objective.progress.current} / {objective.progress.target}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-accent h-2 rounded-full transition-all"
                          style={{ 
                            width: `${Math.min((objective.progress.current / objective.progress.target) * 100, 100)}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
                {objective.action && (
                  <button
                    onClick={objective.action.onClick}
                    className="btn-primary text-sm px-4 py-2"
                  >
                    {objective.action.label}
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>


      {/* Recent Activity */}
      {portfolio?.transactions?.length > 0 && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, ease: "easeOut" }}
          className="card p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {portfolio.transactions.slice(0, 3).map((transaction, index) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    transaction.type === 'buy' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {transaction.type === 'buy' ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {transaction.type.toUpperCase()} {transaction.symbol}
                    </p>
                    <p className="text-sm text-gray-500">
                      {transaction.shares} shares @ {formatCurrency(transaction.price)}
                    </p>
                  </div>
                </div>
                <p className="font-mono font-medium text-gray-900">
                  {formatCurrency(transaction.shares * transaction.price)}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Tutorial Overlay */}
      <TutorialOverlay
        isOpen={tutorial.showTutorial}
        onClose={handleTutorialClose}
        onComplete={handleTutorialComplete}
      />

      {/* Custom Portfolio Modal */}
      <CustomPortfolioModal
        isOpen={showCustomModal}
        onClose={() => setShowCustomModal(false)}
      />

      {/* Trading Modal */}
      <TradingModal
        isOpen={showTradingModal}
        onClose={handleCloseTradingModal}
      />
    </motion.div>
  );
};

export default Dashboard;