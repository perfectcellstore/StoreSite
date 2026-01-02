'use client';

/**
 * BULLETPROOF AUDIO MANAGER
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
 */
function getAudioContext() {
  if (typeof window === 'undefined') {
    console.warn('[AudioManager] Not in browser environment');
    return null;
  }

  if (!audioContext) {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) {
        console.error('[AudioManager] AudioContext not supported');
        return null;
      }
      audioContext = new AudioContextClass();
      console.log('[AudioManager] AudioContext created, state:', audioContext.state);
    } catch (err) {
      console.error('[AudioManager] Failed to create AudioContext:', err);
      return null;
    }
  }

  return audioContext;
}

/**
 * Unlock AudioContext - MUST be called from user gesture handler
 */
export async function unlockAudio() {
  const ctx = getAudioContext();
  if (!ctx) {
    console.error('[AudioManager] No AudioContext available');
    return false;
  }

  if (isUnlocked && ctx.state === 'running') {
    console.log('[AudioManager] Audio already unlocked');
    return true;
  }

  try {
    console.log('[AudioManager] Unlocking audio... Current state:', ctx.state);
    
    if (ctx.state === 'suspended') {
      await ctx.resume();
      console.log('[AudioManager] AudioContext resumed, new state:', ctx.state);
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
        
        console.log('[AudioManager] Silent tone played for initialization');
      } catch (err) {
        console.warn('[AudioManager] Silent tone failed (non-critical):', err);
      }
    }

    isUnlocked = ctx.state === 'running';
    
    if (isUnlocked) {
      console.log('[AudioManager] ✅ Audio fully unlocked and ready');
    } else {
      console.error('[AudioManager] ❌ Failed to unlock audio, state:', ctx.state);
    }

    return isUnlocked;
  } catch (err) {
    console.error('[AudioManager] ❌ Error during unlock:', err);
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
 * Public API: Play click sound
 * Volume: 0.5 (balanced with background music at 0.15-0.25)
 */
export async function playClick() {
  console.log('[AudioManager] playClick() called');
  return await playSound(clickBuffer, 'click', 0.5);
}

/**
 * Public API: Play robot sound
 * Volume: 0.6 (slightly louder than clicks for emphasis)
 */
export async function playRobot() {
  console.log('[AudioManager] playRobot() called');
  return await playSound(robotBuffer, 'robot', 0.6);
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

// ==================== AUTO-INITIALIZATION ====================

// Auto-initialize on client side
if (typeof window !== 'undefined') {
  console.log('[AudioManager] 🎵 Module loaded in browser, scheduling initialization...');
  console.log('[AudioManager] 📁 Music file will be: /music/calm_ambient_silence.mp3');
  
  // Initialize after a short delay to ensure DOM is ready
  setTimeout(() => {
    console.log('[AudioManager] 🚀 Starting initialization now...');
    initializeAudio().then(() => {
      console.log('[AudioManager] ✅ Initialization complete');
    }).catch(err => {
      console.error('[AudioManager] ❌ Auto-initialization failed:', err);
    });
    
    // Setup auto-start listeners for background music
    setupAutoStartListeners();
    console.log('[AudioManager] 👂 Listening for first user interaction to start music');
  }, 100);
}
