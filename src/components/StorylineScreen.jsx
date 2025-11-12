import React from 'react';

const StorylineScreen = ({
  storylines = [],
  onOpenCreateStoryline,
  onBackToDashboard,
  showStorylineModal,
  onCloseStorylineModal,
  storylineFormData,
  setStorylineFormData,
  storylineParticipantSearch = '',
  onStorylineParticipantSearch,
  storylineParticipantResults = [],
  onAddStorylineParticipant,
  onRemoveStorylineParticipant,
  onCreateStoryline,
  FireIcon,
  PlusIcon,
  CloseIcon,
  XCircleIcon,
}) => {
  const activeStorylines = storylines.filter((storyline) => storyline.status === 'Active');

  return (
    <>
      <div className="max-w-7xl mx-auto p-4 md:p-8 text-white">
        <div className="flex justify-between items-center p-4 bg-gray-800 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-white flex items-center">
            {FireIcon ? <FireIcon /> : null}
            Storyline Manager
          </h1>
          <div className="flex space-x-2">
            <button
              onClick={onOpenCreateStoryline}
              className="px-4 py-2 bg-green-600 text-white font-bold rounded-lg shadow-lg hover:bg-green-500 transition-all flex items-center"
            >
              {PlusIcon ? <PlusIcon /> : null}
              Create Storyline
            </button>
            <button
              onClick={onBackToDashboard}
              className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-500 transition-all"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {storylines.length === 0 && (
            <p className="text-gray-400 md:col-span-2 text-center p-8">You have no active storylines. Go create one!</p>
          )}
          {activeStorylines.map((storyline) => (
            <div key={storyline.id} className="bg-gray-800 p-4 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold text-white">{storyline.name}</h3>
              <p className="text-sm text-gray-400 mb-2">
                Heat: <span className="font-semibold text-red-400">{storyline.heat}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {storyline.participants.map((participant) => (
                  <span key={participant.id} className="bg-gray-700 text-sm px-3 py-1 rounded-full">
                    {participant.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showStorylineModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={onCloseStorylineModal}
        >
          <div
            className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-lg"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
              <h2 className="text-2xl font-bold text-white">Create New Storyline</h2>
              <button
                onClick={onCloseStorylineModal}
                className="text-gray-400 hover:text-white"
              >
                {CloseIcon ? <CloseIcon /> : null}
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Storyline Name</label>
                <input
                  type="text"
                  name="name"
                  value={storylineFormData?.name || ''}
                  onChange={(event) =>
                    setStorylineFormData((prev) => ({ ...prev, name: event.target.value }))
                  }
                  placeholder="e.g., Main Event Title Feud"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Participants (min. 2)
                </label>
                <div className="p-2 bg-gray-700 rounded-lg min-h-[50px] flex flex-wrap gap-2">
                  {(storylineFormData?.participants || []).map((participant) => (
                    <span key={participant.id} className="flex items-center bg-indigo-600 text-white text-sm font-medium px-3 py-1 rounded-full">
                      {participant.name}
                      <button
                        onClick={() => onRemoveStorylineParticipant(participant.id)}
                        className="ml-2 text-indigo-100 hover:text-white"
                      >
                        {XCircleIcon ? <XCircleIcon /> : null}
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Add Participant
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    value={storylineParticipantSearch}
                    onChange={(event) => onStorylineParticipantSearch(event.target.value)}
                    placeholder="Search roster..."
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                {storylineParticipantResults.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-gray-600 border border-gray-500 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {storylineParticipantResults.map((wrestler) => (
                      <button
                        key={wrestler.id}
                        onClick={() => onAddStorylineParticipant(wrestler)}
                        className="block w-full text-left px-4 py-2 text-white hover:bg-indigo-500"
                      >
                        {wrestler.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 bg-gray-700 border-t border-gray-600 flex justify-end space-x-3">
              <button
                onClick={onCloseStorylineModal}
                className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg shadow-lg hover:bg-gray-500 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={onCreateStoryline}
                className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg shadow-lg hover:bg-green-500 transition-all"
              >
                Create Storyline
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StorylineScreen;
