import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers.js';
import stockService from '../../services/stockServiceSimple.js';

const StockChart = ({ symbol, height = 400, showControls = true }) => {
  const [data, setData] = useState([]);
  const [period, setPeriod] = useState('1M');
  const [loading, setLoading] = useState(true);
  const [currentQuote, setCurrentQuote] = useState(null);

  const periods = [
    { value: '1D', label: '1D' },
    { value: '1W', label: '1W' },
    { value: '1M', label: '1M' },
    { value: '3M', label: '3M' },
    { value: '6M', label: '6M' },
    { value: '1Y', label: '1Y' },
    { value: '5Y', label: '5Y' }
  ];

  useEffect(() => {
    loadChartData();
    loadCurrentQuote();
  }, [symbol, period]);

  const loadChartData = async () => {
    if (!symbol) return;
    
    setLoading(true);
    try {
      const historicalData = await stockService.getHistoricalData(symbol, period);
      if (historicalData && historicalData.length > 0) {
        // Format data for Recharts
        const formattedData = historicalData.map(item => ({
          date: item.date,
          price: item.close,
          volume: item.volume,
          high: item.high,
          low: item.low,
          open: item.open
        }));
        setData(formattedData);
      }
    } catch (error) {
      console.error('Error loading chart data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCurrentQuote = async () => {
    if (!symbol) return;
    
    try {
      const quote = await stockService.getQuote(symbol);
      setCurrentQuote(quote);
    } catch (error) {
      console.error('Error loading current quote:', error);
    }
  };

  const formatXAxisLabel = (dateStr) => {
    const date = new Date(dateStr);
    if (period === '1D') {
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (period === '1W' || period === '1M') {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        year: '2-digit' 
      });
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-xl shadow-lg">
          <p className="text-sm text-gray-600 mb-2">
            {new Date(label).toLocaleDateString('en-US', {
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </p>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Open:</span>
              <span className="font-semibold">{formatCurrency(data.open)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">High:</span>
              <span className="font-semibold">{formatCurrency(data.high)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Low:</span>
              <span className="font-semibold">{formatCurrency(data.low)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Close:</span>
              <span className="font-semibold">{formatCurrency(data.price)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Volume:</span>
              <span className="font-semibold">{data.volume?.toLocaleString()}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading chart data...</p>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <div className="text-center">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No chart data available</p>
          <p className="text-sm text-gray-400">Try selecting a different time period</p>
        </div>
      </div>
    );
  }

  const firstPrice = data[0]?.price || 0;
  const lastPrice = data[data.length - 1]?.price || 0;
  const priceChange = lastPrice - firstPrice;
  const priceChangePercent = firstPrice > 0 ? ((priceChange / firstPrice) * 100) : 0;
  const isPositive = priceChange >= 0;

  return (
    <div className="space-y-4">
      {/* Chart Header */}
      {showControls && currentQuote && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h3 className="text-xl font-bold text-gray-900">{symbol}</h3>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-gray-900">
                {formatCurrency(currentQuote.price)}
              </span>
              <div className={`flex items-center space-x-1 ${
                isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                {isPositive ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span className="font-semibold">
                  {isPositive ? '+' : ''}{formatCurrency(currentQuote.change)}
                </span>
                <span className="text-sm">
                  ({isPositive ? '+' : ''}{currentQuote.changePercent.toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>
          
          {/* Period Selector */}
          <div className="flex rounded-lg bg-gray-100 p-1">
            {periods.map((p) => (
              <button
                key={p.value}
                onClick={() => setPeriod(p.value)}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${
                  period === p.value
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="bg-white rounded-xl border border-gray-200">
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatXAxisLabel}
              stroke="#666"
              fontSize={12}
            />
            <YAxis 
              domain={['dataMin - 5', 'dataMax + 5']}
              tickFormatter={(value) => `$${value.toFixed(0)}`}
              stroke="#666"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Reference line at first price */}
            <ReferenceLine 
              y={firstPrice} 
              stroke="#ccc" 
              strokeDasharray="2 2" 
              strokeWidth={1}
            />
            
            <Line
              type="monotone"
              dataKey="price"
              stroke={isPositive ? "#10b981" : "#ef4444"}
              strokeWidth={2}
              dot={false}
              activeDot={{ 
                r: 6, 
                fill: isPositive ? "#10b981" : "#ef4444",
                stroke: "#fff",
                strokeWidth: 2
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Summary */}
      {showControls && (
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <span>Period: {periods.find(p => p.value === period)?.label}</span>
            <span>Data Points: {data.length}</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>Change: {formatCurrency(priceChange)}</span>
            <span>({priceChangePercent >= 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%)</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockChart;