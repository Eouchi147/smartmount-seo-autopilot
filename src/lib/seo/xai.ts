const CHAT_URL = "https://api.x.ai/v1/chat/completions";
const IMAGE_URL = "https://api.x.ai/v1/images/generations";

export function getApiKey(): string | null {
  const key = process.env.XAI_API_KEY;
  return key && key.trim() ? key : null;
}

export async function chatGrok(opts: {
  system: string;
  user: string;
  maxTokens?: number;
  temperature?: number;
}): Promise<{ ok: true; text: string } | { ok: false; error: string }> {
  const apiKey = getApiKey();
  if (!apiKey) return { ok: false, error: "AI is not available in this environment" };

  const res = await fetch(CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "grok-4.5",
      temperature: opts.temperature ?? 0.5,
      max_tokens: opts.maxTokens ?? 4096,
      messages: [
        { role: "system", content: opts.system },
        { role: "user", content: opts.user },
      ],
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    return {
      ok: false,
      error: `xAI API error ${res.status}${detail ? `: ${detail.slice(0, 180)}` : ""}`,
    };
  }

  const body = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  return { ok: true, text: body.choices?.[0]?.message?.content ?? "" };
}

export async function generateImage(prompt: string): Promise<
  { ok: true; url: string } | { ok: false; error: string }
> {
  const apiKey = getApiKey();
  if (!apiKey) return { ok: false, error: "AI is not available in this environment" };

  const res = await fetch(IMAGE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "grok-imagine-image",
      prompt,
      n: 1,
      resolution: "1k",
      response_format: "url",
    }),
  });

  if (!res.ok) {
    return { ok: false, error: `Image API error ${res.status}` };
  }

  const body = (await res.json()) as { data?: { url?: string }[] };
  const url = body.data?.[0]?.url;
  if (!url) return { ok: false, error: "Image API returned no URL" };
  return { ok: true, url };
}

export function extractJson<T>(text: string): T | null {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = (fenced?.[1] ?? text).trim();
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start < 0 || end <= start) {
    const a = raw.indexOf("[");
    const b = raw.lastIndexOf("]");
    if (a >= 0 && b > a) {
      try {
        return JSON.parse(raw.slice(a, b + 1)) as T;
      } catch {
        return null;
      }
    }
    return null;
  }
  try {
    return JSON.parse(raw.slice(start, end + 1)) as T;
  } catch {
    return null;
  }
}
