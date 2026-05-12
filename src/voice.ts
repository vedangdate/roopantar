// Web Speech API wrapper. Browser-native, free, good enough for v0.
// Chrome/Edge: full support. Safari: partial (works but recognition is shorter).

// Minimal type shims for the SpeechRecognition API which TS lib.dom does not
// always expose (vendor prefix and varying browser availability).
interface SpeechRecognitionResult {
  isFinal: boolean;
  0: { transcript: string; confidence: number };
}
interface SpeechRecognitionEvent extends Event {
  results: { length: number; [i: number]: SpeechRecognitionResult };
}
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((ev: SpeechRecognitionEvent) => void) | null;
  onerror: ((ev: Event) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
}
type SRConstructor = new () => SpeechRecognition;

export function getSpeechRecognition(): SpeechRecognition | null {
  const w = window as unknown as {
    SpeechRecognition?: SRConstructor;
    webkitSpeechRecognition?: SRConstructor;
  };
  const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
  if (!Ctor) return null;
  const sr = new Ctor();
  sr.continuous = false;
  sr.interimResults = false;
  sr.lang = 'en-IN';
  return sr;
}

export class VoiceController {
  private sr: SpeechRecognition | null;
  private listening = false;
  private finalText = '';

  constructor(
    private onPartial: (text: string) => void,
    private onFinal: (text: string) => void,
    private onError: (msg: string) => void,
  ) {
    this.sr = getSpeechRecognition();
    if (this.sr) {
      this.sr.continuous = true;
      this.sr.interimResults = true;
      this.sr.onresult = (e: SpeechRecognitionEvent) => {
        let interim = '';
        for (let i = 0; i < e.results.length; i++) {
          const r = e.results[i];
          if (r.isFinal) {
            this.finalText += r[0].transcript;
          } else {
            interim += r[0].transcript;
          }
        }
        if (interim) this.onPartial(this.finalText + interim);
        else if (this.finalText) this.onPartial(this.finalText);
      };
      this.sr.onerror = (e: any) => {
        this.onError(e?.error ?? 'speech-recognition-error');
        this.listening = false;
      };
      this.sr.onend = () => {
        this.listening = false;
        if (this.finalText.trim()) this.onFinal(this.finalText.trim());
        this.finalText = '';
      };
    }
  }

  get supported() { return this.sr !== null; }
  get isListening() { return this.listening; }

  start() {
    if (!this.sr || this.listening) return;
    this.finalText = '';
    try {
      this.sr.start();
      this.listening = true;
    } catch (e) {
      this.onError(String(e));
    }
  }

  stop() {
    if (!this.sr || !this.listening) return;
    try {
      this.sr.stop();
    } catch { /* ignore */ }
  }
}

// Speak text via Web Speech API SpeechSynthesis.
export function speak(text: string, opts: { rate?: number; pitch?: number; voice?: string } = {}) {
  if (!('speechSynthesis' in window)) return;
  const u = new SpeechSynthesisUtterance(text);
  u.rate = opts.rate ?? 1.05;
  u.pitch = opts.pitch ?? 1.0;
  u.lang = 'en-IN';
  if (opts.voice) {
    const v = speechSynthesis.getVoices().find((vc) => vc.name === opts.voice);
    if (v) u.voice = v;
  }
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
}
