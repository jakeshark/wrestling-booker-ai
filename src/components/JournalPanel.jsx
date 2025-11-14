import React, { useMemo, useState } from 'react';

const FILTERS = ['All', 'Active', 'Succeeded', 'Failed', 'Cancelled'];

const statusStyles = {
  active: 'bg-blue-500/20 text-blue-200 border border-blue-500/40',
  succeeded: 'bg-green-500/20 text-green-200 border border-green-500/40',
  failed: 'bg-red-500/20 text-red-200 border border-red-500/40',
  cancelled: 'bg-gray-600/20 text-gray-200 border border-gray-600/40'
};

const categoryColors = {
  Talent: 'bg-purple-500/20 text-purple-200 border border-purple-500/40',
  Creative: 'bg-indigo-500/20 text-indigo-200 border border-indigo-500/40',
  Business: 'bg-yellow-500/20 text-yellow-200 border border-yellow-500/40',
  Medical: 'bg-rose-500/20 text-rose-200 border border-rose-500/40',
  Other: 'bg-gray-500/20 text-gray-200 border border-gray-500/40'
};

const formatTimestamp = (value) => {
  if (!value) return '—';
  try {
    const date = typeof value.toDate === 'function' ? value.toDate() : value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return '—';
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch (error) {
    console.warn('[JournalPanel] Failed to format timestamp', error);
    return '—';
  }
};

const sanitizeEntries = (entries) => {
  if (!Array.isArray(entries)) return [];
  return entries.filter((entry) => {
    const valid = entry && typeof entry === 'object';
    if (!valid) {
      console.warn('[journal] Skipping malformed entry', entry);
    }
    return valid;
  });
};

const JournalPanel = ({ quests = [], onClose }) => {
  const [filter, setFilter] = useState('All');
  const [expandedId, setExpandedId] = useState(null);

  const safeEntries = useMemo(() => sanitizeEntries(quests), [quests]);

  console.log('[journal] rendering JournalPanel with', safeEntries.length, 'entries');

  const sortedQuests = useMemo(() => {
    return [...safeEntries].sort((a, b) => {
      const aCreated = typeof a?.createdAt?.toMillis === 'function'
        ? a.createdAt.toMillis()
        : (a?.createdAt instanceof Date ? a.createdAt.getTime() : Date.parse(a?.createdAt || 0) || 0);
      const bCreated = typeof b?.createdAt?.toMillis === 'function'
        ? b.createdAt.toMillis()
        : (b?.createdAt instanceof Date ? b.createdAt.getTime() : Date.parse(b?.createdAt || 0) || 0);
      return bCreated - aCreated;
    });
  }, [safeEntries]);

  const filteredQuests = useMemo(() => {
    if (filter === 'All') return sortedQuests;
    const lowered = filter.toLowerCase();
    return sortedQuests.filter((quest) => (quest.status || '').toLowerCase() === lowered);
  }, [filter, sortedQuests]);

  const handleToggle = (questId) => {
    setExpandedId((prev) => (prev === questId ? null : questId));
  };

  return (
    <div className="bg-gray-900 h-full w-full max-w-xl shadow-2xl flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
        <div>
          <h2 className="text-2xl font-bold text-white">Journal</h2>
          <p className="text-sm text-gray-400">Track promises, quests, and long-term goals.</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-white"
          aria-label="Close journal"
        >
          ✕
        </button>
      </div>

      <div className="px-6 py-3 border-b border-gray-800 flex space-x-2 overflow-x-auto">
        {FILTERS.map((label) => {
          const isActive = filter === label;
          return (
            <button
              key={label}
              type="button"
              onClick={() => setFilter(label)}
              className={`px-3 py-1 rounded-full text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
        {filteredQuests.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-400 text-center">No journal entries yet.</p>
          </div>
        ) : (
          filteredQuests.map((quest) => {
            const status = (quest.status || 'active').toLowerCase();
            const statusClass = statusStyles[status] || 'bg-gray-600/20 text-gray-200 border border-gray-600/40';
            const categoryClass = categoryColors[quest.category] || categoryColors.Other;
            const isExpanded = expandedId === quest.id;

            return (
              <div key={quest.id} className="bg-gray-800/70 rounded-2xl border border-gray-700/60">
                <button
                  type="button"
                  onClick={() => handleToggle(quest.id)}
                  className="w-full text-left px-5 py-4 flex flex-col gap-2"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold text-white">{quest.title || 'Untitled Quest'}</p>
                      <p className="text-xs text-gray-400">
                        Created {formatTimestamp(quest.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs font-bold rounded-full whitespace-nowrap ${statusClass}`}>
                        {quest.status ? quest.status.charAt(0).toUpperCase() + quest.status.slice(1) : 'Active'}
                      </span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${categoryClass}`}>
                        {quest.category || 'Other'}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-300">
                    <span className="font-semibold text-gray-200">
                      Deadline: <span className="font-normal text-gray-300">{formatTimestamp(quest.deadline)}</span>
                    </span>
                    <span>
                      Updated {formatTimestamp(quest.updatedAt)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300">
                    {quest.description || 'No description provided yet.'}
                  </p>
                  <span className="text-xs text-indigo-300 mt-2">
                    {isExpanded ? 'Hide details ▲' : 'View details ▼'}
                  </span>
                </button>

                {isExpanded && (
                  <div className="px-5 pb-5 text-sm text-gray-200 space-y-3 border-t border-gray-700/60">
                    {quest.description && (
                      <div>
                        <p className="text-gray-300 whitespace-pre-wrap">{quest.description}</p>
                      </div>
                    )}

                    {Array.isArray(quest.notes) && quest.notes.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">Notes</h4>
                        <ul className="space-y-1 list-disc list-inside text-gray-200">
                          {quest.notes.map((note, index) => (
                            <li key={`${quest.id}-note-${index}`}>{note}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {quest.linkedEntities && (quest.linkedEntities.wrestlerIds || quest.linkedEntities.storylineIds) && (
                      <div className="text-xs text-gray-400 space-y-1">
                        {quest.linkedEntities.wrestlerIds && quest.linkedEntities.wrestlerIds.length > 0 && (
                          <p>
                            Wrestlers: {quest.linkedEntities.wrestlerIds.join(', ')}
                          </p>
                        )}
                        {quest.linkedEntities.storylineIds && quest.linkedEntities.storylineIds.length > 0 && (
                          <p>
                            Storylines: {quest.linkedEntities.storylineIds.join(', ')}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default JournalPanel;
