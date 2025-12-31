# PRODUCTION-GRADE FIX IMPLEMENTATION PLAN

## PHASE 1: AUDIO SYSTEM CLEANUP (SINGLE MANAGER)

### Files to MODIFY:
1. `/lib/audioManager.js` - Make it the ONLY audio handler
2. `/components/GlobalClickEffects.js` - Integrate audio playback here

### Files to DELETE:
1. `/components/GlobalClickSound.js` - REDUNDANT
2. `/components/AudioBootstrapper.js` - REDUNDANT (move logic to audioManager)

### Files to FIX:
1. `/components/SwordInStone.js` - Remove inline AudioContext creation
2. `/components/WhatsAppButton.js` - Remove playClick call

### New Architecture:
```
audioManager.js (singleton)
  ↓ Initialize on first user interaction
  ↓ Preload & decode buffers ONCE
  ↓ Expose: playClick(), playRobot()
  ↓
GlobalClickEffects.js (SINGLE global listener)
  ↓ Handles BOTH visual effects AND audio
  ↓ Works on ALL tiers (High/Mid/Low)
  ↓
PerfectCellLogo.js (uses playRobot())
```

## PHASE 2: LOGIN FIX

### Action:
1. Run seed script to create admin user
2. Verify bcrypt hash
3. Test login endpoint

## PHASE 3: PERFORMANCE OPTIMIZATION

### Remove:
1. Duplicate event listeners
2. Unused components
3. Redundant state management

### Optimize:
1. Use React.memo where needed
2. Proper useCallback/useMemo
3. Reduce re-renders

## DELIVERABLES

- Clean, single audio system
- Admin login working
- 50%+ performance improvement
- Zero duplicates
