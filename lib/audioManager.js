'use client';

/**
 * SAFE AUDIO MANAGER - WORKING & NON-BLOCKING
 * 
 * SAFETY RULES:
 * 1. Initialization happens synchronously but safely
 * 2. Audio playback uses fire-and-forget pattern
 * 3. All errors caught and silently ignored
 * 4. One-time unlock on first user interaction
 * 5. UI NEVER blocked by audio operations
 */

// ==================== STATE (Module-level Singleton) ====================
let audioContext = null;
let clickBuffer = null;
let robotBuffer = null;
let musicAudio = null;
let musicSource = null;
let musicGainNode = null;
let isUnlocked = false;
let unlockAttempted = false;
let initAttempted = false;
let buffersLoading = false;

// Track nodes for cleanup
let lastClickNode = null;
let lastRobotNode = null;

// ==================== SAFE INITIALIZATION ====================

/**
 * Initialize audio system (called once on first user interaction)
 * CRITICAL: Creates context synchronously, loads buffers asynchronously
 */
function initializeAudioSafe() {
  if (initAttempted) return;
  initAttempted = true;

  try {
    // Create AudioContext synchronously so it's ready
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    
    audioContext = new AudioContextClass();
    console.log('[Audio] Context created, state:', audioContext.state);
    
    // Load buffers asynchronously (non-blocking)
    if (!buffersLoading) {
      buffersLoading = true;
      
      loadBuffer('/sfx/click.wav').then(buffer => {
        if (buffer) {
          clickBuffer = buffer;
          console.log('[Audio] Click sound loaded');
        }
      }).catch(() => {
        console.warn('[Audio] Failed to load click sound');
      });
      
      loadBuffer('/sfx/robot.wav').then(buffer => {
        if (buffer) {
          robotBuffer = buffer;
          console.log('[Audio] Robot sound loaded');
        }
      }).catch(() => {
        console.warn('[Audio] Failed to load robot sound');
      });
    }
    
  } catch (err) {
    console.warn('[Audio] Init failed:', err.message);
  }
}

/**
 * Load audio buffer (async but fire-and-forget)
 */
async function loadBuffer(url) {
  try {
    if (!audioContext) return null;
    
    const response = await fetch(url);
    if (!response.ok) return null;
    
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

  try {
    if (!audioContext) {
      console.warn('[Audio] Cannot unlock: no context');
      return;
    }
    
    if (audioContext.state === 'running') {
      isUnlocked = true;
      console.log('[Audio] Already unlocked');
      startBackgroundMusic();
      return;
    }

    console.log('[Audio] Unlocking...');
    
    // Resume context
    audioContext.resume().then(() => {
      isUnlocked = true;
      console.log('[Audio] ✅ Unlocked successfully');
      
      // Start background music after unlock
      startBackgroundMusic();
    }).catch((err) => {
      console.warn('[Audio] Unlock failed:', err.message);
    });
    
  } catch (err) {
    console.warn('[Audio] Unlock error:', err.message);
  }
}

// ==================== BACKGROUND MUSIC ====================

/**
 * Start background music (fire-and-forget)
 */
function startBackgroundMusic() {
  // Use setTimeout to not block, but small delay
  setTimeout(() => {
    try {
      if (!audioContext || !isUnlocked) {
        console.log('[Audio] Music: not ready (unlocked:', isUnlocked, ')');
        return;
      }
      
      if (musicAudio) {
        console.log('[Audio] Music already playing');
        return;
      }

      console.log('[Audio] Starting background music...');
      
      musicAudio = new Audio('/music/calm_ambient_silence.mp3');
      musicAudio.loop = true;
      musicAudio.volume = 0.15;
      
      // Create media element source
      musicSource = audioContext.createMediaElementSource(musicAudio);
      musicGainNode = audioContext.createGain();
      musicGainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
      
      musicSource.connect(musicGainNode);
      musicGainNode.connect(audioContext.destination);
      
      // Play
      musicAudio.play().then(() => {
        console.log('[Audio] ✅ Music playing');
      }).catch((err) => {
        console.warn('[Audio] Music play failed:', err.message);
      });
      
    } catch (err) {
      console.warn('[Audio] Music error:', err.message);
    }
  }, 100); // Small delay to ensure unlock is complete
}

/**
 * Stop background music
 */
export function stopBackgroundMusic() {
  try {
    if (musicAudio) {
      musicAudio.pause();
      musicAudio.currentTime = 0;
      musicAudio = null;
      console.log('[Audio] Music stopped');
    }
  } catch (err) {
    console.warn('[Audio] Stop music error:', err.message);
  }
}

// ==================== SOUND EFFECTS (FIRE-AND-FORGET) ====================

/**
 * Play a sound buffer (completely non-blocking)
 * Uses minimal setTimeout for safety while maintaining responsiveness
 */
function playSoundSafe(buffer, kind, volume = 0.5) {
  // Quick check before setTimeout
  if (!audioContext || !buffer || !isUnlocked) {
    return;
  }
  
  // Fire-and-forget: queue with minimal delay
  setTimeout(() => {
    try {
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
      // Silent failure
    }
  }, 0);
}

// ==================== PUBLIC API (COMPLETELY SAFE) ====================

/**
 * Play click sound (FIRE-AND-FORGET)
 */
export function playClick() {
  playSoundSafe(clickBuffer, 'click', 0.5);
}

/**
 * Play robot sound (FIRE-AND-FORGET)
 */
export function playRobot() {
  playSoundSafe(robotBuffer, 'robot', 0.6);
}

/**
 * Initialize and unlock audio on first user interaction
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
  console.log('[Audio] Module loaded, setting up listeners...');
  
  // Setup one-time initialization on first user interaction
  const initOnInteraction = () => {
    console.log('[Audio] First interaction detected!');
    initAndUnlockAudio();
  };
  
  // Use passive listeners that can't block
  document.addEventListener('click', initOnInteraction, { once: true, passive: true });
  document.addEventListener('touchstart', initOnInteraction, { once: true, passive: true });
  
  console.log('[Audio] Ready to initialize on first click/touch');
}
