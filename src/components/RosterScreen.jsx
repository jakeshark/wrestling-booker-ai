import React from 'react';
import { useGame } from '../context/GameProvider';

const RosterScreen = () => {
  const {
    wrestlers,
    goToDashboard,
    handleViewCareerHistory,
    handleViewRelationships,
    RosterIcon,
    HistoryIcon,
    RelationshipsIcon
  } = useGame();
  const getAlignmentClass = (alignment) => {
    switch (alignment) {
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

  const rosterList = Array.isArray(wrestlers) ? wrestlers : [];
  const cleanedWrestlers = rosterList.filter(
    (w) => w && typeof w.name === 'string' && w.name.trim().length > 0
  );

  if (cleanedWrestlers.length !== rosterList.length) {
    console.warn(
      'RosterScreen: Dropped',
      rosterList.length - cleanedWrestlers.length,
      'invalid roster entries'
    );
  }

  const safeName = (wrestler) =>
    wrestler && typeof wrestler.name === 'string' ? wrestler.name : '';

  const sortedWrestlers = [...cleanedWrestlers].sort((a, b) =>
    safeName(a).localeCompare(safeName(b))
  );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 text-white">
      <div className="flex justify-between items-center p-4 bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-white flex items-center">
          {RosterIcon && <RosterIcon />}
          Your Roster
        </h1>
        <button
          onClick={goToDashboard}
          className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-500 transition-all"
        >
          Back to Dashboard
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedWrestlers.length === 0 && (
          <p className="text-gray-400 md:col-span-3 text-center">No wrestlers found in your save data.</p>
        )}
        {sortedWrestlers.map((wrestler) => {
          const alignment = wrestler?.alignment || wrestler?.disposition || 'Unknown';
          const gimmick = wrestler?.gimmick || wrestler?.character?.gimmick || 'Unknown';
          const moraleValue = typeof wrestler?.morale === 'number'
            ? wrestler.morale
            : typeof wrestler?.metadata?.morale === 'number'
              ? wrestler.metadata.morale
              : null;
          const stats = wrestler?.stats || {};
          const inRing = wrestler?.inRing || {};
          const brawling = typeof stats.brawling === 'number'
            ? stats.brawling
            : typeof inRing.brawl === 'number'
              ? inRing.brawl
              : 0;
          const speed = typeof stats.speed === 'number'
            ? stats.speed
            : typeof inRing.speed === 'number'
              ? inRing.speed
              : 0;
          const technical = typeof stats.technical === 'number'
            ? stats.technical
            : typeof inRing.technical === 'number'
              ? inRing.technical
              : 0;
          const charismaStat = typeof stats.charisma === 'number'
            ? stats.charisma
            : typeof wrestler?.charisma === 'number'
              ? wrestler.charisma
              : typeof wrestler?.character?.charisma === 'number'
                ? wrestler.character.charisma
                : 0;

          return (
            <div key={wrestler.id} className="bg-gray-800 p-4 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold text-white">{wrestler.name}</h3>
              <p className="text-sm text-gray-400 mb-2">
                Gimmick: <span className="font-semibold text-gray-200">{gimmick}</span>
              </p>

              <div className="flex justify-between text-sm mb-3">
                <span className={`font-bold ${getAlignmentClass(alignment)}`}>
                  {alignment}
                </span>
                <span className="text-gray-300">
                  Morale:{' '}
                  <span className="font-semibold text-white">
                    {moraleValue !== null ? moraleValue : '—'}
                  </span>
                </span>
              </div>

              <div className="border-t border-gray-700 pt-2 grid grid-cols-4 gap-2 text-center text-xs">
                <div>
                  <span className="text-gray-400">BRAWL</span>
                  <p className="text-lg font-bold">{brawling}</p>
                </div>
                <div>
                  <span className="text-gray-400">SPEED</span>
                  <p className="text-lg font-bold">{speed}</p>
                </div>
                <div>
                  <span className="text-gray-400">TECH</span>
                  <p className="text-lg font-bold">{technical}</p>
                </div>
                <div>
                  <span className="text-gray-400">CHAR</span>
                  <p className="text-lg font-bold">{charismaStat}</p>
                </div>
              </div>

              {/* TODO: Surface deeper attributes (personality, move set, etc.) in future roster UX updates. */}

              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleViewCareerHistory(wrestler)}
                  className="w-full p-2 bg-indigo-600 text-white font-semibold rounded-lg text-sm hover:bg-indigo-500 transition-all flex items-center justify-center"
                >
                  {HistoryIcon && <HistoryIcon />}
                  History
                </button>
                <button
                  onClick={() => handleViewRelationships(wrestler)}
                  className="w-full p-2 bg-purple-600 text-white font-semibold rounded-lg text-sm hover:bg-purple-500 transition-all flex items-center justify-center"
                >
                  {RelationshipsIcon && <RelationshipsIcon />}
                  Relations
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RosterScreen;
