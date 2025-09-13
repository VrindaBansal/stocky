import { STORAGE_KEYS } from '../utils/constants.js';

class StorageService {
  // Generic localStorage methods
  static get(key) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error getting from localStorage:', error);
      return null;
    }
  }

  static set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error setting to localStorage:', error);
      return false;
    }
  }

  static remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  }

  static clear() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }

  // User-specific methods
  static getUser() {
    return this.get(STORAGE_KEYS.USER) || {
      username: '',
      avatar: 'default',
      createdAt: Date.now(),
      currentLevel: 1,
      totalPoints: 0,
      preferences: {
        theme: 'light',
        soundEffects: true,
        animations: true
      },
      stats: {
        totalTrades: 0,
        successfulTrades: 0,
        totalReturn: 0,
        currentStreak: 0,
        longestStreak: 0,
        daysActive: 1
      }
    };
  }

  static setUser(userData) {
    return this.set(STORAGE_KEYS.USER, userData);
  }

  // Portfolio methods
  static getPortfolio(level) {
    return this.get(`${STORAGE_KEYS.PORTFOLIO}${level}`) || {
      level,
      cash: 0,
      totalValue: 0,
      startingValue: 0,
      positions: [],
      transactions: [],
      performance: []
    };
  }

  static setPortfolio(level, portfolioData) {
    return this.set(`${STORAGE_KEYS.PORTFOLIO}${level}`, portfolioData);
  }

  static getAllPortfolios() {
    const portfolios = {};
    for (let level = 1; level <= 5; level++) {
      const portfolio = this.getPortfolio(level);
      if (portfolio.startingValue > 0) {
        portfolios[level] = portfolio;
      }
    }
    return portfolios;
  }

  // Progress methods
  static getProgress() {
    return this.get(STORAGE_KEYS.PROGRESS) || {
      currentLevel: 1,
      levelStartDate: Date.now(),
      levelsCompleted: [],
      objectives: [],
      unlockedFeatures: ['buy', 'sell', 'portfolio']
    };
  }

  static setProgress(progressData) {
    return this.set(STORAGE_KEYS.PROGRESS, progressData);
  }

  // Achievements methods
  static getAchievements() {
    return this.get(STORAGE_KEYS.ACHIEVEMENTS) || {
      badges: [],
      points: 0,
      pointsHistory: []
    };
  }

  static setAchievements(achievementData) {
    return this.set(STORAGE_KEYS.ACHIEVEMENTS, achievementData);
  }

  // Settings methods
  static getSettings() {
    return this.get(STORAGE_KEYS.SETTINGS) || {
      theme: 'light',
      soundEffects: true,
      animations: true,
      notifications: true,
      autoSave: true
    };
  }

  static setSettings(settingsData) {
    return this.set(STORAGE_KEYS.SETTINGS, settingsData);
  }

  // Cache methods
  static getCache() {
    return this.get(STORAGE_KEYS.CACHE) || {};
  }

  static setCacheItem(key, data, expiry = 5 * 60 * 1000) { // 5 minutes default
    const cache = this.getCache();
    cache[key] = {
      data,
      timestamp: Date.now(),
      expiry: Date.now() + expiry
    };
    return this.set(STORAGE_KEYS.CACHE, cache);
  }

  static getCacheItem(key) {
    const cache = this.getCache();
    const item = cache[key];
    
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      // Remove expired item
      delete cache[key];
      this.set(STORAGE_KEYS.CACHE, cache);
      return null;
    }
    
    return item.data;
  }

  static clearExpiredCache() {
    const cache = this.getCache();
    const now = Date.now();
    let hasChanges = false;
    
    Object.keys(cache).forEach(key => {
      if (now > cache[key].expiry) {
        delete cache[key];
        hasChanges = true;
      }
    });
    
    if (hasChanges) {
      this.set(STORAGE_KEYS.CACHE, cache);
    }
  }

  // Export/Import methods
  static exportData() {
    const data = {
      user: this.getUser(),
      portfolios: this.getAllPortfolios(),
      progress: this.getProgress(),
      achievements: this.getAchievements(),
      settings: this.getSettings(),
      exportDate: new Date().toISOString()
    };
    
    return JSON.stringify(data, null, 2);
  }

  static importData(jsonData) {
    try {
      const data = JSON.parse(jsonData);
      
      // Validate data structure
      if (!data.user || !data.progress) {
        throw new Error('Invalid data format');
      }
      
      // Import data
      if (data.user) this.setUser(data.user);
      if (data.portfolios) {
        Object.entries(data.portfolios).forEach(([level, portfolio]) => {
          this.setPortfolio(parseInt(level), portfolio);
        });
      }
      if (data.progress) this.setProgress(data.progress);
      if (data.achievements) this.setAchievements(data.achievements);
      if (data.settings) this.setSettings(data.settings);
      
      return { success: true, message: 'Data imported successfully' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  // Reset methods
  static resetUser() {
    this.remove(STORAGE_KEYS.USER);
  }

  static resetPortfolio(level) {
    this.remove(`${STORAGE_KEYS.PORTFOLIO}${level}`);
  }

  static resetAllPortfolios() {
    for (let level = 1; level <= 5; level++) {
      this.resetPortfolio(level);
    }
  }

  static resetProgress() {
    this.remove(STORAGE_KEYS.PROGRESS);
  }

  static resetAchievements() {
    this.remove(STORAGE_KEYS.ACHIEVEMENTS);
  }

  // Tutorial methods
  static getTutorialData() {
    return this.get(STORAGE_KEYS.TUTORIAL) || {
      hasCompletedTutorial: false,
      currentTutorialStep: 0,
      showTutorial: false,
      tutorialData: {
        selectedStock: null,
        shares: 0,
        purchasePrice: 0,
        simulationSpeed: 1,
        daysPassed: 0
      }
    };
  }

  static setTutorialData(tutorialState) {
    return this.set(STORAGE_KEYS.TUTORIAL, tutorialState);
  }

  static clearTutorialData() {
    return this.remove(STORAGE_KEYS.TUTORIAL);
  }

  static resetAll() {
    this.resetUser();
    this.resetAllPortfolios();
    this.resetProgress();
    this.resetAchievements();
    this.remove(STORAGE_KEYS.SETTINGS);
    this.remove(STORAGE_KEYS.CACHE);
    this.remove(STORAGE_KEYS.TUTORIAL);
  }

  // Utility methods
  static getStorageSize() {
    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length;
      }
    }
    return total;
  }

  static getStorageSizeFormatted() {
    const size = this.getStorageSize();
    if (size < 1024) return size + ' bytes';
    if (size < 1024 * 1024) return (size / 1024).toFixed(2) + ' KB';
    return (size / (1024 * 1024)).toFixed(2) + ' MB';
  }
}

export default StorageService;