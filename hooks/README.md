# useVoiceRecognition Hook

A production-ready React hook for the Web Speech Recognition API with full TypeScript support, error handling, and browser compatibility.

## Features

- Full TypeScript support with complete type definitions
- Cross-browser compatibility (Chrome, Edge, Safari, with webkit prefix handling)
- Real-time transcript updates with interim and final results
- Comprehensive error handling with user-friendly messages
- Microphone permission management
- Configurable language support
- Auto-cleanup on component unmount
- Protection against rapid start/stop edge cases

## Browser Compatibility

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome | ✅ Full | Best support, uses standard API |
| Edge | ✅ Full | Chromium-based, full support |
| Safari | ✅ Full | Uses webkit prefix |
| Firefox | ❌ No | Not currently supported |
| Opera | ✅ Full | Chromium-based, full support |
| Mobile Chrome | ✅ Full | Android support |
| Mobile Safari | ✅ Full | iOS 14.5+ |

**Global Usage:** ~93% of users (as of 2024)

## Installation

The hook is already included in the project. Simply import it:

```typescript
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';
```

## API Reference

### Hook Signature

```typescript
function useVoiceRecognition(
  options?: UseVoiceRecognitionOptions
): UseVoiceRecognitionReturn
```

### Options

```typescript
interface UseVoiceRecognitionOptions {
  lang?: string;              // Default: 'en-US'
  continuous?: boolean;        // Default: true
  interimResults?: boolean;    // Default: true
  maxAlternatives?: number;    // Default: 1
}
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `lang` | string | `'en-US'` | BCP 47 language tag (e.g., 'en-US', 'es-ES', 'fr-FR') |
| `continuous` | boolean | `true` | Continue recognition after user stops speaking |
| `interimResults` | boolean | `true` | Return interim results (live transcription) |
| `maxAlternatives` | number | `1` | Maximum alternative transcriptions to consider |

### Return Value

```typescript
interface UseVoiceRecognitionReturn {
  transcript: string;           // Current transcript text
  isListening: boolean;         // Whether actively listening
  isSupported: boolean;         // Browser support status
  error: string | null;         // Error message if any
  startListening: () => void;   // Start speech recognition
  stopListening: () => void;    // Stop speech recognition
  resetTranscript: () => void;  // Clear current transcript
}
```

## Usage Examples

### Basic Usage

```typescript
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';

function VoiceInput() {
  const {
    transcript,
    isListening,
    isSupported,
    error,
    startListening,
    stopListening,
  } = useVoiceRecognition();

  if (!isSupported) {
    return <p>Speech recognition not supported</p>;
  }

  return (
    <div>
      <button onClick={startListening} disabled={isListening}>
        Start
      </button>
      <button onClick={stopListening} disabled={!isListening}>
        Stop
      </button>
      {error && <p className="error">{error}</p>}
      <p>{transcript}</p>
    </div>
  );
}
```

### With Custom Language

```typescript
const { transcript, startListening } = useVoiceRecognition({
  lang: 'es-ES',  // Spanish
  continuous: true,
  interimResults: true,
});
```

### Integration with Chat

```typescript
function ChatInput({ onSendMessage }) {
  const [input, setInput] = useState('');
  const { transcript, isListening, startListening, stopListening } =
    useVoiceRecognition();

  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  const handleSend = () => {
    onSendMessage(input);
    setInput('');
  };

  return (
    <div>
      <input value={input} onChange={e => setInput(e.target.value)} />
      <button onClick={isListening ? stopListening : startListening}>
        {isListening ? '🎤 Stop' : '🎤'}
      </button>
      <button onClick={handleSend}>Send</button>
    </div>
  );
}
```

## Error Handling

The hook provides user-friendly error messages for common issues:

| Error Type | User Message | Cause |
|------------|--------------|-------|
| `not-allowed` | "Microphone access denied. Please allow microphone permissions..." | User denied permission |
| `no-speech` | "No speech detected. Please try again." | No speech input detected |
| `network` | "Network error occurred. Please check your internet connection." | Network failure |
| `audio-capture` | "No microphone found. Please ensure a microphone is connected." | No mic available |
| `aborted` | `null` | User stopped intentionally |

### Handling Errors

```typescript
const { error, isSupported } = useVoiceRecognition();

if (!isSupported) {
  return <BrowserNotSupported />;
}

if (error) {
  return <ErrorMessage message={error} />;
}
```

## Supported Languages

Common BCP 47 language codes:

```typescript
const languages = [
  'en-US',  // English (United States)
  'en-GB',  // English (United Kingdom)
  'es-ES',  // Spanish (Spain)
  'es-MX',  // Spanish (Mexico)
  'fr-FR',  // French (France)
  'de-DE',  // German (Germany)
  'it-IT',  // Italian (Italy)
  'pt-BR',  // Portuguese (Brazil)
  'zh-CN',  // Chinese (Simplified)
  'ja-JP',  // Japanese (Japan)
  'ko-KR',  // Korean (Korea)
  'ru-RU',  // Russian (Russia)
  'ar-SA',  // Arabic (Saudi Arabia)
  'hi-IN',  // Hindi (India)
];
```

[Full list of supported languages](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition/lang)

## Implementation Details

### Webkit Prefix Handling

The hook automatically detects and uses the correct API:

```typescript
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
```

### Transcript Processing

- **Final results:** Appended to transcript permanently
- **Interim results:** Updated in real-time, replaced when finalized
- **Continuous mode:** Keeps listening after each phrase
- **Non-continuous mode:** Stops after each phrase

### State Management

The hook uses `useRef` to prevent race conditions:

```typescript
const isStartingRef = useRef(false);  // Prevents double-start
```

### Cleanup

Automatic cleanup on unmount:

```typescript
useEffect(() => {
  return () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };
}, []);
```

## Best Practices

### 1. Check Browser Support First

```typescript
const { isSupported } = useVoiceRecognition();

if (!isSupported) {
  return <FallbackTextInput />;
}
```

### 2. Handle Permissions Gracefully

```typescript
const { error, startListening } = useVoiceRecognition();

// Show permission instructions before starting
if (error?.includes('denied')) {
  return <PermissionInstructions />;
}
```

### 3. Provide Visual Feedback

```typescript
<button
  onClick={startListening}
  className={isListening ? 'animate-pulse bg-red-500' : 'bg-blue-500'}
>
  {isListening ? '🎤 Listening...' : '🎤 Start'}
</button>
```

### 4. Allow Editing

```typescript
const [editableTranscript, setEditableTranscript] = useState('');

useEffect(() => {
  setEditableTranscript(transcript);
}, [transcript]);

<textarea
  value={editableTranscript}
  onChange={e => setEditableTranscript(e.target.value)}
/>
```

### 5. Mobile Considerations

```typescript
// Mobile browsers may require user gesture to start
<button onClick={startListening}>
  Tap to speak
</button>

// Avoid auto-starting on mobile
useEffect(() => {
  if (isMobile()) return;
  startListening();
}, []);
```

## Testing

### Manual Testing Checklist

- [ ] Start/stop recording works
- [ ] Transcript updates in real-time
- [ ] Final transcript is accurate
- [ ] Permissions prompt appears on first use
- [ ] Error messages display correctly
- [ ] Works on Chrome
- [ ] Works on Safari (webkit)
- [ ] Works on mobile Chrome
- [ ] Works on mobile Safari
- [ ] Cleanup on unmount (no memory leaks)
- [ ] Multiple start/stop cycles work
- [ ] Language switching works
- [ ] No errors in console

### Test Phrases

Use these phrases to test accuracy:

- **Math:** "What is 2x plus 5 equals 13?"
- **Numbers:** "Calculate 125 times 47"
- **Fractions:** "Simplify 3 over 4 plus 1 over 2"
- **Equations:** "Solve for x: x squared minus 9 equals 0"

## Common Issues & Solutions

### Issue: "Already started" error

**Cause:** Calling `startListening()` when already listening

**Solution:** The hook handles this automatically by checking `isStartingRef`

### Issue: Permissions not requesting

**Cause:** Browser requires user gesture (click) before requesting permissions

**Solution:** Always start via button click, not automatically

### Issue: Transcript not updating

**Cause:** `interimResults: false` or no speech detected

**Solution:** Set `interimResults: true` for live updates

### Issue: Stops after each phrase

**Cause:** `continuous: false`

**Solution:** Set `continuous: true`

### Issue: Not working on Firefox

**Cause:** Firefox doesn't support Web Speech API

**Solution:** Show fallback UI for unsupported browsers

## Performance Considerations

- **Memory:** Hook uses minimal memory (~10KB)
- **CPU:** Negligible when not listening
- **Network:** Sends audio to Google/Apple servers (privacy consideration)
- **Latency:** ~100-300ms for interim results, ~500ms for final

## Privacy & Security

The Web Speech Recognition API:
- Sends audio to external servers (Google for Chrome, Apple for Safari)
- Requires HTTPS in production (except localhost)
- Requires explicit user permission
- Does not store audio after transcription

### Security Best Practices

```typescript
// Only use on HTTPS
if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
  console.warn('Speech recognition requires HTTPS');
}

// Inform users about data transmission
<p>Your voice will be processed by {browserName}'s speech service</p>
```

## Advanced Usage

### Auto-stop After Silence

```typescript
const { isListening, stopListening } = useVoiceRecognition();
const [lastUpdate, setLastUpdate] = useState(Date.now());

useEffect(() => {
  if (!isListening) return;

  const timeout = setTimeout(() => {
    if (Date.now() - lastUpdate > 3000) {
      stopListening();
    }
  }, 3000);

  return () => clearTimeout(timeout);
}, [isListening, lastUpdate]);
```

### Confidence Threshold

The Speech Recognition API provides confidence scores. While this hook doesn't expose them directly, you can modify the source to access them:

```typescript
// In the hook's onresult handler:
const confidence = result[0].confidence;
if (confidence > 0.8) {
  // High confidence result
}
```

## Future Enhancements

Potential features for future versions:

- [ ] Confidence score exposure
- [ ] Grammar hints support
- [ ] Custom vocabulary
- [ ] Offline mode (browser support pending)
- [ ] Noise cancellation configuration
- [ ] Alternative transcriptions

## References

- [MDN: Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [MDN: SpeechRecognition](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition)
- [Can I Use: Speech Recognition](https://caniuse.com/speech-recognition)
- [W3C Specification](https://wicg.github.io/speech-api/)

## License

This hook is part of the Gandalf AI Math Tutor project.

## Support

For issues or questions:
1. Check browser compatibility
2. Review error messages
3. See usage examples above
4. Check console for warnings
