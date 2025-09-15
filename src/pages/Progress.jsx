import React from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Target, 
  TrendingUp, 
  Clock, 
  Star, 
  Award, 
  BarChart3, 
  CheckCircle, 
  Lock,
  Zap,
  Brain,
  Shield,
  Rocket,
  Crown
} from 'lucide-react';
import { formatCurrency, formatPercentage } from '../utils/helpers.js';
import { LEVELS, ACHIEVEMENTS } from '../utils/constants.js';

const Progress = () => {
  const { currentLevel, levelsCompleted, objectives, achievements } = useSelector(state => state.game);
  const { activePortfolio } = useSelector(state => state.portfolio);
  const { username, totalPoints } = useSelector(state => state.user);

  const currentLevelConfig = LEVELS[currentLevel];
  const portfolioValue = activePortfolio?.totalValue || 0;
  const startingValue = currentLevelConfig?.startingCapital || 0;
  const currentReturn = startingValue > 0 ? ((portfolioValue - startingValue) / startingValue) * 100 : 0;

  // Calculate overall progress
  const totalLevels = Object.keys(LEVELS).length;
  const completedLevels = levelsCompleted.length;
  const overallProgress = (completedLevels / totalLevels) * 100;

  // Achievement statistics
  const totalAchievements = Object.keys(ACHIEVEMENTS).length;
  const earnedAchievements = achievements.badges?.length || 0;
  const achievementProgress = (earnedAchievements / totalAchievements) * 100;

  const levelIcons = {
    1: '📝',
    2: '🔍', 
    3: '🎯',
    4: '🚀',
    5: '👑'
  };

  const levelColors = {
    1: 'from-green-400 to-green-600',
    2: 'from-blue-400 to-blue-600',
    3: 'from-purple-400 to-purple-600',
    4: 'from-orange-400 to-orange-600',
    5: 'from-yellow-400 to-yellow-600'
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Your Trading Journey
          </h1>
          <p className="text-xl text-gray-600">
            Welcome back, {username}! Track your progress and achievements.
          </p>
        </motion.div>

        {/* Current Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Trophy className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">Level {currentLevel}</div>
            <div className="text-sm text-gray-600">{currentLevelConfig?.name}</div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(portfolioValue)}</div>
            <div className="text-sm text-gray-600">Portfolio Value</div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{totalPoints.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Points</div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <BarChart3 className="w-6 h-6 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {currentReturn >= 0 ? '+' : ''}{formatPercentage(currentReturn)}
            </div>
            <div className="text-sm text-gray-600">Current Return</div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Level Progress */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl border border-gray-200 p-6 mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Trophy className="w-6 h-6 mr-2 text-yellow-500" />
                Level Progress ({completedLevels}/{totalLevels})
              </h2>

              <div className="space-y-4">
                {Object.entries(LEVELS).map(([level, config]) => {
                  const levelNum = parseInt(level);
                  const isCompleted = levelsCompleted.some(l => l.level === levelNum);
                  const isCurrent = levelNum === currentLevel;
                  const isLocked = levelNum > currentLevel && !isCompleted;

                  return (
                    <div
                      key={level}
                      className={`relative p-4 rounded-xl border transition-all ${
                        isCompleted 
                          ? 'bg-green-50 border-green-200' 
                          : isCurrent 
                            ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-500' 
                            : isLocked
                              ? 'bg-gray-50 border-gray-200 opacity-60'
                              : 'bg-white border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white bg-gradient-to-r ${levelColors[levelNum]}`}>
                            {isCompleted ? (
                              <CheckCircle className="w-6 h-6" />
                            ) : isLocked ? (
                              <Lock className="w-6 h-6" />
                            ) : (
                              <span className="text-xl">{levelIcons[levelNum]}</span>
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              Level {level}: {config.name}
                            </h3>
                            <p className="text-sm text-gray-600">{config.description}</p>
                            <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                              <span>💰 Start: {formatCurrency(config.startingCapital)}</span>
                              <span>🎯 Target: {formatCurrency(config.winCondition)}</span>
                              <span>📈 Gain: {((config.winCondition - config.startingCapital) / config.startingCapital * 100).toFixed(0)}%</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          {isCompleted && (
                            <div className="text-green-600 font-semibold">
                              ✅ Completed
                            </div>
                          )}
                          {isCurrent && (
                            <div className="text-blue-600 font-semibold">
                              🎮 Current Level
                            </div>
                          )}
                          {isLocked && (
                            <div className="text-gray-400 font-semibold">
                              🔒 Locked
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Current level progress */}
                      {isCurrent && objectives.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <h4 className="font-medium text-gray-900 mb-2">Current Objectives:</h4>
                          <div className="space-y-2">
                            {objectives.map((objective) => (
                              <div key={objective.id} className="flex items-center justify-between text-sm">
                                <span className="text-gray-700">{objective.description}</span>
                                <div className="flex items-center space-x-2">
                                  <div className="w-24 bg-gray-200 rounded-full h-2">
                                    <div 
                                      className="bg-blue-600 h-2 rounded-full transition-all"
                                      style={{ width: `${Math.min((objective.progress / objective.target) * 100, 100)}%` }}
                                    />
                                  </div>
                                  <span className={`font-medium ${objective.completed ? 'text-green-600' : 'text-gray-600'}`}>
                                    {objective.completed ? '✓' : `${objective.progress}/${objective.target}`}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl border border-gray-200 p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Award className="w-6 h-6 mr-2 text-purple-500" />
                Achievements ({earnedAchievements}/{totalAchievements})
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.values(ACHIEVEMENTS).map((achievement) => {
                  const isEarned = achievements.badges?.some(badge => badge.id === achievement.id);
                  
                  return (
                    <div
                      key={achievement.id}
                      className={`p-4 rounded-lg border transition-all ${
                        isEarned 
                          ? 'bg-purple-50 border-purple-200' 
                          : 'bg-gray-50 border-gray-200 opacity-60'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{achievement.icon}</span>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {achievement.name}
                            {isEarned && <span className="text-purple-600 ml-2">✓</span>}
                          </h3>
                          <p className="text-sm text-gray-600">{achievement.description}</p>
                          <div className="text-xs text-purple-600 font-medium">
                            {achievement.points} points
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-6">
            {/* Overall Progress */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl border border-gray-200 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Overall Progress</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Level Completion</span>
                    <span>{completedLevels}/{totalLevels}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                      style={{ width: `${overallProgress}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Achievements</span>
                    <span>{earnedAchievements}/{totalAchievements}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                      style={{ width: `${achievementProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl border border-gray-200 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Trading Stats</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Trades</span>
                  <span className="font-semibold">{activePortfolio?.transactions?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Holdings</span>
                  <span className="font-semibold">{activePortfolio?.positions?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Available Cash</span>
                  <span className="font-semibold">{formatCurrency(activePortfolio?.cash || 0)}</span>
                </div>
              </div>
            </motion.div>

            {/* Next Milestone */}
            {currentLevel < 5 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-blue-600" />
                  Next Milestone
                </h3>
                
                <div className="text-center">
                  <div className="text-2xl mb-2">{levelIcons[currentLevel + 1]}</div>
                  <h4 className="font-semibold text-gray-900">
                    Level {currentLevel + 1}: {LEVELS[currentLevel + 1]?.name}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Target: {formatCurrency(LEVELS[currentLevel + 1]?.winCondition)}
                  </p>
                  <div className="mt-3">
                    <div className="text-xs text-gray-500 mb-1">
                      {formatCurrency(portfolioValue)} / {formatCurrency(currentLevelConfig?.winCondition)}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                        style={{ 
                          width: `${Math.min((portfolioValue / currentLevelConfig?.winCondition) * 100, 100)}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;