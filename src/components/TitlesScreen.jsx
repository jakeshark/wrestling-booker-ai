import React, { useState, useMemo } from 'react';
import { useGame } from '../context/GameProvider';
import { getTitlePrestigeStyle } from '../utils/defaultTitles';

// --- Icons ---
const TrophyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mr-2">
    <path fillRule="evenodd" d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 0 0-.584.859 6.753 6.753 0 0 0 6.138 5.6 6.73 6.73 0 0 0 2.743 1.35A6.98 6.98 0 0 1 9.56 13.12v.001a7 7 0 0 1-3.144 1.132.75.75 0 0 0-.574.67L5.5 16.5h13l-.342-1.577a.75.75 0 0 0-.574-.67 7 7 0 0 1-3.144-1.132 6.98 6.98 0 0 1-1.425-1.546 6.73 6.73 0 0 0 2.743-1.35 6.753 6.753 0 0 0 6.138-5.6.75.75 0 0 0-.584-.86 47.078 47.078 0 0 0-3.07-.542V2.62a.75.75 0 0 0-.658-.744 49.793 49.793 0 0 0-6.093-.377c-2.063 0-4.096.128-6.093.377a.75.75 0 0 0-.657.744Zm0 2.629c0 1.196.312 2.32.857 3.294A5.266 5.266 0 0 1 3.16 5.337a45.6 45.6 0 0 1 2.006-.343v.256Zm13.5 0v-.256c.674.1 1.343.214 2.006.343a5.265 5.265 0 0 1-2.863 3.207 6.72 6.72 0 0 0 .857-3.294ZM11.25 19.5H9a.75.75 0 0 0 0 1.5h6a.75.75 0 0 0 0-1.5h-2.25v-1h-.5v1Z" clipRule="evenodd" />
  </svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-1">
    <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
  </svg>
);

const XCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.707-11.707a1 1 0 0 0-1.414-1.414L10 8.586 7.707 6.293a1 1 0 0 0-1.414 1.414L8.586 10l-2.293 2.293a1 1 0 1 0 1.414 1.414L10 11.414l2.293 2.293a1 1 0 0 0 1.414-1.414L11.414 10l2.293-2.293Z" clipRule="evenodd" />
  </svg>
);

const HistoryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-1">
    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z" clipRule="evenodd" />
  </svg>
);

// --- Helpers ---
const formatDate = (timestamp) => {
  if (!timestamp) return null;
  try {
    const date = typeof timestamp.toDate === 'function' ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return null;
  }
};

const getReignDays = (wonOn) => {
  if (!wonOn) return null;
  try {
    const start = typeof wonOn.toDate === 'function' ? wonOn.toDate() : new Date(wonOn);
    const diff = Math.floor((Date.now() - start.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  } catch {
    return null;
  }
};

const PRESTIGE_OPTIONS = ['World', 'Secondary', 'Tag', 'Specialty', 'TV'];

// --- Sub-components ---

const VacantBadge = () => (
  <span className="px-2 py-0.5 rounded text-xs font-bold bg-red-900 text-red-300 uppercase tracking-wide">
    Vacant
  </span>
);

const PrestigeBadge = ({ prestige }) => {
  const style = getTitlePrestigeStyle(prestige);
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide ${style.badge}`}>
      {prestige}
    </span>
  );
};

// --- History Modal ---
const HistoryModal = ({ title, onClose }) => {
  const history = title?.history || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-xl max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <div>
            <h2 className="text-xl font-bold text-white">{title?.shortName || title?.name}</h2>
            <p className="text-sm text-gray-400">Title History</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><CloseIcon /></button>
        </div>

        <div className="overflow-y-auto flex-1 p-4 space-y-3">
          {/* Current reign at top */}
          {title?.currentHolderId && (
            <div className="p-3 bg-yellow-900/30 border border-yellow-700/50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-300 font-bold">{title.currentHolderName}</p>
                  <p className="text-xs text-gray-400">
                    Won: {formatDate(title.wonOn) || 'Unknown date'}
                    {title.wonOn && <span className="ml-2 text-yellow-500">({getReignDays(title.wonOn)} days and counting)</span>}
                  </p>
                </div>
                <span className="text-xs bg-yellow-700 text-yellow-100 px-2 py-0.5 rounded font-bold">CURRENT</span>
              </div>
            </div>
          )}

          {history.length === 0 && !title?.currentHolderId && (
            <p className="text-gray-500 text-center py-6 text-sm">No championship history recorded yet.</p>
          )}

          {/* Past reigns (newest first) */}
          {[...history].reverse().map((reign, i) => (
            <div key={i} className="p-3 bg-gray-700 rounded-lg">
              <div className="flex items-center justify-between">
                <p className="text-white font-semibold">{reign.holderName || 'Unknown'}</p>
                {reign.isVacated && (
                  <span className="text-xs bg-gray-600 text-gray-300 px-2 py-0.5 rounded">Vacated</span>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Won: {formatDate(reign.wonOn) || '?'}
                {reign.wonFromName && <span className="ml-1">from {reign.wonFromName}</span>}
              </p>
              {reign.lostOn && (
                <p className="text-xs text-gray-400">
                  Lost: {formatDate(reign.lostOn) || '?'}
                  {reign.lostToName && <span className="ml-1">to {reign.lostToName}</span>}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Change Champion Modal ---
const ChangeChampionModal = ({ title, wrestlers, onConfirm, onClose }) => {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const results = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [];
    return wrestlers.filter(w => w?.name?.toLowerCase().includes(q)).slice(0, 6);
  }, [search, wrestlers]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <div>
            <h2 className="text-xl font-bold text-white">Change Champion</h2>
            <p className="text-sm text-gray-400">{title?.shortName || title?.name}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><CloseIcon /></button>
        </div>

        <div className="p-4 space-y-4">
          {selected ? (
            <div className="flex items-center justify-between p-3 bg-indigo-900/40 border border-indigo-500/50 rounded-lg">
              <span className="text-white font-semibold">{selected.name}</span>
              <button onClick={() => setSelected(null)} className="text-indigo-300 hover:text-white">
                <XCircleIcon />
              </button>
            </div>
          ) : (
            <div className="relative">
              <label className="block text-sm text-gray-300 mb-1">Search Roster</label>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Type wrestler name..."
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                autoFocus
              />
              {results.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-gray-600 border border-gray-500 rounded-lg shadow-lg">
                  {results.map(w => (
                    <button
                      key={w.id}
                      onClick={() => { setSelected(w); setSearch(''); }}
                      className="block w-full text-left px-4 py-2 text-white hover:bg-indigo-500"
                      type="button"
                    >
                      {w.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <p className="text-xs text-gray-500">
            This manually sets the champion. Use the booking screen for show-based title changes.
          </p>
        </div>

        <div className="p-4 bg-gray-700 border-t border-gray-600 flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500">
            Cancel
          </button>
          <button
            onClick={() => selected && onConfirm(title, selected)}
            disabled={!selected}
            className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Set as Champion
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Create Title Modal ---
const CreateTitleModal = ({ onConfirm, onClose }) => {
  const [form, setForm] = useState({
    name: '',
    shortName: '',
    prestige: 'Secondary',
    weightClass: '',
    isTagTeam: false,
  });

  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const canSubmit = form.name.trim().length > 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-lg">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Create Title Belt</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><CloseIcon /></button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Full Name <span className="text-red-400">*</span></label>
            <input
              type="text"
              value={form.name}
              onChange={e => handleChange('name', e.target.value)}
              placeholder="e.g. PGW World Heavyweight Championship"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Short Name</label>
            <input
              type="text"
              value={form.shortName}
              onChange={e => handleChange('shortName', e.target.value)}
              placeholder="e.g. World Title"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Prestige Tier</label>
              <select
                value={form.prestige}
                onChange={e => handleChange('prestige', e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {PRESTIGE_OPTIONS.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">Weight Class</label>
              <input
                type="text"
                value={form.weightClass}
                onChange={e => handleChange('weightClass', e.target.value)}
                placeholder="e.g. Heavyweight"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isTagTeam}
              onChange={e => handleChange('isTagTeam', e.target.checked)}
              className="w-4 h-4 accent-indigo-500"
            />
            <span className="text-sm text-gray-300">Tag Team Championship (multiple holders)</span>
          </label>
        </div>

        <div className="p-4 bg-gray-700 border-t border-gray-600 flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500">
            Cancel
          </button>
          <button
            onClick={() => canSubmit && onConfirm(form)}
            disabled={!canSubmit}
            className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Create Title
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Title Card ---
const TitleCard = ({ title, onHistory, onChangeChampion, onVacate }) => {
  const style = getTitlePrestigeStyle(title.prestige);
  const isVacant = !title.currentHolderId;

  return (
    <div className={`bg-gray-800 rounded-lg p-5 border border-gray-700 ring-1 ${style.ring} shadow-lg`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <PrestigeBadge prestige={title.prestige} />
            {title.isTagTeam && (
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-700 text-gray-300">Tag Team</span>
            )}
            {title.weightClass && (
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-700 text-gray-300">{title.weightClass}</span>
            )}
          </div>
          <h3 className="text-white font-bold text-lg leading-tight truncate">{title.name}</h3>
        </div>
      </div>

      <div className="mt-4">
        {isVacant ? (
          <div className="flex items-center gap-2">
            <VacantBadge />
            <span className="text-gray-500 text-sm">No champion</span>
          </div>
        ) : (
          <div>
            <p className="text-yellow-300 font-semibold text-base">{title.currentHolderName}</p>
            {title.wonOn && (
              <p className="text-gray-400 text-xs mt-0.5">
                Champion since {formatDate(title.wonOn)}
                <span className="ml-2 text-gray-500">({getReignDays(title.wonOn)} days)</span>
              </p>
            )}
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => onHistory(title)}
          className="flex items-center px-3 py-1.5 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded-lg transition-colors"
        >
          <HistoryIcon />
          History
        </button>
        <button
          onClick={() => onChangeChampion(title)}
          className="flex items-center px-3 py-1.5 text-xs bg-indigo-700 hover:bg-indigo-600 text-white rounded-lg transition-colors"
        >
          Set Champion
        </button>
        {!isVacant && (
          <button
            onClick={() => onVacate(title)}
            className="flex items-center px-3 py-1.5 text-xs bg-gray-700 hover:bg-red-900/60 text-gray-400 hover:text-red-300 rounded-lg transition-colors"
          >
            Vacate
          </button>
        )}
      </div>
    </div>
  );
};

// --- Main TitlesScreen Component ---
const TitlesScreen = ({
  onBackToDashboard,
  onCreateTitle,
  onChangeChampion,
  onVacateTitle,
}) => {
  const { titles = [], wrestlers = [] } = useGame();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [historyTitle, setHistoryTitle] = useState(null);
  const [championTitle, setChampionTitle] = useState(null);
  const [vacateConfirm, setVacateConfirm] = useState(null);

  const activeTitles = useMemo(
    () => titles.filter(t => t?.isActive !== false),
    [titles]
  );

  const prestigeOrder = { World: 0, Secondary: 1, Tag: 2, Specialty: 3, TV: 4 };
  const sortedTitles = useMemo(
    () => [...activeTitles].sort((a, b) => (prestigeOrder[a.prestige] ?? 99) - (prestigeOrder[b.prestige] ?? 99)),
    [activeTitles]
  );

  const handleConfirmCreate = (form) => {
    onCreateTitle(form);
    setShowCreateModal(false);
  };

  const handleConfirmChampion = (title, wrestler) => {
    onChangeChampion(title.id, wrestler);
    setChampionTitle(null);
  };

  const handleConfirmVacate = () => {
    if (vacateConfirm) {
      onVacateTitle(vacateConfirm.id);
      setVacateConfirm(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center">
          <TrophyIcon />
          <div>
            <h1 className="text-3xl font-bold text-white">Title Belts</h1>
            <p className="text-gray-400 text-sm mt-0.5">{sortedTitles.length} active championship{sortedTitles.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition-colors"
          >
            <PlusIcon />
            Create Title
          </button>
          <button
            onClick={onBackToDashboard}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
          >
            ← Dashboard
          </button>
        </div>
      </div>

      {/* Title Cards Grid */}
      {sortedTitles.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <TrophyIcon />
          <p className="text-lg mt-4">No title belts exist yet.</p>
          <p className="text-sm mt-1">Create your first championship to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {sortedTitles.map(title => (
            <TitleCard
              key={title.id}
              title={title}
              onHistory={setHistoryTitle}
              onChangeChampion={setChampionTitle}
              onVacate={setVacateConfirm}
            />
          ))}
        </div>
      )}

      {/* Vacate Confirm */}
      {vacateConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-sm p-6">
            <h3 className="text-xl font-bold text-white mb-2">Vacate Title?</h3>
            <p className="text-gray-300 text-sm mb-6">
              This will remove <span className="text-yellow-300 font-semibold">{vacateConfirm.currentHolderName}</span> as{' '}
              {vacateConfirm.shortName || vacateConfirm.name} champion. The title will be listed as vacant.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setVacateConfirm(null)} className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600">
                Cancel
              </button>
              <button onClick={handleConfirmVacate} className="px-4 py-2 bg-red-700 text-white font-bold rounded-lg hover:bg-red-600">
                Vacate Title
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {showCreateModal && (
        <CreateTitleModal
          onConfirm={handleConfirmCreate}
          onClose={() => setShowCreateModal(false)}
        />
      )}
      {historyTitle && (
        <HistoryModal
          title={historyTitle}
          onClose={() => setHistoryTitle(null)}
        />
      )}
      {championTitle && (
        <ChangeChampionModal
          title={championTitle}
          wrestlers={wrestlers}
          onConfirm={handleConfirmChampion}
          onClose={() => setChampionTitle(null)}
        />
      )}
    </div>
  );
};

export default TitlesScreen;
