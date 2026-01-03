'use client';

/**
 * SAFARI-COMPATIBLE AUDIO MANAGER
 * 
 * This audio system is designed to work across all browsers including Safari (desktop & iOS).
 * 
 * SAFARI AUDIO POLICY:
 * - Safari requires explicit user interaction (click, tap, keydown) before audio can play
 * - AudioContext starts in 'suspended' state and must be resumed after user gesture
 * - Audio elements must have load() called before play() on Safari
 * - autoplay is blocked - all playback must be user-initiated
 * - Audio files must be in supported formats (.mp3, .aac, .wav)
 * 
 * IMPLEMENTATION APPROACH:
 * 1. Detect Safari/iOS Safari accurately
 * 2. Initialize AudioContext lazily on first user interaction
 * 3. Use audio.load() before audio.play() for Safari
 * 4. Handle all play() promise rejections gracefully
 * 5. Ensure volume is set after interaction, not before
 * 6. No autoplay - all audio triggered by user actions only
 */

console.log('[Audio] 🎵 Safari-Compatible Audio Manager Loading...');

// ==================== BROWSER DETECTION ====================

/**
 * Detect if running on Safari (desktop or iOS)
 * Safari requires special handling for audio playback
 */
function detectSafari() {
  if (typeof window === 'undefined') return { isSafari: false, isIOSSafari: false };
  
  const ua = navigator.userAgent;
  const vendor = navigator.vendor || '';
  
  // iOS Safari detection (includes Chrome/Firefox on iOS which use WebKit)
  const isIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
  const isIOSSafari = isIOS;
  
  // Desktop Safari detection
  const isSafari = vendor.includes('Apple') && !ua.includes('CriOS') && !ua.includes('FxiOS');
  
  console.log('[Audio] 🔍 Browser Detection:', { isSafari, isIOSSafari, ua: ua.substring(0, 50) });
  
  return { isSafari: isSafari || isIOSSafari, isIOSSafari };
}

const browserInfo = detectSafari();
const IS_SAFARI = browserInfo.isSafari;
const IS_IOS_SAFARI = browserInfo.isIOSSafari;

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
let musicEnabled = true; // User preference for background music

// Track nodes for cleanup
let lastClickNode = null;
let lastRobotNode = null;

// ==================== INITIALIZATION ====================

/**
 * Initialize audio system - Creates AudioContext
 * SAFARI FIX: Context created but stays suspended until user interaction
 */
function initializeAudio() {
  if (initAttempted) {
    console.log('[Audio] ⚠️ Already initialized');
    return;
  }
  
  initAttempted = true;
  console.log('[Audio] 🚀 Initializing audio system (Safari mode:', IS_SAFARI, ')...');

  try {
    // Create AudioContext (use webkit prefix for older Safari)
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      console.error('[Audio] ❌ AudioContext not supported');
      return;
    }
    
    audioContext = new AudioContextClass();
    console.log('[Audio] ✅ AudioContext created, initial state:', audioContext.state);
    
    // SAFARI FIX: Don't try to resume here - wait for user interaction
    // On Safari, the context will be 'suspended' until user gesture
    
    // Load sound buffers (async, non-blocking)
    loadSoundBuffers();
    
  } catch (err) {
    console.error('[Audio] ❌ Initialization error:', err);
  }
}

/**
 * Load sound effect buffers asynchronously
 */
function loadSoundBuffers() {
  console.log('[Audio] 📦 Loading sound buffers...');
  
  loadBuffer('/sfx/click.wav').then(buffer => {
    if (buffer) {
      clickBuffer = buffer;
      console.log('[Audio] ✅ Click sound loaded:', buffer.duration.toFixed(2), 's');
    }
  }).catch(err => {
    console.warn('[Audio] ⚠️ Click sound failed:', err.message);
  });
  
  loadBuffer('/sfx/robot.wav').then(buffer => {
    if (buffer) {
      robotBuffer = buffer;
      console.log('[Audio] ✅ Robot sound loaded:', buffer.duration.toFixed(2), 's');
    }
  }).catch(err => {
    console.warn('[Audio] ⚠️ Robot sound failed:', err.message);
  });
}

/**
 * Load audio buffer from URL
 * Returns null on failure (never throws)
 */
async function loadBuffer(url) {
  try {
    if (!audioContext) {
      console.warn('[Audio] Cannot load buffer: no AudioContext');
      return null;
    }
    
    const response = await fetch(url);
    if (!response.ok) {
      console.warn('[Audio] Fetch failed for', url, ':', response.status);
      return null;
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    
    return audioBuffer;
  } catch (err) {
    console.warn('[Audio] Load buffer error:', err.message);
    return null;
  }
}

// ==================== AUDIO UNLOCK (User Gesture Required) ====================

/**
 * Unlock audio on first user interaction
 * CRITICAL FOR SAFARI: This must be called directly from a user gesture event handler
 * 
 * Safari Policy:
 * - AudioContext.resume() must be called from user gesture
 * - Audio.play() must be called from user gesture
 * - This function unlocks both the AudioContext AND prepares audio elements
 */
function unlockAudio() {
  if (unlockAttempted) {
    console.log('[Audio] ⚠️ Unlock already attempted');
    return;
  }
  
  unlockAttempted = true;
  console.log('[Audio] 🔓 UNLOCKING AUDIO (Safari-safe)...');

  try {
    if (!audioContext) {
      console.warn('[Audio] Cannot unlock: no AudioContext');
      return;
    }
    
    console.log('[Audio] Current context state:', audioContext.state);
    
    if (audioContext.state === 'running') {
      console.log('[Audio] ✅ Already running!');
      isUnlocked = true;
      onAudioUnlocked();
      return;
    }

    // SAFARI FIX: Resume must be called from user gesture
    // The promise resolves when the context is actually running
    audioContext.resume()
      .then(() => {
        console.log('[Audio] ✅ UNLOCK SUCCESS! State:', audioContext.state);
        isUnlocked = true;
        onAudioUnlocked();
      })
      .catch(err => {
        console.error('[Audio] ❌ Resume failed:', err.message);
        // On some Safari versions, we may need to retry on next interaction
        unlockAttempted = false;
      });
      
  } catch (err) {
    console.error('[Audio] ❌ Unlock error:', err);
  }
}

/**
 * Called after audio is successfully unlocked
 * Starts background music if enabled
 */
function onAudioUnlocked() {
  console.log('[Audio] 🎉 Audio unlocked! Starting background music...');
  
  // Check user preference from localStorage
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('musicEnabled');
    if (saved !== null) {
      musicEnabled = saved === 'true';
    }
  }
  
  if (musicEnabled) {
    // Small delay to ensure unlock is fully complete
    setTimeout(() => {
      startBackgroundMusic();
    }, 100);
  } else {
    console.log('[Audio] Music disabled by user preference');
  }
}

// ==================== BACKGROUND MUSIC ====================

/**
 * Start background music
 * SAFARI FIXES:
 * - Create Audio element fresh (not reused)
 * - Call load() before play()
 * - Set volume AFTER creation
 * - Handle play() promise rejection
 */
function startBackgroundMusic() {
  console.log('[Audio] 🎵 Starting background music...');
  
  try {
    if (!audioContext) {
      console.warn('[Audio] ❌ Music: no AudioContext');
      return;
    }
    
    if (!isUnlocked) {
      console.warn('[Audio] ❌ Music: audio not unlocked yet');
      return;
    }
    
    if (musicAudio && !musicAudio.paused) {
      console.log('[Audio] ⚠️ Music already playing');
      return;
    }

    // Clean up existing audio element if any
    if (musicAudio) {
      try {
        musicAudio.pause();
        musicAudio.src = '';
        musicAudio = null;
      } catch (e) {
        // Ignore cleanup errors
      }
    }

    console.log('[Audio] 🎼 Creating audio element...');
    
    // SAFARI FIX: Create new Audio element
    musicAudio = new Audio();
    musicAudio.preload = 'auto'; // Changed from 'none' for better Safari compatibility
    musicAudio.loop = true;
    
    // SAFARI FIX: Set src after creating element
    musicAudio.src = '/music/calm_ambient_silence.mp3';
    
    // SAFARI FIX: Set volume after src is set
    musicAudio.volume = 0.15;
    musicAudio.muted = false; // Explicitly unmute
    
    // SAFARI FIX: Call load() before play()
    if (IS_SAFARI) {
      console.log('[Audio] 🍎 Safari detected: calling load() before play()');
      musicAudio.load();
    }
    
    // Connect to AudioContext for consistent volume control
    try {
      musicSource = audioContext.createMediaElementSource(musicAudio);
      musicGainNode = audioContext.createGain();
      musicGainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
      
      musicSource.connect(musicGainNode);
      musicGainNode.connect(audioContext.destination);
      console.log('[Audio] 🔗 Connected to AudioContext graph');
    } catch (connectErr) {
      console.warn('[Audio] Could not connect to AudioContext:', connectErr.message);
      // Fallback: play directly without AudioContext routing
    }
    
    // SAFARI FIX: Handle play() promise with proper error logging
    console.log('[Audio] ▶️ Attempting to play music...');
    const playPromise = musicAudio.play();
    
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log('[Audio] ✅ 🎶 MUSIC PLAYING! Volume:', musicAudio.volume);
        })
        .catch(err => {
          // SAFARI: Common rejection reasons
          // - NotAllowedError: User interaction required
          // - AbortError: play() interrupted by load() or pause()
          console.warn('[Audio] ⚠️ Music play rejected:', err.name, '-', err.message);
          
          if (err.name === 'NotAllowedError') {
            console.log('[Audio] 💡 Safari requires another user interaction');
            // Don't reset unlockAttempted - we'll retry on next click
          }
        });
    }
    
  } catch (err) {
    console.error('[Audio] ❌ Background music error:', err);
  }
}

/**
 * Stop background music
 */
export function stopBackgroundMusic() {
  console.log('[Audio] ⏹️ Stopping music...');
  try {
    if (musicAudio) {
      musicAudio.pause();
      musicAudio.currentTime = 0;
      console.log('[Audio] ✅ Music stopped');
    }
  } catch (err) {
    console.warn('[Audio] Stop music error:', err.message);
  }
}

/**
 * Toggle background music on/off
 */
export function toggleBackgroundMusic(enabled) {
  console.log('[Audio] 🎵 toggleBackgroundMusic:', enabled);
  musicEnabled = enabled;
  
  // Save preference
  if (typeof window !== 'undefined') {
    localStorage.setItem('musicEnabled', enabled.toString());
  }
  
  if (enabled) {
    if (isUnlocked) {
      if (!musicAudio || musicAudio.paused) {
        startBackgroundMusic();
      } else {
        // Resume if paused
        musicAudio.play().catch(err => {
          console.warn('[Audio] Resume music failed:', err.message);
        });
      }
    }
  } else {
    if (musicAudio && !musicAudio.paused) {
      musicAudio.pause();
      console.log('[Audio] ⏸️ Music paused');
    }
  }
}

/**
 * Get current music enabled state
 */
export function getMusicEnabled() {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('musicEnabled');
    if (saved !== null) {
      return saved === 'true';
    }
  }
  return musicEnabled;
}

// ==================== SOUND EFFECTS ====================

/**
 * Play a sound buffer (fire-and-forget)
 * SAFARI FIX: Ensure context is running before playing
 */
function playSound(buffer, kind, volume = 0.5) {
  // Use setTimeout(0) to prevent blocking the click handler
  setTimeout(() => {
    try {
      // Check prerequisites
      if (!audioContext) {
        console.warn('[Audio] ⚠️', kind, ': no AudioContext');
        return;
      }
      
      if (!isUnlocked) {
        console.warn('[Audio] ⚠️', kind, ': audio not unlocked');
        return;
      }
      
      if (!buffer) {
        console.warn('[Audio] ⚠️', kind, ': buffer not loaded');
        return;
      }
      
      // SAFARI FIX: Check context state
      if (audioContext.state !== 'running') {
        console.warn('[Audio] ⚠️', kind, ': context state is', audioContext.state);
        // Try to resume (may work if we're in a user gesture)
        audioContext.resume().catch(() => {});
        return;
      }

      // Create and configure source
      const source = audioContext.createBufferSource();
      source.buffer = buffer;

      const gainNode = audioContext.createGain();
      gainNode.gain.setValueAtTime(volume, audioContext.currentTime);

      source.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Stop previous sound of same type (prevent overlap)
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
      console.log('[Audio] 🔊', kind, 'played');
      
    } catch (err) {
      console.warn('[Audio] ⚠️', kind, 'error:', err.message);
    }
  }, 0);
}

// ==================== PUBLIC API ====================

/**
 * Play click sound effect
 * Call this from click/tap handlers
 */
export function playClick() {
  playSound(clickBuffer, 'click', 0.5);
}

/**
 * Play robot sound effect
 * Call this from robot interaction handlers
 */
export function playRobot() {
  playSound(robotBuffer, 'robot', 0.6);
}

/**
 * Initialize and unlock audio
 * MUST be called from a user gesture event handler (click, tap, keydown)
 * This is the main entry point for Safari compatibility
 */
export function initAndUnlockAudio() {
  console.log('[Audio] 🎬 initAndUnlockAudio() called');
  
  // Initialize if not already done
  if (!initAttempted) {
    initializeAudio();
  }
  
  // Unlock audio context
  if (!unlockAttempted) {
    unlockAudio();
  } else if (audioContext && audioContext.state !== 'running') {
    // SAFARI FIX: If previous unlock failed, try again on this user gesture
    console.log('[Audio] 🔄 Retrying resume on user gesture...');
    audioContext.resume()
      .then(() => {
        console.log('[Audio] ✅ Resume succeeded on retry');
        isUnlocked = true;
        if (musicEnabled && (!musicAudio || musicAudio.paused)) {
          startBackgroundMusic();
        }
      })
      .catch(err => {
        console.warn('[Audio] Retry resume failed:', err.message);
      });
  }
}

/**
 * Check if audio is fully ready for playback
 */
export function isAudioReady() {
  return isUnlocked && audioContext && audioContext.state === 'running';
}

/**
 * Get audio system status (for debugging)
 */
export function getAudioStatus() {
  return {
    initialized: initAttempted,
    unlocked: isUnlocked,
    contextState: audioContext?.state || 'no-context',
    clickBufferLoaded: !!clickBuffer,
    robotBufferLoaded: !!robotBuffer,
    musicPlaying: !!musicAudio && !musicAudio.paused,
    musicEnabled: musicEnabled,
    isSafari: IS_SAFARI,
    isIOSSafari: IS_IOS_SAFARI
  };
}

// ==================== AUTO-SETUP (User Gesture Listeners) ====================

/**
 * Set up listeners for first user interaction
 * CRITICAL FOR SAFARI: Audio can only be unlocked from user gesture
 */
if (typeof window !== 'undefined') {
  console.log('[Audio] 🌐 Setting up Safari-compatible auto-initialization...');
  console.log('[Audio] Browser info - Safari:', IS_SAFARI, 'iOS:', IS_IOS_SAFARI);
  
  // Load saved music preference
  const savedMusic = localStorage.getItem('musicEnabled');
  if (savedMusic !== null) {
    musicEnabled = savedMusic === 'true';
    console.log('[Audio] Loaded music preference:', musicEnabled);
  }
  
  /**
   * Handle first user interaction
   * This is where we initialize and unlock audio for Safari
   */
  const handleFirstInteraction = (e) => {
    console.log('[Audio] 👆 FIRST USER INTERACTION:', e.type);
    initAndUnlockAudio();
  };
  
  // Listen for user gestures that Safari accepts for audio unlock:
  // - click: Mouse/trackpad clicks
  // - touchstart: Touch taps (iOS)
  // - touchend: More reliable on some iOS versions
  // - keydown: Keyboard input
  
  const interactionEvents = ['click', 'touchstart', 'touchend', 'keydown'];
  
  interactionEvents.forEach(eventType => {
    document.addEventListener(eventType, handleFirstInteraction, { 
      once: true,  // Remove after first trigger
      passive: true,  // Don't block scrolling
      capture: true  // Capture phase for earliest possible handling
    });
  });
  
  console.log('[Audio] ✅ User gesture listeners registered');
  console.log('[Audio] Waiting for first interaction to unlock audio...');
}

// Export browser detection for other components that may need it
export { IS_SAFARI, IS_IOS_SAFARI };
