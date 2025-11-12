import React from 'react';
import { useGame } from '../context/GameContext';

const RosterScreen = ({
  RosterIcon,
  HistoryIcon,
  RelationshipsIcon,
}) => {
  const {
    gameData,
    navigateToDashboard,
    viewCareerHistory,
    viewRelationships,
  } = useGame();

  const wrestlers = gameData?.save_wrestlers || [];
  const getDispositionClass = (disposition) => {
    switch (disposition) {
      case 'Face':
        return 'text-green-400';
      case 'Heel':
        return 'text-red-400';
      case 'Tweener':
        return 'text-yellow-400';
      default:
        return 'text-gray-400';
    }
  };

  const sortedWrestlers = [...wrestlers].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 text-white">
      <div className="flex justify-between items-center p-4 bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-white flex items-center">
          {RosterIcon && <RosterIcon />}
          Your Roster
        </h1>
        <button
          onClick={navigateToDashboard}
          className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-500 transition-all"
        >
          Back to Dashboard
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedWrestlers.length === 0 && (
          <p className="text-gray-400 md:col-span-3 text-center">No wrestlers found in your save data.</p>
        )}
        {sortedWrestlers.map((wrestler) => (
          <div key={wrestler.id} className="bg-gray-800 p-4 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-white">{wrestler.name}</h3>
            <p className="text-sm text-gray-400 mb-2">
              Gimmick: <span className="font-semibold text-gray-200">{wrestler.gimmick}</span>
            </p>

            <div className="flex justify-between text-sm mb-3">
              <span className={`font-bold ${getDispositionClass(wrestler.disposition)}`}>
                {wrestler.disposition}
              </span>
              <span className="text-gray-300">
                Morale: <span className="font-semibold text-white">{wrestler.morale}</span>
              </span>
            </div>

            <div className="border-t border-gray-700 pt-2 grid grid-cols-4 gap-2 text-center text-xs">
              <div>
                <span className="text-gray-400">BRAWL</span>
                <p className="text-lg font-bold">{wrestler.stats.brawling}</p>
              </div>
              <div>
                <span className="text-gray-400">SPEED</span>
                <p className="text-lg font-bold">{wrestler.stats.speed}</p>
              </div>
              <div>
                <span className="text-gray-400">TECH</span>
                <p className="text-lg font-bold">{wrestler.stats.technical}</p>
              </div>
              <div>
                <span className="text-gray-400">CHAR</span>
                <p className="text-lg font-bold">{wrestler.stats.charisma}</p>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                onClick={() => viewCareerHistory(wrestler)}
                className="w-full p-2 bg-indigo-600 text-white font-semibold rounded-lg text-sm hover:bg-indigo-500 transition-all flex items-center justify-center"
              >
                {HistoryIcon && <HistoryIcon />}
                History
              </button>
              <button
                onClick={() => viewRelationships(wrestler)}
                className="w-full p-2 bg-purple-600 text-white font-semibold rounded-lg text-sm hover:bg-purple-500 transition-all flex items-center justify-center"
              >
                {RelationshipsIcon && <RelationshipsIcon />}
                Relations
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RosterScreen;
