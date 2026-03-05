import React from 'react';
import SegmentModal from './SegmentModal';
import { useGame } from '../context/GameProvider';
import { getTitlePrestigeStyle } from '../utils/defaultTitles';

const BeltIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 mr-1">
    <path fillRule="evenodd" d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 0 0-.584.859 6.753 6.753 0 0 0 6.138 5.6 6.73 6.73 0 0 0 2.743 1.35A6.98 6.98 0 0 1 9.56 13.12v.001a7 7 0 0 1-3.144 1.132.75.75 0 0 0-.574.67L5.5 16.5h13l-.342-1.577a.75.75 0 0 0-.574-.67 7 7 0 0 1-3.144-1.132 6.98 6.98 0 0 1-1.425-1.546 6.73 6.73 0 0 0 2.743-1.35 6.753 6.753 0 0 0 6.138-5.6.75.75 0 0 0-.584-.86 47.078 47.078 0 0 0-3.07-.542V2.62a.75.75 0 0 0-.658-.744 49.793 49.793 0 0 0-6.093-.377c-2.063 0-4.096.128-6.093.377a.75.75 0 0 0-.657.744Zm0 2.629c0 1.196.312 2.32.857 3.294A5.266 5.266 0 0 1 3.16 5.337a45.6 45.6 0 0 1 2.006-.343v.256Zm13.5 0v-.256c.674.1 1.343.214 2.006.343a5.265 5.265 0 0 1-2.863 3.207 6.72 6.72 0 0 0 .857-3.294Z" clipRule="evenodd" />
  </svg>
);

const BookingScreen = ({
  currentShow,
  currentDate,
  segments = [],
  onCancel,
  onRunShow,
  onOpenSegment,
  SegmentAddIcon,
  segmentModalOpen,
  segment,
  onSegmentChange,
  onSegmentSave,
  onSegmentCancel
}) => {
  const { titles = [] } = useGame();

  if (!currentShow) return null;

  const formattedDate = typeof currentDate?.toDate === 'function'
    ? currentDate.toDate().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : '';

  const AddIcon = SegmentAddIcon || (() => null);

  const getTitleById = (titleId) => titles.find(t => t.id === titleId) || null;

  return (
    <>
      <div className="max-w-7xl mx-auto p-4 md:p-8 text-white">
        <div className="flex flex-col md:flex-row justify-between items-center p-4 bg-gray-800 rounded-lg shadow-lg">
          <div>
            <h1 className="text-2xl font-bold text-white">Book Show: {currentShow.eventName}</h1>
            <p className="text-indigo-300">
              {formattedDate}
              <span className="ml-4 font-semibold text-yellow-400">(Tier: {currentShow.eventTier})</span>
            </p>
          </div>
          <div className="flex space-x-2 mt-4 md:mt-0">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-600 text-white font-bold rounded-lg shadow-lg hover:bg-gray-500 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={onRunShow}
              className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg shadow-lg hover:bg-green-500 transition-all"
            >
              Run Show
            </button>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {segments.map((segmentItem, index) => {
            const titleOnLine = segmentItem?.titleId ? getTitleById(segmentItem.titleId) : null;
            const titleStyle = titleOnLine ? getTitlePrestigeStyle(titleOnLine.prestige) : null;

            return (
              <button
                key={index}
                onClick={() => onOpenSegment(index)}
                className="w-full p-4 bg-gray-700 rounded-lg shadow-md text-left hover:bg-gray-600 transition-all flex items-center"
              >
                <span className="text-lg font-bold text-gray-400 w-12">{index + 1}.</span>
                {segmentItem ? (
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-sm font-bold px-2 py-0.5 rounded ${segmentItem.type === 'Match' ? 'bg-blue-600' : 'bg-purple-600'}`}>
                        {segmentItem.type}
                      </span>
                      {titleOnLine && (
                        <span className={`flex items-center text-xs font-bold px-2 py-0.5 rounded ${titleStyle.badge}`}>
                          <BeltIcon />
                          {titleOnLine.shortName || titleOnLine.name}
                        </span>
                      )}
                      <span className="text-lg text-white">
                        {segmentItem.participants.map(p => p.name).join(' vs. ')}
                      </span>
                    </div>
                    {segmentItem.winnerId && (
                      <p className="mt-1 ml-0 text-sm text-yellow-400">
                        Winner: {segmentItem.participants.find(p => p.id === segmentItem.winnerId)?.name || 'N/A'}
                        {titleOnLine && <span className="ml-2 text-yellow-300">→ New Champion</span>}
                      </p>
                    )}
                  </div>
                ) : (
                  <span className="text-lg text-gray-400 flex items-center">
                    <AddIcon />
                    Add Segment
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <SegmentModal
        open={segmentModalOpen}
        segment={segment}
        onChange={onSegmentChange}
        onSave={onSegmentSave}
        onCancel={onSegmentCancel}
      />
    </>
  );
};

export default BookingScreen;
