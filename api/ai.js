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

  // helper: topic-aware default replies
  const buildTopicFallback = (topic = "general", wrestlerName = "the talent") => {
    const t = topic.toLowerCase();

    // booking / push
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
        `This week isn’t great — you’re on the sheet. If you can hold off, I’d prefer that.`,
        `Let me see how the next taping looks. If we can cover your spot, we’ll approve the week.`
      ];
    }

    // contract / money
    if (t.includes('contract') || t.includes('money') || t.includes('pay') || t.includes('deal')) {
      return [
        `Okay, we can look at bumping your deal — you’ve been valuable.`,
        `Can’t hit that number right now — it’s above where we have you slotted.`,
        `If business stays good and you keep producing, we can revisit the money soon.`
      ];
    }

    // default
    return [
      `Yeah, we can work with that.`,
      `No, that doesn’t fit where we’re going right now.`,
      `Maybe — let’s see how the next couple of shows shake out.`
    ];
  };

  // helper: detect placeholder-y strings and replace
  const sanitizeReplies = (replies, topic, wrestlerName) => {
    const fallback = buildTopicFallback(topic, wrestlerName);

    if (!Array.isArray(replies) || replies.length < 3) {
      return fallback;
    }

    const looksPlaceholder = (s = "") => {
      const lower = s.toLowerCase();
      return (
        lower.includes("a yes") ||
        lower.includes("agreeable") ||
        lower.includes("a no") ||
        lower.includes("pushback") ||
        lower.includes("a maybe") ||
        lower.includes("conditional") ||
        lower.trim().length < 5 // super short, probably junk
      );
    };

    const cleaned = replies.map((r, idx) => {
      if (!r || looksPlaceholder(r)) {
        return fallback[idx] || fallback[0];
      }
      return r;
    });

    return cleaned;
  };

  try {
    const { type } = req.body || {};

    //
    // 1) WRESTLER MESSAGE
    //
    if (type === 'wrestler-message') {
      const {
        wrestler,
        topic,
        originalMessage
      } = req.body;

      const wrestlerName = wrestler?.name || 'the talent';
      const topicFallback = buildTopicFallback(topic, wrestlerName);

      const systemPrompt = `
You are generating INTERNAL / BACKSTAGE messages for a wrestling booking simulator.
These are *real people* talking to the booker about creative, money, time off, or being booked weak.
NOT kayfabe. NOT promos.

Rules:
- Speak as the human behind the character.
- If they mention creative, they can say “my character” or “what I’m doing on TV” in a practical way.
- Be concise: 2–5 sentences.
- Tone should match the situation (frustrated, hopeful, professional).

You MUST return valid JSON in this exact shape:

{
  "message": "the message the talent sends the booker",
  "replyOptions": [
    "YES-style answer the booker could send back in this specific situation",
    "NO-style answer the booker could send back in this specific situation",
    "MAYBE/conditional answer the booker could send back in this specific situation"
  ]
}

IMPORTANT:
- Do NOT return placeholder text like "a YES / agreeable answer..." or "a NO / pushback answer...".
- Write real, natural, situation-specific sentences.
      `.trim();

      const userPrompt = `
Talent: ${wrestlerName}
On-screen disposition: ${wrestler?.disposition || 'Unknown'}
On-screen gimmick: ${wrestler?.gimmick || 'Unknown'}
Current morale: ${wrestler?.morale ?? 75}
Topic / situation: ${topic || 'general_concern'}

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
      let replyOptions = topicFallback;

      try {
        const parsed = JSON.parse(raw);
        if (parsed.message) message = parsed.message;
        if (Array.isArray(parsed.replyOptions) && parsed.replyOptions.length >= 3) {
          replyOptions = sanitizeReplies(parsed.replyOptions, topic, wrestlerName);
        } else {
          replyOptions = topicFallback;
        }
      } catch (e) {
        console.warn("JSON parse failed for wrestler-message, using topic fallback.");
        message = raw || message;
        replyOptions = topicFallback;
      }

      return res.status(200).json({ message, replyOptions });
    }

    //
    // 1b) WRESTLER REACTION TO PLAYER REPLY
    //
    if (type === 'wrestler-reaction') {
      const {
        wrestler,
        topic,
        playerMessage,
        tone
      } = req.body;

      const wrestlerName = wrestler?.name || 'the talent';
      const toneDescriptor = (() => {
        if (tone === 'yes') return 'positive (booker agreed)';
        if (tone === 'no') return 'negative (booker declined)';
        if (tone === 'maybe') return 'mixed/conditional (booker hesitated)';
        return tone || 'unknown';
      })();

      const systemPrompt = `
You are writing a short reaction to the booker’s decision.
DO NOT ask a new question. DO NOT make a new request. Acknowledge the decision and end the conversation for now.
Return JSON:
{ "message": "string", "requiresReply": false }
      `.trim();

      const userPrompt = `
Talent: ${wrestlerName}
On-screen disposition: ${wrestler?.disposition || 'Unknown'}
On-screen gimmick: ${wrestler?.gimmick || 'Unknown'}
Current morale: ${wrestler?.morale ?? 75}
Topic / situation: ${topic || 'general'}
Booker decision tone: ${toneDescriptor}
Booker said:
"""${playerMessage || 'No direct quote provided.'}"""

Write 1-3 sentences reacting to the decision. Acknowledge it and close the conversation for now.
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
          temperature: 0.8,
          response_format: { type: "json_object" }
        })
      });

      if (!openaiRes.ok) {
        const errText = await openaiRes.text();
        console.error("OpenAI error (wrestler-reaction):", errText);
        return res.status(500).json({ error: 'OpenAI request failed', details: errText });
      }

      const data = await openaiRes.json();
      const raw = data.choices?.[0]?.message?.content?.trim() || "";

      let message = `Alright, I hear you.`;

      try {
        const parsed = JSON.parse(raw);
        if (parsed.message) {
          message = parsed.message;
        }
      } catch (e) {
        console.warn("JSON parse failed for wrestler-reaction, using fallback message.");
        message = raw || message;
      }

      return res.status(200).json({ message, requiresReply: false });
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
