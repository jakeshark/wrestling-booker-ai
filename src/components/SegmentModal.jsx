import React, { useEffect, useMemo, useState } from 'react';
import { useGame } from '../context/GameProvider';

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path
      fillRule="evenodd"
      d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 0 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
      clipRule="evenodd"
    />
  </svg>
);

const XCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.707-11.707a1 1 0 0 0-1.414-1.414L10 8.586 7.707 6.293a1 1 0 0 0-1.414 1.414L8.586 10l-2.293 2.293a1 1 0 1 0 1.414 1.414L10 11.414l2.293 2.293a1 1 0 0 0 1.414-1.414L11.414 10l2.293-2.293Z"
      clipRule="evenodd"
    />
  </svg>
);

const SegmentModal = ({ open, segment, onChange, onSave, onCancel }) => {
  const { wrestlers = [], storylines = [] } = useGame();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (!open) {
      setSearchQuery('');
      setSearchResults([]);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      setSearchResults([]);
      return;
    }

    const participants = segment?.participants || [];
    const results = wrestlers
      .filter(w => w.name.toLowerCase().includes(query))
      .filter(w => !participants.some(p => p.id === w.id))
      .slice(0, 5);

    setSearchResults(results);
  }, [open, searchQuery, wrestlers, segment]);

  const activeStorylines = useMemo(
    () => storylines.filter(storyline => storyline.status === 'Active'),
    [storylines]
  );

  if (!open) return null;

  const participants = segment?.participants || [];

  const handleTypeChange = (event) => {
    onChange('type', event.target.value);
  };

  const handleStorylineChange = (event) => {
    onChange('storylineId', event.target.value || null);
  };

  const handleWinnerChange = (event) => {
    onChange('winnerId', event.target.value || null);
  };

  const handleAddParticipant = (wrestler) => {
    const nextParticipants = [...participants, { id: wrestler.id, name: wrestler.name }];
    onChange('participants', nextParticipants);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleRemoveParticipant = (wrestlerId) => {
    const nextParticipants = participants.filter(p => p.id !== wrestlerId);
    onChange('participants', nextParticipants);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={onCancel}
    >
      <div
        className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-lg"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">Edit Segment {segment?.segmentNumber}</h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-white">
            <CloseIcon />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Segment Type</label>
            <select
              name="type"
              value={segment?.type || 'Match'}
              onChange={handleTypeChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Match">Match</option>
              <option value="Angle">Angle</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Assign to Storyline (Optional)</label>
            <select
              name="storylineId"
              value={segment?.storylineId || ''}
              onChange={handleStorylineChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">-- None --</option>
              {activeStorylines.map(storyline => (
                <option key={storyline.id} value={storyline.id}>
                  {storyline.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Participants</label>
            <div className="p-2 bg-gray-700 rounded-lg min-h-[50px] flex flex-wrap gap-2">
              {participants.map(participant => (
                <span key={participant.id} className="flex items-center bg-indigo-600 text-white text-sm font-medium px-3 py-1 rounded-full">
                  {participant.name}
                  <button
                    onClick={() => handleRemoveParticipant(participant.id)}
                    className="ml-2 text-indigo-100 hover:text-white"
                    type="button"
                  >
                    <XCircleIcon />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-300 mb-1">Add Participant</label>
            <div className="flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search roster..."
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            {searchResults.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-gray-600 border border-gray-500 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {searchResults.map(wrestler => (
                  <button
                    key={wrestler.id}
                    onClick={() => handleAddParticipant(wrestler)}
                    className="block w-full text-left px-4 py-2 text-white hover:bg-indigo-500"
                    type="button"
                  >
                    {wrestler.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {segment?.type === 'Match' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Winner (Optional)</label>
              <select
                name="winnerId"
                value={segment?.winnerId || ''}
                onChange={handleWinnerChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={participants.length === 0}
              >
                <option value="">-- Select a Winner --</option>
                {participants.map(participant => (
                  <option key={participant.id} value={participant.id}>
                    {participant.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="p-4 bg-gray-700 border-t border-gray-600 flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg shadow-lg hover:bg-gray-500 transition-all"
            type="button"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-500 transition-all"
            type="button"
          >
            Save Segment
          </button>
        </div>
      </div>
    </div>
  );
};

export default SegmentModal;
