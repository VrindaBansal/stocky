import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import TutorialOverlay from '../components/tutorial/TutorialOverlay.jsx';
import CustomPortfolioModal from '../components/CustomPortfolioModal.jsx';
import { startTutorial, closeTutorial, completeTutorial } from '../store/slices/tutorialSlice.js';
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
  Plus
} from 'lucide-react';

// Utils
import { formatCurrency, formatPercentage, getGainLossColor } from '../utils/helpers.js';
import { LEVELS } from '../utils/constants.js';

const Dashboard = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const portfolio = useSelector(state => state.portfolio.activePortfolio);
  const tutorial = useSelector(state => state.tutorial);
  const [greeting, setGreeting] = useState('');
  const [showCustomModal, setShowCustomModal] = useState(false);


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

  const currentLevelConfig = LEVELS[user?.currentLevel || 1] || LEVELS[1];
  const totalValue = portfolio?.totalValue || 0;
  const startingValue = portfolio?.startingValue || 1;
  const totalGain = totalValue - startingValue;
  const totalGainPercent = ((totalValue - startingValue) / startingValue) * 100;
  const progressToNext = (totalValue / currentLevelConfig.winCondition) * 100;

  const currentLevel = user?.currentLevel || 1;

  const handleTutorialClose = () => {
    dispatch(closeTutorial());
  };

  const handleTutorialComplete = () => {
    dispatch(completeTutorial());
  };

  // Handle loading or error states
  if (!user || !portfolio) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Recent achievements (mock data for demo)
  const recentAchievements = [
    { id: 1, name: 'First Purchase', icon: '🎉', date: 'Today' },
    { id: 2, name: 'Day Trader', icon: '⚡', date: 'Yesterday' }
  ];

  // Level-based quick actions
  const getQuickActionsForLevel = (level) => {
    const baseActions = [
      {
        title: 'Start Trading',
        description: 'Buy and sell stocks',
        icon: ShoppingCart,
        to: '/trading'
      },
      {
        title: 'View Portfolio',
        description: 'Check your investments',
        icon: Briefcase,
        to: '/portfolio'
      },
      {
        title: 'Market Research',
        description: 'Explore stocks',
        icon: TrendingUp,
        to: '/market'
      }
    ];

    // Add level-specific next step
    switch (level) {
      case 1:
        baseActions.unshift({
          title: 'Next: Make Your First Trade',
          description: `${currentLevelConfig.requiredTrades} trades needed to advance`,
          icon: DollarSign,
          onClick: () => dispatch(startTutorial()),
          isNextStep: true,
          isTutorialAction: true
        });
        break;
      case 2:
        baseActions.unshift({
          title: 'Next: Diversify Portfolio',
          description: `Invest in ${currentLevelConfig.requiredStocks} different stocks`,
          icon: BarChart3,
          to: '/market',
          isNextStep: true
        });
        break;
      case 3:
        baseActions.unshift({
          title: 'Next: Learn Risk Management',
          description: 'Use stop-loss orders and limit orders',
          icon: BookOpen,
          to: '/education/risk-management',
          isNextStep: true
        });
        break;
      case 4:
        baseActions.unshift({
          title: 'Next: Try Advanced Trading',
          description: 'Learn short selling and margin trading',
          icon: TrendingDown,
          to: '/education/advanced-strategies',
          isNextStep: true
        });
        break;
      case 5:
        baseActions.unshift({
          title: 'Master Level: Options Trading',
          description: 'Explore options and portfolio optimization',
          icon: GraduationCap,
          to: '/education/advanced-strategies',
          isNextStep: true
        });
        break;
      default:
        // Custom portfolio
        baseActions.unshift({
          title: 'Continue Trading',
          description: 'Build your custom portfolio',
          icon: TrendingUp,
          to: '/trading',
          isNextStep: true
        });
        break;
    }


    return baseActions;
  };

  const quickActions = getQuickActionsForLevel(currentLevel);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-8"
    >
      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
              {formatCurrency(totalValue)}
            </p>
            <p className="text-sm text-gray-500">
              Starting: {formatCurrency(startingValue)}
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
            <div className={`w-4 h-4 ${totalGain >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {totalGain >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            </div>
          </div>
          <div className="space-y-1">
            <p className={`text-2xl font-bold font-mono ${getGainLossColor(totalGain)}`}>
              {totalGainPercent >= 0 ? '+' : ''}{totalGainPercent.toFixed(1)}%
            </p>
            <p className={`text-sm ${getGainLossColor(totalGain)}`}>
              {totalGain >= 0 ? '+' : ''}{formatCurrency(totalGain)}
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
              {currentLevel}/5
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold text-gray-900">
                {currentLevelConfig.name}
              </p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progressToNext, 100)}%` }}
                transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                className="bg-gray-900 h-2 rounded-full"
              ></motion.div>
            </div>
            <p className="text-xs text-gray-500">
              Target: {formatCurrency(currentLevelConfig.winCondition)}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions with Level Timeline */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, ease: "easeOut" }}
        className="card p-6"
      >
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900">Level {currentLevel} Progress</h2>
            <p className="text-sm text-gray-600 mt-1">{currentLevelConfig.description}</p>
          </div>
          <div className="flex flex-col items-center space-y-3 ml-6">
            {[5, 4, 3, 2, 1].map((level, index) => (
              <div key={level} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    level < currentLevel
                      ? 'bg-green-500 text-white'
                      : level === currentLevel
                      ? 'bg-accent text-white ring-4 ring-accent/20 shadow-lg'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {level}
                </div>
                {index < 4 && (
                  <div className={`w-px h-8 ml-5 ${
                    level <= currentLevel ? 'bg-green-500' : 'bg-gray-200'
                  }`} style={{ marginTop: '8px', marginBottom: '-8px' }} />
                )}
              </div>
            ))}
            <div className="text-xs text-gray-500 text-center mt-2">
              Current: Level {currentLevel}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const IconComponent = action.icon;
            const isNextStep = action.isNextStep;
            const isCustomAction = action.isCustomAction;
            const isTutorialAction = action.isTutorialAction;
            
            // Handle tutorial and custom actions with onClick
            if (isCustomAction || isTutorialAction) {
              return (
                <button
                  key={index}
                  onClick={action.onClick}
                  className={`group flex items-center space-x-3 p-4 rounded-lg border transition-all duration-200 ${
                    isNextStep 
                      ? 'border-accent bg-accent/5 hover:bg-accent/10 hover:border-accent' 
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <IconComponent className={`w-5 h-5 ${
                    isNextStep 
                      ? 'text-accent' 
                      : 'text-gray-600 group-hover:text-gray-900'
                  }`} />
                  <div className="flex-1">
                    <p className={`font-medium ${
                      isNextStep ? 'text-accent' : 'text-gray-900'
                    }`}>
                      {action.title}
                    </p>
                    <p className="text-sm text-gray-500">{action.description}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 ml-auto" />
                </button>
              );
            }
            
            return (
              <Link
                key={index}
                to={action.to}
                className={`group flex items-center space-x-3 p-4 rounded-lg border transition-all duration-200 ${
                  isNextStep 
                    ? 'border-accent bg-accent/5 hover:bg-accent/10 hover:border-accent' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <IconComponent className={`w-5 h-5 ${
                  isNextStep 
                    ? 'text-accent' 
                    : 'text-gray-600 group-hover:text-gray-900'
                }`} />
                <div className="flex-1">
                  <p className={`font-medium ${
                    isNextStep ? 'text-accent' : 'text-gray-900'
                  }`}>
                    {action.title}
                  </p>
                  <p className="text-sm text-gray-500">{action.description}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 ml-auto" />
              </Link>
            );
          })}
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
    </motion.div>
  );
};

export default Dashboard;