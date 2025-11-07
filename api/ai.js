// /api/ai.js

// Vercel serverless function style
export default async function handler(req, res) {
  // Quick health check
  if (req.method === 'GET') {
    return res.status(200).json({ ok: true, message: "AI route is alive" });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Make sure we actually got JSON
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (err) {
      return res.status(400).json({ error: 'Invalid JSON body' });
    }
  }

  const { type } = body || {};

  // If no type, bail gracefully
  if (!type) {
    return res.status(400).json({ error: 'Missing "type" in request body.' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  const hasRealAI = !!apiKey;

  // Helper to safely call OpenAI and always return text
  async function callOpenAI(system, user, maxTokens = 400) {
    if (!hasRealAI) {
      // Fall back to mock text so React UI still works
      return "AI key missing on server. This is a placeholder response so the UI doesn't break.";
    }

    try {
      const resp = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: system },
            { role: "user", content: user }
          ],
          max_tokens: maxTokens,
          temperature: 0.8
        })
      });

      if (!resp.ok) {
        const errText = await resp.text();
        console.error("OpenAI API error:", errText);
        return "AI was unavailable. Try again in a bit.";
      }

      const data = await resp.json();
      const text = data.choices?.[0]?.message?.content?.trim();
      return text || "AI did not return content.";
    } catch (err) {
      console.error("OpenAI fetch error:", err);
      return "AI request failed. Check server logs.";
    }
  }

  // 1) Wrestler message generator
  if (type === 'wrestler-message') {
    const wrestler = body.wrestler || {};
    const topic = body.topic || "general_backstage";

    // Keep name short to avoid prompt blowups
    const name = wrestler.name || "Unnamed Wrestler";
    const gimmick = wrestler.gimmick || "wrestler";
    const morale = typeof wrestler.morale === 'number' ? wrestler.morale : 70;

    const systemPrompt = `
You are simulating a private message from a professional wrestler to their booker/owner in a text-message style.
Return ONLY the message text, no extra formatting.
Tone should match the wrestler's gimmick if possible.
`;
    const userPrompt = `
WRESTLER NAME: ${name}
GIMMICK: ${gimmick}
MORALE: ${morale}
TOPIC: ${topic}

Write a short, 1-3 paragraph in-character message to the booker about this topic.
`;
    const aiText = await callOpenAI(systemPrompt, userPrompt, 260);

    // Also synthesize 3 plausible reply options for the UI to prefill
    let replyOptions = [
      "Thanks for reaching out — let me see what I can do for your booking.",
      "I get where you're coming from, but I need you to trust the longer-term plan.",
      "Let's talk more after the next show."
    ];

    if (hasRealAI) {
      // We can ask AI for reply options too, but protect against failure
      const replyUserPrompt = `
The booker needs 3 short, natural replies to send back to ${name}.
Give them as 3 separate lines, each a single sentence.
`;
      const repliesText = await callOpenAI(systemPrompt, replyUserPrompt, 120);
      if (repliesText && repliesText.includes('\n')) {
        replyOptions = repliesText
          .split('\n')
          .map(l => l.trim())
          .filter(Boolean)
          .slice(0, 3);
      }
    }

    return res.status(200).json({
      message: aiText,
      replyOptions
    });
  }

  // 2) Booker assistant (the one your modal calls)
  if (type === 'booker-assistant') {
    // rosterContext can get BIG — trim it
    let rosterContext = body.rosterContext || "";
    if (rosterContext.length > 4000) {
      rosterContext = rosterContext.slice(0, 4000) + "\n...[trimmed roster]...";
    }

    const query = body.query || "Give me booking advice.";

    const systemPrompt = `
You are "Wrestling Booker AI Assistant," an expert in EWR/TEW-style booking.
You know:
- each segment is rated individually
- angles and matches both matter
- feud/storyline heat should come from segments involving those wrestlers
Give concise, actionable booking advice. Include match/angle suggestions when relevant.
`;
    const userPrompt = `
ROSTER (partial, may be trimmed):
${rosterContext}

QUESTION:
${query}
`;

    const aiText = await callOpenAI(systemPrompt, userPrompt, 400);

    return res.status(200).json({
      text: aiText
    });
  }

  // 3) Show recap generator
  if (type === 'show-recap') {
    const showName = body.showName || "Unnamed Show";
    const overallRating = body.overallRating || 60;
    const segments = Array.isArray(body.segments) ? body.segments : [];

    // build a compact recap prompt
    const compactSegments = segments
      .filter(Boolean)
      .map((s, i) => {
        const names = Array.isArray(s.participants)
          ? s.participants.map(p => p.name).join(" vs. ")
          : "Unknown participants";
        return `${i + 1}. ${s.type} — ${names} — Rating ${s.rating ?? 'N/A'}`;
      })
      .join("\n");

    const systemPrompt = `
You write "dirt sheet" style show recaps for a wrestling booking sim.
You understand segment-by-segment grades and how they roll up to an overall show grade.
Be specific, note highs/lows, and mention implications for feuds.
`;
    const userPrompt = `
Show: ${showName}
Overall Rating: ${overallRating}/100

Segments:
${compactSegments}

Write 2-5 tight paragraphs.
Mention what overperformed, what underperformed, and storyline momentum.
`;

    const aiText = await callOpenAI(systemPrompt, userPrompt, 350);

    return res.status(200).json({
      text: aiText
    });
  }

  // fallback
  return res.status(400).json({ error: `Unknown type "${type}"` });
}
