// POST /api/imagine
// Body: { prompt: string, imageBase64: string (PNG/JPEG, no data: prefix) }
// Returns: { imageBase64?, mimeType?, caption?, error? }
//
// Proxies to gemini-2.5-flash-image-preview ("nano-banana"). Takes the
// current 3D-view screenshot and the user's transformation prompt, returns
// a generated image showing the room with the requested change.

interface Env {
  GEMINI_API_KEY: string;
}

interface ReqBody {
  prompt: string;
  imageBase64: string;
}

const VISUAL_PROMPT_PREFIX = `You are an interior-design visualiser. The attached image is a screenshot from a first-person walkthrough of a virtual apartment. Generate a single new image showing the SAME room from the SAME viewpoint, but with the following transformation applied. Keep the camera, framing, walls, and overall geometry the same — only change interior elements (colors, materials, furniture, decor, lighting) as requested. Render photorealistically.

TRANSFORMATION:
`;

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
  if (!body.prompt || !body.imageBase64) {
    return json({ error: 'prompt and imageBase64 required' }, 400);
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${env.GEMINI_API_KEY}`;
  const upstream = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [
            { text: VISUAL_PROMPT_PREFIX + body.prompt },
            { inline_data: { mime_type: 'image/jpeg', data: body.imageBase64 } },
          ],
        },
      ],
      generationConfig: {
        responseModalities: ['IMAGE', 'TEXT'],
      },
    }),
  });

  if (!upstream.ok) {
    const errText = await upstream.text().catch(() => upstream.statusText);
    return json({ error: `Gemini ${upstream.status}: ${errText.slice(0, 600)}` }, 502);
  }

  const data: any = await upstream.json();
  const parts: any[] = data?.candidates?.[0]?.content?.parts ?? [];
  const imgPart = parts.find((p) => p.inline_data || p.inlineData);
  const inline = imgPart?.inline_data ?? imgPart?.inlineData;
  const textPart = parts.find((p) => p.text);

  if (!inline?.data) {
    return json({
      caption: textPart?.text ?? '(model returned no image)',
      error: 'no_image',
    });
  }

  return json({
    imageBase64: inline.data,
    mimeType: inline.mime_type ?? inline.mimeType ?? 'image/png',
    caption: textPart?.text?.trim() ?? body.prompt,
  });
};

function json(obj: unknown, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}
