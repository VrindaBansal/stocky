import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ApiService from '../../services/api.js';
import StorageService from '../../services/storageService.js';

const initialState = {
  isInitialized: false,
  username: '',
  avatar: 'default',
  createdAt: null,
  currentLevel: 1,
  totalPoints: 0,
  preferences: {
    theme: 'light',
    soundEffects: true,
    animations: true,
    notifications: true
  },
  stats: {
    totalTrades: 0,
    successfulTrades: 0,
    totalReturn: 0,
    currentStreak: 0,
    longestStreak: 0,
    daysActive: 1,
    lastLogin: null
  },
  isOnboarding: true,
  loading: false,
  error: null
};

// Async thunks
export const registerUser = createAsyncThunk(
  'user/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await ApiService.register(userData);
      return response.user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const initializeUserFromAPI = createAsyncThunk(
  'user/initializeFromAPI',
  async (_, { rejectWithValue }) => {
    try {
      if (ApiService.isAuthenticated()) {
        const response = await ApiService.getProfile();
        return response.user;
      }
      return null;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    initializeUser: (state) => {
      const userData = StorageService.getUser();
      if (userData.username) {
        Object.assign(state, userData);
        state.isInitialized = true;
        state.isOnboarding = false;
      } else {
        // For new users, just mark as initialized so they see onboarding
        state.isInitialized = true;
        state.isOnboarding = true;
      }
    },
    
    createUser: (state, action) => {
      const { username, avatar } = action.payload;
      const newUser = {
        ...initialState,
        username,
        avatar: avatar || 'default',
        createdAt: Date.now(),
        isInitialized: true,
        isOnboarding: false,
        stats: {
          ...initialState.stats,
          lastLogin: Date.now()
        }
      };
      
      Object.assign(state, newUser);
      StorageService.setUser(state);
    },
    
    updateUser: (state, action) => {
      Object.assign(state, action.payload);
      StorageService.setUser(state);
    },
    
    updatePreferences: (state, action) => {
      state.preferences = { ...state.preferences, ...action.payload };
      StorageService.setUser(state);
    },
    
    addPoints: (state, action) => {
      const points = action.payload;
      state.totalPoints += points;
      
      // Add to achievements points history
      const achievements = StorageService.getAchievements();
      achievements.points += points;
      achievements.pointsHistory.push({
        source: action.meta?.source || 'unknown',
        amount: points,
        timestamp: Date.now()
      });
      StorageService.setAchievements(achievements);
      StorageService.setUser(state);
    },
    
    updateStats: (state, action) => {
      state.stats = { ...state.stats, ...action.payload };
      StorageService.setUser(state);
    },
    
    incrementTrades: (state, action) => {
      const { isSuccessful = false } = action.payload || {};
      state.stats.totalTrades++;
      
      if (isSuccessful) {
        state.stats.successfulTrades++;
        state.stats.currentStreak++;
        if (state.stats.currentStreak > state.stats.longestStreak) {
          state.stats.longestStreak = state.stats.currentStreak;
        }
      } else {
        state.stats.currentStreak = 0;
      }
      
      StorageService.setUser(state);
    },
    
    updateTotalReturn: (state, action) => {
      state.stats.totalReturn = action.payload;
      StorageService.setUser(state);
    },
    
    levelUp: (state, action) => {
      const newLevel = action.payload;
      state.currentLevel = Math.max(state.currentLevel, newLevel);
      StorageService.setUser(state);
    },
    
    recordLogin: (state) => {
      const now = Date.now();
      const lastLogin = state.stats.lastLogin;
      
      // Check if it's a new day
      if (!lastLogin || !isSameDay(new Date(lastLogin), new Date(now))) {
        state.stats.daysActive++;
      }
      
      state.stats.lastLogin = now;
      StorageService.setUser(state);
    },
    
    completeOnboarding: (state) => {
      state.isOnboarding = false;
      StorageService.setUser(state);
    },
    
    resetUser: (state) => {
      Object.assign(state, initialState);
      StorageService.resetUser();
    }
  },
  extraReducers: (builder) => {
    builder
      // Register user
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          Object.assign(state, action.payload);
          state.isInitialized = true;
          state.isOnboarding = false;
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Initialize user from API
      .addCase(initializeUserFromAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initializeUserFromAPI.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          Object.assign(state, action.payload);
          state.isInitialized = true;
          state.isOnboarding = false;
        } else {
          // No authenticated user, show onboarding
          state.isInitialized = true;
          state.isOnboarding = true;
        }
      })
      .addCase(initializeUserFromAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // Clear token on auth error
        ApiService.clearToken();
        state.isInitialized = true;
        state.isOnboarding = true;
      });
  }
});

// Helper function to check if two dates are the same day
function isSameDay(date1, date2) {
  return date1.toDateString() === date2.toDateString();
}

export const {
  initializeUser,
  createUser,
  updateUser,
  updatePreferences,
  addPoints,
  updateStats,
  incrementTrades,
  updateTotalReturn,
  levelUp,
  recordLogin,
  completeOnboarding,
  resetUser
} = userSlice.actions;

// registerUser and initializeUserFromAPI are already exported above as const exports

export default userSlice.reducer;