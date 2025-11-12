// src/utils/aiClient.js
export async function callAI(type, payload = {}) {
  try {
    const res = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // keep a flat payload with a top-level "type" field
      body: JSON.stringify({ type, ...payload })
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`AI request failed (${res.status}): ${text}`);
    }

    // All our /api/ai handlers return JSON
    return await res.json();
  } catch (err) {
    console.error('callAI error:', err);
    throw err;
  }
}
