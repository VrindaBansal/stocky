import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { User, Award, TrendingUp, Target, Settings } from 'lucide-react';
import { formatCurrency } from '../utils/helpers.js';

const Profile = () => {
  const user = useSelector(state => state.user);
  const portfolios = useSelector(state => state.portfolio.portfolios);

  const achievements = [
    { id: 1, name: 'First Purchase', icon: '🎉', earned: true, date: 'Dec 15, 2024' },
    { id: 2, name: 'Day Trader', icon: '⚡', earned: true, date: 'Dec 16, 2024' },
    { id: 3, name: 'Diversified', icon: '🌟', earned: false, date: null },
    { id: 4, name: 'Risk Manager', icon: '🛡️', earned: false, date: null },
  ];

  const levelProgress = [
    { level: 1, name: 'Paper Trader', completed: true, performance: 25.5 },
    { level: 2, name: 'Market Explorer', completed: false, performance: 0 },
    { level: 3, name: 'Strategic Investor', completed: false, performance: 0 },
    { level: 4, name: 'Advanced Trader', completed: false, performance: 0 },
    { level: 5, name: 'Portfolio Master', completed: false, performance: 0 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center space-x-3">
        <User className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold gradient-text">Profile</h1>
          <p className="text-gray-600">Your trading journey and achievements</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="lg:col-span-1 space-y-6"
        >
          {/* User Card */}
          <div className="card p-6 text-center">
            <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl text-white font-bold">
                {user.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">{user.username}</h2>
            <p className="text-gray-600 mb-4">Level {user.currentLevel} Trader</p>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Total Points</span>
                <span className="font-semibold">{user.totalPoints.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Trades</span>
                <span className="font-semibold">{user.stats.totalTrades}</span>
              </div>
              <div className="flex justify-between">
                <span>Success Rate</span>
                <span className="font-semibold">
                  {user.stats.totalTrades > 0 
                    ? Math.round((user.stats.successfulTrades / user.stats.totalTrades) * 100)
                    : 0}%
                </span>
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="card p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Settings className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-800">Settings</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Sound Effects</span>
                <div className="w-12 h-6 bg-primary rounded-full flex items-center justify-end px-1">
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Animations</span>
                <div className="w-12 h-6 bg-primary rounded-full flex items-center justify-end px-1">
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Notifications</span>
                <div className="w-12 h-6 bg-gray-300 rounded-full flex items-center justify-start px-1">
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Level Progress */}
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="card p-6"
          >
            <div className="flex items-center space-x-2 mb-6">
              <Target className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold text-gray-900">Level Progress</h2>
            </div>

            <div className="space-y-4">
              {levelProgress.map((level, index) => (
                <motion.div
                  key={level.level}
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className={`flex items-center justify-between p-4 rounded-xl ${
                    level.completed ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      level.completed ? 'bg-green-500' : user.currentLevel === level.level ? 'bg-primary' : 'bg-gray-300'
                    }`}>
                      {level.completed ? (
                        <span className="text-white text-sm">✓</span>
                      ) : (
                        <span className="text-white text-sm font-bold">{level.level}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Level {level.level}: {level.name}</h3>
                      {level.completed && (
                        <p className="text-sm text-green-600">
                          Performance: +{level.performance.toFixed(1)}%
                        </p>
                      )}
                      {user.currentLevel === level.level && !level.completed && (
                        <p className="text-sm text-primary">Currently Active</p>
                      )}
                    </div>
                  </div>
                  
                  {level.completed && (
                    <Award className="w-5 h-5 text-green-500" />
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="card p-6"
          >
            <div className="flex items-center space-x-2 mb-6">
              <Award className="w-6 h-6 text-accent" />
              <h2 className="text-xl font-bold text-gray-900">Achievements</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    achievement.earned 
                      ? 'border-green-300 bg-gradient-to-r from-green-50 to-gray-50' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <h3 className={`font-semibold ${
                        achievement.earned ? 'text-gray-800' : 'text-gray-500'
                      }`}>
                        {achievement.name}
                      </h3>
                      {achievement.earned && achievement.date && (
                        <p className="text-xs text-gray-600">Earned: {achievement.date}</p>
                      )}
                    </div>
                    {achievement.earned && (
                      <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Statistics */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="card p-6"
          >
            <div className="flex items-center space-x-2 mb-6">
              <TrendingUp className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-bold text-gray-900">Trading Statistics</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <p className="text-2xl font-bold text-green-600">{user.stats.successfulTrades}</p>
                <p className="text-sm text-gray-600">Profitable Trades</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <p className="text-2xl font-bold text-blue-600">{user.stats.longestStreak}</p>
                <p className="text-sm text-gray-600">Best Streak</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <p className="text-2xl font-bold text-purple-600">{user.stats.daysActive}</p>
                <p className="text-sm text-gray-600">Days Active</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-xl">
                <p className="text-2xl font-bold text-orange-600">
                  {formatCurrency(user.stats.totalReturn)}
                </p>
                <p className="text-sm text-gray-600">Total Return</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;