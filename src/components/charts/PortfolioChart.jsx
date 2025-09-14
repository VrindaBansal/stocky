import React, { useState, useEffect, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { TrendingUp, Eye, EyeOff } from 'lucide-react';
import { formatCurrency, getGainLossColor } from '../../utils/helpers.js';
import stockService from '../../services/stockServiceSimple.js';

const PortfolioChart = ({ portfolio, timeSpeed, isSimulatingTime, height = 300 }) => {
  const [chartData, setChartData] = useState([]);
  const [visibleStocks, setVisibleStocks] = useState({});
  const [stockPriceHistory, setStockPriceHistory] = useState({});

  // Colors for different stock lines
  const stockColors = {
    'AAPL': '#1f77b4',
    'MSFT': '#ff7f0e', 
    'GOOGL': '#2ca02c',
    'TSLA': '#d62728',
    'AMZN': '#9467bd',
    'META': '#8c564b',
    'NVDA': '#e377c2',
    'NFLX': '#7f7f7f'
  };

  // Define userStocks early so it can be used in effects
  const userStocks = useMemo(() => {
    return portfolio?.positions?.map(p => p.symbol) || [];
  }, [portfolio?.positions]);

  // Initialize visible stocks based on user's positions
  useEffect(() => {
    if (portfolio?.positions?.length > 0) {
      const initialVisible = {};
      portfolio.positions.forEach(position => {
        initialVisible[position.symbol] = true;
      });
      setVisibleStocks(initialVisible);
    }
  }, [portfolio?.positions]);

  // Initialize chart data with user's personal holding history
  useEffect(() => {
    const initializeChart = async () => {
      if (!portfolio?.positions?.length) return;

      const personalHistory = {};
      const allTimestamps = new Set();

      // Generate chart data from each stock's purchase date to now
      for (const position of portfolio.positions) {
        try {
          const purchaseDate = new Date(position.purchaseDate);
          const now = new Date();
          const daysSincePurchase = Math.max(1, Math.ceil((now - purchaseDate) / (1000 * 60 * 60 * 24)));
          
          // Get the stock's price at purchase (fallback to purchase price from position)
          const purchasePrice = position.purchasePrice;
          
          // Generate simulated price history from purchase date to now
          const stockHistory = [];
          const currentQuote = await stockService.getQuote(position.symbol);
          const currentPrice = currentQuote?.price || purchasePrice;
          
          // Create daily price points from purchase date to now
          for (let i = 0; i <= daysSincePurchase; i++) {
            const date = new Date(purchaseDate);
            date.setDate(date.getDate() + i);
            
            // Calculate interpolated price between purchase and current price
            let price;
            if (i === 0) {
              price = purchasePrice; // Start with actual purchase price
            } else if (i === daysSincePurchase) {
              price = currentPrice; // End with current price
            } else {
              // Linear interpolation with some realistic volatility
              const progress = i / daysSincePurchase;
              const basePrice = purchasePrice + (currentPrice - purchasePrice) * progress;
              
              // Add some realistic daily volatility (±2%)
              const volatility = 0.02;
              const randomChange = (Math.random() - 0.5) * 2 * volatility;
              price = basePrice * (1 + randomChange);
              
              // Ensure price doesn't go negative
              price = Math.max(price, purchasePrice * 0.5);
            }
            
            const timestamp = date.getTime();
            stockHistory.push({
              timestamp,
              price: Math.round(price * 100) / 100,
              change: 0,
              changePercent: 0
            });
            
            allTimestamps.add(timestamp);
          }
          
          personalHistory[position.symbol] = stockHistory;
          
        } catch (error) {
          console.warn(`Failed to generate history for ${position.symbol}:`, error);
        }
      }

      // Create chart data points from personal holding history
      const sortedTimestamps = Array.from(allTimestamps).sort();
      const chartPoints = [];
      
      sortedTimestamps.forEach(timestamp => {
        const dataPoint = {
          timestamp: timestamp,
          time: new Date(timestamp).toLocaleDateString(),
          date: new Date(timestamp).toLocaleDateString()
        };

        // Add stock prices for this timestamp
        Object.keys(personalHistory).forEach(symbol => {
          const stockHistory = personalHistory[symbol];
          // Find the exact or closest price point for this timestamp
          const exactPoint = stockHistory.find(point => point.timestamp === timestamp);
          
          if (exactPoint) {
            dataPoint[symbol] = exactPoint.price;
          } else {
            // Find closest point if exact timestamp not found
            let closestPoint = stockHistory[0];
            let minTimeDiff = Math.abs(stockHistory[0].timestamp - timestamp);
            
            for (const point of stockHistory) {
              const timeDiff = Math.abs(point.timestamp - timestamp);
              if (timeDiff < minTimeDiff) {
                minTimeDiff = timeDiff;
                closestPoint = point;
              }
            }
            
            if (closestPoint) {
              dataPoint[symbol] = closestPoint.price;
            }
          }
        });

        // Only add data points that have at least one stock price
        if (Object.keys(dataPoint).length > 3) { // More than timestamp, time, and date
          chartPoints.push(dataPoint);
        }
      });

      setChartData(chartPoints);
      setStockPriceHistory(personalHistory);
    };

    initializeChart();
  }, [portfolio?.positions]);

  // Update chart data when time is accelerated
  useEffect(() => {
    if (isSimulatingTime && timeSpeed > 1) {
      const interval = setInterval(() => {
        const now = new Date();
        const newDataPoint = {
          timestamp: now.getTime(),
          time: now.toLocaleTimeString()
        };

        // Get updated stock data from the service
        const availableStocks = stockService.getAvailableSymbols();
        const updatedHistory = { ...stockPriceHistory };

        // Update prices for stocks in portfolio
        portfolio?.positions?.forEach(position => {
          if (availableStocks.includes(position.symbol)) {
            try {
              const stockData = stockService.stockData[position.symbol];
              if (stockData) {
                const historyEntry = {
                  timestamp: now.getTime(),
                  price: stockData.price,
                  change: stockData.change,
                  changePercent: stockData.changePercent
                };

                if (!updatedHistory[position.symbol]) {
                  updatedHistory[position.symbol] = [];
                }
                updatedHistory[position.symbol].push(historyEntry);
                
                // Keep only last 50 points for performance
                if (updatedHistory[position.symbol].length > 50) {
                  updatedHistory[position.symbol] = updatedHistory[position.symbol].slice(-50);
                }

                newDataPoint[position.symbol] = stockData.price;
              }
            } catch (error) {
              console.warn(`Error updating ${position.symbol}:`, error);
            }
          }
        });

        setStockPriceHistory(updatedHistory);
        setChartData(prevData => {
          const newData = [...prevData, newDataPoint];
          // Keep only last 100 points for better historical view
          return newData.length > 100 ? newData.slice(-100) : newData;
        });
      }, 2000); // Update every 2 seconds

      return () => clearInterval(interval);
    }
  }, [isSimulatingTime, timeSpeed, portfolio?.positions, stockPriceHistory]);

  // Toggle stock visibility
  const toggleStock = (symbol) => {
    setVisibleStocks(prev => ({
      ...prev,
      [symbol]: !prev[symbol]
    }));
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const formattedDate = new Date(label).toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
      
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-xl shadow-lg min-w-48">
          <p className="text-sm text-gray-600 mb-2 font-medium">
            {formattedDate}
          </p>
          <div className="space-y-1">
            {payload.map((entry) => {
              const history = stockPriceHistory[entry.dataKey];
              const currentPoint = history?.find(h => 
                Math.abs(h.timestamp - entry.payload.timestamp) < 5000
              );
              
              return (
                <div key={entry.dataKey} className="flex items-center justify-between space-x-4">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-sm font-medium">{entry.dataKey}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatCurrency(entry.value)}</div>
                    {currentPoint && (
                      <div className={`text-xs ${getGainLossColor(currentPoint.change)}`}>
                        {currentPoint.change >= 0 ? '+' : ''}{currentPoint.changePercent.toFixed(2)}%
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    return null;
  };

  if (!portfolio?.positions?.length) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="text-center">
          <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Stocks to Track</h3>
          <p className="text-gray-500">Buy some stocks to see their live performance here!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Your Stock Holdings Performance</h3>
          <p className="text-sm text-gray-500">
            Price trends since you purchased each stock
            {isSimulatingTime && timeSpeed > 1 && (
              <span className="ml-2 text-blue-600 font-medium">
                ({timeSpeed}x speed)
              </span>
            )}
          </p>
        </div>
        
        {/* Stock Toggle Controls */}
        <div className="flex items-center space-x-2">
          {userStocks.map(symbol => (
            <button
              key={symbol}
              onClick={() => toggleStock(symbol)}
              className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                visibleStocks[symbol] 
                  ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                  : 'bg-gray-100 text-gray-500 border border-gray-200'
              }`}
            >
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: visibleStocks[symbol] ? stockColors[symbol] : '#ccc' }}
              />
              <span>{symbol}</span>
              {visibleStocks[symbol] ? (
                <Eye className="w-3 h-3" />
              ) : (
                <EyeOff className="w-3 h-3" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="relative">
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
            <XAxis 
              dataKey="date" 
              stroke="#666"
              fontSize={11}
              interval="preserveStartEnd"
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              }}
            />
            <YAxis 
              domain={['dataMin - 5', 'dataMax + 5']}
              tickFormatter={(value) => `$${value.toFixed(0)}`}
              stroke="#666"
              fontSize={11}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="line"
            />
            
            {/* Draw lines for each visible stock */}
            {userStocks.map(symbol => (
              visibleStocks[symbol] && (
                <Line
                  key={symbol}
                  type="monotone"
                  dataKey={symbol}
                  stroke={stockColors[symbol]}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ 
                    r: 4, 
                    fill: stockColors[symbol],
                    stroke: "#fff",
                    strokeWidth: 2
                  }}
                  connectNulls={false}
                />
              )
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Stats */}
      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-4">
          <span>Data Points: {chartData.length}</span>
          <span>Update Rate: {isSimulatingTime ? '2s' : 'Static'}</span>
        </div>
        {isSimulatingTime && (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-600 font-medium">Live Updates Active</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioChart;