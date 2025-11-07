// /api/ai.js
export default async function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({ ok: true, message: "AI route is alive" });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing OPENAI_API_KEY in environment' });
  }

  try {
    const { type } = req.body || {};

    if (type === 'wrestler-message') {
      const { wrestler, topic } = req.body;

      // We force the model to speak OUT of character:
      // - real person tone
      // - referring to “my character” only when talking about creative
      // - and we force 3 distinct replies: yes, no, conditional
      const systemPrompt = `
You are generating internal, behind-the-scenes messages for a pro wrestling booking sim.
These are NOT on-camera promos. These are real people talking to the booker about business, creative, and their careers.
Tone rules:
- Speak as the real person behind the gimmick.
- Do NOT cut a promo.
- Do NOT threaten in a corny monster-heel way.
- If they're talking about creative, they can refer to "my character" or "my current gimmick" in a practical way.
- Keep it professional, human, and varied by temperament (confident, frustrated, hopeful, pragmatic, etc).

You must return JSON with this shape:
{
  "message": "string",
  "replyOptions": ["affirmative/agree", "decline/pushback", "conditional/maybe"]
}

The three replyOptions MUST be clearly different in intent:
1) a YES / agreeable response
2) a NO / pushback / can't do it response
3) a MAYBE / let's see / meet-me-halfway response
      `.trim();

      const userPrompt = `
Wrestler info:
- Name: ${wrestler?.name || 'Unknown Talent'}
- Disposition/on-screen: ${wrestler?.disposition || 'Unknown'}
- Gimmick/on-screen: ${wrestler?.gimmick || 'Unknown'}
- Morale: ${wrestler?.morale ?? 75}

Topic/situation: ${topic || 'general_concern'}

Write a short internal message from this talent to the booker about that topic, as the REAL person, not the character.
Keep it 2-5 sentences.
      `.trim();

      const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          temperature: 0.9
        })
      });

      if (!openaiRes.ok) {
        const errText = await openaiRes.text();
        console.error("OpenAI error (wrestler-message):", errText);
        return res.status(500).json({ error: 'OpenAI request failed', details: errText });
      }

      const data = await openaiRes.json();
      const raw = data.choices?.[0]?.message?.content?.trim() || "";

      // Try to parse JSON if the model followed instructions
      let message = "Hey, just wanted to talk about how I'm being used.";
      let replyOptions = [
        "You're right, let's get you slotted higher on the card.",
        "Right now we can’t adjust that, but we'll keep it in mind.",
        "If your next couple of matches go well, we can revisit the push."
      ];

      try {
        const parsed = JSON.parse(raw);
        if (parsed.message) message = parsed.message;
        if (Array.isArray(parsed.replyOptions) && parsed.replyOptions.length >= 3) {
          replyOptions = parsed.replyOptions.slice(0, 3);
        }
      } catch (e) {
        // fallback: model didn't return json, make our own 3-tone options
        // also keep message = raw if it looks like normal text
        if (raw) {
          message = raw;
        }
        replyOptions = [
          "Yeah, I can make that work — let's do it.",
          "I can’t approve that right now, it doesn’t fit where we’re going.",
          "If we get a good reaction next show, we can talk about it again."
        ];
      }

      return res.status(200).json({ message, replyOptions });
    }

    if (type === 'booker-assistant') {
      const { rosterContext, query } = req.body;

      const systemPrompt = `
You are the AI booker assistant for a pro wrestling booking sim.
You know modern EWR-style logic: segments are rated, show rating is derived from segments, feuds gain/lose heat from relevant segments, morale and relationships matter.
When the user asks for ideas, make sure they FIT the roster they sent and the promotion size.
Always answer directly — do NOT tell them to send their roster if they've already sent it in the same request.
      `.trim();

      const userPrompt = `
User question:
${query}

Roster (partial):
${rosterContext || 'No roster provided.'}

Give a concise, actionable answer with 2-3 booking ideas max.
      `.trim();

      const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          temperature: 0.7
        })
      });

      if (!openaiRes.ok) {
        const errText = await openaiRes.text();
        console.error("OpenAI error (booker-assistant):", errText);
        return res.status(500).json({ error: 'OpenAI request failed', details: errText });
      }

      const data = await openaiRes.json();
      const text = data.choices?.[0]?.message?.content?.trim() || "Couldn't generate a response.";
      return res.status(200).json({ text });
    }

    if (type === 'show-recap') {
      const { showName, overallRating, segments } = req.body;

      const systemPrompt = `
You are writing a "dirt sheet" style show recap for a wrestling booking sim.
You know that in EWR-like sims, each segment is rated and the overall show rating is a weighted combination.
Write like an insider recap: what's over, what underperformed, what angles advanced, who looked like a star.
You may only reference the segments passed in segments. Do not invent surprise returns, do not invent wrestlers, do not add injury updates, and do not mention anyone not in the provided roster. If something is missing, say it was a short show.
      `.trim();

      const userPrompt = `
Show name: ${showName}
Overall rating: ${overallRating}

Segments (in order):
${(segments || [])
  .filter(Boolean)
  .map((s, i) => {
    const participants = (s.participants || []).map(p => p.name).join(" vs. ");
    return `${i + 1}. ${s.type}: ${participants} (rating: ${s.rating || 'N/A'})${s.storylineId ? ' [storyline]' : ''}`;
  })
  .join("\n")
}

Write 2-4 paragraphs. Mention the best segment, any storyline segment, and how the main event reflected on the promotion.
      `.trim();

      const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          temperature: 0.7
        })
      });

      if (!openaiRes.ok) {
        const errText = await openaiRes.text();
        console.error("OpenAI error (show-recap):", errText);
        return res.status(500).json({ error: 'OpenAI request failed', details: errText });
      }

      const data = await openaiRes.json();
      const text = data.choices?.[0]?.message?.content?.trim() || "Recap unavailable.";
      return res.status(200).json({ text });
    }

    return res.status(400).json({ error: 'Unknown AI request type' });
  } catch (err) {
    console.error("AI handler error:", err);
    return res.status(500).json({ error: 'Server error', details: err.message });
  }
}
