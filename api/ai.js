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

  // helper: topic-aware fallback replies
  const buildTopicFallback = (topic = "general", wrestlerName = "the talent") => {
    const t = topic.toLowerCase();

    // asking for a push / better booking
    if (t.includes('push') || t.includes('unhappy_booking') || t.includes('booking')) {
      return [
        `Yeah, we can look at spotlighting you more soon — you’ve been delivering, ${wrestlerName}.`,
        `Not right now — the top of the card is pretty set, but I don’t want you thinking we don’t see you.`,
        `If the next couple of appearances land and the crowd stays with you, we can talk about moving you up.`
      ];
    }

    // time off
    if (t.includes('time_off') || t.includes('time off') || t.includes('request_time_off')) {
      return [
        `Yeah, we can give you that time — thanks for the heads up.`,
        `Right now isn’t ideal, we’ve got you penciled in — I’d rather you hold off if you can.`,
        `Let’s see how the next taping looks. If we can cover your spot, we’ll approve the week.`
      ];
    }

    // contract / money
    if (t.includes('contract') || t.includes('money') || t.includes('pay') || t.includes('deal')) {
      return [
        `Okay, we can look at bumping your deal — you’ve been valuable.`,
        `Can’t do that number right now — it’s above where we have you slotted.`,
        `If business stays good and you keep producing, we can revisit the money in a few weeks.`
      ];
    }

    // default catch-all
    return [
      `Yep, we can work with that.`,
      `No, that doesn’t fit where we’re going right now.`,
      `Maybe — let’s see how the next couple of shows shake out.`
    ];
  };

  try {
    const { type } = req.body || {};

    //
    // 1) WRESTLER MESSAGES
    //
    if (type === 'wrestler-message') {
      const {
        wrestler,
        topic,
        // optional: if your client later sends the actual message text it saved
        originalMessage
      } = req.body;

      const wrestlerName = wrestler?.name || 'the talent';
      const fallbackReplies = buildTopicFallback(topic, wrestlerName);

      // system prompt: behind-the-scenes, not kayfabe
      const systemPrompt = `
You are generating INTERNAL / BACKSTAGE messages for a wrestling booking simulator.
These are real people texting or DMing the booker about creative, money, time off, or being booked weak.
Rules:
- Do NOT cut a promo.
- Speak as the human behind the character.
- If they mention creative, they can say “my character” or “what I’m doing on TV” in a practical way.
- Be concise: 2-5 sentences.
- Tone should match the situation (frustrated, hopeful, professional).
You MUST return valid JSON in this exact shape:

{
  "message": "the message the talent sends the booker",
  "replyOptions": [
    "a YES / agreeable answer the booker could send back",
    "a NO / pushback answer the booker could send back",
    "a MAYBE / conditional answer the booker could send back"
  ]
}
      `.trim();

      const userPrompt = `
Talent: ${wrestlerName}
On-screen disposition: ${wrestler?.disposition || 'Unknown'}
On-screen gimmick: ${wrestler?.gimmick || 'Unknown'}
Current morale: ${wrestler?.morale ?? 75}
Topic / situation: ${topic || 'general_concern'}

This is the player's current in-game date context; assume it's an active TV schedule.

If the topic is time off, they should sound reasonable but clear.
If the topic is booking/push, they should mention recent results or crowd reaction.
If the topic is contract/money, they should reference value to the company.

${
  originalMessage
    ? `The original saved message text was:\n"""${originalMessage}"""\nYou may keep the spirit of it but make it cleaner.`
    : ''
}
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
          temperature: 0.9,
          // THIS is the key so we don't get plain text back
          response_format: { type: "json_object" }
        })
      });

      if (!openaiRes.ok) {
        const errText = await openaiRes.text();
        console.error("OpenAI error (wrestler-message):", errText);
        return res.status(500).json({ error: 'OpenAI request failed', details: errText });
      }

      const data = await openaiRes.json();
      const raw = data.choices?.[0]?.message?.content?.trim() || "";

      let message = `Hey, just wanted to touch base about how I'm being used.`;
      let replyOptions = fallbackReplies;

      // because of response_format, this should succeed most of the time
      try {
        const parsed = JSON.parse(raw);
        if (parsed.message) message = parsed.message;
        if (Array.isArray(parsed.replyOptions) && parsed.replyOptions.length >= 3) {
          replyOptions = parsed.replyOptions.slice(0, 3);
        }
      } catch (e) {
        // if for some reason it still isn't JSON, use topic-aware fallback
        console.warn("JSON parse failed for wrestler-message, using topic fallback.");
        message = raw || message;
        replyOptions = fallbackReplies;
      }

      return res.status(200).json({ message, replyOptions });
    }

    //
    // 2) BOOKER ASSISTANT
    //
    if (type === 'booker-assistant') {
      const { rosterContext, query } = req.body;

      const systemPrompt = `
You are the AI booker assistant for a pro wrestling booking sim.
You know EWR-style logic: segments rated individually; show rating derived from segments; feud heat tied to relevant segments; morale and relationships matter.
When the user asks for ideas, make sure they FIT the roster they sent.
Always answer directly — do NOT ask for the roster again if we have one.
      `.trim();

      const userPrompt = `
User question:
${query}

Roster:
${rosterContext || 'No roster provided.'}

Give 2-3 booking ideas, short and actionable.
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

    //
    // 3) SHOW RECAP
    //
    if (type === 'show-recap') {
      const { showName, overallRating, segments } = req.body;

      const systemPrompt = `
You are writing a "dirt sheet" style show recap for a wrestling booking sim.
Each segment is provided; the overall rating is provided.
You may ONLY reference segments that were provided.
Do NOT invent surprise returns, do NOT invent wrestlers, do NOT add segments that weren't booked.
Mention the best segment, any storyline-tagged segment, and how the main event reflected on the promotion.
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
  .join("\n")}
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
