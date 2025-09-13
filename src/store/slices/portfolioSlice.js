import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ApiService from '../../services/api.js';
import StorageService from '../../services/storageService.js';
import { LEVELS } from '../../utils/constants.js';
import { generateId, calculatePortfolioValue } from '../../utils/helpers.js';

const initialState = {
  currentLevel: 1,
  portfolios: {}, // Will hold portfolio for each level
  activePortfolio: {
    level: 1,
    cash: 0,
    totalValue: 0,
    startingValue: 0,
    positions: [],
    transactions: [],
    performance: []
  },
  isLoading: false,
  error: null
};

// Async thunks
export const fetchPortfolio = createAsyncThunk(
  'portfolio/fetchPortfolio',
  async (level, { rejectWithValue }) => {
    try {
      if (ApiService.isAuthenticated()) {
        const response = await ApiService.getPortfolio(level);
        return response.data;
      }
      return null;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAllPortfolios = createAsyncThunk(
  'portfolio/fetchAllPortfolios',
  async (_, { rejectWithValue }) => {
    try {
      if (ApiService.isAuthenticated()) {
        const response = await ApiService.getPortfolios();
        return response.data;
      }
      return null;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    initializePortfolios: (state) => {
      // Load all existing portfolios
      state.portfolios = StorageService.getAllPortfolios();
      
      // Set active portfolio based on current level
      const currentLevel = state.currentLevel;
      state.activePortfolio = StorageService.getPortfolio(currentLevel);
      
      // If no portfolio exists for current level, create one
      if (state.activePortfolio.startingValue === 0) {
        const levelConfig = LEVELS[currentLevel];
        state.activePortfolio = {
          level: currentLevel,
          cash: levelConfig.startingCapital,
          totalValue: levelConfig.startingCapital,
          startingValue: levelConfig.startingCapital,
          positions: [],
          transactions: [],
          performance: [{
            date: new Date().toISOString().split('T')[0],
            totalValue: levelConfig.startingCapital,
            dailyReturn: 0
          }]
        };
        StorageService.setPortfolio(currentLevel, state.activePortfolio);
        state.portfolios[currentLevel] = state.activePortfolio;
      }
    },
    
    setActiveLevel: (state, action) => {
      const level = action.payload;
      state.currentLevel = level;
      state.activePortfolio = StorageService.getPortfolio(level);
      
      // Create new portfolio if doesn't exist
      if (state.activePortfolio.startingValue === 0) {
        const levelConfig = LEVELS[level];
        state.activePortfolio = {
          level,
          cash: levelConfig.startingCapital,
          totalValue: levelConfig.startingCapital,
          startingValue: levelConfig.startingCapital,
          positions: [],
          transactions: [],
          performance: [{
            date: new Date().toISOString().split('T')[0],
            totalValue: levelConfig.startingCapital,
            dailyReturn: 0
          }]
        };
        StorageService.setPortfolio(level, state.activePortfolio);
        state.portfolios[level] = state.activePortfolio;
      }
    },
    
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    
    buyStock: (state, action) => {
      const { symbol, companyName, shares, price, orderType = 'market' } = action.payload;
      const totalCost = shares * price;
      
      if (state.activePortfolio.cash < totalCost) {
        state.error = 'Insufficient funds';
        return;
      }
      
      // Update cash
      state.activePortfolio.cash -= totalCost;
      
      // Add or update position
      const existingPosition = state.activePortfolio.positions.find(p => p.symbol === symbol);
      
      if (existingPosition) {
        // Update existing position (average cost basis)
        const totalShares = existingPosition.shares + shares;
        const totalCost = (existingPosition.shares * existingPosition.averagePrice) + (shares * price);
        existingPosition.averagePrice = totalCost / totalShares;
        existingPosition.shares = totalShares;
      } else {
        // Create new position
        state.activePortfolio.positions.push({
          symbol,
          companyName,
          shares,
          averagePrice: price,
          currentPrice: price,
          purchaseDate: Date.now(),
          unrealizedGain: 0,
          type: 'long'
        });
      }
      
      // Add transaction
      const transaction = {
        id: generateId(),
        symbol,
        type: 'buy',
        shares,
        price,
        timestamp: Date.now(),
        fee: 0, // No fees in simulation
        orderType
      };
      state.activePortfolio.transactions.unshift(transaction);
      
      // Update portfolio value
      state.activePortfolio.totalValue = state.activePortfolio.cash + 
        state.activePortfolio.positions.reduce((sum, pos) => sum + (pos.shares * pos.currentPrice), 0);
      
      // Save to storage
      StorageService.setPortfolio(state.currentLevel, state.activePortfolio);
      state.portfolios[state.currentLevel] = { ...state.activePortfolio };
      
      state.error = null;
    },
    
    sellStock: (state, action) => {
      const { symbol, shares, price, orderType = 'market' } = action.payload;
      
      const position = state.activePortfolio.positions.find(p => p.symbol === symbol);
      if (!position || position.shares < shares) {
        state.error = 'Insufficient shares';
        return;
      }
      
      const totalValue = shares * price;
      
      // Update cash
      state.activePortfolio.cash += totalValue;
      
      // Update or remove position
      position.shares -= shares;
      if (position.shares === 0) {
        state.activePortfolio.positions = state.activePortfolio.positions.filter(p => p.symbol !== symbol);
      }
      
      // Add transaction
      const transaction = {
        id: generateId(),
        symbol,
        type: 'sell',
        shares,
        price,
        timestamp: Date.now(),
        fee: 0,
        orderType
      };
      state.activePortfolio.transactions.unshift(transaction);
      
      // Update portfolio value
      state.activePortfolio.totalValue = state.activePortfolio.cash + 
        state.activePortfolio.positions.reduce((sum, pos) => sum + (pos.shares * pos.currentPrice), 0);
      
      // Save to storage
      StorageService.setPortfolio(state.currentLevel, state.activePortfolio);
      state.portfolios[state.currentLevel] = { ...state.activePortfolio };
      
      state.error = null;
    },
    
    shortSell: (state, action) => {
      const { symbol, companyName, shares, price } = action.payload;
      
      // For simplification, short selling adds cash and creates a "short" position
      const totalValue = shares * price;
      state.activePortfolio.cash += totalValue;
      
      // Check if short position exists
      const existingPosition = state.activePortfolio.positions.find(p => p.symbol === symbol && p.type === 'short');
      
      if (existingPosition) {
        // Update existing short position
        const totalShares = existingPosition.shares + shares;
        const totalValue = (existingPosition.shares * existingPosition.averagePrice) + (shares * price);
        existingPosition.averagePrice = totalValue / totalShares;
        existingPosition.shares = totalShares;
      } else {
        // Create new short position
        state.activePortfolio.positions.push({
          symbol,
          companyName,
          shares,
          averagePrice: price,
          currentPrice: price,
          purchaseDate: Date.now(),
          unrealizedGain: 0,
          type: 'short'
        });
      }
      
      // Add transaction
      const transaction = {
        id: generateId(),
        symbol,
        type: 'short_sell',
        shares,
        price,
        timestamp: Date.now(),
        fee: 0
      };
      state.activePortfolio.transactions.unshift(transaction);
      
      // Save to storage
      StorageService.setPortfolio(state.currentLevel, state.activePortfolio);
      state.portfolios[state.currentLevel] = { ...state.activePortfolio };
      
      state.error = null;
    },
    
    coverShort: (state, action) => {
      const { symbol, shares, price } = action.payload;
      
      const position = state.activePortfolio.positions.find(p => p.symbol === symbol && p.type === 'short');
      if (!position || position.shares < shares) {
        state.error = 'No short position to cover';
        return;
      }
      
      const totalCost = shares * price;
      
      if (state.activePortfolio.cash < totalCost) {
        state.error = 'Insufficient funds to cover short';
        return;
      }
      
      // Update cash
      state.activePortfolio.cash -= totalCost;
      
      // Update or remove short position
      position.shares -= shares;
      if (position.shares === 0) {
        state.activePortfolio.positions = state.activePortfolio.positions.filter(p => p !== position);
      }
      
      // Add transaction
      const transaction = {
        id: generateId(),
        symbol,
        type: 'short_buy',
        shares,
        price,
        timestamp: Date.now(),
        fee: 0
      };
      state.activePortfolio.transactions.unshift(transaction);
      
      // Save to storage
      StorageService.setPortfolio(state.currentLevel, state.activePortfolio);
      state.portfolios[state.currentLevel] = { ...state.activePortfolio };
      
      state.error = null;
    },
    
    updatePrices: (state, action) => {
      const quotes = action.payload;
      
      // Update current prices in positions
      state.activePortfolio.positions.forEach(position => {
        if (quotes[position.symbol]) {
          position.currentPrice = quotes[position.symbol].price;
          
          // Calculate unrealized gain/loss
          if (position.type === 'long') {
            position.unrealizedGain = (position.currentPrice - position.averagePrice) * position.shares;
          } else {
            // For short positions, gain when price goes down
            position.unrealizedGain = (position.averagePrice - position.currentPrice) * position.shares;
          }
        }
      });
      
      // Update total portfolio value
      state.activePortfolio.totalValue = state.activePortfolio.cash + 
        state.activePortfolio.positions.reduce((sum, pos) => {
          if (pos.type === 'long') {
            return sum + (pos.shares * pos.currentPrice);
          } else {
            // Short positions don't add to portfolio value directly
            return sum;
          }
        }, 0);
      
      // Save to storage
      StorageService.setPortfolio(state.currentLevel, state.activePortfolio);
      state.portfolios[state.currentLevel] = { ...state.activePortfolio };
    },
    
    addPerformanceData: (state, action) => {
      const { date, totalValue, dailyReturn } = action.payload;
      
      state.activePortfolio.performance.push({
        date,
        totalValue,
        dailyReturn
      });
      
      // Keep only last 365 days of performance data
      if (state.activePortfolio.performance.length > 365) {
        state.activePortfolio.performance = state.activePortfolio.performance.slice(-365);
      }
      
      StorageService.setPortfolio(state.currentLevel, state.activePortfolio);
      state.portfolios[state.currentLevel] = { ...state.activePortfolio };
    },
    
    resetPortfolio: (state, action) => {
      const level = action.payload || state.currentLevel;
      const levelConfig = LEVELS[level];
      
      const resetPortfolio = {
        level,
        cash: levelConfig.startingCapital,
        totalValue: levelConfig.startingCapital,
        startingValue: levelConfig.startingCapital,
        positions: [],
        transactions: [],
        performance: [{
          date: new Date().toISOString().split('T')[0],
          totalValue: levelConfig.startingCapital,
          dailyReturn: 0
        }]
      };
      
      if (level === state.currentLevel) {
        state.activePortfolio = resetPortfolio;
      }
      
      state.portfolios[level] = resetPortfolio;
      StorageService.setPortfolio(level, resetPortfolio);
      state.error = null;
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    createCustomPortfolio: (state, action) => {
      const { startingCapital, level = 'custom' } = action.payload;
      
      const customPortfolio = {
        level,
        cash: startingCapital,
        totalValue: startingCapital,
        startingValue: startingCapital,
        positions: [],
        transactions: [],
        performance: [{
          date: new Date().toISOString().split('T')[0],
          totalValue: startingCapital,
          dailyReturn: 0
        }],
        isCustom: true
      };
      
      state.portfolios[level] = customPortfolio;
      state.activePortfolio = customPortfolio;
      state.currentLevel = level;
      
      StorageService.setPortfolio(level, customPortfolio);
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch single portfolio
      .addCase(fetchPortfolio.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPortfolio.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          const portfolio = action.payload;
          state.activePortfolio = portfolio;
          state.portfolios[portfolio.level] = portfolio;
          state.currentLevel = portfolio.level;
        }
      })
      .addCase(fetchPortfolio.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch all portfolios
      .addCase(fetchAllPortfolios.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllPortfolios.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload && action.payload.length > 0) {
          const portfoliosData = {};
          action.payload.forEach(portfolio => {
            portfoliosData[portfolio.level] = portfolio;
          });
          state.portfolios = portfoliosData;
          // Set first portfolio as active
          const firstPortfolio = action.payload[0];
          state.activePortfolio = firstPortfolio;
          state.currentLevel = firstPortfolio.level;
        }
      })
      .addCase(fetchAllPortfolios.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const {
  initializePortfolios,
  setActiveLevel,
  setLoading,
  setError,
  buyStock,
  sellStock,
  shortSell,
  coverShort,
  updatePrices,
  addPerformanceData,
  resetPortfolio,
  clearError,
  createCustomPortfolio
} = portfolioSlice.actions;

export default portfolioSlice.reducer;