import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ArrowRight, 
  Play, 
  FastForward, 
  TrendingUp, 
  DollarSign, 
  Clock,
  CheckCircle,
  AlertCircle,
  Target,
  Pause
} from 'lucide-react';
import stockService from '../../services/stockService.js';
import StockChart from '../charts/StockChart.jsx';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const TutorialOverlay = ({ isOpen, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedStock, setSelectedStock] = useState('AAPL');
  const [shares, setShares] = useState(0.5);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [simulatedPrice, setSimulatedPrice] = useState(0);
  const [initialPrice, setInitialPrice] = useState(0);
  const [daysPassed, setDaysPassed] = useState(0);
  const [stockPrices, setStockPrices] = useState({});
  const [isLoadingPrices, setIsLoadingPrices] = useState(true);
  const [simulationData, setSimulationData] = useState([]);

  // Tutorial stocks with educational information
  const tutorialStocks = [
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      sector: 'Technology',
      pros: [
        'Strong brand loyalty and ecosystem',
        'Consistent revenue from iPhone sales',
        'Growing services business (App Store, iCloud)',
        'Strong financial position with cash reserves'
      ],
      cons: [
        'Heavy dependence on iPhone sales',
        'High valuation compared to competitors',
        'Slowing growth in mature markets',
        'Regulatory scrutiny over App Store policies'
      ],
      riskLevel: 'Medium',
      beginner: true
    },
    {
      symbol: 'KO',
      name: 'The Coca-Cola Company',
      sector: 'Consumer Staples',
      pros: [
        'Global brand recognition and distribution',
        'Stable dividend payments for decades',
        'Recession-resistant consumer staples',
        'Strong cash flow generation'
      ],
      cons: [
        'Limited growth potential in mature markets',
        'Health trends moving away from sugary drinks',
        'Currency exchange risks from global operations',
        'Slow adaptation to changing consumer preferences'
      ],
      riskLevel: 'Low',
      beginner: true
    },
    {
      symbol: 'TSLA',
      name: 'Tesla, Inc.',
      sector: 'Automotive/Technology',
      pros: [
        'Leader in electric vehicle technology',
        'Growing energy storage and solar business',
        'Strong brand and CEO influence',
        'Expanding global manufacturing capacity'
      ],
      cons: [
        'High volatility and unpredictable price swings',
        'Increasing competition in EV market',
        'Dependent on CEO Elon Musk',
        'Production and delivery challenges'
      ],
      riskLevel: 'High',
      beginner: false
    }
  ];

  // Load real stock prices and historical data
  useEffect(() => {
    const loadStockPrices = async () => {
      setIsLoadingPrices(true);
      const prices = {};
      
      for (const stockInfo of tutorialStocks) {
        try {
          const quote = await stockService.getQuote(stockInfo.symbol);
          const historicalData = await stockService.getHistoricalData(stockInfo.symbol, '3M');
          
          prices[stockInfo.symbol] = {
            ...stockInfo,
            price: quote?.price || 150,
            change: quote?.change || 0,
            changePercent: quote?.changePercent || 0,
            historicalData: historicalData || []
          };
        } catch (error) {
          console.error(`Error loading ${stockInfo.symbol}:`, error);
          prices[stockInfo.symbol] = {
            ...stockInfo,
            price: 150,
            change: 0,
            changePercent: 0,
            historicalData: []
          };
        }
      }
      
      setStockPrices(prices);
      const selectedStockData = prices[selectedStock] || prices['AAPL'];
      setSimulatedPrice(selectedStockData.price);
      setInitialPrice(selectedStockData.price);
      
      // Initialize simulation data
      setSimulationData([{
        date: new Date().toISOString().split('T')[0],
        price: selectedStockData.price,
        day: 0
      }]);
      
      setIsLoadingPrices(false);
    };

    if (isOpen) {
      loadStockPrices();
    }
  }, [isOpen]);

  const tutorialSteps = [
    {
      title: "Welcome to Your First Trade! 🎉",
      content: (
        <div className="space-y-4">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mb-4">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
            <p className="text-lg text-gray-700">
              Let's walk through your first stock purchase step-by-step. 
              You'll learn how to research, buy, and track a stock's performance over time.
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-800">Tutorial Mode</h4>
                <p className="text-sm text-blue-600">
                  This is a simulation using your virtual $200. No real money is involved.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Choose Your First Stock 📈",
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-lg text-gray-700 mb-2">
              Choose your first stock investment from these 3 carefully selected options:
            </p>
            <p className="text-sm text-gray-500">
              Each has different risk levels and characteristics to help you learn
            </p>
          </div>
          
          {isLoadingPrices ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Loading real stock data and charts...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(stockPrices).map(([symbol, data]) => (
                <motion.div
                  key={symbol}
                  whileHover={{ scale: 1.01 }}
                  className={`border-2 rounded-xl overflow-hidden transition-all cursor-pointer ${
                    selectedStock === symbol
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    setSelectedStock(symbol);
                    setSimulatedPrice(data.price);
                    setInitialPrice(data.price);
                    setShares(Math.min(0.5, 200 / data.price));
                    setSimulationData([{
                      date: new Date().toISOString().split('T')[0],
                      price: data.price,
                      day: 0
                    }]);
                  }}
                >
                  {/* Stock Header */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold ${
                          data.riskLevel === 'Low' ? 'bg-green-500' :
                          data.riskLevel === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}>
                          {symbol}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">{data.name}</h3>
                          <p className="text-sm text-gray-600">{data.sector}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              data.riskLevel === 'Low' ? 'bg-green-100 text-green-800' :
                              data.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {data.riskLevel} Risk
                            </span>
                            {data.beginner && (
                              <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                                Beginner Friendly
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-bold text-xl text-gray-900">
                          ${data.price.toFixed(2)}
                        </div>
                        <div className={`text-sm font-medium ${
                          data.change >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {data.change >= 0 ? '+' : ''}{data.change.toFixed(2)} 
                          ({data.changePercent >= 0 ? '+' : ''}{data.changePercent.toFixed(2)}%)
                        </div>
                      </div>
                    </div>

                    {/* 3-Month Chart */}
                    <div className="bg-white rounded-lg border border-gray-100 p-3">
                      <div className="text-xs text-gray-500 mb-2">3-Month Performance</div>
                      {data.historicalData && data.historicalData.length > 0 ? (
                        <StockChart 
                          symbol={symbol} 
                          height={120} 
                          showControls={false}
                        />
                      ) : (
                        <div className="h-20 bg-gray-50 rounded flex items-center justify-center">
                          <span className="text-xs text-gray-400">Chart loading...</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Pros and Cons */}
                  <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-green-700 mb-2 flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                          Pros
                        </h4>
                        <ul className="space-y-1">
                          {data.pros.slice(0, 2).map((pro, idx) => (
                            <li key={idx} className="text-xs text-gray-600 flex items-start">
                              <span className="w-1 h-1 bg-green-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                              {pro}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-red-700 mb-2 flex items-center">
                          <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                          Cons
                        </h4>
                        <ul className="space-y-1">
                          {data.cons.slice(0, 2).map((con, idx) => (
                            <li key={idx} className="text-xs text-gray-600 flex items-start">
                              <span className="w-1 h-1 bg-red-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                              {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          
          {selectedStock && stockPrices[selectedStock] && (
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-800">You selected {selectedStock}</h4>
                  <p className="text-sm text-blue-600">
                    {stockPrices[selectedStock].beginner 
                      ? "Great choice for a beginner! This stock has stable characteristics."
                      : "This is a more volatile option - good for learning about risk management."
                    }
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )
    },
    {
      title: "Decide How Many Shares 📊",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            Now let's decide how many shares of {selectedStock} to buy. 
            Remember, you have $200 to start with and can buy fractional shares (minimum 0.1).
          </p>
          
          <div className="bg-gray-50 p-4 rounded-xl">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Stock Price:</span>
                <span className="font-mono font-bold ml-2">${stockPrices[selectedStock]?.price.toFixed(2) || '0.00'}</span>
              </div>
              <div>
                <span className="text-gray-600">Available Cash:</span>
                <span className="font-mono font-bold ml-2 text-green-600">$200.00</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Number of Shares (Fractional Allowed)
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="number"
                min="0.1"
                max={200 / (stockPrices[selectedStock]?.price || 1)}
                step="0.1"
                value={shares}
                onChange={(e) => setShares(parseFloat(e.target.value) || 0.1)}
                className="input-field text-center font-mono"
              />
              <div className="text-sm text-gray-600">
                × ${stockPrices[selectedStock]?.price.toFixed(2) || '0.00'} = 
                <span className="font-mono font-bold ml-1">
                  ${(shares * (stockPrices[selectedStock]?.price || 0)).toFixed(2)}
                </span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              {[0.1, 0.5, 1.0].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setShares(amount)}
                  className={`px-3 py-1 rounded-lg text-sm transition-all ${
                    Math.abs(shares - amount) < 0.01
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  {amount} shares
                </button>
              ))}
            </div>
          </div>

          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
              <div className="text-sm">
                <div className="font-semibold text-yellow-800">Total Cost</div>
                <div className="text-yellow-700">
                  {shares} shares × ${stockPrices[selectedStock]?.price.toFixed(2) || '0.00'} = 
                  <span className="font-mono font-bold ml-1">
                    ${(shares * (stockPrices[selectedStock]?.price || 0)).toFixed(2)}
                  </span>
                </div>
                <div className="text-yellow-600 text-xs mt-1">
                  Remaining cash: ${(200 - (shares * (stockPrices[selectedStock]?.price || 0))).toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Execute Your Trade! 🚀",
      content: (
        <div className="space-y-4">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mb-4">
              <Target className="w-8 h-8 text-white" />
            </div>
            <p className="text-lg text-gray-700 mb-4">
              Ready to make your first trade? Here's a summary:
            </p>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div><span className="text-gray-600">Stock:</span> <span className="font-bold">{selectedStock}</span></div>
                <div><span className="text-gray-600">Company:</span> <span className="text-gray-800">{stockPrices[selectedStock]?.name || 'Loading...'}</span></div>
                <div><span className="text-gray-600">Shares:</span> <span className="font-mono font-bold">{shares}</span></div>
              </div>
              <div className="space-y-2">
                <div><span className="text-gray-600">Price per share:</span> <span className="font-mono font-bold">${stockPrices[selectedStock]?.price.toFixed(2) || '0.00'}</span></div>
                <div><span className="text-gray-600">Total cost:</span> <span className="font-mono font-bold text-green-600">${(shares * (stockPrices[selectedStock]?.price || 0)).toFixed(2)}</span></div>
                <div><span className="text-gray-600">Remaining cash:</span> <span className="font-mono font-bold">${(200 - (shares * (stockPrices[selectedStock]?.price || 0))).toFixed(2)}</span></div>
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setCurrentStep(4)}
            className="w-full btn-accent flex items-center justify-center space-x-2"
          >
            <Play className="w-5 h-5" />
            <span>Execute Trade</span>
          </motion.button>
        </div>
      )
    },
    {
      title: "Watch Your Investment Over Time ⏰",
      content: (
        <div className="space-y-4">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Trade Executed Successfully!</h3>
            <p className="text-gray-600">
              You now own {shares} shares of {selectedStock}. Let's see how your investment performs over time.
            </p>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-200">
            <div className="grid grid-cols-3 gap-4 text-center mb-6">
              <div>
                <div className="text-sm text-gray-600">Current Price</div>
                <div className="font-mono font-bold text-lg">${simulatedPrice.toFixed(2)}</div>
                <div className={`text-xs ${simulatedPrice >= initialPrice ? 'text-green-600' : 'text-red-600'}`}>
                  {simulatedPrice >= initialPrice ? '+' : ''}{((simulatedPrice - initialPrice) / initialPrice * 100).toFixed(2)}%
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Portfolio Value</div>
                <div className="font-mono font-bold text-lg">${(shares * simulatedPrice).toFixed(2)}</div>
                <div className={`text-xs ${shares * simulatedPrice >= shares * initialPrice ? 'text-green-600' : 'text-red-600'}`}>
                  {shares * simulatedPrice >= shares * initialPrice ? '+' : ''}${(shares * (simulatedPrice - initialPrice)).toFixed(2)}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Days Passed</div>
                <div className="font-mono font-bold text-lg">{daysPassed}</div>
                <div className="text-xs text-gray-500">
                  <Clock className="w-3 h-3 inline mr-1" />
                  Time simulation
                </div>
              </div>
            </div>

            {/* Interactive Price Chart */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                Live Price Movement - {selectedStock}
              </h4>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={simulationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="day" 
                    tickFormatter={(day) => `Day ${day}`}
                    stroke="#666"
                    fontSize={12}
                  />
                  <YAxis 
                    domain={['dataMin - 5', 'dataMax + 5']}
                    tickFormatter={(value) => `$${value.toFixed(0)}`}
                    stroke="#666"
                    fontSize={12}
                  />
                  <Tooltip 
                    formatter={(value) => [`$${value.toFixed(2)}`, 'Price']}
                    labelFormatter={(day) => `Day ${day}`}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #ccc',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke={simulatedPrice >= initialPrice ? "#10b981" : "#ef4444"}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ 
                      r: 4, 
                      fill: simulatedPrice >= initialPrice ? "#10b981" : "#ef4444"
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Watch how your stock price changes over time! Each point represents one day.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-800">Time Controls</h4>
              <div className="text-sm text-gray-600">
                Speed: {simulationSpeed}x
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  if (!isSimulating) {
                    setIsSimulating(true);
                    setSimulationSpeed(1);
                  } else {
                    setIsSimulating(false);
                  }
                }}
                className={`flex-1 btn-secondary flex items-center justify-center space-x-2 ${
                  isSimulating ? 'bg-red-100 border-red-300 text-red-700' : 'bg-green-100 border-green-300 text-green-700'
                }`}
              >
                {isSimulating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isSimulating ? 'Pause' : 'Start'} Simulation</span>
              </button>
              
              <button
                onClick={() => setSimulationSpeed(prev => Math.min(prev * 2, 8))}
                disabled={!isSimulating}
                className="btn-secondary flex items-center space-x-2 disabled:opacity-50"
              >
                <FastForward className="w-4 h-4" />
                <span>Speed Up</span>
              </button>
            </div>

            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
              <div className="text-xs text-center">
                <span className="text-yellow-700 font-medium">💡 Learning Tip:</span>
                <p className="text-yellow-600 mt-1">
                  Try speeding up time to see how stock prices fluctuate over days and weeks! 
                  Notice how the graph shows the ups and downs - this is called volatility.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  // Simulation effect with graph data
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setDaysPassed(prev => prev + 1);
      
      // Simulate realistic price movement
      setSimulatedPrice(prev => {
        const changePercent = (Math.random() - 0.5) * 0.1; // -5% to +5% daily change
        const newPrice = prev * (1 + changePercent);
        const finalPrice = Math.max(newPrice, initialPrice * 0.5); // Don't go below 50% of initial
        
        // Add to simulation data for graph
        setSimulationData(prevData => {
          const newDataPoint = {
            date: new Date(Date.now() + (prevData.length * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
            price: finalPrice,
            day: prevData.length
          };
          return [...prevData.slice(-29), newDataPoint]; // Keep last 30 days
        });
        
        return finalPrice;
      });
    }, 1000 / simulationSpeed);

    return () => clearInterval(interval);
  }, [isSimulating, simulationSpeed, initialPrice]);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    onComplete();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
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
          className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {tutorialSteps[currentStep].title}
              </h2>
              <div className="flex items-center space-x-2 mt-2">
                <div className="text-sm text-gray-600">
                  Step {currentStep + 1} of {tutorialSteps.length}
                </div>
                <div className="flex space-x-1">
                  {tutorialSteps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index === currentStep ? 'bg-green-500' : 
                        index < currentStep ? 'bg-green-300' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="mb-8">
            {tutorialSteps[currentStep].content}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Skip Tutorial
              </button>

              {currentStep < tutorialSteps.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="btn-primary flex items-center space-x-2"
                >
                  <span>Next</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleComplete}
                  className="btn-accent flex items-center space-x-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Complete Tutorial</span>
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TutorialOverlay;