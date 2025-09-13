import { createSlice } from '@reduxjs/toolkit';
import StorageService from '../../services/storageService.js';

const initialState = {
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

const tutorialSlice = createSlice({
  name: 'tutorial',
  initialState,
  reducers: {
    initializeTutorial: (state) => {
      const tutorialData = StorageService.getTutorialData();
      if (tutorialData) {
        Object.assign(state, tutorialData);
      }
    },

    startTutorial: (state) => {
      state.showTutorial = true;
      state.currentTutorialStep = 0;
      state.hasCompletedTutorial = false;
    },

    closeTutorial: (state) => {
      state.showTutorial = false;
    },

    nextTutorialStep: (state) => {
      state.currentTutorialStep += 1;
    },

    previousTutorialStep: (state) => {
      if (state.currentTutorialStep > 0) {
        state.currentTutorialStep -= 1;
      }
    },

    setTutorialStep: (state, action) => {
      state.currentTutorialStep = action.payload;
    },

    updateTutorialData: (state, action) => {
      state.tutorialData = { ...state.tutorialData, ...action.payload };
      StorageService.setTutorialData(state);
    },

    completeTutorial: (state) => {
      state.hasCompletedTutorial = true;
      state.showTutorial = false;
      state.currentTutorialStep = 0;
      StorageService.setTutorialData(state);
    },

    resetTutorial: (state) => {
      Object.assign(state, initialState);
      StorageService.clearTutorialData();
    }
  }
});

export const {
  initializeTutorial,
  startTutorial,
  closeTutorial,
  nextTutorialStep,
  previousTutorialStep,
  setTutorialStep,
  updateTutorialData,
  completeTutorial,
  resetTutorial
} = tutorialSlice.actions;

export default tutorialSlice.reducer;