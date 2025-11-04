// /api/ai.js
// Vercel serverless function
// Make sure OPENAI_API_KEY is set in your Vercel project

import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  // basic guard
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

    // small helper so we don't repeat the call everywhere
    async function runChat(systemText, userText) {
      const resp = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemText },
          { role: "user", content: userText },
        ],
        temperature: 0.8,
      });
      return resp.choices[0].message.content;
    }

    // route by mode
    switch (mode) {
      case "wrestler-message": {
        // used by daily sim to generate inbox messages
        const sys =
          systemPrompt ||
          `
You are roleplaying as a professional wrestler texting their boss (the booker).
1-3 sentences, informal, sounds like a human wrestler.
Match your disposition (face = respectful, heel = cocky/annoyed).
Do NOT add hashtags. Do NOT sign your name.
`;
        const user =
          userQuery ||
          "Write a short in-character text message to the booker about today's issue.";

        const content = await runChat(sys, user);

        return res.status(200).json({
          ok: true,
          text: content,
          meta: {
            mode: "wrestler-message",
            topic: topic || null,
            wrestler: wrestler || null,
          },
        });
      }

      case "booker-reply": {
        // used when the user hits Reply but leaves the box blank
        const sys =
          systemPrompt ||
          `
You are the head booker / owner replying to a wrestler's text.
Be professional but human. 1-3 sentences.
If they complained: acknowledge, don't promise too much.
If they asked for time off: ask for dates or briefly approve.
`;
        const user =
          userQuery ||
          "Draft a quick reply to the wrestler about their message.";

        const content = await runChat(sys, user);

        return res.status(200).json({
          ok: true,
          text: content,
          meta: {
            mode: "booker-reply",
          },
        });
      }

      case "booker-assistant": {
        // the “Ask AI Assistant” button in the UI
        const sys =
          systemPrompt ||
          `
You are an expert wrestling booker and EWR-style simulator consultant.
Give concrete angles, feuds, and roster-management suggestions.
Keep it practical for the in-game booking system.
`;
        const user =
          userQuery ||
          "Give me 3 storyline ideas for the main event scene.";

        const content = await runChat(sys, user);

        return res.status(200).json({
          ok: true,
          text: content,
          meta: {
            mode: "booker-assistant",
          },
        });
      }

      case "show-recap": {
        // after a show is run
        const sys =
          systemPrompt ||
          `
You are writing a wrestling show recap in the style of an insider/dirt sheet.
Highlight best and worst segments and mention momentum/heat where relevant.
`;
        const user =
          userQuery ||
          "Here's the card and ratings. Write a recap.";

        const content = await runChat(sys, user);

        return res.status(200).json({
          ok: true,
          text: content,
          meta: {
            mode: "show-recap",
          },
        });
      }

      default: {
        // unknown mode — tell frontend
        return res.status(400).json({
          error: "Unknown mode. Expected wrestler-message | booker-reply | booker-assistant | show-recap.",
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
}
