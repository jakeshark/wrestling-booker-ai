const TOPIC_OUTCOMES = {
  unhappy_booking: {
    yes: { moraleDelta: 6, note: 'Promised better booking' },
    no: { moraleDelta: -8, note: 'Declined booking change' },
    maybe: { moraleDelta: -2, note: 'Asked for patience on booking' }
  },
  excited_push: {
    yes: { moraleDelta: 6, note: 'Greenlit new push' },
    no: { moraleDelta: -6, note: 'Shut down push plans' },
    maybe: { moraleDelta: 1, note: 'Soft-played push request' }
  },
  request_time_off: {
    yes: { moraleDelta: 5, note: 'Approved time off' },
    no: { moraleDelta: -7, note: 'Denied time off' },
    maybe: { moraleDelta: 0, note: 'Delayed time off decision' }
  },
  contract_renewal: {
    yes: { moraleDelta: 4, note: 'Agreed to contract renewal' },
    no: { moraleDelta: -6, note: 'Declined contract renewal' },
    maybe: { moraleDelta: -2, note: 'Stalled contract discussion' }
  },
  creative_pitch: {
    yes: { moraleDelta: 4, note: 'Approved creative pitch' },
    no: { moraleDelta: -4, note: 'Rejected creative pitch' },
    maybe: { moraleDelta: 0, note: 'Deferred creative pitch' }
  }
};

const DEFAULT_OUTCOMES = {
  yes: { moraleDelta: 3, note: 'Gave supportive reply' },
  no: { moraleDelta: -3, note: 'Gave dismissive reply' },
  maybe: { moraleDelta: 0, note: 'Offered neutral reply' }
};

const normalizeTone = (tone) => {
  if (!tone) return 'maybe';
  const normalized = tone.toLowerCase();
  if (normalized === 'yes' || normalized === 'no' || normalized === 'maybe') {
    return normalized;
  }
  if (normalized.startsWith('y')) return 'yes';
  if (normalized.startsWith('n')) return 'no';
  return 'maybe';
};

export const getOutcomeForReply = (topic, tone) => {
  const normalizedTopic = typeof topic === 'string' ? topic.toLowerCase() : '';
  const normalizedTone = normalizeTone(tone);
  const topicOutcomes = TOPIC_OUTCOMES[normalizedTopic] || DEFAULT_OUTCOMES;
  const outcome = topicOutcomes[normalizedTone] || DEFAULT_OUTCOMES[normalizedTone] || DEFAULT_OUTCOMES.maybe;
  return {
    moraleDelta: outcome.moraleDelta,
    note: outcome.note
  };
};

export default getOutcomeForReply;
