import React, { createContext, useContext } from 'react';

const GameContext = createContext(null);

export const GameProvider = ({ value, children }) => (
  <GameContext.Provider value={value}>
    {children}
  </GameContext.Provider>
);

export const useGame = () => {
  const context = useContext(GameContext);

  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }

  return context;
};

export default GameProvider;
