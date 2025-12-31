'use client';

/**
 * PRODUCTION-GRADE AUDIO MANAGER
 * 
 * Single global audio system for the entire application.
 * - ONE AudioContext (created once, reused forever)
 * - Buffers decoded ONCE on app start
 * - Zero async work in click handlers
 * - Mobile-safe (auto-unlocks on first user interaction)
 * - Works on ALL performance tiers (High/Mid/Low)
 */

let audioCtx = null;
let clickBuffer = null;
let robotBuffer = null;

let preloadPromise = null;
let unlocked = false;
let initStarted = false;

let lastClickNode = null;
let lastRobotNode = null;

function getCtx() {
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

function decodeWithCtx(ctx, arrayBuffer) {
  // Works across browsers (callback + promise forms)
  return new Promise((resolve, reject) => {
    try {
      const p = ctx.decodeAudioData(arrayBuffer, resolve, reject);
      if (p && typeof p.then === 'function') p.then(resolve).catch(reject);
    } catch (e) {
      reject(e);
    }
  });
}

export function preloadAudioBuffers() {
  if (typeof window === 'undefined') return null;
  if (preloadPromise) return preloadPromise;

  const ctx = getCtx();
  if (!ctx) {
    console.warn('[AudioManager] No AudioContext available');
    return null;
  }

  preloadPromise = (async () => {
    try {
      const [clickAb, robotAb] = await Promise.all([
        fetch('/sfx/click.wav', { cache: 'force-cache' }).then((r) => r.arrayBuffer()),
        fetch('/sfx/robot.wav', { cache: 'force-cache' }).then((r) => r.arrayBuffer()),
      ]);

      const [cb, rb] = await Promise.all([
        decodeWithCtx(ctx, clickAb),
        decodeWithCtx(ctx, robotAb),
      ]);

      clickBuffer = cb;
      robotBuffer = rb;
      console.log('[AudioManager] ✅ Audio buffers loaded successfully');
    } catch (err) {
      console.error('[AudioManager] ❌ Failed to load audio buffers:', err);
      clickBuffer = null;
      robotBuffer = null;
    }
  })();

  return preloadPromise;
}

// Resume/unlock audio (must be invoked from a user gesture on mobile).
// IMPORTANT: This should be called once; it never recreates the context.
export async function unlockAudio() {
  const ctx = getCtx();
  if (!ctx) {
    console.warn('[AudioManager] No AudioContext available for unlock');
    return false;
  }

  try {
    if (ctx.state === 'suspended') {
      await ctx.resume();
      console.log('[AudioManager] ✅ Audio unlocked, state:', ctx.state);
    }

    // Warm-up an inaudible tone so output path is ready
    try {
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

    unlocked = true;
  } catch (err) {
    console.error('[AudioManager] ❌ Failed to unlock audio:', err);
  }

  // Ensure buffers are decoded ASAP after the first gesture.
  // (Not in click handlers.)
  preloadAudioBuffers();

  return unlocked;
}

export function isAudioUnlocked() {
  return unlocked;
}

function playBuffer(buffer, { volume = 0.35, kind = 'click' } = {}) {
  const ctx = getCtx();
  if (!ctx) {
    console.warn('[AudioManager] No AudioContext for playback');
    return;
  }
  
  if (!buffer) {
    console.warn(`[AudioManager] No buffer loaded for ${kind} sound`);
    return;
  }

  // Do not start audio if context isn't running yet (prevents delayed playback).
  if (ctx.state !== 'running') {
    console.warn(`[AudioManager] AudioContext not running (state: ${ctx.state}), skipping ${kind} sound`);
    return;
  }

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

    src.start();
  } catch (err) {
    console.error(`[AudioManager] Failed to play ${kind} sound:`, err);
  }
}

// Synchronous, near-zero latency playback.
// No fetch/decode/resume happens here.
export function playClick() {
  playBuffer(clickBuffer, { volume: 0.35, kind: 'click' });
}

export function playRobot() {
  playBuffer(robotBuffer, { volume: 0.4, kind: 'robot' });
}

// Begin preloading as soon as possible (still requires unlock for playback).
// This runs outside click handlers.
if (typeof window !== 'undefined') {
  // best-effort; may decode even while suspended
  preloadAudioBuffers();
}
