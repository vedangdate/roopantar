// UI glue: start/pause overlays, chat panel, image overlay, toasts.
// All UI elements are defined in index.html; this file wires up events.

import type { SceneBundle } from './scene';
import { VoiceController, speak } from './voice';
import { chat, imagine } from './ai';

export function setupUI(bundle: SceneBundle) {
  const { camera, canvas, screenshot, currentRoomName } = bundle;

  const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;

  const startOverlay = $('startOverlay');
  const startBtn = $<HTMLButtonElement>('startBtn');
  const pauseOverlay = $('pauseOverlay');
  const resumeBtn = $<HTMLButtonElement>('resumeBtn');
  const hud = $('hud');
  const roomLabel = $('roomLabel');
  const chatPanel = $('chatPanel');
  const chatLog = $('chatLog');
  const chatForm = $<HTMLFormElement>('chatForm');
  const chatInput = $<HTMLInputElement>('chatInput');
  const micBtn = $<HTMLButtonElement>('micBtn');
  const imagineBtn = $<HTMLButtonElement>('imagineBtn');
  const imageOverlay = $('imageOverlay');
  const imagineResult = $<HTMLImageElement>('imagineResult');
  const imagineCaption = $('imagineCaption');
  const closeImageBtn = $<HTMLButtonElement>('closeImageBtn');
  const toast = $('toast');

  function showToast(msg: string, ms = 2500) {
    toast.textContent = msg;
    toast.classList.remove('hidden');
    window.clearTimeout((showToast as any)._t);
    (showToast as any)._t = window.setTimeout(() => toast.classList.add('hidden'), ms);
  }

  function addMsg(role: 'user' | 'ai' | 'thinking' | 'error', text: string, id?: string): HTMLElement {
    const div = document.createElement('div');
    div.className = `msg ${role}`;
    if (id) div.id = id;
    div.textContent = text;
    chatLog.appendChild(div);
    chatLog.scrollTop = chatLog.scrollHeight;
    return div;
  }

  function setChatVisible(v: boolean) {
    chatPanel.classList.toggle('hidden', !v);
    if (v) {
      chatInput.focus();
    }
  }

  // === Pointer lock + start/pause overlays ===
  let entered = false;

  function enterScene() {
    startOverlay.classList.add('hidden');
    pauseOverlay.classList.add('hidden');
    hud.classList.remove('hidden');
    canvas.focus();
    canvas.requestPointerLock();
    entered = true;
  }

  function pauseScene() {
    pauseOverlay.classList.remove('hidden');
    chatPanel.classList.add('hidden');
  }

  function resumeScene() {
    pauseOverlay.classList.add('hidden');
    canvas.focus();
    canvas.requestPointerLock();
  }

  startBtn.addEventListener('click', enterScene);
  resumeBtn.addEventListener('click', resumeScene);

  // Clicking on the canvas while in scene re-acquires pointer lock.
  canvas.addEventListener('click', () => {
    if (entered && document.pointerLockElement !== canvas && pauseOverlay.classList.contains('hidden')) {
      canvas.requestPointerLock();
    }
  });

  document.addEventListener('pointerlockchange', () => {
    if (document.pointerLockElement !== canvas && entered && startOverlay.classList.contains('hidden')) {
      // Mouse released — show pause overlay (unless chat is open).
      if (chatPanel.classList.contains('hidden')) {
        pauseScene();
      }
    }
  });

  // === Room label updates ===
  setInterval(() => {
    if (!entered) return;
    const room = currentRoomName();
    roomLabel.textContent = room ?? '';
    roomLabel.style.opacity = room ? '1' : '0';
  }, 300);

  // === Chat ===
  async function sendChat(text: string) {
    if (!text.trim()) return;
    addMsg('user', text);
    chatInput.value = '';
    const thinking = addMsg('thinking', 'thinking…');
    try {
      const r = await chat(text, { roomName: currentRoomName() });
      thinking.remove();
      addMsg('ai', r.text);
      // Auto speak short responses.
      if (r.text.length < 400) speak(r.text);
      if (r.imagine) {
        showToast('Generating visual…');
        await doImagine(r.imagine);
      }
    } catch (e: any) {
      thinking.remove();
      addMsg('error', `error: ${e?.message ?? e}`);
    }
  }

  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    sendChat(chatInput.value);
  });

  // === Voice ===
  const voice = new VoiceController(
    (partial) => { chatInput.value = partial; },
    (final) => {
      chatInput.value = final;
      sendChat(final);
    },
    (err) => { showToast(`mic: ${err}`); micBtn.classList.remove('recording'); },
  );

  let micActive = false;
  function toggleMic() {
    if (!voice.supported) { showToast('Voice input not supported in this browser.'); return; }
    if (micActive) {
      voice.stop();
      micBtn.classList.remove('recording');
      micActive = false;
    } else {
      voice.start();
      micBtn.classList.add('recording');
      micActive = true;
    }
  }
  micBtn.addEventListener('click', (e) => { e.preventDefault(); toggleMic(); });

  // === Imagine button: take screenshot + ask for visual change ===
  async function doImagine(prompt: string) {
    const overlay = imagineResult.parentElement!.parentElement!;
    imagineCaption.textContent = 'Generating…';
    imagineResult.removeAttribute('src');
    overlay.classList.remove('hidden');
    try {
      const shot = await screenshot();
      const r = await imagine(prompt, shot);
      if (r.error) {
        imagineCaption.textContent = `error: ${r.error}`;
        return;
      }
      if (r.imageBase64) {
        imagineResult.src = `data:${r.mimeType ?? 'image/png'};base64,${r.imageBase64}`;
        imagineCaption.textContent = r.caption ?? prompt;
      } else {
        imagineCaption.textContent = r.caption ?? '(no image returned)';
      }
    } catch (e: any) {
      imagineCaption.textContent = `error: ${e?.message ?? e}`;
    }
  }

  imagineBtn.addEventListener('click', async () => {
    let prompt = chatInput.value.trim();
    if (!prompt) {
      prompt = window.prompt('Imagine what?', `Make this room more cozy with warm earth-tones and a velvet sofa.`) ?? '';
    }
    if (!prompt) return;
    addMsg('user', `[imagine] ${prompt}`);
    chatInput.value = '';
    await doImagine(prompt);
  });

  closeImageBtn.addEventListener('click', () => imageOverlay.classList.add('hidden'));

  // === Global keyboard shortcuts ===
  // T = open chat; M = toggle mic (hold-to-talk: keydown→start, keyup→stop);
  // Esc = release pointer lock (browser handles); when overlay is visible,
  // we don't intercept typing keys.
  let mHeld = false;
  window.addEventListener('keydown', (e) => {
    // Don't interfere if typing in the chat input.
    if (document.activeElement === chatInput) return;
    if (!entered) return;

    if (e.code === 'KeyT' && chatPanel.classList.contains('hidden')) {
      e.preventDefault();
      setChatVisible(true);
    } else if (e.code === 'KeyM') {
      if (!mHeld) {
        mHeld = true;
        toggleMic();
      }
    } else if (e.code === 'Escape' && !chatPanel.classList.contains('hidden')) {
      // Close chat — but the browser also exits pointer lock on Esc, which
      // shows the pause overlay. So just hide the chat and let pause show.
      setChatVisible(false);
    }
  });
  window.addEventListener('keyup', (e) => {
    if (e.code === 'KeyM' && mHeld) {
      mHeld = false;
      if (micActive) toggleMic();
    }
  });

  // Reveal the chat panel by default (collapsed-ish) so it's discoverable.
  setChatVisible(true);

  // Welcome
  addMsg('ai', 'Hi — I am your interior design assistant. Walk around with WASD + mouse, then ask me to redesign anything. Try: "Show me this living room with a navy velvet sofa".');
}
