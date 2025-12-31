'use client';

// Lightweight, performance-safe audio manager using ONE Audio element per sound.
// - Fixes mobile autoplay restrictions by "unlocking" playback on first user gesture.
// - Preloads essential sounds after unlock.
// - Prevents stacking by restarting the same element (cooldown handled by callers).

let initialized = false;
let unlocked = false;

// HTMLAudio fallback (shared single instance per sound)
let clickAudio = null;
let robotAudio = null;

// Low-latency WebAudio path (preferred)
let audioCtx = null;
let clickBuffer = null;
let robotBuffer = null;
let decodingPromise = null;
let lastClickNode = null;
let lastRobotNode = null;

function safeCreateAudio(src) {
  try {
    const a = new Audio(src);
    a.preload = 'auto';
    a.crossOrigin = 'anonymous';
    return a;
  } catch {
    return null;
  }
}

function getWebAudioContext() {
  if (audioCtx) return audioCtx;
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    audioCtx = new Ctx();
    return audioCtx;
  } catch {
    return null;
  }
}

async function decodeBuffersIfNeeded() {
  if (clickBuffer && robotBuffer) return;
  if (decodingPromise) return decodingPromise;

  const ctx = getWebAudioContext();
  if (!ctx) return;

  decodingPromise = (async () => {
    try {
      const [c, r] = await Promise.all([
        fetch('/sfx/click.wav').then((res) => res.arrayBuffer()),
        fetch('/sfx/robot.wav').then((res) => res.arrayBuffer()),
      ]);

      // decodeAudioData signature differs across browsers; normalize with Promise.
      const decode = (ab) =>
        new Promise((resolve, reject) => {
          try {
            const p = ctx.decodeAudioData(ab, resolve, reject);
            if (p && typeof p.then === 'function') p.then(resolve).catch(reject);
          } catch (e) {
            reject(e);
          }
        });

      const [cb, rb] = await Promise.all([decode(c), decode(r)]);
      clickBuffer = cb;
      robotBuffer = rb;
    } catch {
      // If decoding fails, fallback stays available.
    } finally {
      decodingPromise = null;
    }
  })();

  return decodingPromise;
}

function playBuffer(buffer, { volume = 0.35, kind = 'click' } = {}) {
  const ctx = getWebAudioContext();
  if (!ctx || !buffer) return false;

  try {
    const src = ctx.createBufferSource();
    src.buffer = buffer;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(volume, ctx.currentTime);

    src.connect(gain);
    gain.connect(ctx.destination);

    // Prevent stacking: stop previous node for same sound
    if (kind === 'click' && lastClickNode) {
      try { lastClickNode.stop(); } catch (e) { /* ignore */ }
    }
    if (kind === 'robot' && lastRobotNode) {
      try { lastRobotNode.stop(); } catch (e) { /* ignore */ }
    }

    if (kind === 'click') lastClickNode = src;
    if (kind === 'robot') lastRobotNode = src;

    src.start(0);
    return true;
  } catch {
    return false;
  }
}

export function initAudioManager() {
  if (initialized) return;
  initialized = true;

  // Local static assets (served by Next.js public/)
  clickAudio = safeCreateAudio('/sfx/click.wav');
  robotAudio = safeCreateAudio('/sfx/robot.wav');

  // Low volume default (can be adjusted later)
  if (clickAudio) clickAudio.volume = 0.35;
  if (robotAudio) robotAudio.volume = 0.4;
}

export async function unlockAudio() {
  initAudioManager();
  if (unlocked) return true;

  // Preferred: unlock WebAudio context for lowest latency
  const ctx = getWebAudioContext();
  if (ctx) {
    try {
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      // Warm up the audio graph with an inaudible short tone
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      const t0 = ctx.currentTime;
      osc.frequency.setValueAtTime(220, t0);
      gain.gain.setValueAtTime(0.0001, t0);
      osc.start(t0);
      osc.stop(t0 + 0.02);
    } catch {
      // ignore
    }

    // Start decoding in background (still initiated after gesture)
    decodeBuffersIfNeeded();
  }

  // Fallback: unlock HTMLAudio elements
  const unlockOne = async (a) => {
    if (!a) return;
    try {
      const prevVol = a.volume;
      a.volume = 0.0001;
      a.currentTime = 0;
      const p = a.play();
      if (p && typeof p.then === 'function') await p;
      a.pause();
      a.currentTime = 0;
      a.volume = prevVol;
    } catch {
      // ignore
    }
  };

  await unlockOne(clickAudio);
  await unlockOne(robotAudio);

  try { clickAudio?.load?.(); } catch (e) { /* ignore */ }
  try { robotAudio?.load?.(); } catch (e) { /* ignore */ }

  unlocked = true;
  return true;
}

function restartAndPlay(a) {
  if (!a) return;
  try {
    a.currentTime = 0;
    const p = a.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
  } catch {
    // ignore
  }
}

export function playClick() {
  initAudioManager();

  // Prefer WebAudio buffer (lower latency)
  if (clickBuffer && playBuffer(clickBuffer, { volume: 0.35, kind: 'click' })) return;

  restartAndPlay(clickAudio);
}

export function playRobot() {
  initAudioManager();

  if (robotBuffer && playBuffer(robotBuffer, { volume: 0.4, kind: 'robot' })) return;

  restartAndPlay(robotAudio);
}

export function isAudioUnlocked() {
  return unlocked;
}
