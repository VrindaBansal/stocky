import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { store } from './store/store.js';

// Store actions
import { initializeUser, initializeUserFromAPI, recordLogin } from './store/slices/userSlice.js';
import { initializePortfolios, fetchAllPortfolios } from './store/slices/portfolioSlice.js';
import { initializeTutorial } from './store/slices/tutorialSlice.js';
import { initializeGame } from './store/slices/gameSlice.js';

// Layout Components
import Header from './components/layout/Header.jsx';
import Sidebar from './components/layout/Sidebar.jsx';

// Page Components
import Onboarding from './pages/Onboarding.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Progress from './pages/Progress.jsx';
import Portfolio from './pages/Portfolio.jsx';
import Market from './pages/Market.jsx';
import Trading from './pages/Trading.jsx';
import Education from './pages/Education.jsx';
import Profile from './pages/Profile.jsx';
import StockDetail from './pages/StockDetail.jsx';

// Level Completion
import LevelCompletionModal from './components/LevelCompletionModal.jsx';
import useLevelCompletion from './hooks/useLevelCompletion.js';

function App() {
  const dispatch = useDispatch();
  const { isInitialized, isOnboarding } = useSelector(state => state.user);
  
  // Level completion detection
  const { isLevelComplete, completionData, resetCompletion } = useLevelCompletion();
  
  useEffect(() => {
    // Smart initialization: Try backend first, fallback to localStorage
    const initializeApp = async () => {
      try {
        // Try to initialize from API first
        const result = await dispatch(initializeUserFromAPI());
        if (result.payload) {
          // User is authenticated, fetch portfolios from API
          try {
            await dispatch(fetchAllPortfolios());
          } catch (error) {
            console.warn('Portfolio API failed, using localStorage');
            dispatch(initializePortfolios());
          }
        } else {
          // No authenticated user, use localStorage
          await dispatch(initializeUser());
          // Pass current level from user state
          const userState = store.getState().user;
          dispatch(initializePortfolios({ currentLevel: userState.currentLevel }));
        }
      } catch (error) {
        console.warn('Backend unavailable, using localStorage only');
        // Fallback to localStorage if API fails
        await dispatch(initializeUser());
        const userState = store.getState().user;
        dispatch(initializePortfolios({ currentLevel: userState.currentLevel }));
      }
      
      dispatch(initializeTutorial());
      dispatch(initializeGame());
      dispatch(recordLogin());
    };

    initializeApp();
  }, [dispatch]);

  // Show loading if not initialized
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold gradient-text">Loading Stocky...</h2>
          <p className="text-gray-600 mt-2">Preparing your trading adventure</p>
        </motion.div>
      </div>
    );
  }

  // Show onboarding if user hasn't completed it
  if (isOnboarding) {
    return <Onboarding />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="flex">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main content */}
        <div className="flex-1 lg:ml-64">
          {/* Header */}
          <Header />
          
          {/* Page content */}
          <main className="p-3 sm:p-4 lg:p-6 pb-20">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/progress" element={<Progress />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/market" element={<Market />} />
                <Route path="/market/:symbol" element={<StockDetail />} />
                <Route path="/trading" element={<Trading />} />
                <Route path="/trading/:symbol" element={<Trading />} />
                <Route path="/education" element={<Education />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* Level Completion Modal */}
      {completionData && (
        <LevelCompletionModal
          isOpen={isLevelComplete}
          level={completionData.level}
          portfolioValue={completionData.portfolioValue}
          performance={completionData.performance}
          timeToComplete={completionData.timeToComplete}
        />
      )}
    </div>
  );
}

export default App;