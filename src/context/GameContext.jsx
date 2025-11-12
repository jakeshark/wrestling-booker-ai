import React, { createContext, useContext, useMemo } from 'react';

const GameContext = createContext(null);

export const GameProvider = ({
  activeSave,
  gameDate,
  gameData,
  setGameData,
  navigateToDashboard,
  viewCareerHistory,
  viewRelationships,
  children,
}) => {
  const value = useMemo(
    () => ({
      activeSave,
      gameDate,
      gameData,
      setGameData,
      navigateToDashboard,
      viewCareerHistory,
      viewRelationships,
    }),
    [
      activeSave,
      gameDate,
      gameData,
      setGameData,
      navigateToDashboard,
      viewCareerHistory,
      viewRelationships,
    ]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = () => {
  const context = useContext(GameContext);

  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }

  return context;
};

export default GameContext;
