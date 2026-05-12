// POST /api/tts
// Body: { text: string, voiceId?: string, modelId?: string, languageCode?: string }
// Returns: audio/mpeg stream
//
// Proxies to ElevenLabs text-to-speech. Defaults to multilingual_v2 (best
// stable model for English + Marathi mix on starter tier) and the "Sarah"
// voice (warm conversational, works across languages).

interface Env {
  ELEVENLABS_API_KEY: string;
}

interface ReqBody {
  text: string;
  voiceId?: string;
  modelId?: string;
  languageCode?: string;
}

// Default voice: "Sarah" - mature, reassuring, conversational female voice.
// Works well with multilingual models across English + Marathi.
const DEFAULT_VOICE = 'EXAVITQu4vr4xnSDxMaL';

// Default model: multilingual_v2 - stable, supports 29 languages incl. Marathi.
// Override to 'eleven_v3' for higher expressiveness (alpha) if available.
const DEFAULT_MODEL = 'eleven_multilingual_v2';

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.ELEVENLABS_API_KEY) {
    return json({ error: 'ELEVENLABS_API_KEY not set on Pages project' }, 500);
  }

  let body: ReqBody;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'invalid JSON body' }, 400);
  }
  if (!body.text?.trim()) return json({ error: 'text required' }, 400);

  const voiceId = body.voiceId || DEFAULT_VOICE;
  const modelId = body.modelId || DEFAULT_MODEL;

  // language_code is only accepted by certain models (turbo_v2_5, v3, flash_v2_5).
  // multilingual_v2 auto-detects language from script — passing language_code
  // returns 400 there. So gate the param on model.
  const modelsSupportingLang = new Set(['eleven_turbo_v2_5', 'eleven_flash_v2_5', 'eleven_v3']);
  const includeLangCode = !!body.languageCode && modelsSupportingLang.has(modelId);

  const upstream = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: 'POST',
      headers: {
        'xi-api-key': env.ELEVENLABS_API_KEY,
        'content-type': 'application/json',
        'accept': 'audio/mpeg',
      },
      body: JSON.stringify({
        text: body.text,
        model_id: modelId,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.3,
          use_speaker_boost: true,
        },
        ...(includeLangCode ? { language_code: body.languageCode } : {}),
      }),
    }
  );

  if (!upstream.ok) {
    const errText = await upstream.text().catch(() => upstream.statusText);
    return json({ error: `ElevenLabs ${upstream.status}: ${errText.slice(0, 500)}` }, 502);
  }

  // Stream the audio response back to the client unchanged.
  return new Response(upstream.body, {
    status: 200,
    headers: {
      'content-type': 'audio/mpeg',
      'cache-control': 'no-store',
    },
  });
};

function json(obj: unknown, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}
