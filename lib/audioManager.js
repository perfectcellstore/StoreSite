'use client';

/**
 * SAFE AUDIO MANAGER - WITH EXPLICIT UNLOCK
 * 
 * CRITICAL: Audio will be SILENT until first user interaction
 * Then everything unlocks and plays normally
 */

console.log('[Audio] 🎵 Module loading...');

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

// Track nodes for cleanup
let lastClickNode = null;
let lastRobotNode = null;

// ==================== INITIALIZATION ====================

/**
 * Initialize audio system - Creates AudioContext
 */
function initializeAudio() {
  if (initAttempted) {
    console.log('[Audio] ⚠️ Already initialized');
    return;
  }
  
  initAttempted = true;
  console.log('[Audio] 🚀 Initializing audio system...');

  try {
    // Create AudioContext
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      console.error('[Audio] ❌ AudioContext not supported in this browser');
      return;
    }
    
    audioContext = new AudioContextClass();
    console.log('[Audio] ✅ AudioContext created, state:', audioContext.state);
    
    // Load sound buffers
    console.log('[Audio] 📦 Loading sound buffers...');
    
    loadBuffer('/sfx/click.wav').then(buffer => {
      if (buffer) {
        clickBuffer = buffer;
        console.log('[Audio] ✅ Click sound loaded:', buffer.duration.toFixed(2), 'seconds');
      } else {
        console.error('[Audio] ❌ Click sound failed to load');
      }
    }).catch(err => {
      console.error('[Audio] ❌ Click sound error:', err);
    });
    
    loadBuffer('/sfx/robot.wav').then(buffer => {
      if (buffer) {
        robotBuffer = buffer;
        console.log('[Audio] ✅ Robot sound loaded:', buffer.duration.toFixed(2), 'seconds');
      } else {
        console.error('[Audio] ❌ Robot sound failed to load');
      }
    }).catch(err => {
      console.error('[Audio] ❌ Robot sound error:', err);
    });
    
  } catch (err) {
    console.error('[Audio] ❌ Initialization error:', err);
  }
}

/**
 * Load audio buffer
 */
async function loadBuffer(url) {
  try {
    if (!audioContext) {
      console.error('[Audio] Cannot load buffer: no AudioContext');
      return null;
    }
    
    console.log('[Audio] 📥 Fetching:', url);
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error('[Audio] ❌ Fetch failed:', response.status, response.statusText);
      return null;
    }
    
    const arrayBuffer = await response.arrayBuffer();
    console.log('[Audio] 🔄 Decoding audio data...');
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    
    return audioBuffer;
  } catch (err) {
    console.error('[Audio] ❌ Load buffer error:', err);
    return null;
  }
}

/**
 * EXPLICIT UNLOCK - Called on first user interaction
 */
function unlockAudio() {
  if (unlockAttempted) {
    console.log('[Audio] ⚠️ Unlock already attempted');
    return;
  }
  
  unlockAttempted = true;
  console.log('[Audio] 🔓 UNLOCKING AUDIO...');

  try {
    if (!audioContext) {
      console.error('[Audio] ❌ Cannot unlock: no AudioContext');
      return;
    }
    
    console.log('[Audio] Current state:', audioContext.state);
    
    if (audioContext.state === 'running') {
      console.log('[Audio] ✅ Already running!');
      isUnlocked = true;
      startBackgroundMusic();
      return;
    }

    // Resume AudioContext
    console.log('[Audio] 🔄 Resuming AudioContext...');
    audioContext.resume().then(() => {
      console.log('[Audio] ✅ UNLOCK SUCCESS! State:', audioContext.state);
      isUnlocked = true;
      
      // Start background music
      startBackgroundMusic();
      
    }).catch(err => {
      console.error('[Audio] ❌ Resume failed:', err);
    });
    
  } catch (err) {
    console.error('[Audio] ❌ Unlock error:', err);
  }
}

// ==================== BACKGROUND MUSIC ====================

/**
 * Start background music
 */
function startBackgroundMusic() {
  console.log('[Audio] 🎵 Starting background music...');
  
  // Check if user wants music
  if (!musicEnabledByUser) {
    console.log('[Audio] ⏭️ Music disabled by user preference');
    return;
  }
  
  // Small delay to ensure unlock is complete
  setTimeout(() => {
    try {
      if (!audioContext) {
        console.error('[Audio] ❌ Music: no AudioContext');
        return;
      }
      
      if (!isUnlocked) {
        console.error('[Audio] ❌ Music: audio not unlocked yet');
        return;
      }
      
      // Re-check music preference (could have changed during delay)
      if (!musicEnabledByUser) {
        console.log('[Audio] ⏭️ Music disabled by user preference (during delay)');
        return;
      }
      
      if (musicAudio) {
        console.log('[Audio] ⚠️ Music already playing');
        return;
      }

      console.log('[Audio] 🎼 Creating audio element...');
      musicAudio = new Audio('/music/calm_ambient_silence.mp3');
      musicAudio.loop = true;
      musicAudio.volume = 0.15;
      
      console.log('[Audio] 🔗 Creating media source...');
      musicSource = audioContext.createMediaElementSource(musicAudio);
      musicGainNode = audioContext.createGain();
      musicGainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
      
      musicSource.connect(musicGainNode);
      musicGainNode.connect(audioContext.destination);
      
      console.log('[Audio] ▶️ Playing music...');
      musicAudio.play().then(() => {
        console.log('[Audio] ✅ 🎶 MUSIC PLAYING! Volume:', musicAudio.volume, 'Loop:', musicAudio.loop);
      }).catch(err => {
        console.error('[Audio] ❌ Music play failed:', err);
      });
      
    } catch (err) {
      console.error('[Audio] ❌ Background music error:', err);
    }
  }, 200); // 200ms delay to ensure unlock completes
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
    console.error('[Audio] ❌ Stop music error:', err);
  }
}

// ==================== SOUND EFFECTS ====================

/**
 * Play a sound buffer (fire-and-forget)
 */
function playSound(buffer, kind, volume = 0.5) {
  // Fire-and-forget pattern
  setTimeout(() => {
    try {
      // Check prerequisites
      if (!audioContext) {
        console.warn('[Audio] ⚠️', kind, 'sound: no AudioContext');
        return;
      }
      
      if (!isUnlocked) {
        console.warn('[Audio] ⚠️', kind, 'sound: audio not unlocked yet');
        return;
      }
      
      if (!buffer) {
        console.warn('[Audio] ⚠️', kind, 'sound: buffer not loaded yet');
        return;
      }
      
      if (audioContext.state !== 'running') {
        console.warn('[Audio] ⚠️', kind, 'sound: context not running');
        return;
      }

      // Create and play
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
      console.log('[Audio] 🔊', kind, 'sound played at volume', volume);
      
    } catch (err) {
      console.error('[Audio] ❌', kind, 'sound error:', err);
    }
  }, 0);
}

// ==================== PUBLIC API ====================

/**
 * Play click sound
 */
export function playClick() {
  playSound(clickBuffer, 'click', 0.5);
}

/**
 * Play robot sound
 */
export function playRobot() {
  playSound(robotBuffer, 'robot', 0.6);
}

/**
 * Initialize and unlock audio (call on first user interaction)
 */
export function initAndUnlockAudio() {
  console.log('[Audio] 🎬 initAndUnlockAudio() called');
  
  if (!initAttempted) {
    initializeAudio();
  }
  
  if (!unlockAttempted) {
    unlockAudio();
  }
}

/**
 * Check if audio is ready
 */
export function isAudioReady() {
  return isUnlocked && !!clickBuffer && !!robotBuffer;
}

/**
 * Get audio status (for debugging)
 */
export function getAudioStatus() {
  return {
    initialized: initAttempted,
    unlocked: isUnlocked,
    contextState: audioContext?.state,
    clickBufferLoaded: !!clickBuffer,
    robotBufferLoaded: !!robotBuffer,
    musicPlaying: !!musicAudio && !musicAudio.paused
  };
}

// ==================== MUSIC TOGGLE FUNCTIONS ====================

let musicEnabledByUser = true; // Default to enabled

/**
 * Get current music enabled state
 */
export function getMusicEnabled() {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('musicEnabled');
    if (saved !== null) {
      musicEnabledByUser = saved === 'true';
    }
  }
  return musicEnabledByUser;
}

/**
 * Toggle background music on/off
 */
export function toggleBackgroundMusic(enabled) {
  console.log('[Audio] 🎵 toggleBackgroundMusic called with:', enabled);
  musicEnabledByUser = enabled;
  
  if (typeof window !== 'undefined') {
    localStorage.setItem('musicEnabled', enabled.toString());
  }
  
  if (enabled) {
    // Try to start music if audio is unlocked
    if (isUnlocked && !musicAudio) {
      startBackgroundMusic();
    } else if (musicAudio && musicAudio.paused) {
      musicAudio.play().catch(err => {
        console.error('[Audio] ❌ Resume music error:', err);
      });
    }
  } else {
    // Stop music
    if (musicAudio && !musicAudio.paused) {
      musicAudio.pause();
      console.log('[Audio] ⏸️ Music paused by user');
    }
  }
}

/**
 * Initialize audio with user gesture (Safari-safe)
 * Call this directly from a user click/touch handler
 */
export function initAudioWithUserGesture(enableMusic = true) {
  console.log('[Audio] 🎬 initAudioWithUserGesture() called, enableMusic:', enableMusic);
  
  musicEnabledByUser = enableMusic;
  if (typeof window !== 'undefined') {
    localStorage.setItem('musicEnabled', enableMusic.toString());
  }
  
  if (!initAttempted) {
    initializeAudio();
  }
  
  if (!unlockAttempted) {
    unlockAttempted = true;
    console.log('[Audio] 🔓 UNLOCKING AUDIO (Safari-safe user gesture)...');

    try {
      if (!audioContext) {
        console.error('[Audio] ❌ Cannot unlock: no AudioContext');
        return;
      }
      
      console.log('[Audio] Current state:', audioContext.state);
      
      if (audioContext.state === 'running') {
        console.log('[Audio] ✅ Already running!');
        isUnlocked = true;
        if (enableMusic) {
          startBackgroundMusic();
        }
        return;
      }

      // Resume AudioContext - this is the Safari-safe part
      console.log('[Audio] 🔄 Resuming AudioContext...');
      audioContext.resume().then(() => {
        console.log('[Audio] ✅ UNLOCK SUCCESS! State:', audioContext.state);
        isUnlocked = true;
        
        // Only start background music if user wants it
        if (enableMusic) {
          startBackgroundMusic();
        }
        
      }).catch(err => {
        console.error('[Audio] ❌ Resume failed:', err);
      });
      
    } catch (err) {
      console.error('[Audio] ❌ Unlock error:', err);
    }
  } else {
    // Already unlocked, just handle music preference
    if (enableMusic && isUnlocked && !musicAudio) {
      startBackgroundMusic();
    } else if (!enableMusic && musicAudio && !musicAudio.paused) {
      musicAudio.pause();
    }
  }
}

// ==================== AUTO-SETUP ====================

if (typeof window !== 'undefined') {
  console.log('[Audio] 🌐 Setting up auto-initialization...');
  
  // Load saved music preference
  const savedMusic = localStorage.getItem('musicEnabled');
  if (savedMusic !== null) {
    musicEnabledByUser = savedMusic === 'true';
  }
  
  const handleFirstInteraction = (e) => {
    console.log('[Audio] 👆 FIRST USER INTERACTION DETECTED!', e.type);
    // Only auto-init if user hasn't explicitly set preference via popup
    const hasSelectedAudio = localStorage.getItem('perfect_sell_audio_selected');
    if (!hasSelectedAudio) {
      initAndUnlockAudio();
    }
  };
  
  // Listen for first click or touch
  document.addEventListener('click', handleFirstInteraction, { once: true, passive: true });
  document.addEventListener('touchstart', handleFirstInteraction, { once: true, passive: true });
  
  console.log('[Audio] ✅ Listeners registered. Waiting for first interaction...');
}
