// Voice stack: ElevenLabs (via Pages Functions proxy).
// - STT: MediaRecorder captures mic audio → POST /api/stt → scribe_v1
//   transcribes (auto-detects English vs Marathi).
// - TTS: POST /api/tts → eleven_multilingual_v2 returns audio/mpeg,
//   we play it via a hidden <audio> element.
//
// Defaults to en-IN-friendly behaviour: lets the model auto-detect language
// so the user can speak either English or Marathi freely.

export class VoiceController {
  private mediaRecorder: MediaRecorder | null = null;
  private stream: MediaStream | null = null;
  private chunks: Blob[] = [];
  private recording = false;
  private aborted = false;

  constructor(
    private onPartial: (text: string) => void, // unused for now (no streaming STT)
    private onFinal: (text: string) => void,
    private onError: (msg: string) => void,
  ) {}

  get supported() {
    return typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia && typeof MediaRecorder !== 'undefined';
  }
  get isListening() { return this.recording; }

  async start() {
    if (this.recording) return;
    if (!this.supported) {
      this.onError('Mic / MediaRecorder not supported in this browser.');
      return;
    }
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (e: any) {
      this.onError(`mic permission denied: ${e?.message ?? e}`);
      return;
    }

    // Prefer Opus in WebM; ElevenLabs Scribe accepts most common formats.
    let mimeType = 'audio/webm;codecs=opus';
    if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = 'audio/webm';
    if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = 'audio/mp4';

    this.mediaRecorder = new MediaRecorder(this.stream, { mimeType });
    this.chunks = [];
    this.aborted = false;

    this.mediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) this.chunks.push(e.data);
    };
    this.mediaRecorder.onstop = async () => {
      // Release mic
      this.stream?.getTracks().forEach((t) => t.stop());
      this.stream = null;
      const blob = new Blob(this.chunks, { type: mimeType });
      this.recording = false;
      if (this.aborted) return;
      if (blob.size < 1000) {
        this.onError('Too short — try holding the mic a bit longer.');
        return;
      }
      // Show partial cue while waiting for transcription.
      this.onPartial('listening… transcribing…');
      try {
        const text = await transcribe(blob);
        if (text) this.onFinal(text);
        else this.onError('No speech detected.');
      } catch (e: any) {
        this.onError(`stt: ${e?.message ?? e}`);
      }
    };

    this.mediaRecorder.start();
    this.recording = true;
  }

  stop() {
    if (!this.recording || !this.mediaRecorder) return;
    try { this.mediaRecorder.stop(); } catch { /* ignore */ }
  }

  abort() {
    this.aborted = true;
    this.stop();
  }
}

async function transcribe(audio: Blob): Promise<string> {
  const fd = new FormData();
  fd.append('file', audio, 'audio.webm');
  const res = await fetch('/api/stt', { method: 'POST', body: fd });
  if (!res.ok) {
    const t = await res.text().catch(() => res.statusText);
    throw new Error(`${res.status}: ${t.slice(0, 200)}`);
  }
  const data = (await res.json()) as { text?: string; error?: string };
  if (data.error) throw new Error(data.error);
  return data.text ?? '';
}

// === TTS ===

let currentAudio: HTMLAudioElement | null = null;

/**
 * Speak the given text via ElevenLabs. Cancels any in-flight playback.
 * Returns a promise that resolves when playback finishes (or rejects on error).
 */
export async function speak(text: string, opts: { voiceId?: string; modelId?: string; languageCode?: string } = {}): Promise<void> {
  if (!text?.trim()) return;
  cancelSpeech();

  const res = await fetch('/api/tts', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ text, ...opts }),
  });
  if (!res.ok) {
    const err = await res.text().catch(() => res.statusText);
    throw new Error(`tts ${res.status}: ${err.slice(0, 200)}`);
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);

  return new Promise((resolve, reject) => {
    const audio = new Audio(url);
    currentAudio = audio;
    audio.onended = () => {
      URL.revokeObjectURL(url);
      if (currentAudio === audio) currentAudio = null;
      resolve();
    };
    audio.onerror = (e) => {
      URL.revokeObjectURL(url);
      if (currentAudio === audio) currentAudio = null;
      reject(new Error('audio playback failed'));
    };
    audio.play().catch(reject);
  });
}

export function cancelSpeech() {
  if (currentAudio) {
    try { currentAudio.pause(); } catch { /* ignore */ }
    currentAudio = null;
  }
}
