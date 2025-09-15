import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { registerUser, createUser, completeOnboarding } from '../store/slices/userSlice.js';
import { initializePortfolios } from '../store/slices/portfolioSlice.js';
import { 
  TrendingUp, 
  Target, 
  Award, 
  DollarSign, 
  ArrowRight, 
  Play,
  BookOpen,
  ShieldCheck,
  User,
  TrendingDown,
  Rocket,
  Diamond,
  BarChart3
} from 'lucide-react';

const Onboarding = () => {
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState(0);
  const [username, setUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('default');

  const avatars = [
    { id: 'default', name: 'Classic', color: 'bg-gray-500', icon: User },
    { id: 'bull', name: 'Bull', color: 'bg-green-500', icon: TrendingUp },
    { id: 'bear', name: 'Bear', color: 'bg-red-500', icon: TrendingDown },
    { id: 'rocket', name: 'Rocket', color: 'bg-blue-500', icon: Rocket },
    { id: 'diamond', name: 'Diamond', color: 'bg-purple-500', icon: Diamond },
    { id: 'chart', name: 'Trending', color: 'bg-orange-500', icon: BarChart3 }
  ];

  const steps = [
    {
      title: 'Get Started',
      subtitle: 'Master the art of stock investing through interactive gameplay',
      content: (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-6"
        >
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0] 
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut" 
            }}
            className="mx-auto w-24 h-24 bg-gradient-primary rounded-2xl flex items-center justify-center"
          >
            <DollarSign className="w-12 h-12 text-white" />
          </motion.div>
          
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">Start Your Journey</h1>
            <p className="text-xl text-gray-600">
              Learn stock investing through fun, interactive gameplay
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="card p-4 text-center"
            >
              <BookOpen className="w-8 h-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Learn</h3>
              <p className="text-sm text-gray-600">Master investing concepts</p>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="card p-4 text-center"
            >
              <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Practice</h3>
              <p className="text-sm text-gray-600">Trade with virtual money</p>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="card p-4 text-center"
            >
              <Award className="w-8 h-8 text-accent mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Achieve</h3>
              <p className="text-sm text-gray-600">Unlock levels & badges</p>
            </motion.div>
          </div>
        </motion.div>
      )
    },
    {
      title: 'Create Your Profile',
      subtitle: 'Choose your trading persona',
      content: (
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="space-y-6"
        >
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              What should we call you?
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="input-field"
              maxLength={20}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-4">
              Pick your avatar
            </label>
            <div className="grid grid-cols-3 gap-3">
              {avatars.map((avatar) => (
                <motion.button
                  key={avatar.id}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedAvatar(avatar.id)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedAvatar === avatar.id
                      ? 'border-gray-900 bg-gray-50'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <div className={`w-8 h-8 ${avatar.color} rounded-lg mx-auto mb-2 flex items-center justify-center`}>
                    <avatar.icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-sm font-medium">{avatar.name}</div>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      )
    },
    {
      title: 'How It Works',
      subtitle: 'Your journey through 5 exciting levels',
      content: (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="space-y-6"
        >
          <div className="grid gap-4">
            {[
              { level: 1, title: 'Paper Trader', desc: 'Learn basics with $200', icon: '📝' },
              { level: 2, title: 'Market Explorer', desc: 'Explore sectors with $500', icon: '🔍' },
              { level: 3, title: 'Strategic Investor', desc: 'Master orders with $1,000', icon: '🎯' },
              { level: 4, title: 'Advanced Trader', desc: 'Short selling with $5,000', icon: '🚀' },
              { level: 5, title: 'Portfolio Master', desc: 'Options trading with $10,000', icon: '👑' }
            ].map((level, index) => (
              <motion.div
                key={level.level}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-green-50 rounded-xl"
              >
                <div className="text-2xl">{level.icon}</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    Level {level.level}: {level.title}
                  </h3>
                  <p className="text-sm text-gray-600">{level.desc}</p>
                </div>
                <Target className="w-5 h-5 text-primary" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )
    },
    {
      title: 'Safety First!',
      subtitle: 'Important disclaimers',
      content: (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="space-y-6"
        >
          <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border border-orange-200">
            <div className="flex items-start space-x-3">
              <ShieldCheck className="w-6 h-6 text-orange-600 mt-1" />
              <div className="space-y-3">
                <h3 className="font-semibold text-orange-800">Educational Purpose Only</h3>
                <ul className="space-y-2 text-sm text-orange-700">
                  <li>• This is a simulation using virtual money only</li>
                  <li>• No real money is involved in any transactions</li>
                  <li>• Market data may be delayed or simulated</li>
                  <li>• Not real investment advice</li>
                  <li>• Always consult financial professionals for real investing</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="text-center">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block text-4xl mb-4"
            >
              🎮
            </motion.div>
            <p className="text-gray-600">
              Ready to start your stock market adventure?
            </p>
          </div>
        </motion.div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStart = async () => {
    if (username.trim()) {
      try {
        // Try backend registration first
        console.log('Attempting backend registration...');
        await dispatch(registerUser({ 
          username: username.trim(), 
          avatar: selectedAvatar,
          email: `${username.trim()}@example.com`,
          password: 'temp123'
        })).unwrap();
        
        console.log('✅ Backend registration successful');
        dispatch(initializePortfolios({ currentLevel: 1 }));
        dispatch(completeOnboarding());
      } catch (error) {
        console.warn('❌ Backend registration failed, using localStorage:', error.message);
        // Fallback to localStorage if API fails
        dispatch(createUser({ username: username.trim(), avatar: selectedAvatar }));
        dispatch(initializePortfolios({ currentLevel: 1 }));
        dispatch(completeOnboarding());
      }
    }
  };

  const canProceed = () => {
    if (currentStep === 1) {
      return username.trim().length >= 2;
    }
    return true;
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-gray-100/50 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-green-100/50 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative max-w-4xl w-full"
      >
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm font-medium text-primary">
              {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              className="bg-gradient-primary h-2 rounded-full"
              transition={{ duration: 0.5 }}
            ></motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12 border border-gray-100">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                  {steps[currentStep].title}
                </h1>
                <p className="text-lg text-gray-600">
                  {steps[currentStep].subtitle}
                </p>
              </div>

              <div className="mb-8">
                {steps[currentStep].content}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={`btn-secondary ${
                currentStep === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Previous
            </motion.button>

            <div className="flex space-x-2">
              {steps.map((_, index) => (
                <motion.div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentStep ? 'bg-primary' : 'bg-gray-300'
                  }`}
                  animate={{
                    scale: index === currentStep ? 1.2 : 1,
                  }}
                />
              ))}
            </div>

            {currentStep < steps.length - 1 ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                disabled={!canProceed()}
                className={`btn-primary flex items-center space-x-2 ${
                  !canProceed() ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStart}
                disabled={!canProceed()}
                className={`btn-accent flex items-center space-x-2 ${
                  !canProceed() ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <Play className="w-4 h-4" />
                <span>Start Trading!</span>
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Onboarding;