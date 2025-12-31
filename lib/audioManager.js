'use client';

// Lightweight, performance-safe audio manager using ONE Audio element per sound.
// - Fixes mobile autoplay restrictions by "unlocking" playback on first user gesture.
// - Preloads essential sounds after unlock.
// - Prevents stacking by restarting the same element (cooldown handled by callers).

let initialized = false;
let unlocked = false;

let clickAudio = null;
let robotAudio = null;

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

  // iOS/Safari requirement: call play() inside a real user gesture.
  // We play a near-silent sound once, then pause immediately.
  const unlockOne = async (a) => {
    if (!a) return;
    try {
      const prevVol = a.volume;
      a.volume = 0.0001;
      a.currentTime = 0;
      const p = a.play();
      // Some browsers return undefined instead of a Promise.
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

  // Now preload for real.
  try { clickAudio?.load?.(); } catch {}
  try { robotAudio?.load?.(); } catch {}

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
  restartAndPlay(clickAudio);
}

export function playRobot() {
  initAudioManager();
  restartAndPlay(robotAudio);
}

export function isAudioUnlocked() {
  return unlocked;
}
