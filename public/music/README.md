# Background Music

## Current Music File

✅ **Active**: `calm_ambient_silence.mp3`
- **Track**: "Silence" by AShamaluevMusic
- **Duration**: 5:06 minutes
- **Style**: Calm ambient meditation music
- **License**: Royalty-free for commercial use
- **Source**: AShamaluevMusic (https://www.ashamaluevmusic.com/ambient-music)

## Music Characteristics

The current background music is:
- 🎵 Calm, peaceful, and meditative
- 🔁 Loops seamlessly (automatic)
- 🔇 Low volume (20% = 0.20)
- 🎹 Instrumental ambient (no vocals)
- 🧘 Perfect for browsing without distraction

## Features

The background music system:
- **Auto-starts** after first user interaction (if enabled)
- **Loops** continuously without interruption
- **Toggleable** via music button in navigation menu
- **Respects** user preferences (saved to localStorage)
- **Default**: Music ON by default

## Sources for Alternative Music

If you want to change the background music, here are recommended royalty-free sources:

1. **AShamaluevMusic** (Free, high quality)
   - https://www.ashamaluevmusic.com/ambient-music
   - Direct MP3 downloads via Dropbox
   - License: Free for commercial use
   - Tracks: Silence, Aura, Peaceful, Calm Lake, etc.

2. **Mixkit** (Free, no attribution required)
   - https://mixkit.co/free-stock-music/mood/peaceful/
   - Tracks: Rest Now, Meditation, Valley Sunset, etc.
   - License: Mixkit License (royalty-free)

3. **Pixabay Music** (Free, no attribution required)
   - https://pixabay.com/music/search/meditation/
   - Search: "calm", "ambient", "peaceful", "meditation"
   - License: Pixabay License (commercial use allowed)

4. **YouTube Audio Library** (Free)
   - https://www.youtube.com/audiolibrary
   - Filter: Genre = "Ambient" or "Meditation"
   - License: Varies (check per track)

### Technical Requirements

- **Format**: MP3
- **File Size**: 5-15MB (recommended)
- **Length**: 3-6 minutes (loops automatically)
- **Quality**: 128-320 kbps
- **Volume**: Should be normalized (not too loud)

### How to Change the Music

1. Download your chosen track from one of the sources above
2. Place the MP3 file in `/app/public/music/`
3. Update `/app/lib/audioManager.js`:
   - Change `MUSIC_FILE_PATH` to `/music/your-file-name.mp3`
4. Restart the application

The new music will automatically loop and play at the configured volume.

---

**Status**: ✅ Background music active and working properly
