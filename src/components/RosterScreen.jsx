import React, { useEffect, useMemo, useState } from 'react';
import { useGame } from '../context/GameProvider';
import { buildKeyRelationships } from '../utils/relationshipSummary';
import { calculateOverallRating, getPopularityRating, getSkillRating } from '../utils/ratings';

const alignmentBadgeClass = (alignment) => {
  switch (alignment) {
    case 'Face':
      return 'bg-green-500/20 text-green-300 border-green-500/40';
    case 'Heel':
      return 'bg-red-500/20 text-red-300 border-red-500/40';
    case 'Tweener':
      return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40';
    default:
      return 'bg-gray-600/30 text-gray-300 border-gray-500/40';
  }
};

const toneTextClass = {
  positive: 'text-green-300',
  negative: 'text-red-300',
  neutral: 'text-gray-300'
};

const safeName = (wrestler) =>
  wrestler && typeof wrestler.name === 'string' ? wrestler.name : '';

const getInitials = (name) => {
  if (!name) return '?';
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 3)
    .toUpperCase();

  return initials || '?';
};

const getMoraleValue = (wrestler) => {
  if (typeof wrestler?.morale === 'number') return wrestler.morale;
  if (typeof wrestler?.metadata?.morale === 'number') return wrestler.metadata.morale;
  return null;
};

const getOverallValue = (wrestler) => {
  const computed = calculateOverallRating(wrestler);
  if (typeof computed === 'number') return computed;
  if (typeof wrestler?.overallRating === 'number') return wrestler.overallRating;
  if (typeof wrestler?.stats?.overall === 'number') return wrestler.stats.overall;
  return null;
};

const getPopularityValue = (wrestler) => {
  const popularity = getPopularityRating(wrestler);
  return typeof popularity === 'number' ? popularity : null;
};

const getStatValue = (wrestler, statKey) => {
  const stats = wrestler?.stats || {};
  const inRing = wrestler?.inRing || {};

  switch (statKey) {
    case 'brawl':
    case 'speed':
    case 'tech':
    case 'charisma': {
      const value = getSkillRating(wrestler, statKey);
      return typeof value === 'number' ? value : null;
    }
    case 'condition':
      if (typeof wrestler?.condition === 'number') return wrestler.condition;
      if (typeof wrestler?.physical?.condition === 'number') return wrestler.physical.condition;
      if (typeof stats.condition === 'number') return stats.condition;
      break;
    default:
      break;
  }

  return null;
};

const formatFinisherType = (type) => {
  if (!type) return null;
  switch (type) {
    case 'slam':
      return 'Slam';
    case 'strike':
      return 'Strike';
    case 'submission':
      return 'Submission';
    case 'top_rope':
      return 'Top Rope';
    default:
      return type;
  }
};

const buildIdentitySubtitle = (wrestler) => {
  const parts = [];

  if (wrestler?.gender) parts.push(wrestler.gender);
  if (typeof wrestler?.age === 'number') parts.push(`${wrestler.age}`);
  if (wrestler?.weightClass) parts.push(wrestler.weightClass);
  if (wrestler?.nationality) parts.push(wrestler.nationality);

  return parts.join(', ');
};

const getCompanyName = (wrestler) => {
  return (
    wrestler?.company ||
    wrestler?.metadata?.homePromotion ||
    wrestler?.homePromotion ||
    wrestler?.contract?.promotionName ||
    null
  );
};

const RosterScreen = () => {
  const {
    wrestlers,
    relationships = [],
    goToDashboard,
    handleViewCareerHistory,
    handleViewRelationships,
    RosterIcon,
    HistoryIcon,
    RelationshipsIcon
  } = useGame();

  const rosterList = Array.isArray(wrestlers) ? wrestlers : [];
  const cleanedWrestlers = useMemo(
    () =>
      rosterList.filter(
        (w) => w && typeof w.name === 'string' && w.name.trim().length > 0
      ),
    [rosterList]
  );

  useEffect(() => {
    if (cleanedWrestlers.length !== rosterList.length) {
      console.warn(
        'RosterScreen: Dropped',
        rosterList.length - cleanedWrestlers.length,
        'invalid roster entries'
      );
    }
  }, [cleanedWrestlers.length, rosterList.length]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  const sortedWrestlers = useMemo(
    () => [...cleanedWrestlers].sort((a, b) => safeName(a).localeCompare(safeName(b))),
    [cleanedWrestlers]
  );

  const filteredWrestlers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return sortedWrestlers;

    return sortedWrestlers.filter((wrestler) =>
      safeName(wrestler).toLowerCase().includes(query)
    );
  }, [searchTerm, sortedWrestlers]);

  useEffect(() => {
    if (filteredWrestlers.length === 0) {
      if (selectedId !== null) {
        setSelectedId(null);
      }
      return;
    }

    if (!selectedId || !filteredWrestlers.some((wrestler) => wrestler.id === selectedId)) {
      setSelectedId(filteredWrestlers[0].id);
    }
  }, [filteredWrestlers, selectedId]);

  const selectedWrestler = useMemo(
    () => cleanedWrestlers.find((wrestler) => wrestler.id === selectedId) || null,
    [cleanedWrestlers, selectedId]
  );

  const keyRelationships = useMemo(() => {
    if (!selectedWrestler) return [];
    return buildKeyRelationships(selectedWrestler.id, relationships, cleanedWrestlers, 4);
  }, [selectedWrestler, relationships, cleanedWrestlers]);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 text-white">
      <div className="flex justify-between items-center p-4 bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          {RosterIcon && (
            <span className="inline-flex items-center text-indigo-400">
              <RosterIcon />
            </span>
          )}
          Your Roster
        </h1>
        <button
          onClick={goToDashboard}
          className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-500 transition-all"
        >
          Back to Dashboard
        </button>
      </div>

      <div className="mt-6 flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/3 xl:w-1/4 bg-gray-900/60 border border-gray-800 rounded-lg p-4 shadow-inner">
          <div>
            <label htmlFor="roster-search" className="text-sm font-semibold text-gray-300">
              Search roster
            </label>
            <input
              id="roster-search"
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by name"
              className="mt-2 w-full rounded-lg bg-gray-900 border border-gray-700 px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="mt-4 space-y-2 overflow-y-auto max-h-[70vh] pr-1">
            {filteredWrestlers.length === 0 ? (
              <p className="text-sm text-gray-400 py-4 text-center">
                No wrestlers match your search.
              </p>
            ) : (
              filteredWrestlers.map((wrestler) => {
                const alignment = wrestler?.alignment || wrestler?.disposition || 'Unknown';
                const popularity = getPopularityValue(wrestler);
                const morale = getMoraleValue(wrestler);
                const overall = getOverallValue(wrestler);
                const displayNumber = popularity ?? morale ?? '—';

                return (
                  <button
                    type="button"
                    key={wrestler.id}
                    onClick={() => setSelectedId(wrestler.id)}
                    data-overall={overall ?? undefined}
                    className={`w-full text-left px-3 py-3 rounded-lg border transition-all duration-150 ${
                      selectedId === wrestler.id
                        ? 'border-purple-500 bg-purple-600/10 shadow-lg'
                        : 'border-gray-700 bg-gray-800 hover:border-purple-500/60 hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-base font-semibold text-white leading-tight">{wrestler.name}</p>
                        {wrestler.shortName && wrestler.shortName !== wrestler.name && (
                          <p className="text-xs text-gray-400 mt-1">{wrestler.shortName}</p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span
                          className={`px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide rounded-full border ${alignmentBadgeClass(
                            alignment
                          )}`}
                        >
                          {alignment}
                        </span>
                        <span className="text-xs font-semibold text-gray-200">
                          {displayNumber}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        <div className="flex-1">
          {!selectedWrestler ? (
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center text-gray-300">
              Select a wrestler from the list to view their profile.
            </div>
          ) : (
            <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-6 flex flex-col gap-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-gray-900 border border-gray-700 flex items-center justify-center text-3xl font-bold text-gray-500">
                    {getInitials(selectedWrestler.name)}
                  </div>
                </div>

                <div className="flex-1 space-y-3">
                  <div>
                    <h2 className="text-3xl font-bold text-white">{selectedWrestler.name}</h2>
                    {buildIdentitySubtitle(selectedWrestler) && (
                      <p className="text-sm text-gray-400 mt-1">
                        {buildIdentitySubtitle(selectedWrestler)}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-200">
                    <span className={`px-3 py-1 rounded-full border text-xs font-semibold uppercase tracking-wide ${alignmentBadgeClass(
                      selectedWrestler.alignment || selectedWrestler.disposition
                    )}`}>
                      {selectedWrestler.alignment || selectedWrestler.disposition || 'Unknown'}
                    </span>
                    {selectedWrestler.gimmick && (
                      <span className="text-gray-300">{selectedWrestler.gimmick}</span>
                    )}
                  </div>

                  {getCompanyName(selectedWrestler) && (
                    <p className="text-xs uppercase tracking-wide text-indigo-300">
                      {getCompanyName(selectedWrestler)}
                    </p>
                  )}

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
                    {[
                      { label: 'Over', value: getPopularityValue(selectedWrestler) },
                      { label: 'Brawl', value: getStatValue(selectedWrestler, 'brawl') },
                      { label: 'Speed', value: getStatValue(selectedWrestler, 'speed') },
                      { label: 'Tech', value: getStatValue(selectedWrestler, 'tech') },
                      { label: 'Charisma', value: getStatValue(selectedWrestler, 'charisma') },
                      { label: 'Condition', value: getStatValue(selectedWrestler, 'condition') },
                      { label: 'Morale', value: getMoraleValue(selectedWrestler) }
                    ]
                      .filter((item) => item.value !== null && item.value !== undefined)
                      .map((item) => (
                        <div
                          key={item.label}
                          className="bg-gray-900/60 border border-gray-700 rounded-lg p-3 flex flex-col"
                        >
                          <span className="text-xs uppercase tracking-wide text-gray-400">{item.label}</span>
                          <span className="text-xl font-semibold text-white">{item.value}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white">Signature Finishers</h3>
                <dl className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-200">
                  {selectedWrestler.finisherPrimaryName ? (
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-gray-400">Primary Finisher</dt>
                      <dd className="mt-1 text-base font-semibold text-white">
                        {selectedWrestler.finisherPrimaryName}
                        {formatFinisherType(selectedWrestler.finisherPrimaryType) && (
                          <span className="text-xs text-gray-400 ml-2">
                            ({formatFinisherType(selectedWrestler.finisherPrimaryType)})
                          </span>
                        )}
                      </dd>
                    </div>
                  ) : (
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-gray-400">Primary Finisher</dt>
                      <dd className="mt-1 text-gray-500">Not set</dd>
                    </div>
                  )}

                  {selectedWrestler.finisherSecondaryName ? (
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-gray-400">Secondary Finisher</dt>
                      <dd className="mt-1 text-base font-semibold text-white">
                        {selectedWrestler.finisherSecondaryName}
                        {formatFinisherType(selectedWrestler.finisherSecondaryType) && (
                          <span className="text-xs text-gray-400 ml-2">
                            ({formatFinisherType(selectedWrestler.finisherSecondaryType)})
                          </span>
                        )}
                      </dd>
                    </div>
                  ) : (
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-gray-400">Secondary Finisher</dt>
                      <dd className="mt-1 text-gray-500">Not set</dd>
                    </div>
                  )}
                </dl>
              </div>

              <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Key Relationships</h3>
                    <p className="text-xs text-gray-400 mt-1">Snapshot of the most notable connections.</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleViewCareerHistory(selectedWrestler)}
                      className="px-4 py-2 text-sm font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow inline-flex items-center"
                    >
                      {HistoryIcon && (
                        <span className="mr-2 inline-flex items-center">
                          <HistoryIcon />
                        </span>
                      )}
                      History
                    </button>
                    <button
                      type="button"
                      onClick={() => handleViewRelationships(selectedWrestler)}
                      className="px-4 py-2 text-sm font-semibold rounded-lg bg-purple-600 hover:bg-purple-500 text-white shadow inline-flex items-center"
                    >
                      {RelationshipsIcon && (
                        <span className="mr-2 inline-flex items-center">
                          <RelationshipsIcon />
                        </span>
                      )}
                      Relations
                    </button>
                  </div>
                </div>

                {keyRelationships.length === 0 ? (
                  <p className="mt-4 text-sm text-gray-400">
                    No notable relationships recorded.
                  </p>
                ) : (
                  <ul className="mt-4 space-y-3 text-sm">
                    {keyRelationships.map((rel) => (
                      <li key={rel.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <p className="text-white font-medium">
                            {rel.role}: <span className="text-gray-300">{rel.otherName}</span>
                          </p>
                          <p className="text-xs text-gray-400">{rel.status}</p>
                        </div>
                        <span className={`text-xs font-semibold uppercase tracking-wide ${toneTextClass[rel.tone]}`}>
                          {rel.tone}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RosterScreen;
