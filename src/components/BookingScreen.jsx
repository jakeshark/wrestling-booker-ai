import React from 'react';
import SegmentModal from './SegmentModal';

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
  if (!currentShow) return null;

  const formattedDate = currentDate
    ? currentDate.toDate().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : '';

  const AddIcon = SegmentAddIcon || (() => null);

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
          {segments.map((segmentItem, index) => (
            <button
              key={index}
              onClick={() => onOpenSegment(index)}
              className="w-full p-4 bg-gray-700 rounded-lg shadow-md text-left hover:bg-gray-600 transition-all flex items-center"
            >
              <span className="text-lg font-bold text-gray-400 w-12">{index + 1}.</span>
              {segmentItem ? (
                <div>
                  <span className={`text-sm font-bold px-2 py-0.5 rounded ${segmentItem.type === 'Match' ? 'bg-blue-600' : 'bg-purple-600'}`}>
                    {segmentItem.type}
                  </span>
                  <span className="ml-3 text-lg text-white">
                    {segmentItem.participants.map(p => p.name).join(' vs. ')}
                  </span>
                  {segmentItem.winnerId && (
                    <p className="ml-16 text-sm text-yellow-400">
                      Winner: {segmentItem.participants.find(p => p.id === segmentItem.winnerId)?.name || 'N/A'}
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
          ))}
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
