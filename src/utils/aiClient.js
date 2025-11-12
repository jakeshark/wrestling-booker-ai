export async function callAI(type, payload) {
  const res = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, ...payload })
  });
  if (!res.ok) {
    const err = await res.text().catch(() => '');
    throw new Error(`AI error (${type}): ${res.status} ${err}`);
  }
  return res.json();
}
