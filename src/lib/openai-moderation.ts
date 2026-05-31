const OPENAI_MODERATION_URL = "https://api.openai.com/v1/moderations";

export async function checkWithAI(
  text: string
): Promise<{ flagged: boolean; categories: string[] } | null> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return null;
  }

  const res = await fetch(OPENAI_MODERATION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ input: text }),
  });

  if (!res.ok) {
    console.warn("[openai-moderation] API error:", res.status, await res.text());
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
