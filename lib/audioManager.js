'use client';

/**
 * SAFE AUDIO MANAGER - FIRE-AND-FORGET ARCHITECTURE
 * 
 * CRITICAL SAFETY RULES:
 * 1. All audio operations use setTimeout for complete isolation
 * 2. No blocking operations in main thread
 * 3. All errors caught and silently ignored
 * 4. One-time unlock on first user interaction
 * 5. UI NEVER waits for audio
 * 
 * If audio fails → UI continues normally
 */

// ==================== STATE (Module-level Singleton) ====================
let audioContext = null;
let clickBuffer = null;
let robotBuffer = null;
let musicSource = null;
let musicGainNode = null;
let isUnlocked = false;
let unlockAttempted = false;
let initAttempted = false;

// Track nodes for cleanup
let lastClickNode = null;
let lastRobotNode = null;

// ==================== SAFE INITIALIZATION ====================

/**
 * Initialize audio system (called once on first user interaction)
 * CRITICAL: This runs in a setTimeout, never blocks UI
 */
function initializeAudioSafe() {
  if (initAttempted) return;
  initAttempted = true;

  setTimeout(() => {
    try {
      // Create AudioContext
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      
      audioContext = new AudioContextClass();
      
      // Load buffers asynchronously (non-blocking)
      loadBuffer('/sounds/click.mp3').then(buffer => {
        clickBuffer = buffer;
      }).catch(() => { /* silent fail */ });
      
      loadBuffer('/sounds/robot.mp3').then(buffer => {
        robotBuffer = buffer;
      }).catch(() => { /* silent fail */ });
      
    } catch (err) {
      // Silent fail - never throw
    }
  }, 0);
}

/**
 * Load audio buffer (async but fire-and-forget)
 */
async function loadBuffer(url) {
  try {
    if (!audioContext) return null;
    
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    
    return audioBuffer;
  } catch (err) {
    return null;
  }
}

/**
 * Unlock audio on first user interaction
 * Called ONCE, never retried
 */
function unlockAudioOnce() {
  if (unlockAttempted) return;
  unlockAttempted = true;

  setTimeout(() => {
    try {
      if (!audioContext) return;
      if (audioContext.state === 'running') {
        isUnlocked = true;
        return;
      }

      // Resume context
      audioContext.resume().then(() => {
        isUnlocked = true;
        
        // Start background music after unlock
        startBackgroundMusic();
      }).catch(() => {
        // Silent fail
      });
      
    } catch (err) {
      // Silent fail
    }
  }, 0);
}

// ==================== BACKGROUND MUSIC ====================

/**
 * Start background music (fire-and-forget)
 */
function startBackgroundMusic() {
  setTimeout(() => {
    try {
      if (!audioContext || !isUnlocked) return;
      if (musicSource) return; // Already playing

      const audio = new Audio('/music/calm_ambient_silence.mp3');
      audio.loop = true;
      audio.volume = 0.15;
      
      // Create media element source
      musicSource = audioContext.createMediaElementSource(audio);
      musicGainNode = audioContext.createGain();
      musicGainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
      
      musicSource.connect(musicGainNode);
      musicGainNode.connect(audioContext.destination);
      
      // Play (fire-and-forget)
      audio.play().catch(() => { /* silent fail */ });
      
    } catch (err) {
      // Silent fail
    }
  }, 0);
}

/**
 * Stop background music
 */
export function stopBackgroundMusic() {
  setTimeout(() => {
    try {
      if (musicSource && musicSource.mediaElement) {
        musicSource.mediaElement.pause();
        musicSource.mediaElement.currentTime = 0;
      }
    } catch (err) {
      // Silent fail
    }
  }, 0);
}

// ==================== SOUND EFFECTS (FIRE-AND-FORGET) ====================

/**
 * Play a sound buffer (completely non-blocking)
 * CRITICAL: Uses setTimeout for complete isolation from caller
 */
function playSoundSafe(buffer, kind, volume = 0.5) {
  // Fire-and-forget: queue in next tick, return immediately
  setTimeout(() => {
    try {
      if (!audioContext || !buffer || !isUnlocked) return;
      if (audioContext.state !== 'running') return;

      // Create and play sound
      const source = audioContext.createBufferSource();
      source.buffer = buffer;

      const gainNode = audioContext.createGain();
      gainNode.gain.setValueAtTime(volume, audioContext.currentTime);

      source.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Stop previous sound of same type
      if (kind === 'click' && lastClickNode) {
        try { lastClickNode.stop(); } catch (e) { /* already stopped */ }
      }
      if (kind === 'robot' && lastRobotNode) {
        try { lastRobotNode.stop(); } catch (e) { /* already stopped */ }
      }

      // Track and play
      if (kind === 'click') lastClickNode = source;
      if (kind === 'robot') lastRobotNode = source;
      
      source.start(0);
      
    } catch (err) {
      // CRITICAL: Never throw, never log
      // Silent failure ensures UI safety
    }
  }, 0);
}

// ==================== PUBLIC API (COMPLETELY SAFE) ====================

/**
 * Play click sound (FIRE-AND-FORGET)
 * CRITICAL: Returns immediately, audio queued in next tick
 */
export function playClick() {
  playSoundSafe(clickBuffer, 'click', 0.5);
}

/**
 * Play robot sound (FIRE-AND-FORGET)
 * CRITICAL: Returns immediately, audio queued in next tick
 */
export function playRobot() {
  playSoundSafe(robotBuffer, 'robot', 0.6);
}

/**
 * Initialize and unlock audio on first user interaction
 * CRITICAL: Called from click handler but returns immediately
 */
export function initAndUnlockAudio() {
  if (!initAttempted) {
    initializeAudioSafe();
  }
  if (!unlockAttempted) {
    unlockAudioOnce();
  }
}

/**
 * Check if audio is ready
 */
export function isAudioReady() {
  return isUnlocked && !!clickBuffer && !!robotBuffer;
}

// ==================== CLIENT-SIDE AUTO-SETUP ====================

if (typeof window !== 'undefined') {
  // Setup one-time initialization on first user interaction
  const initOnInteraction = () => {
    initAndUnlockAudio();
    // Remove listeners after first interaction
    document.removeEventListener('click', initOnInteraction);
    document.removeEventListener('touchstart', initOnInteraction);
  };
  
  // Use passive listeners that can't block
  document.addEventListener('click', initOnInteraction, { once: true, passive: true });
  document.addEventListener('touchstart', initOnInteraction, { once: true, passive: true });
}
