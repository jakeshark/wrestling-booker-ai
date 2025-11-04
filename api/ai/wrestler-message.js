// /api/ai/wrestler-message.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    // fall back so your frontend still works
    const { wrestler = {}, topic = "general" } = req.body || {};
    const name = wrestler.name || "One of your talents";
    return res.status(200).json({
      text: `${name}: Hey boss, AI key is missing on the server, but I still wanted to talk.`
    });
  }

  try {
    const { wrestler = {}, topic = "general" } = req.body || {};
    const name = wrestler.name || "One of your talents";
    const gimmick = wrestler.gimmick || "Pro Wrestler";

    const userPrompt = `
You are simulating a *backstage DM* from a wrestler to the booker in a wrestling booking sim (inspired by EWR).
Write 1-3 short paragraphs, conversational, first person, from the wrestler's POV.

Wrestler:
- Name: ${name}
- Gimmick/persona: ${gimmick}
- Disposition: ${wrestler.disposition || "Unknown"}
- Morale: ${wrestler.morale ?? "Unknown"}

Topic: ${topic}

Rules:
- Stay in-character as a real person, not a computer.
- Reference booking/push/opportunities if relevant.
- Keep it plausible for a locker room/politics message.
- Do NOT explain what you are doing.
`;

    // OpenAI-style call
    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You write in-character backstage messages from wrestlers to a booker." },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.9,
        max_tokens: 300
      })
    });

    if (!resp.ok) {
      const text = await resp.text();
      console.error("OpenAI error:", text);
      return res.status(200).json({
        text: `${name}: Couldn't get through to the office AI, but I wanted to follow up about my spot.`
      });
    }

    const data = await resp.json();
    const text = data.choices?.[0]?.message?.content?.trim() || `${name}: Just checking in about my booking.`;
    return res.status(200).json({ text });
  } catch (err) {
    console.error(err);
    return res.status(200).json({
      text: "One of your talents: Tech issues on the AI side, but pretend I messaged you about my push."
    });
  }
}
