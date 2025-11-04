// /api/ai/show-recap.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  const { showName = "Tonight's Show", overallRating = 60, card = "" } = req.body || {};

  if (!apiKey) {
    // fallback
    return res.status(200).json({
      text: `**${showName} — Recap (Fallback)**\nOverall: ${overallRating}/100\nCard:\n${card}`
    });
  }

  const prompt = `
You are a wrestling dirt sheet / EWR-style recap writer.
Write a recap of a booked show in 3-6 paragraphs.
You MUST use the segment list below to pick highlights. Mention good or bad segment ratings.
If main event or opening segment is strong, point it out. If overall is low, mention pacing or crowd reaction.

Show name: ${showName}
Overall rating: ${overallRating}/100

Segments (top = opener, bottom = main):
${card}

Tone rules:
- Insider but readable.
- Refer to wrestlers by name.
- Call out strong segments (>=75) as "show-stealing" or "anchor" segments.
- Call out weak segments (<55) as hurting momentum.
- Do NOT include any meta or instructions.
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
          { role: "system", content: "You write dirt-sheet recaps of wrestling shows based on segment-level data." },
          { role: "user", content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 500
      })
    });

    if (!resp.ok) {
      const text = await resp.text();
      console.error("OpenAI error:", text);
      return res.status(200).json({
        text: `**${showName} — Recap (Partial)**\nOverall: ${overallRating}/100\n(There was an AI issue, but the show generally tracked with the provided segments.)`
      });
    }

    const data = await resp.json();
    const text = data.choices?.[0]?.message?.content?.trim() || `**${showName} — Recap**\nOverall: ${overallRating}/100`;
    return res.status(200).json({ text });
  } catch (err) {
    console.error(err);
    return res.status(200).json({
      text: `**${showName} — Recap (Error Fallback)**\nOverall: ${overallRating}/100`
    });
  }
}
