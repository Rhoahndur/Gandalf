# Voice Settings - Quick Start Guide

## How to Access Voice Settings

1. Click the "Settings" button in the header
2. Click the "Voice" tab
3. Adjust settings as desired
4. Click "Test Voice" to preview
5. Close modal - settings are saved automatically

## Settings Explained

### Auto-Read AI Responses
**What it does**: Automatically reads AI messages aloud when they arrive
**Default**: OFF
**How to use**: Toggle the switch ON to enable

### Voice Selection
**What it does**: Chooses which system voice to use for speaking
**Default**: First available system voice
**How to use**:
- Click the dropdown
- Select from available voices (grouped by language)
- Look for "(Local)" for better performance

### Speech Rate
**What it does**: Controls how fast the voice speaks
**Range**: 0.5x (slower) to 2x (faster)
**Default**: 1x (normal speed)
**How to use**: Drag the slider left for slower, right for faster

### Speech Pitch
**What it does**: Controls the voice pitch (high/low)
**Range**: 0.5 (lower) to 2 (higher)
**Default**: 1 (normal pitch)
**How to use**: Drag the slider left for lower pitch, right for higher

### Volume
**What it does**: Controls the speaking volume
**Range**: 0% (mute) to 100% (max)
**Default**: 100%
**How to use**: Drag the slider left to decrease, right to increase

### Voice Recognition Language
**What it does**: Sets the language for voice input recognition
**Default**: English (US)
**How to use**: Select your preferred language from the dropdown

### Test Voice Button
**What it does**: Previews the current voice settings
**How to use**:
- Click "Test Voice" to hear a sample
- Click "Stop Test" to stop playback
- Settings apply in real-time

## Persistence

All settings are automatically saved to your browser's localStorage and will persist across sessions.

## Browser Support

- Chrome/Edge: Full support
- Safari: Good support
- Firefox: Limited support
- Mobile: iOS Safari and Chrome Android supported

## Troubleshooting

**No voices showing in dropdown?**
- Wait a few seconds for voices to load
- Try refreshing the page
- Check browser compatibility

**Test voice not working?**
- Check volume is not at 0%
- Ensure browser has permission for audio
- Try a different voice from the list

**Settings not saving?**
- Check localStorage is enabled in your browser
- Check browser console for errors

## Code Integration

To use voice preferences in your code:

```typescript
import { loadVoicePreferences } from '@/utils/storageManager'

const preferences = loadVoicePreferences()

// Access settings
console.log(preferences.autoRead)      // boolean
console.log(preferences.voiceName)     // string | null
console.log(preferences.rate)          // number (0.5-2)
console.log(preferences.pitch)         // number (0.5-2)
console.log(preferences.volume)        // number (0-100)
console.log(preferences.recognitionLang) // string
```

## Next Steps

The voice settings UI is complete. To implement auto-reading:

1. Monitor new AI messages in chat
2. Check if `preferences.autoRead` is true
3. Use Web Speech API to speak the message
4. Apply saved rate, pitch, volume, and voice settings

See `VOICE_SETTINGS_IMPLEMENTATION.md` for detailed technical documentation.
