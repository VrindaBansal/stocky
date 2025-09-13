import { createSlice } from '@reduxjs/toolkit';
import StorageService from '../../services/storageService.js';
import { LEVELS, ACHIEVEMENTS } from '../../utils/constants.js';

const initialState = {
  currentLevel: 1,
  levelStartDate: Date.now(),
  levelsCompleted: [],
  objectives: [],
  unlockedFeatures: ['buy', 'sell', 'portfolio'],
  achievements: {
    badges: [],
    points: 0,
    pointsHistory: []
  },
  levelProgress: {
    isComplete: false,
    requirements: [],
    progress: {}
  },
  notifications: [],
  isLevelComplete: false
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    initializeGame: (state) => {
      const progress = StorageService.getProgress();
      const achievements = StorageService.getAchievements();
      
      state.currentLevel = progress.currentLevel;
      state.levelStartDate = progress.levelStartDate;
      state.levelsCompleted = progress.levelsCompleted;
      state.objectives = progress.objectives;
      state.unlockedFeatures = progress.unlockedFeatures;
      state.achievements = achievements;
      
      // Set up current level objectives
      state.levelProgress = calculateLevelProgress(state.currentLevel, progress);
    },

    completeLevel: (state, action) => {
      const { level, finalValue, performance, timeToComplete } = action.payload;
      
      // Add to completed levels
      const completedLevel = {
        level,
        completedAt: Date.now(),
        finalValue,
        performance,
        timeToComplete
      };
      
      state.levelsCompleted.push(completedLevel);
      
      // Advance to next level
      if (level < 5) {
        state.currentLevel = level + 1;
        state.levelStartDate = Date.now();
        
        // Unlock new features for next level
        const nextLevelConfig = LEVELS[state.currentLevel];
        state.unlockedFeatures = [...new Set([...state.unlockedFeatures, ...nextLevelConfig.features])];
        
        // Set up new objectives
        state.objectives = generateObjectives(state.currentLevel);
        state.levelProgress = calculateLevelProgress(state.currentLevel);
      }
      
      // Award completion points
      state.achievements.points += 500;
      state.achievements.pointsHistory.push({
        source: `Level ${level} Completion`,
        amount: 500,
        timestamp: Date.now()
      });
      
      // Save progress
      const progressData = {
        currentLevel: state.currentLevel,
        levelStartDate: state.levelStartDate,
        levelsCompleted: state.levelsCompleted,
        objectives: state.objectives,
        unlockedFeatures: state.unlockedFeatures
      };
      
      StorageService.setProgress(progressData);
      StorageService.setAchievements(state.achievements);
      
      state.isLevelComplete = true;
    },

    updateObjectiveProgress: (state, action) => {
      const { objectiveId, progress } = action.payload;
      
      const objective = state.objectives.find(obj => obj.id === objectiveId);
      if (objective) {
        objective.progress = Math.min(progress, objective.target);
        objective.completed = objective.progress >= objective.target;
        
        // Save progress
        const progressData = {
          currentLevel: state.currentLevel,
          levelStartDate: state.levelStartDate,
          levelsCompleted: state.levelsCompleted,
          objectives: state.objectives,
          unlockedFeatures: state.unlockedFeatures
        };
        StorageService.setProgress(progressData);
      }
    },

    awardAchievement: (state, action) => {
      const achievementId = action.payload;
      const achievement = ACHIEVEMENTS[achievementId.toUpperCase()];
      
      if (achievement && !state.achievements.badges.find(badge => badge.id === achievement.id)) {
        const newBadge = {
          ...achievement,
          earnedAt: Date.now()
        };
        
        state.achievements.badges.push(newBadge);
        state.achievements.points += achievement.points;
        state.achievements.pointsHistory.push({
          source: `Achievement: ${achievement.name}`,
          amount: achievement.points,
          timestamp: Date.now()
        });
        
        // Add notification
        state.notifications.push({
          id: Date.now(),
          type: 'achievement',
          title: 'Achievement Unlocked!',
          message: `${achievement.name}: ${achievement.description}`,
          icon: achievement.icon,
          timestamp: Date.now()
        });
        
        StorageService.setAchievements(state.achievements);
      }
    },

    addNotification: (state, action) => {
      const notification = {
        id: Date.now(),
        timestamp: Date.now(),
        ...action.payload
      };
      
      state.notifications.unshift(notification);
      
      // Keep only last 20 notifications
      if (state.notifications.length > 20) {
        state.notifications = state.notifications.slice(0, 20);
      }
    },

    removeNotification: (state, action) => {
      const notificationId = action.payload;
      state.notifications = state.notifications.filter(n => n.id !== notificationId);
    },

    clearNotifications: (state) => {
      state.notifications = [];
    },

    resetLevelCompletion: (state) => {
      state.isLevelComplete = false;
    },

    skipToLevel: (state, action) => {
      const targetLevel = action.payload;
      
      if (targetLevel >= 1 && targetLevel <= 5) {
        state.currentLevel = targetLevel;
        state.levelStartDate = Date.now();
        
        // Unlock all features up to this level
        const unlockedFeatures = new Set(['buy', 'sell', 'portfolio']);
        for (let level = 1; level <= targetLevel; level++) {
          const levelConfig = LEVELS[level];
          levelConfig.features.forEach(feature => unlockedFeatures.add(feature));
        }
        state.unlockedFeatures = Array.from(unlockedFeatures);
        
        // Set up objectives for current level
        state.objectives = generateObjectives(targetLevel);
        state.levelProgress = calculateLevelProgress(targetLevel);
        
        // Save progress
        const progressData = {
          currentLevel: state.currentLevel,
          levelStartDate: state.levelStartDate,
          levelsCompleted: state.levelsCompleted,
          objectives: state.objectives,
          unlockedFeatures: state.unlockedFeatures
        };
        StorageService.setProgress(progressData);
      }
    },

    resetProgress: (state) => {
      Object.assign(state, {
        ...initialState,
        achievements: state.achievements, // Keep achievements
        objectives: generateObjectives(1),
        levelProgress: calculateLevelProgress(1)
      });
      
      StorageService.resetProgress();
    }
  }
});

// Helper functions
function generateObjectives(level) {
  const levelConfig = LEVELS[level];
  const objectives = [
    {
      id: 'portfolio_value',
      description: `Reach portfolio value of ${levelConfig.winCondition}`,
      progress: 0,
      target: levelConfig.winCondition,
      completed: false
    }
  ];

  // Add level-specific objectives
  switch (level) {
    case 1:
      objectives.push({
        id: 'complete_trades',
        description: 'Complete 5 successful trades',
        progress: 0,
        target: 5,
        completed: false
      });
      break;
      
    case 2:
      objectives.push({
        id: 'diversify_stocks',
        description: 'Own stocks from 3 different companies',
        progress: 0,
        target: 3,
        completed: false
      });
      break;
      
    case 3:
      objectives.push({
        id: 'use_stop_loss',
        description: 'Use stop-loss orders 3 times',
        progress: 0,
        target: 3,
        completed: false
      });
      break;
      
    case 4:
      objectives.push({
        id: 'short_trade',
        description: 'Complete 1 successful short trade',
        progress: 0,
        target: 1,
        completed: false
      });
      break;
      
    case 5:
      objectives.push({
        id: 'portfolio_diversity',
        description: 'Maintain positions in 5+ different sectors',
        progress: 0,
        target: 5,
        completed: false
      });
      break;
  }

  return objectives;
}

function calculateLevelProgress(level, progress = null) {
  const levelConfig = LEVELS[level];
  const objectives = progress?.objectives || generateObjectives(level);
  
  const completedObjectives = objectives.filter(obj => obj.completed).length;
  const totalObjectives = objectives.length;
  
  return {
    isComplete: completedObjectives === totalObjectives,
    requirements: objectives,
    progress: {
      completed: completedObjectives,
      total: totalObjectives,
      percentage: totalObjectives > 0 ? (completedObjectives / totalObjectives) * 100 : 0
    }
  };
}

export const {
  initializeGame,
  completeLevel,
  updateObjectiveProgress,
  awardAchievement,
  addNotification,
  removeNotification,
  clearNotifications,
  resetLevelCompletion,
  skipToLevel,
  resetProgress
} = gameSlice.actions;

export default gameSlice.reducer;