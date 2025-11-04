// /api/ai/booker-assistant.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  const { rosterContext = "", userQuestion = "" } = req.body || {};

  if (!apiKey) {
    return res.status(200).json({
      text: `AI is not configured on the server yet, but here's a manual tip:\n- Push your highest-charisma face against your highest-workrate heel for 4-6 weeks.\n- Protect morale on big shows.`
    });
  }

  const prompt = `
You are an EWR/TEW-style booking assistant helping a player book a wrestling company.
You will be given:
1. A roster list with roles, charisma, and disposition.
2. A specific user question.

Your job:
- Propose 2-3 concrete booking options.
- Make sure they would actually raise storyline heat (segment-level quality matters, not show-level).
- Mention morale/politics issues if the user is trying to job someone too big.

Roster context:
${rosterContext}

User question:
${userQuestion}
`;

  try {
    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a veteran wrestling booker and understand EWR-style sims, feud heat, and morale." },
          { role: "user", content: prompt }
        ],
        temperature: 0.75,
        max_tokens: 500
      })
    });

    if (!resp.ok) {
      const text = await resp.text();
      console.error("OpenAI error:", text);
      return res.status(200).json({
        text: "Booking assistant is temporarily unavailable. Book around your hottest babyface and keep losing streaks to 2 in a row."
      });
    }

    const data = await resp.json();
    const text = data.choices?.[0]?.message?.content?.trim() || "Try pairing your top face with your top heel and escalate over 4 weeks.";
    return res.status(200).json({ text });
  } catch (err) {
    console.error(err);
    return res.status(200).json({
      text: "There was an AI error, but general rule: protect stars, advance angles with 65+ rated segments, and blow off on PPV."
    });
  }
}
