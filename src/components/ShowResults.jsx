import React, { useEffect, useMemo, useRef, useState } from 'react';
import { callAI } from '../utils/aiClient';

const LoadingIcon = () => (
  <svg
    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

const StarIcon = ({ className = 'w-5 h-5 text-yellow-400' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M10.868 2.884c.321-.772 1.415-.772 1.736 0l1.83 4.401 4.79 1.149c.82.198 1.135 1.106.546 1.691l-3.473 3.385 1.03 4.88c.174.82-.716 1.459-1.442 1.053L10 18.273l-4.32 2.271c-.726.406-1.616-.234-1.442-1.053l1.03-4.88L1.873 10.124c-.589-.586-.274-1.493.546-1.691l4.79-1.149 1.83-4.401Z"
      clipRule="evenodd"
    />
  </svg>
);

const recapFallbackMessage = 'An error occurred while generating the show recap. The show is still saved.';

const formatDate = (date) => {
  if (!date) return 'Unknown date';

  if (typeof date === 'string') return date;
  if (date instanceof Date) {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  }

  if (date.toDate) {
    return formatDate(date.toDate());
  }

  return 'Unknown date';
};

const ShowResults = ({ show, onBackToDashboard, onContinue, onRecapGenerated }) => {
  const [recap, setRecap] = useState(show?.recap || '');
  const [isLoadingRecap, setIsLoadingRecap] = useState(!show?.recap);
  const [errorMessage, setErrorMessage] = useState('');
  const requestSentRef = useRef(false);

  useEffect(() => {
    if (!show) return;
    setRecap(show.recap || '');
    setIsLoadingRecap(!show.recap && requestSentRef.current);
  }, [show]);

  useEffect(() => {
    requestSentRef.current = false;
    setErrorMessage('');
    if (!show) {
      setRecap('');
      setIsLoadingRecap(false);
    } else {
      setIsLoadingRecap(!show.recap);
    }
  }, [show?.id]);

  useEffect(() => {
    if (!show || show.recap || requestSentRef.current) return;

    requestSentRef.current = true;
    setIsLoadingRecap(true);

    let isActive = true;

    const payload = {
      showName: show.eventName,
      overallRating: show.overallRating,
      segments: (show.segments || []).map((segment) =>
        segment
          ? {
              ...segment,
              participants: (segment.participants || []).map((participant) => ({
                id: participant.id,
                name: participant.name
              }))
            }
          : null
      )
    };

    const fetchRecap = async () => {
      try {
        const result = await callAI('show-recap', payload);
        const text = result.text || recapFallbackMessage;

        if (!isActive) return;

        setRecap(text);
        setIsLoadingRecap(false);
        setErrorMessage(result.text ? '' : '');
        onRecapGenerated?.(text);
      } catch (error) {
        console.error('Error generating AI recap: ', error);
        if (!isActive) return;

        setRecap(recapFallbackMessage);
        setIsLoadingRecap(false);
        setErrorMessage('There was an issue generating the AI recap.');
        onRecapGenerated?.(recapFallbackMessage);
      }
    };

    fetchRecap();

    return () => {
      isActive = false;
    };
  }, [show, onRecapGenerated]);

  const summary = useMemo(() => {
    const segments = show?.segments?.filter(Boolean) || [];
    if (!segments.length) return null;

    const bestSegment = segments.reduce((best, segment) => {
      if (!best || (segment.rating || 0) > (best.rating || 0)) {
        return segment;
      }
      return best;
    }, null);

    const worstSegment = segments.reduce((worst, segment) => {
      if (!worst || (segment.rating || 0) < (worst.rating || 0)) {
        return segment;
      }
      return worst;
    }, null);

    return {
      totalSegments: segments.length,
      bestSegment,
      worstSegment
    };
  }, [show?.segments]);

  if (!show) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-8 text-white">
        <div className="p-6 bg-gray-800 rounded-lg shadow-lg text-center">
          <p className="text-lg text-gray-300">No show results are available.</p>
          {onBackToDashboard && (
            <button
              onClick={onBackToDashboard}
              className="mt-4 px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-500 transition-all"
            >
              Back to Dashboard
            </button>
          )}
        </div>
      </div>
    );
  }

  const formattedDate = formatDate(show.date);
  const formatParticipants = (segment) => {
    if (!segment) return '';
    const names = (segment.participants || []).map((p) => p.name);
    if (names.length === 0) return '';
    return segment.type === 'Match' ? names.join(' vs. ') : names.join(', ');
  };

  const formatWinner = (segment) => {
    if (!segment || segment.type !== 'Match') return '';
    if (!segment.winnerId) {
      return 'Draw / No Contest';
    }
    const winner = (segment.participants || []).find((p) => p.id === segment.winnerId);
    return winner?.name || 'N/A';
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 text-white">
      <div className="p-6 bg-gray-800 rounded-lg shadow-lg flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white">Show Results: {show.eventName}</h1>
          <p className="text-indigo-300">{formattedDate}</p>
        </div>
        <div className="mt-4 md:mt-0 text-right">
          <p className="text-sm text-gray-400">Overall Rating</p>
          <p className="text-4xl font-bold text-yellow-400 flex items-center justify-end">
            <StarIcon className="w-8 h-8 mr-1" />
            {show.overallRating}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-4">
          {(show.segments || []).map((segment, index) => (
            <div key={index} className="bg-gray-800 rounded-lg shadow-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm uppercase tracking-wide text-gray-400">Segment {index + 1}</p>
                  {segment ? (
                    <div className="mt-2 space-y-1">
                      <p className="text-lg font-semibold text-white">
                        {segment.type}: {formatParticipants(segment) || 'Participants TBD'}
                      </p>
                      {segment.type === 'Match' && (
                        <p className="text-sm text-gray-300">
                          Winner: {formatWinner(segment)}
                        </p>
                      )}
                      {segment.storylineId && (
                        <p className="text-xs text-indigo-300">Storyline ID: {segment.storylineId}</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-lg text-gray-400">No segment was booked in this slot.</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Rating</p>
                  <p className="text-3xl font-bold text-yellow-400">{segment?.rating ?? '—'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="bg-gray-800 rounded-lg shadow-lg p-5 space-y-4">
          <h2 className="text-xl font-semibold text-white flex items-center">
            <StarIcon className="w-6 h-6 mr-2" />
            Show Summary
          </h2>
          <div className="space-y-2 text-sm text-gray-300">
            <div className="flex justify-between">
              <span>Booked Segments</span>
              <span>{summary?.totalSegments || 0}</span>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase">Best Segment</p>
              <p className="text-sm text-white">
                {summary?.bestSegment
                  ? `${summary.bestSegment.type} — ${formatParticipants(summary.bestSegment) || 'N/A'}`
                  : 'N/A'}
              </p>
              {summary?.bestSegment && (
                <p className="text-xs text-yellow-400">Rating: {summary.bestSegment.rating}</p>
              )}
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase">Needs Improvement</p>
              <p className="text-sm text-white">
                {summary?.worstSegment
                  ? `${summary.worstSegment.type} — ${formatParticipants(summary.worstSegment) || 'N/A'}`
                  : 'N/A'}
              </p>
              {summary?.worstSegment && (
                <p className="text-xs text-red-400">Rating: {summary.worstSegment.rating}</p>
              )}
            </div>
          </div>
        </aside>
      </div>

      <div className="mt-6 bg-gray-800 p-6 rounded-lg shadow-lg min-h-[200px]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-white">Dirt Sheet Recap</h2>
          {isLoadingRecap && (
            <div className="flex items-center text-sm text-gray-300">
              <LoadingIcon />
              <span className="ml-2">Generating recap...</span>
            </div>
          )}
        </div>
        {errorMessage && (
          <p className="mb-4 text-sm text-red-400">{errorMessage}</p>
        )}
        {recap ? (
          <p className="text-gray-300 whitespace-pre-wrap font-mono text-sm leading-relaxed">{recap}</p>
        ) : (
          <div className="flex items-center justify-center p-8 text-gray-400">
            <LoadingIcon />
            <span className="ml-3 text-lg">Preparing AI recap...</span>
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        {onBackToDashboard && (
          <button
            onClick={onBackToDashboard}
            className="px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg shadow-lg hover:bg-gray-600 transition-all"
          >
            Back to Dashboard
          </button>
        )}
        {onContinue && (
          <button
            onClick={onContinue}
            className="px-8 py-3 bg-green-600 text-white text-lg font-bold rounded-lg shadow-lg hover:bg-green-500 transition-all"
          >
            Save &amp; Continue
          </button>
        )}
      </div>
    </div>
  );
};

export default ShowResults;
