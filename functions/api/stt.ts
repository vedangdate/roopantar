// POST /api/stt
// Body: multipart/form-data with a "file" field (audio blob) and optional
//       "languageCode" (e.g. "eng", "mar", or omitted for auto-detect).
// Returns: { text: string, languageCode?: string }
//
// Proxies to ElevenLabs scribe_v1 — supports 99 languages including
// English and Marathi. Multipart pass-through.

interface Env {
  ELEVENLABS_API_KEY: string;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.ELEVENLABS_API_KEY) {
    return json({ error: 'ELEVENLABS_API_KEY not set on Pages project' }, 500);
  }

  let inForm: FormData;
  try {
    inForm = await request.formData();
  } catch {
    return json({ error: 'expected multipart/form-data with a file field' }, 400);
  }

  const file = inForm.get('file');
  // In Workers runtime, File extends Blob; type-narrow on Blob only.
  if (!file || typeof file === 'string' || !(file instanceof Blob)) {
    return json({ error: 'file field missing or not a blob' }, 400);
  }

  // Build the forwarded form. scribe_v1 wants `file` + `model_id`.
  const outForm = new FormData();
  outForm.append('file', file, (file as { name?: string }).name ?? 'audio.webm');
  outForm.append('model_id', 'scribe_v1');
  const lang = inForm.get('languageCode');
  if (typeof lang === 'string' && lang) outForm.append('language_code', lang);

  const upstream = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
    method: 'POST',
    headers: { 'xi-api-key': env.ELEVENLABS_API_KEY },
    body: outForm,
  });

  if (!upstream.ok) {
    const errText = await upstream.text().catch(() => upstream.statusText);
    return json({ error: `ElevenLabs ${upstream.status}: ${errText.slice(0, 500)}` }, 502);
  }

  const data: any = await upstream.json();
  return json({
    text: (data?.text ?? '').trim(),
    languageCode: data?.language_code ?? data?.languageCode ?? null,
  });
};

function json(obj: unknown, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}
