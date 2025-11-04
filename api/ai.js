// /api/ai.js
// Single unified AI endpoint for the app
// Make sure OPENAI_API_KEY is set in Vercel

const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports = async function handler(req, res) {
  // allow only POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "Missing OPENAI_API_KEY" });
  }

  try {
    const {
      mode,
      systemPrompt,
      userQuery,
      wrestler,
      topic,
    } = req.body || {};

    // helper so we don't repeat ourselves
    async function runChat(systemText, userText) {
      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemText },
          { role: "user", content: userText },
        ],
        temperature: 0.8,
      });
      return response.choices[0].message.content;
    }

    // route by mode
    switch (mode) {
      case "wrestler-message": {
        // daily sim inbox messages
        const sys =
          systemPrompt ||
          `
You are roleplaying as a professional wrestler texting their boss (the booker).
1-3 sentences, informal, sounds like a human wrestler.
Match the given disposition (face = respectful, heel = cocky/annoyed).
Do NOT add hashtags. Do NOT sign your name.
`;
        const user =
          userQuery ||
          "Write a short in-character text message to the booker about today's issue.";

        const text = await runChat(sys, user);

        return res.status(200).json({
          ok: true,
          text,
          meta: {
            mode: "wrestler-message",
            wrestler: wrestler || null,
            topic: topic || null,
          },
        });
      }

      case "booker-reply": {
        // reply to wrestler (if user left it blank we auto-generate)
        const sys =
          systemPrompt ||
          `
You are the head booker / owner replying to a wrestler's text.
Be professional but human. 1-3 sentences.
If they complained: acknowledge and say you'll keep them in mind.
If they asked for time off: approve briefly or ask for dates.
`;
        const user =
          userQuery ||
          "Draft a quick reply to the wrestler about their message.";

        const text = await runChat(sys, user);

        return res.status(200).json({
          ok: true,
          text,
          meta: {
            mode: "booker-reply",
          },
        });
      }

      case "booker-assistant": {
        // the sidebar “AI assistant” the user opens
        const sys =
          systemPrompt ||
          `
You are an expert wrestling booker and EWR-style simulator consultant.
Give concrete angles, feuds, matchups, and roster-management suggestions.
Reference alignment, gimmicks, morale, and storyline heat when possible.
Keep answers practical for a booking game.
`;
        const user =
          userQuery ||
          "Give me 3 storyline ideas for my main event scene.";

        const text = await runChat(sys, user);

        return res.status(200).json({
          ok: true,
          text,
          meta: {
            mode: "booker-assistant",
          },
        });
      }

      case "show-recap": {
        const sys =
          systemPrompt ||
          `
You are writing a recap of a wrestling show in insider/dirt-sheet style.
Highlight best and worst segments and mention storyline advancement.
`;
        const user =
          userQuery || "Here's the card and ratings. Write the recap.";

        const text = await runChat(sys, user);

        return res.status(200).json({
          ok: true,
          text,
          meta: {
            mode: "show-recap",
          },
        });
      }

      default: {
        return res.status(400).json({
          error:
            "Unknown mode. Expected wrestler-message | booker-reply | booker-assistant | show-recap.",
        });
      }
    }
  } catch (err) {
    console.error("AI route error:", err);
    return res.status(500).json({
      error: "AI request failed",
      detail: err.message,
    });
  }
};
