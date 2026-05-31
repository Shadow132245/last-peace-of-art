// ─── Google Gemini (free, no credit card required) ─────────────────
// Free tier: 1500 requests/day, no billing needed
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

async function checkWithGemini(text: string): Promise<{
  flagged: boolean;
  categories: string[];
} | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const prompt = `Analyze the following text and determine if it contains any of these categories:
- harassment / hate speech / personal attacks
- sexual content / pornographic material
- violence / self-harm / suicide
- spam / phishing / scams
- hacking / malware / illegal activities
- promotion of illegal drugs

Reply with ONLY a JSON object like this:
{"flagged":true/false,"categories":["category1","category2"]}

If nothing is found, return: {"flagged":false,"categories":[]}

Text to analyze:
"""${text}"""`;

  const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 200,
      },
    }),
  });

  if (!res.ok) {
    console.warn("[ai-moderation] Gemini API error:", res.status, await res.text());
    return null;
  }

  const data = await res.json();
  const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

  const jsonMatch = reply.match(/\{[^{}]*\}/);
  if (!jsonMatch) return null;

  try {
    const parsed = JSON.parse(jsonMatch[0]);
    return {
      flagged: Boolean(parsed.flagged),
      categories: Array.isArray(parsed.categories) ? parsed.categories : [],
    };
  } catch {
    return null;
  }
}

// ─── OpenAI Moderation (optional, requires billing) ────────────────
async function checkWithOpenAI(text: string): Promise<{
  flagged: boolean;
  categories: string[];
} | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const res = await fetch("https://api.openai.com/v1/moderations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ input: text }),
  });

  if (!res.ok) {
    console.warn("[ai-moderation] OpenAI API error:", res.status, await res.text());
    return null;
  }

  const data = await res.json();
  const result = data.results?.[0];
  if (!result) return null;

  const flaggedCategories = Object.entries(result.categories ?? {})
    .filter(([, val]) => val === true)
    .map(([key]) => key);

  return {
    flagged: result.flagged ?? false,
    categories: flaggedCategories,
  };
}

// ─── Unified entry point ────────────────────────────────────────────
// Tries Gemini first (free), then OpenAI (optional).
// Returns null if neither is configured.
export async function checkWithAI(text: string): Promise<{
  flagged: boolean;
  categories: string[];
} | null> {
  // Try Gemini first (free tier, no card required)
  const geminiResult = await checkWithGemini(text);
  if (geminiResult !== null) return geminiResult;

  // Fall back to OpenAI if Gemini is not configured
  const openaiResult = await checkWithOpenAI(text);
  if (openaiResult !== null) return openaiResult;

  return null;
}
