'use client';

// Shared lightweight WebAudio helpers for consistent SFX across the site.
// Fixes mobile Safari/Chrome quirks by lazily creating the AudioContext
// and resuming it on user interaction.

let ctx = null;
let ctxInitFailed = false;

export function getAudioContext() {
  if (ctxInitFailed) return null;
  if (ctx) return ctx;

  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) {
      ctxInitFailed = true;
      return null;
    }
    ctx = new Ctx();
    return ctx;
  } catch (e) {
    ctxInitFailed = true;
    return null;
  }
}

export async function ensureAudioRunning() {
  const audioContext = getAudioContext();
  if (!audioContext) return null;

  try {
    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }
  } catch {
    // ignore
  }

  return audioContext;
}

// Bootstrap audio on first interaction.
// - Creates/resumes AudioContext
// - Warms up the output path with a near-silent short tone
// This improves reliability on iOS Safari/Chrome.
export async function bootstrapAudio() {
  const audioContext = await ensureAudioRunning();
  if (!audioContext) return null;

  try {
    // Warm-up: tiny gain so it is inaudible but unlocks the audio graph.
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.connect(gain);
    gain.connect(audioContext.destination);

    const t0 = audioContext.currentTime;
    osc.frequency.setValueAtTime(220, t0);
    gain.gain.setValueAtTime(0.0001, t0);
    osc.start(t0);
    osc.stop(t0 + 0.02);
  } catch {
    // ignore
  }

  return audioContext;
}


export async function playOscSweep({
  from = 2000,
  to = 80,
  duration = 0.3,
  volume = 0.15,
  type = 'sawtooth',
  curve = 'exp', // 'exp' | 'linear'
}) {
  const audioContext = await ensureAudioRunning();
  if (!audioContext) return;

  try {
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();

    osc.connect(gain);
    gain.connect(audioContext.destination);

    const t0 = audioContext.currentTime;
    osc.frequency.setValueAtTime(from, t0);

    if (curve === 'exp') {
      osc.frequency.exponentialRampToValueAtTime(Math.max(1, to), t0 + duration);
    } else {
      osc.frequency.linearRampToValueAtTime(to, t0 + duration);
    }

    gain.gain.setValueAtTime(0, t0);
    gain.gain.linearRampToValueAtTime(volume, t0 + Math.min(0.03, duration * 0.2));
    gain.gain.exponentialRampToValueAtTime(0.01, t0 + duration);

    osc.type = type;
    osc.start(t0);
    osc.stop(t0 + duration);
  } catch {
    // ignore
  }
}

export async function playHappyChirp() {
  // Small friendly ascending chirp
  await playOscSweep({ from: 520, to: 980, duration: 0.22, volume: 0.18, type: 'sine', curve: 'linear' });
}

export async function playSwordPullSfx() {
  // Longer rising gritty pull
  await playOscSweep({ from: 200, to: 1200, duration: 1.1, volume: 0.22, type: 'sawtooth', curve: 'exp' });
}

export async function playClickWhoosh() {
  await playOscSweep({ from: 2000, to: 80, duration: 0.28, volume: 0.12, type: 'sawtooth', curve: 'exp' });
}
