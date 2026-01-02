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

 * Guaranteed to work in Next.js App Router with proper user gesture handling
 * 
 * Key principles:
 * 1. Client-only execution
 * 2. Singleton pattern (survives auth changes)
 * 3. Explicit unlock on user gesture
 * 4. Comprehensive logging
 * 5. No silent failures
 */

// ==================== STATE (SINGLETON) ====================
let audioContext = null;
let isInitialized = false;
let isUnlocked = false;

// Audio buffers
let clickBuffer = null;
let robotBuffer = null;
let musicBuffer = null;

// Playback nodes
let lastClickNode = null;
let lastRobotNode = null;
let musicNode = null;
let musicGainNode = null;

// Music state
let isMusicPlaying = false;
let isMusicLoaded = false;

// ==================== INITIALIZATION ====================

/**
 * Get or create AudioContext (singleton)
 * 
 * CRITICAL: This function never throws errors.
 * Returns null silently if AudioContext creation fails.
 */
function getAudioContext() {
  if (typeof window === 'undefined') {
    return null;
  }

  if (!audioContext) {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) {
        return null;
      }
      audioContext = new AudioContextClass();
    } catch (err) {
      // Silently fail - never throw or log
      return null;
    }
  }

  return audioContext;
}

/**
 * Unlock AudioContext - MUST be called from user gesture handler
 * 
 * CRITICAL: This function now catches all errors to prevent UI freezes.
 * Never blocks the event loop, returns immediately if already unlocked.
 */
export async function unlockAudio() {
  try {
    const ctx = getAudioContext();
    if (!ctx) {
      return false;
    }

    if (isUnlocked && ctx.state === 'running') {
      return true;
    }

    // Resume if suspended
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    // Play silent tone to fully activate audio pipeline
    if (ctx.state === 'running') {
      try {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        gainNode.gain.setValueAtTime(0.001, ctx.currentTime);
        oscillator.frequency.setValueAtTime(440, ctx.currentTime);
        
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.01);
      } catch (err) {
        // Silently ignore silent tone failure
      }
    }

    isUnlocked = ctx.state === 'running';
    return isUnlocked;
  } catch (err) {
    // CRITICAL: Never throw, never block the UI
    // Audio unlock failures must be completely silent
    return false;
  }
}

/**
 * Load audio file into buffer
 */
async function loadAudioBuffer(url, name) {
  const ctx = getAudioContext();
  if (!ctx) {
    console.error(`[AudioManager] Cannot load ${name}: No AudioContext`);
    return null;
  }

  try {
    console.log(`[AudioManager] Loading ${name} from ${url}...`);
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
    
    console.log(`[AudioManager] ✅ ${name} loaded (${audioBuffer.duration.toFixed(2)}s, ${audioBuffer.numberOfChannels}ch)`);
    return audioBuffer;
  } catch (err) {
    console.error(`[AudioManager] ❌ Failed to load ${name}:`, err);
    return null;
  }
}

/**
 * Initialize audio system - load sound files
 */
export async function initializeAudio() {
  if (isInitialized) {
    console.log('[AudioManager] Already initialized');
    return;
  }

  if (typeof window === 'undefined') {
    console.warn('[AudioManager] Cannot initialize in SSR');
    return;
  }

  const ctx = getAudioContext();
  if (!ctx) {
    console.error('[AudioManager] Cannot initialize: No AudioContext');
    return;
  }

  console.log('[AudioManager] Initializing audio system...');

  try {
    // Load sound effects in parallel
    const [click, robot] = await Promise.all([
      loadAudioBuffer('/sfx/click.wav', 'click sound'),
      loadAudioBuffer('/sfx/robot.wav', 'robot sound')
    ]);

    clickBuffer = click;
    robotBuffer = robot;

    const loadedCount = [click, robot].filter(Boolean).length;
    console.log(`[AudioManager] ✅ Initialized with ${loadedCount}/2 sounds loaded`);
    
    isInitialized = true;
  } catch (err) {
    console.error('[AudioManager] ❌ Initialization failed:', err);
  }
}

// ==================== PLAYBACK ====================

/**
 * Play a sound buffer (SYNCHRONOUS & NON-BLOCKING)
 * @param {AudioBuffer} buffer - The audio buffer to play
 * @param {string} kind - Type of sound ('click', 'robot', etc.)
 * @param {number} volume - Volume level (0-1)
 * 
 * CRITICAL: This function is fire-and-forget. It NEVER blocks the UI.
 * Audio failures are silently ignored to prevent UI freezes.
 */
function playSound(buffer, kind, volume = 0.35) {
  try {
    const ctx = getAudioContext();
    
    // Fail silently if no context or buffer - never block the UI
    if (!ctx || !buffer) {
      return false;
    }

    // If audio not unlocked yet, attempt unlock asynchronously (non-blocking)
    if (ctx.state !== 'running') {
      // Fire-and-forget unlock attempt - don't wait for it
      unlockAudio().catch(() => {/* silently ignore unlock failures */});
      return false;
    }

    // Create source and gain nodes
    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);

    // Connect the nodes
    source.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Stop previous sound of same type (prevent overlapping)
    if (kind === 'click' && lastClickNode) {
      try { lastClickNode.stop(); } catch (e) { /* already stopped */ }
    }
    if (kind === 'robot' && lastRobotNode) {
      try { lastRobotNode.stop(); } catch (e) { /* already stopped */ }
    }

    // Track current source
    if (kind === 'click') lastClickNode = source;
    if (kind === 'robot') lastRobotNode = source;

    // Play the sound
    source.start(0);
    
    return true;
  } catch (err) {
    // CRITICAL: Never throw or log errors that could block UI
    // Audio failures must be completely silent to prevent freezes
    return false;
  }
}

/**
 * Public API: Play click sound (EMERGENCY DISABLED)
 * 
 * CRITICAL: Audio completely disabled to restore UI functionality.
 * This function now does NOTHING to ensure site remains interactive.
 */
export function playClick() {
  // EMERGENCY: Completely disabled - do nothing
  return;
}

/**
 * Public API: Play robot sound (EMERGENCY DISABLED)
 * 
 * CRITICAL: Audio completely disabled to restore UI functionality.
 * This function now does NOTHING to ensure site remains interactive.
 */
export function playRobot() {
  // EMERGENCY: Completely disabled - do nothing
  return;
}

// ==================== BACKGROUND MUSIC ====================

/**
 * Load background music
 * IMPORTANT: Using "Silence" by AShamaluevMusic - calm ambient meditation music
 */
async function loadBackgroundMusic() {
  // Calm ambient music file path
  const MUSIC_FILE_PATH = '/music/calm_ambient_silence.mp3';
  
  console.log('[AudioManager] 🎵 Loading calm ambient music:', MUSIC_FILE_PATH);
  console.log('[AudioManager] 🎼 Track: "Silence" by AShamaluevMusic (5:06 min)');
  
  if (isMusicLoaded && musicBuffer) {
    console.log('[AudioManager] Background music already loaded from:', MUSIC_FILE_PATH);
    return true;
  }

  const buffer = await loadAudioBuffer(MUSIC_FILE_PATH, 'background music');
  if (buffer) {
    musicBuffer = buffer;
    isMusicLoaded = true;
    console.log('[AudioManager] ✅ Successfully loaded calm ambient music:', MUSIC_FILE_PATH);
    return true;
  }
  
  console.error('[AudioManager] ❌ Failed to load music from:', MUSIC_FILE_PATH);
  return false;
}

/**
 * Start background music (looping)
 */
export async function startBackgroundMusic() {
  console.log('[AudioManager] 🎵 startBackgroundMusic() called');
  
  const ctx = getAudioContext();
  if (!ctx) {
    console.error('[AudioManager] ❌ Cannot start music: No AudioContext');
    return false;
  }

  console.log('[AudioManager] AudioContext state:', ctx.state);

  // Unlock if needed
  if (ctx.state !== 'running') {
    console.log('[AudioManager] AudioContext not running, unlocking...');
    const unlocked = await unlockAudio();
    if (!unlocked) {
      console.error('[AudioManager] ❌ Failed to unlock for music');
      return false;
    }
    console.log('[AudioManager] ✅ AudioContext unlocked successfully');
  }

  // Load music if needed
  if (!isMusicLoaded) {
    console.log('[AudioManager] Music not loaded yet, loading now...');
    const loaded = await loadBackgroundMusic();
    if (!loaded) {
      console.error('[AudioManager] ❌ Failed to load background music');
      return false;
    }
    console.log('[AudioManager] ✅ Background music loaded');
  }

  if (!musicBuffer) {
    console.error('[AudioManager] ❌ No music buffer available');
    return false;
  }

  // Stop existing music
  if (musicNode) {
    console.log('[AudioManager] Stopping previous music node');
    try {
      musicNode.stop();
    } catch (e) { /* already stopped */ }
  }

  try {
    console.log('[AudioManager] Creating new music nodes...');
    musicNode = ctx.createBufferSource();
    musicNode.buffer = musicBuffer;
    musicNode.loop = true;

    musicGainNode = ctx.createGain();
    // Background music volume: 0.20 (balanced with click effects at 0.5 and robot sounds at 0.6)
    musicGainNode.gain.setValueAtTime(0.20, ctx.currentTime);

    musicNode.connect(musicGainNode);
    musicGainNode.connect(ctx.destination);

    console.log('[AudioManager] Starting music playback...');
    musicNode.start(0);
    isMusicPlaying = true;

    console.log('[AudioManager] ✅ Background music started successfully! 🎶');
    console.log('[AudioManager] 🔊 Volume: 20%, Loop: enabled, Duration:', musicBuffer.duration.toFixed(2), 'seconds');
    return true;
  } catch (err) {
    console.error('[AudioManager] ❌ Failed to start background music:', err);
    return false;
  }
}

/**
 * Stop background music
 */
export function stopBackgroundMusic() {
  console.log('[AudioManager] stopBackgroundMusic() called');
  
  if (musicNode) {
    try {
      musicNode.stop();
      console.log('[AudioManager] ✅ Background music stopped');
    } catch (e) { /* already stopped */ }
    musicNode = null;
  }
  
  isMusicPlaying = false;
}

/**
 * Toggle background music
 */
export async function toggleBackgroundMusic(enabled) {
  console.log('[AudioManager] toggleBackgroundMusic:', enabled);
  
  if (enabled && !isMusicPlaying) {
    await startBackgroundMusic();
  } else if (!enabled && isMusicPlaying) {
    stopBackgroundMusic();
  }

  // Save preference
  if (typeof window !== 'undefined') {
    localStorage.setItem('musicEnabled', enabled ? 'true' : 'false');
  }
}

/**
 * Get music enabled preference
 * Default is TRUE (music on by default)
 */
export function getMusicEnabled() {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('musicEnabled');
    // If never set, default to true (music ON by default)
    if (stored === null) {
      return true;
    }
    return stored === 'true';
  }
  return true;
}

/**
 * Check if music is currently playing
 */
export function isMusicCurrentlyPlaying() {
  return isMusicPlaying;
}

// ==================== AUTO-START MUSIC ON FIRST INTERACTION ====================

let hasAttemptedAutoStart = false;

/**
 * Attempt to start music on first user interaction
 * This respects browser autoplay policies by waiting for user gesture
 */
async function attemptAutoStartMusic() {
  if (hasAttemptedAutoStart) return;
  hasAttemptedAutoStart = true;
  
  console.log('[AudioManager] Attempting auto-start music on user interaction...');
  
  // Check if music should be enabled (default is true)
  const shouldPlay = getMusicEnabled();
  
  if (shouldPlay && !isMusicPlaying) {
    console.log('[AudioManager] Music enabled, starting background music...');
    await startBackgroundMusic();
  } else if (!shouldPlay) {
    console.log('[AudioManager] Music disabled by user preference, not auto-starting');
  } else {
    console.log('[AudioManager] Music already playing');
  }
}

/**
 * Setup auto-start listeners for first user interaction
 */
function setupAutoStartListeners() {
  const events = ['click', 'touchstart', 'keydown'];
  
  const handler = () => {
    attemptAutoStartMusic();
    // Remove listeners after first interaction
    events.forEach(event => {
      document.removeEventListener(event, handler);
    });
  };
  
  events.forEach(event => {
    document.addEventListener(event, handler, { once: true, passive: true });
  });
  
  console.log('[AudioManager] Auto-start listeners registered');
}

// ==================== AUTO-INITIALIZATION (EMERGENCY DISABLED) ====================

// EMERGENCY: All auto-initialization disabled to restore UI functionality
// Audio system completely disabled until freeze issue is resolved

if (typeof window !== 'undefined') {
  console.log('[AudioManager] ⚠️ EMERGENCY MODE: All audio disabled to restore UI');
  
  // DO NOT initialize audio
  // DO NOT setup auto-start listeners
  // Audio completely disabled until issue resolved
}

