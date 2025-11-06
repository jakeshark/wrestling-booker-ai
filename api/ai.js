// /api/ai.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    // quick health check support
    return res.status(200).json({ ok: true, message: "AI route is alive" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: "Missing OPENAI_API_KEY in environment.",
    });
  }

  try {
    const {
      action,
      // common payload pieces the client sends
      wrestler,
      topic,
      roster,
      company,
      query,
      storylines,
      titles,
      show,
      cardText,
      rating,
    } = req.body || {};

    if (!action) {
      return res.status(400).json({ error: "Missing 'action' in request body." });
    }

    // small helper so we don't repeat ourselves
    async function callOpenAI(messages) {
      const resp = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages,
          temperature: 0.8,
        }),
      });

      if (!resp.ok) {
        const txt = await resp.text();
        throw new Error(`OpenAI error: ${resp.status} ${txt}`);
      }

      const data = await resp.json();
      return data.choices[0].message.content;
    }

    // -----------------------------
    // 1) Wrestler -> Booker message
    // -----------------------------
    if (action === "wrestler-message") {
      // the front end expects: { message: string, suggestedReplies: [...] }
      const name = wrestler?.name || "Unnamed Wrestler";
      const companyName = company?.name || "your promotion";

      const systemPrompt = `
You are simulating private inbox messages in a wrestling booker/GM game.
Write short, in-character messages from wrestlers/staff to the booker.
ALWAYS return plain text, no markdown.
Keep it 1-4 sentences.
`;

      const userPrompt = `
WRESTLER:
${JSON.stringify(wrestler, null, 2)}

TOPIC: ${topic}

ROSTER (for context): ${Array.isArray(roster) ? roster.map(r => r.name).join(", ") : ""}

COMPANY: ${companyName}

Write a short message from ${name} to the booker that fits the topic.
Then, after that, invent 3 realistic short replies the booker might send back.
Return them in JSON like this EXACTLY:

{
  "message": "text the wrestler sends",
  "replies": [
    "short booker reply 1",
    "short booker reply 2",
    "short booker reply 3"
  ]
}

No explanation, just JSON.
`;

      const raw = await callOpenAI([
        { role: "system", content: systemPrompt.trim() },
        { role: "user", content: userPrompt.trim() },
      ]);

      // try to parse their JSON
      let parsed;
      try {
        parsed = JSON.parse(raw);
      } catch (e) {
        // fallback if model didn't return JSON
        parsed = {
          message: raw,
          replies: [
            "Got it — I’ll review your booking.",
            "Let’s talk after the show.",
            "We can revisit this next week."
          ]
        };
      }

      return res.status(200).json({
        message: parsed.message || "Hey boss, can we talk about my booking?",
        suggestedReplies: Array.isArray(parsed.replies) && parsed.replies.length > 0
          ? parsed.replies
          : [
              "Got it — I’ll review your booking.",
              "Let’s talk after the show.",
              "We can revisit this next week."
            ]
      });
    }

    // -----------------------------
    // 2) Booker Assistant
    // -----------------------------
    if (action === "booker-assistant") {
      // front end expects: { answer: "..." }
      const systemPrompt = `
You are an AI booking assistant for a wrestling GM/booker sim based on EWR-style depth.
You know about: roster strengths, dispositions, storylines, titles, show structure.
When the user asks "who should I push" or "give me a feud", use the roster they sent.
Be concise but concrete. Suggest matchups, angles, and story beats.
`;

      const rosterText = Array.isArray(roster) && roster.length
        ? roster.map(r => {
            const disp = r.disposition ? `(${r.disposition})` : "";
            return `- ${r.name} ${disp} [B:${r.stats?.brawling} S:${r.stats?.speed} T:${r.stats?.technical} C:${r.stats?.charisma}]`;
          }).join("\n")
        : "No roster provided";

      const storylineText = Array.isArray(storylines) && storylines.length
        ? storylines.map(s => `- ${s.name} (heat: ${s.heat}) participants: ${s.participants?.map(p => p.name).join(", ")}`).join("\n")
        : "No active storylines";

      const titlesText = Array.isArray(titles) && titles.length
        ? titles.map(t => `- ${t.titleName} (prestige: ${t.prestige})`).join("\n")
        : "No titles";

      const userPrompt = `
USER QUESTION:
${query || "Give me general booking guidance."}

CONTEXT:
Company: ${company?.name || "Unknown"}
Roster:
${rosterText}

Storylines:
${storylineText}

Titles:
${titlesText}

Now answer the user's question based on THIS roster. If they ask "who should I push", pick 2-4 names from roster above.
`;

      const answer = await callOpenAI([
        { role: "system", content: systemPrompt.trim() },
        { role: "user", content: userPrompt.trim() },
      ]);

      return res.status(200).json({ answer });
    }

    // -----------------------------
    // 3) Show Recap
    // -----------------------------
    if (action === "show-recap") {
      // front end expects: { recap: "..." }
      const systemPrompt = `
You are a smarky dirt-sheet style recap writer for a wrestling sim.
You receive a card with segments (matches + angles) and per-segment ratings, plus an overall show rating.
Write a 3-8 paragraph recap.
Mention key storylines if provided.
Tone: insider-y but readable. Reference segment ratings subtly.
`;

      const userPrompt = `
SHOW NAME: ${show?.eventName || "Unknown Show"}
TIER: ${show?.eventTier || "Unknown"}
OVERALL RATING: ${rating}

CARD (top to bottom):
${cardText || "No card text was provided."}

STORYLINES:
${Array.isArray(storylines) && storylines.length ? storylines.map(s => `- ${s.name} (heat ${s.heat})`).join("\n") : "None"}

Write the recap now.
`;

      const recap = await callOpenAI([
        { role: "system", content: systemPrompt.trim() },
        { role: "user", content: userPrompt.trim() },
      ]);

      return res.status(200).json({ recap });
    }

    // if we got here, action was unknown
    return res.status(400).json({ error: `Unknown action '${action}'` });

  } catch (err) {
    console.error("AI route error:", err);
    return res.status(500).json({
      error: "AI route failed",
      details: err.message,
    });
  }
}
