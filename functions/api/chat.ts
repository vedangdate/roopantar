// POST /api/chat
// Body: { history: [{role, text}], context?: {roomName?: string|null} }
// Returns: { text: string, imagine?: string|null }
//
// Proxies to Gemini 2.5 Flash. The system prompt instructs the model to be
// a friendly interior-design assistant. If the model determines the user
// wants a visual generation, it can include <imagine>...</imagine> in its
// response — the wrapper strips that tag and surfaces it as `imagine`.

interface Env {
  GEMINI_API_KEY: string;
}

interface InMsg { role: 'user' | 'model'; text: string }
interface ReqBody {
  history: InMsg[];
  context?: { roomName?: string | null };
}

const SYSTEM_PROMPT = `You are Roopantar, an interior-design assistant living inside a first-person 3D walkthrough of someone's apartment.

The user is walking through their home and talking to you in real time. Be warm, conversational, and concise — speak like a friend with a sharp eye for interiors, not a chatbot. Most replies should be 1–3 short sentences.

CONTEXT:
- The user moves with WASD + mouse-look.
- Each user message includes which room they're currently in (when available).
- You CAN trigger an AI image generation of how the current view would look after a change. To do this, append a single line at the very end of your response in the form:
  <imagine>concise description of the desired transformation</imagine>
- Only emit <imagine> when the user is clearly asking to SEE a change ("show me", "what if", "imagine", "make this", "change", "redesign"). For pure questions or chit-chat, do NOT emit it.
- The <imagine> prompt should describe the END STATE (what the room should look like), not the action. Example: "this living room with sage green walls, a rust velvet sofa, and warm pendant lighting".

STYLE: warm, specific, no purple prose. Indian-context fluent (Vastu, mandir room, jali, Jaipur block prints, terrazzo, etc.) when it fits.`;

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.GEMINI_API_KEY) {
    return json({ error: 'GEMINI_API_KEY not set on Pages project' }, 500);
  }

  let body: ReqBody;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'invalid JSON body' }, 400);
  }
  if (!body.history?.length) return json({ error: 'history required' }, 400);

  const contextLine = body.context?.roomName
    ? `\n(The user is currently in: ${body.context.roomName}.)`
    : '';

  // Convert our history shape to Gemini's "contents" shape.
  // Inject context onto the most recent user message so the model knows where they are.
  const contents = body.history.map((m, i) => {
    const isLast = i === body.history.length - 1;
    const text = (isLast && m.role === 'user') ? m.text + contextLine : m.text;
    return { role: m.role, parts: [{ text }] };
  });

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${env.GEMINI_API_KEY}`;
  const upstream = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      contents,
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 400,
      },
    }),
  });

  if (!upstream.ok) {
    const errText = await upstream.text().catch(() => upstream.statusText);
    return json({ error: `Gemini ${upstream.status}: ${errText.slice(0, 400)}` }, 502);
  }

  const data: any = await upstream.json();
  const rawText: string =
    data?.candidates?.[0]?.content?.parts?.map((p: any) => p.text).filter(Boolean).join('\n').trim() ?? '';

  // Extract <imagine>...</imagine> if present.
  let imagine: string | null = null;
  let text = rawText;
  const m = rawText.match(/<imagine>([\s\S]*?)<\/imagine>/i);
  if (m) {
    imagine = m[1].trim();
    text = rawText.replace(/<imagine>[\s\S]*?<\/imagine>/i, '').trim();
  }

  return json({ text: text || '(no reply)', imagine });
};

function json(obj: unknown, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}
