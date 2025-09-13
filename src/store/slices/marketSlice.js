import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  quotes: {},
  watchlist: [],
  trending: ['AAPL', 'MSFT', 'GOOGL', 'TSLA', 'AMZN', 'META', 'NVDA', 'NFLX', 'JPM', 'JNJ'],
  searchResults: [],
  historicalData: {},
  isLoading: false,
  error: null,
  lastUpdate: null
};

const marketSlice = createSlice({
  name: 'market',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    setQuotes: (state, action) => {
      state.quotes = { ...state.quotes, ...action.payload };
      state.lastUpdate = Date.now();
      state.error = null;
    },

    setQuote: (state, action) => {
      const { symbol, data } = action.payload;
      state.quotes[symbol] = data;
      state.lastUpdate = Date.now();
    },

    setSearchResults: (state, action) => {
      state.searchResults = action.payload;
    },

    addToWatchlist: (state, action) => {
      const symbol = action.payload.toUpperCase();
      if (!state.watchlist.includes(symbol)) {
        state.watchlist.push(symbol);
      }
    },

    removeFromWatchlist: (state, action) => {
      const symbol = action.payload.toUpperCase();
      state.watchlist = state.watchlist.filter(s => s !== symbol);
    },

    setWatchlist: (state, action) => {
      state.watchlist = action.payload.map(s => s.toUpperCase());
    },

    setHistoricalData: (state, action) => {
      const { symbol, period, data } = action.payload;
      if (!state.historicalData[symbol]) {
        state.historicalData[symbol] = {};
      }
      state.historicalData[symbol][period] = data;
    },

    setTrending: (state, action) => {
      state.trending = action.payload;
    },

    clearSearchResults: (state) => {
      state.searchResults = [];
    },

    clearError: (state) => {
      state.error = null;
    },

    updateMarketStatus: (state, action) => {
      state.marketStatus = action.payload;
    }
  }
});

export const {
  setLoading,
  setError,
  setQuotes,
  setQuote,
  setSearchResults,
  addToWatchlist,
  removeFromWatchlist,
  setWatchlist,
  setHistoricalData,
  setTrending,
  clearSearchResults,
  clearError,
  updateMarketStatus
} = marketSlice.actions;

export default marketSlice.reducer;