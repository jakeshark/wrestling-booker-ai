// /api/ai.js
// Vercel serverless route for all AI calls
// Needs: process.env.OPENAI_API_KEY
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  // allow quick health check in browser
  if (req.method === "GET") {
    return res.status(200).json({ ok: true, message: "AI route is alive" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "Missing OPENAI_API_KEY" });
  }

  try {
    const {
      mode,          // "assistant" | "wrestler-message" | "show-recap"
      systemPrompt,  // optional
      userQuery,     // what the user typed (assistant)
      wrestler,      // { name, gimmick, disposition, ... }
      topic,         // e.g. "unhappy_booking"
      show,          // { eventName, eventTier, ... }
      segments,      // array of rated segments
      finalRating,   // number
      rosterContext, // string for assistant
    } = req.body || {};

    let messages = [];

    // ------ MODE 1: Booker assistant ------
    if (mode === "assistant") {
      const sys = systemPrompt
        ? systemPrompt
        : `
You are "AI Booker Assistant", a veteran pro-wrestling booker helping a player run a promotion.
You know EWR-style logic: individual segment ratings matter, feud heat is moved by the segments
tied to that feud, and backstage morale/politics matter.
When the user asks for an idea, give:
1) a short pitch,
2) cast (who vs who),
3) segment-by-segment outline,
4) note on how it will affect heat/morale.
Keep answers concise and actionable.
${rosterContext ? "\nCurrent roster:\n" + rosterContext : ""}
        `.trim();

      messages = [
        { role: "system", content: sys },
        { role: "user", content: userQuery || "Give me a booking idea." },
      ];

      const completion = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages,
        temperature: 0.85,
      });

      const text = completion.choices[0].message.content;
      return res.status(200).json({ text });
    }

    // ------ MODE 2: Wrestler in-game message ------
    if (mode === "wrestler-message") {
      // fallback text if we somehow got no wrestler
      const name = wrestler?.name || "Unnamed Wrestler";
      const gimmick = wrestler?.gimmick || "no gimmick";
      const disposition = wrestler?.disposition || "Tweener";

      // pick prompt based on topic
      let topicInstruction = "";
      switch (topic) {
        case "unhappy_booking":
          topicInstruction =
            "You're frustrated with how you've been booked lately. You feel overlooked or misused.";
          break;
        case "excited_push":
          topicInstruction =
            "You're happy with your current push and want to thank the booker but also signal you can do more.";
          break;
        case "request_time_off":
        default:
          topicInstruction =
            "You need to ask for some time off for personal reasons but don't want to hurt your push.";
          break;
      }

      const wrestlerSystem = `
You are a professional wrestler sending an *informal text message* to your boss, the booker.
Write 1-3 sentences, casual, in-character, not an email, no hashtags, no sign-off.
Name: ${name}
Gimmick: ${gimmick}
Disposition: ${disposition}
Context: ${topicInstruction}
`.trim();

      const completion = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: wrestlerSystem },
          {
            role: "user",
            content: "Write the text message now.",
          },
        ],
        temperature: 0.9,
      });

      const text = completion.choices[0].message.content;
      return res.status(200).json({ text });
    }

    // ------ MODE 3: Show recap / dirt sheet ------
    if (mode === "show-recap") {
      const showName = show?.eventName || "Unnamed Show";
      const rating = typeof finalRating === "number" ? finalRating : 60;

      // turn segments into readable list
      const cardLines = Array.isArray(segments)
        ? segments
            .filter(Boolean)
            .map((s, idx) => {
              const names = (s.participants || [])
                .map((p) => p.name)
                .join(" vs. ");
              const ratingPart = s.rating
                ? ` (Segment Rating: ${s.rating}/100)`
                : "";
              const storyPart = s.storylineName
                ? ` (Storyline: ${s.storylineName})`
                : s.storylineId
                ? ` (Storyline ID: ${s.storylineId})`
                : "";
              return `${idx + 1}. ${s.type || "Segment"}: ${names}${storyPart}${ratingPart}`;
            })
            .join("\n")
        : "No segments provided.";

      const recapSystem = `
You are an online wrestling columnist (think WrestleZone / WON / early EWR vibe).
Write a recap of the show. Use insider language but stay readable.
IMPORTANT:
- Base overall tone on the final rating.
- Praise or bury individual segments based on *their* ratings.
- If you see a storyline tag, mention how the segment affected that feud/heat.
- 2-4 paragraphs max, no bullet lists.
      `.trim();

      const completion = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: recapSystem },
          {
            role: "user",
            content: `
Show Name: ${showName}
Final Rating: ${rating}/100

Card:
${cardLines}
            `.trim(),
          },
        ],
        temperature: 0.8,
      });

      const text = completion.choices[0].message.content;
      return res.status(200).json({ text });
    }

    // fallback if we got an unknown mode
    return res.status(400).json({ error: "Unknown mode" });
  } catch (err) {
    console.error("AI route error:", err);
    return res
      .status(500)
      .json({ error: "AI call failed", detail: err.message || String(err) });
  }
}
