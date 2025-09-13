import { configureStore } from '@reduxjs/toolkit';
import userSlice from './slices/userSlice.js';
import portfolioSlice from './slices/portfolioSlice.js';
import marketSlice from './slices/marketSlice.js';
import gameSlice from './slices/gameSlice.js';
import tutorialSlice from './slices/tutorialSlice.js';

export const store = configureStore({
  reducer: {
    user: userSlice,
    portfolio: portfolioSlice,
    market: marketSlice,
    game: gameSlice,
    tutorial: tutorialSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'user/setUser',
          'portfolio/setPortfolio',
          'market/setQuotes',
          'game/setProgress',
        ],
        ignoredPaths: ['user.lastLogin', 'portfolio.transactions.timestamp'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;