import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Target, Award, TrendingUp, X, CheckCircle } from 'lucide-react';

const Education = () => {
  const [selectedLesson, setSelectedLesson] = useState(null);
  
  const lessons = [
    {
      id: 1,
      title: 'What is a Stock?',
      description: 'Learn the basics of stock ownership and how companies raise capital',
      difficulty: 'Beginner',
      duration: '10 min',
      completed: true,
      icon: '📚',
      content: `
        <h2>What is a Stock?</h2>
        <h3>Learn the basics of stock ownership and how companies raise capital</h3>
        
        <p>A stock represents a share in the ownership of a company and constitutes a claim on part of the company's assets and earnings. By purchasing a stock, investors become part-owners of a business.</p>
        
        <h3>Why Do Companies Issue Stocks?</h3>
        <p>Companies issue stocks to raise capital. This funding helps them expand operations, invest in research, hire talent, or pay off debt. When a company goes public via an Initial Public Offering (IPO), it sells shares to the public.</p>
        
        <h3>Types of Stocks</h3>
        <ul>
          <li><strong>Common Stock:</strong> Comes with voting rights and potential dividends.</li>
          <li><strong>Preferred Stock:</strong> Usually no voting rights, but prioritized for dividends.</li>
        </ul>
        
        <h3>How Do Investors Benefit?</h3>
        <ul>
          <li><strong>Capital Appreciation:</strong> When the stock's value increases.</li>
          <li><strong>Dividends:</strong> Periodic payments made to shareholders from profits.</li>
        </ul>
        
        <h3>Conclusion</h3>
        <p>Stocks are essential tools for companies to raise funds and for individuals to build wealth. Understanding stock basics is the first step in your investment journey.</p>
      `
    },
    {
      id: 2,
      title: 'How Stock Markets Work',
      description: 'Understand how stocks are traded and what affects their prices',
      difficulty: 'Beginner',
      duration: '15 min',
      completed: true,
      icon: '🏢',
      content: `
        <h2>How Stock Markets Work</h2>
        <h3>Understand how stocks are traded and what affects their prices</h3>
        
        <p>The stock market is a network of exchanges where shares are bought and sold. It provides liquidity, transparency, and a mechanism for companies to raise capital.</p>
        
        <h3>Key Market Components</h3>
        <ul>
          <li><strong>Stock Exchanges:</strong> NYSE, NASDAQ, etc.</li>
          <li><strong>Brokerages:</strong> Platforms that execute trades for investors.</li>
          <li><strong>Market Makers:</strong> Entities that facilitate trading by maintaining buy/sell quotes.</li>
        </ul>
        
        <h3>Trading Mechanism</h3>
        <ol>
          <li>Investors place orders via brokers.</li>
          <li>Orders are matched electronically.</li>
          <li>Trades are executed, cleared, and settled.</li>
        </ol>
        
        <h3>What Influences Stock Prices?</h3>
        <ul>
          <li><strong>Company Performance</strong> (earnings, leadership)</li>
          <li><strong>Macroeconomic Data</strong> (inflation, interest rates)</li>
          <li><strong>Market Sentiment</strong> (news, global events)</li>
          <li><strong>Supply and Demand</strong></li>
        </ul>
        
        <h3>Conclusion</h3>
        <p>Markets provide a structure for stock trading. Learning how they function helps you navigate them confidently and make informed decisions.</p>
      `
    },
    {
      id: 3,
      title: 'Reading Stock Charts',
      description: 'Master the art of technical analysis and chart patterns',
      difficulty: 'Intermediate',
      duration: '20 min',
      completed: false,
      icon: '📈',
      content: `
        <h2>Reading Stock Charts</h2>
        <h3>Master the art of technical analysis and chart patterns</h3>
        
        <p>Reading stock charts is a key part of technical analysis. It allows traders to understand market behavior, spot patterns, and make educated guesses about future price movements.</p>
        
        <h3>Types of Charts</h3>
        <ul>
          <li><strong>Line Chart:</strong> Simplest, showing closing prices over time.</li>
          <li><strong>Bar Chart:</strong> Adds highs and lows.</li>
          <li><strong>Candlestick Chart:</strong> Most popular; shows open, high, low, and close.</li>
        </ul>
        
        <h3>Important Patterns to Know</h3>
        <ul>
          <li><strong>Head and Shoulders:</strong> Potential reversal pattern.</li>
          <li><strong>Double Top/Bottom:</strong> Reversal indicators.</li>
          <li><strong>Triangles (Ascending/Descending/Symmetric):</strong> Continuation patterns.</li>
        </ul>
        
        <h3>Technical Indicators</h3>
        <ul>
          <li><strong>Moving Averages</strong> (e.g. 50-day, 200-day)</li>
          <li><strong>RSI (Relative Strength Index):</strong> Measures momentum.</li>
          <li><strong>MACD (Moving Average Convergence Divergence):</strong> Trend-following indicator.</li>
        </ul>
        
        <h3>Conclusion</h3>
        <p>Learning to read charts empowers traders to make better decisions. With practice, you'll begin to see the market's story unfold visually.</p>
      `
    },
    {
      id: 4,
      title: 'Risk Management',
      description: 'Learn how to manage risk and protect your investments',
      difficulty: 'Intermediate',
      duration: '18 min',
      completed: false,
      icon: '🛡️',
      content: `
        <h2>Risk Management</h2>
        <h3>Learn how to manage risk and protect your investments</h3>
        
        <p>Risk management is the cornerstone of sustainable investing. Even the best strategies fail without proper risk controls.</p>
        
        <h3>Common Risks in Trading</h3>
        <ul>
          <li><strong>Market Risk:</strong> Price movement.</li>
          <li><strong>Liquidity Risk:</strong> Inability to exit positions.</li>
          <li><strong>Emotional Risk:</strong> Fear and greed-driven decisions.</li>
        </ul>
        
        <h3>Key Strategies</h3>
        <ul>
          <li><strong>Stop-Loss Orders:</strong> Automatically sell at a set price to limit loss.</li>
          <li><strong>Position Sizing:</strong> Allocate only a percentage of your capital.</li>
          <li><strong>Diversification:</strong> Spread investments to reduce exposure.</li>
        </ul>
        
        <h3>Risk-Reward Ratio</h3>
        <p>Always assess how much you're willing to lose versus how much you can gain. A 1:3 ratio is common—risking $1 to potentially gain $3.</p>
        
        <h3>Conclusion</h3>
        <p>Managing risk isn't about avoiding losses entirely but limiting them. A disciplined approach ensures long-term success.</p>
      `
    },
    {
      id: 5,
      title: 'Short Selling Basics',
      description: 'Understand how to profit when stock prices fall',
      difficulty: 'Advanced',
      duration: '25 min',
      completed: false,
      icon: '📉',
      content: `
        <h2>Short Selling Basics</h2>
        <h3>Understand how to profit when stock prices fall</h3>
        
        <p>Short selling is a strategy where traders bet against a stock. If the stock price falls, they profit. It's risky but can be profitable when used wisely.</p>
        
        <h3>How It Works</h3>
        <ol>
          <li>You borrow shares from a broker.</li>
          <li>Sell them at the current market price.</li>
          <li>If the stock drops, buy back at a lower price and return the shares.</li>
          <li>Your profit = Sell Price - Buy Price - Fees.</li>
        </ol>
        
        <h3>Risks of Short Selling</h3>
        <ul>
          <li><strong>Unlimited Loss Potential:</strong> If the stock rises, losses can be infinite.</li>
          <li><strong>Short Squeezes:</strong> Rapid price increases force shorts to buy back, increasing prices further.</li>
          <li><strong>Margin Requirements:</strong> Brokers require collateral.</li>
        </ul>
        
        <h3>When Is Shorting Used?</h3>
        <ul>
          <li>During market corrections.</li>
          <li>On overvalued stocks.</li>
          <li>As a hedge for long positions.</li>
        </ul>
        
        <h3>Conclusion</h3>
        <p>Short selling offers opportunities but requires precision and risk control. It's a powerful tool in experienced hands.</p>
      `
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center space-x-3">
        <BookOpen className="w-8 h-8 text-purple-600" />
        <div>
          <h1 className="text-3xl font-bold gradient-text">Education Center</h1>
          <p className="text-gray-600">Learn the fundamentals of stock investing</p>
        </div>
      </div>

      {/* Progress Overview */}
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="card p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Award className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-800">Lessons Completed</h3>
            <p className="text-2xl font-bold text-green-600">2 / 5</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Target className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-800">Knowledge Level</h3>
            <p className="text-2xl font-bold text-blue-600">Beginner</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-800">Study Streak</h3>
            <p className="text-2xl font-bold text-purple-600">3 days</p>
          </div>
        </div>
      </motion.div>

      {/* Lessons Grid */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {lessons.map((lesson, index) => (
          <motion.div
            key={lesson.id}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            onClick={() => setSelectedLesson(lesson)}
            className={`card p-6 cursor-pointer transition-all duration-300 ${
              lesson.completed 
                ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-200' 
                : 'hover:shadow-lg'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="text-3xl">{lesson.icon}</div>
              {lesson.completed && (
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </div>
            
            <h3 className="font-bold text-gray-800 mb-2">{lesson.title}</h3>
            <p className="text-gray-600 text-sm mb-4">{lesson.description}</p>
            
            <div className="flex items-center justify-between text-xs">
              <span className={`px-2 py-1 rounded-full font-medium ${
                lesson.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                lesson.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {lesson.difficulty}
              </span>
              <span className="text-gray-500">{lesson.duration}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Learning Tip */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="card p-6 bg-gradient-to-r from-purple-50 to-green-50"
      >
        <div className="flex items-start space-x-4">
          <div className="text-3xl">💡</div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Pro Tip</h3>
            <p className="text-gray-600">
              Complete lessons in order to build a strong foundation. Each lesson builds upon the previous one,
              ensuring you have all the knowledge needed for successful trading.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Lesson Modal */}
      <AnimatePresence>
        {selectedLesson && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="text-4xl">{selectedLesson.icon}</div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedLesson.title}
                    </h2>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      <span className={`px-2 py-1 rounded-full font-medium ${
                        selectedLesson.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                        selectedLesson.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {selectedLesson.difficulty}
                      </span>
                      <span>{selectedLesson.duration}</span>
                      {selectedLesson.completed && (
                        <span className="flex items-center space-x-1 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span>Completed</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedLesson(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div 
                className="prose prose-gray max-w-none"
                dangerouslySetInnerHTML={{ __html: selectedLesson.content || 
                  `<h2>${selectedLesson.title}</h2>
                   <p>${selectedLesson.description}</p>
                   <p>This lesson content is coming soon! Check back later for detailed educational materials.</p>` 
                }}
              />

              {/* Footer */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setSelectedLesson(null)}
                  className="btn-secondary"
                >
                  Close
                </button>
                {!selectedLesson.completed && (
                  <button
                    onClick={() => {
                      // Mark lesson as completed (in real app, this would update state/database)
                      selectedLesson.completed = true;
                      setSelectedLesson(null);
                    }}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Mark as Complete</span>
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Education;