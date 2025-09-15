import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateObjectiveProgress } from '../store/slices/gameSlice.js';
import { LEVELS } from '../utils/constants.js';

export const useLevelCompletion = () => {
  const dispatch = useDispatch();
  const { activePortfolio } = useSelector(state => state.portfolio);
  const { currentLevel, objectives, levelsCompleted, levelStartDate } = useSelector(state => state.game);
  const [isLevelComplete, setIsLevelComplete] = useState(false);
  const [completionData, setCompletionData] = useState(null);

  useEffect(() => {
    if (!activePortfolio || !objectives.length) return;

    const levelConfig = LEVELS[currentLevel];
    const portfolioValue = activePortfolio.totalValue;
    const transactionCount = activePortfolio.transactions?.length || 0;
    const positionCount = activePortfolio.positions?.length || 0;
    
    // Check if level is already completed
    const alreadyCompleted = levelsCompleted.some(level => level.level === currentLevel);
    if (alreadyCompleted) return;

    // Update portfolio value objective
    const portfolioObjective = objectives.find(obj => obj.id === 'portfolio_value');
    if (portfolioObjective && portfolioObjective.progress !== portfolioValue) {
      dispatch(updateObjectiveProgress({
        objectiveId: 'portfolio_value',
        progress: portfolioValue
      }));
    }

    // Update level-specific objectives
    if (currentLevel === 1) {
      // Count successful trades (buy + sell pairs)
      const buyTransactions = activePortfolio.transactions?.filter(t => t.type === 'buy') || [];
      const sellTransactions = activePortfolio.transactions?.filter(t => t.type === 'sell') || [];
      const completedTrades = Math.min(buyTransactions.length, sellTransactions.length);
      
      const tradesObjective = objectives.find(obj => obj.id === 'complete_trades');
      if (tradesObjective && tradesObjective.progress !== completedTrades) {
        dispatch(updateObjectiveProgress({
          objectiveId: 'complete_trades',
          progress: completedTrades
        }));
      }

      // Check completion criteria for Level 1
      const hasMetPortfolioTarget = portfolioValue >= levelConfig.winCondition;
      const hasCompletedTrades = completedTrades >= 5;
      
      if (hasMetPortfolioTarget && hasCompletedTrades && !isLevelComplete) {
        const startingValue = levelConfig.startingCapital;
        const performance = ((portfolioValue - startingValue) / startingValue) * 100;
        const timeToComplete = Date.now() - levelStartDate;
        
        setCompletionData({
          level: currentLevel,
          portfolioValue,
          performance,
          timeToComplete
        });
        setIsLevelComplete(true);
      }
    }

    if (currentLevel === 2) {
      // Count unique stocks owned
      const uniqueStocks = activePortfolio.positions?.length || 0;
      
      const diversityObjective = objectives.find(obj => obj.id === 'diversify_stocks');
      if (diversityObjective && diversityObjective.progress !== uniqueStocks) {
        dispatch(updateObjectiveProgress({
          objectiveId: 'diversify_stocks',
          progress: uniqueStocks
        }));
      }

      // Check completion criteria for Level 2
      const hasMetPortfolioTarget = portfolioValue >= levelConfig.winCondition;
      const hasDiversifiedStocks = uniqueStocks >= 3;
      
      if (hasMetPortfolioTarget && hasDiversifiedStocks && !isLevelComplete) {
        const startingValue = levelConfig.startingCapital;
        const performance = ((portfolioValue - startingValue) / startingValue) * 100;
        const timeToComplete = Date.now() - levelStartDate;
        
        setCompletionData({
          level: currentLevel,
          portfolioValue,
          performance,
          timeToComplete
        });
        setIsLevelComplete(true);
      }
    }

    if (currentLevel === 3) {
      // For now, just check portfolio value (stop-loss orders not implemented yet)
      const hasMetPortfolioTarget = portfolioValue >= levelConfig.winCondition;
      
      if (hasMetPortfolioTarget && !isLevelComplete) {
        const startingValue = levelConfig.startingCapital;
        const performance = ((portfolioValue - startingValue) / startingValue) * 100;
        const timeToComplete = Date.now() - levelStartDate;
        
        setCompletionData({
          level: currentLevel,
          portfolioValue,
          performance,
          timeToComplete
        });
        setIsLevelComplete(true);
      }
    }

    if (currentLevel === 4) {
      // For now, just check portfolio value (short selling not fully implemented yet)
      const hasMetPortfolioTarget = portfolioValue >= levelConfig.winCondition;
      
      if (hasMetPortfolioTarget && !isLevelComplete) {
        const startingValue = levelConfig.startingCapital;
        const performance = ((portfolioValue - startingValue) / startingValue) * 100;
        const timeToComplete = Date.now() - levelStartDate;
        
        setCompletionData({
          level: currentLevel,
          portfolioValue,
          performance,
          timeToComplete
        });
        setIsLevelComplete(true);
      }
    }

    if (currentLevel === 5) {
      // Final level - just portfolio target
      const hasMetPortfolioTarget = portfolioValue >= levelConfig.winCondition;
      
      if (hasMetPortfolioTarget && !isLevelComplete) {
        const startingValue = levelConfig.startingCapital;
        const performance = ((portfolioValue - startingValue) / startingValue) * 100;
        const timeToComplete = Date.now() - levelStartDate;
        
        setCompletionData({
          level: currentLevel,
          portfolioValue,
          performance,
          timeToComplete
        });
        setIsLevelComplete(true);
      }
    }

  }, [activePortfolio, currentLevel, objectives, dispatch, levelsCompleted, levelStartDate, isLevelComplete]);

  const resetCompletion = () => {
    setIsLevelComplete(false);
    setCompletionData(null);
  };

  return {
    isLevelComplete,
    completionData,
    resetCompletion
  };
};

export default useLevelCompletion;