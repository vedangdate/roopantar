// Frontend client for the Gemini Pages Functions.
// All requests go through /api/* proxies on Cloudflare Pages so the
// Gemini API key stays server-side.

export interface ChatMsg {
  role: 'user' | 'model';
  text: string;
}

export interface ChatResponse {
  text: string;
  /** If the AI wants to trigger image gen, it can return an inline imagine prompt. */
  imagine?: string | null;
}

export interface ImagineResponse {
  /** base64 PNG/JPEG, no prefix. */
  imageBase64?: string;
  mimeType?: string;
  caption?: string;
  error?: string;
}

// Conversation history kept in memory only for v0.
let history: ChatMsg[] = [];

export function getHistory(): ChatMsg[] {
  return history.slice();
}

export function clearHistory() {
  history = [];
}

export async function chat(userMessage: string, context: { roomName?: string | null } = {}): Promise<ChatResponse> {
  history.push({ role: 'user', text: userMessage });

  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ history, context }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => res.statusText);
    throw new Error(`Chat API error ${res.status}: ${errText}`);
  }
  const data = (await res.json()) as ChatResponse;
  history.push({ role: 'model', text: data.text });
  return data;
}

export async function imagine(prompt: string, screenshotBase64: string): Promise<ImagineResponse> {
  const res = await fetch('/api/imagine', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ prompt, imageBase64: screenshotBase64 }),
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => res.statusText);
    return { error: `Imagine API error ${res.status}: ${errText}` };
  }
  return (await res.json()) as ImagineResponse;
}
