// /api/ai.js
// Vercel serverless function
// Make sure OPENAI_API_KEY is set in your Vercel project

import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  // basic guard
  if (req.method !== "POST" && req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // quick GET check (you already hit this in the browser)
  if (req.method === "GET") {
    return res.status(200).json({ ok: true, message: "AI route is alive" });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "Missing OPENAI_API_KEY" });
  }

  try {
    const {
      mode,
      systemPrompt,
      userQuery,
      rosterContext,
      wrestler,
      topic,
      show,
      segments,
      finalRating,
    } = req.body || {};

    // --- helper to call OpenAI once ---
    const callModel = async (messages) => {
      const completion = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages,
        temperature: 0.9,
      });
      return completion.choices[0].message.content;
    };

    // ===== MODE: ASSISTANT =====
    if (mode === "assistant") {
      // if React sent a roster, use it. if not, tell model to be helpful anyway
      const rosterSection =
        rosterContext && rosterContext.trim().length > 0
          ? `Here is the user's current roster (names + dispositions + gimmicks + morale):\n${rosterContext}\n\nUse these exact names when you suggest feuds or pushes.`
          : `The user did NOT send a roster. In this case, you MUST still answer with concrete, usable booking ideas. 
- Suggest 3–5 wrestlers with archetypal names (Main Event Ace, Monster Heel, Workrate King, Hot Babyface Woman, Veteran Tag Team).
- Then tell the user: "Map these to your real roster names." 
- Do NOT say "I can't answer without your roster."`;

      const sys = systemPrompt
        ? systemPrompt
        : `You are an elite pro-wrestling booker AI that understands TEW/EWR-style sims.
You know: feuds, angles, heat, disposition (face/heel), titles, women's division, tag division, and long-term PPV blowoffs.
You ALWAYS answer with concrete suggestions (segments, matches, feud outline) and NEVER refuse just because you don't see the roster.`;

      const userMsg = `
The user asked: ${userQuery || "(no user question??)"}

${rosterSection}

When you answer:
- Give 2–3 options.
- For each, say WHY it fits (style, charisma, morale, heel/face balance).
- If they asked "who should I push", give at least one main eventer, one upper midcard, and one future project.
`;

      const text = await callModel([
        { role: "system", content: sys },
        { role: "user", content: userMsg },
      ]);

      return res.status(200).json({ ok: true, text });
    }

    // ===== MODE: WRESTLER MESSAGE =====
    if (mode === "wrestler-message") {
      // we expect: { wrestler, topic }
      const safeName = wrestler?.name || "Unnamed Wrestler";
      const safeGimmick = wrestler?.gimmick || "generic pro wrestler";
      const safeDisposition = wrestler?.disposition || "Tweener";
      const morale = typeof wrestler?.morale === "number" ? wrestler.morale : 70;

      const topicInstruction = (() => {
        switch (topic) {
          case "unhappy_booking":
            return `Write as if ${safeName} is politely but firmly unhappy with their recent booking and wants to be protected or featured more.`;
          case "excited_push":
            return `Write as if ${safeName} just heard they're getting a push and wants to thank the boss + pitch a couple of angles.`;
          case "request_time_off":
            return `Write as if ${safeName} needs some time off (minor injury, burnout, family).`;
          default:
            return `Write a short in-game message about current wrestling business.`;
        }
      })();

      const text = await callModel([
        {
          role: "system",
          content: `You are generating in-universe messages for a wrestling booking sim. 
Output ONLY the message body, no headers, no JSON. Keep it 2–5 sentences. 
Voice should match the wrestler's persona/gimmick.`,
        },
        {
          role: "user",
          content: `
Wrestler: ${safeName}
Gimmick/persona: ${safeGimmick}
Disposition: ${safeDisposition}
Current morale: ${morale}

${topicInstruction}

Make it sound like a DM / office message to the booker, not a promo.`,
        },
      ]);

      return res.status(200).json({ ok: true, text });
    }

    // ===== MODE: SHOW RECAP =====
    if (mode === "show-recap") {
      const showName = show?.eventName || "Unnamed Show";
      const tier = show?.eventTier || "Monthly_Event";
      const ratingNum = typeof finalRating === "number" ? finalRating : 60;

      const segmentLines = (segments || [])
        .filter(Boolean)
        .map((seg, idx) => {
          const type = seg.type || "Segment";
          const names = (seg.participants || []).map((p) => p.name).join(" vs. ");
          const segRating = seg.rating ?? "N/A";
          const storyline = seg.storylineId ? `(storyline: ${seg.storylineId})` : "";
          return `#${idx + 1} ${type}: ${names} — Rating ${segRating} ${storyline}`;
        })
        .join("\n");

      const text = await callModel([
        {
          role: "system",
          content: `You write smarky, dirt-sheet style recaps of booked wrestling shows. 
Mention standout matches, bad segments, and momentum for storylines. 
Keep it immersive and in-universe. 3–6 paragraphs.`,
        },
        {
          role: "user",
          content: `
Show name: ${showName}
Tier: ${tier}
Overall rating: ${ratingNum}

Segments:
${segmentLines}

Write the recap.`,
        },
      ]);

      return res.status(200).json({ ok: true, text });
    }

    // ===== UNKNOWN MODE =====
    return res.status(400).json({ error: "Unknown mode" });
  } catch (err) {
    console.error("AI route error:", err);
    return res.status(500).json({ error: "AI route failed", details: err.message });
  }
}
