import React from 'react';

const QuestBadge = ({ count = 0, onClick }) => {
  const displayCount = typeof count === 'number' && count > 0 ? count : 0;
  const hasActive = displayCount > 0;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full p-4 rounded-lg shadow-md text-left transition-all flex items-center justify-between ${
        hasActive
          ? 'bg-indigo-700 hover:bg-indigo-600 text-white'
          : 'bg-gray-700 hover:bg-gray-600 text-gray-100'
      }`}
    >
      <span className="font-semibold">Journal</span>
      <span
        className={`px-2 py-1 text-xs font-bold rounded-full ${
          hasActive ? 'bg-indigo-500 text-white' : 'bg-gray-600 text-gray-200'
        }`}
      >
        {`(${displayCount})`}
      </span>
    </button>
  );
};

export default QuestBadge;
