'use client';

import { useState, useEffect } from 'react';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { loadVoicePreferences, saveVoicePreferences } from '@/utils/storageManager';
import type { VoicePreferences } from '@/types/voice';

/**
 * Text-to-Speech Settings Component
 *
 * Provides controls for:
 * - Auto-read toggle (automatically read AI responses)
 * - Voice selection from available system voices
 * - Speech rate adjustment (0.5x to 2x)
 * - Pitch adjustment (0.5x to 2x)
 * - Volume adjustment (0% to 100%)
 * - Test speech button
 */
export function TTSSettings() {
  const { voices, selectedVoice, setVoice, setRate, setPitch, setVolume, speak, isSupported } =
    useTextToSpeech();

  const [preferences, setPreferences] = useState<VoicePreferences>(() => loadVoicePreferences());

  // Load preferences on mount
  useEffect(() => {
    const prefs = loadVoicePreferences();
    setPreferences(prefs);

    // Apply saved preferences to TTS hook
    setRate(prefs.rate);
    setPitch(prefs.pitch);
    setVolume(prefs.volume / 100); // Convert from 0-100 to 0-1

    // Set voice if available
    if (prefs.voiceName && voices.length > 0) {
      const voice = voices.find((v) => v.name === prefs.voiceName);
      if (voice) {
        setVoice(voice);
      }
    }
  }, [voices, setRate, setPitch, setVolume, setVoice]);

  // Update preference and save
  const updatePreference = <K extends keyof VoicePreferences>(
    key: K,
    value: VoicePreferences[K]
  ) => {
    const updated = { ...preferences, [key]: value };
    setPreferences(updated);
    saveVoicePreferences(updated);

    // Apply to TTS hook
    if (key === 'rate') setRate(value as number);
    if (key === 'pitch') setPitch(value as number);
    if (key === 'volume') setVolume((value as number) / 100);
  };

  // Handle voice selection
  const handleVoiceChange = (voiceName: string) => {
    const voice = voices.find((v) => v.name === voiceName);
    if (voice) {
      setVoice(voice);
      updatePreference('voiceName', voiceName);
    }
  };

  // Test speech
  const handleTestSpeech = () => {
    speak('Hello! I am your AI math tutor. I will guide you through math problems using the Socratic method.');
  };

  if (!isSupported) {
    return (
      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          Text-to-Speech is not supported in your browser. Please use a modern browser like Chrome, Edge, Safari, or Firefox.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Text-to-Speech Settings
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Configure voice and speech preferences for AI responses
          </p>
        </div>
      </div>

      {/* Auto-read toggle */}
      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div>
          <label
            htmlFor="auto-read"
            className="text-sm font-medium text-gray-900 dark:text-white"
          >
            Auto-read AI responses
          </label>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Automatically read AI messages aloud when they arrive
          </p>
        </div>
        <button
          id="auto-read"
          onClick={() => updatePreference('autoRead', !preferences.autoRead)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            preferences.autoRead
              ? 'bg-blue-600'
              : 'bg-gray-300 dark:bg-gray-600'
          }`}
          role="switch"
          aria-checked={preferences.autoRead}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              preferences.autoRead ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Voice selection */}
      <div>
        <label
          htmlFor="voice-select"
          className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
        >
          Voice
        </label>
        <select
          id="voice-select"
          value={preferences.voiceName || ''}
          onChange={(e) => handleVoiceChange(e.target.value)}
          className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {voices.length === 0 ? (
            <option>Loading voices...</option>
          ) : (
            <>
              <option value="">Default Voice</option>
              {voices.map((voice) => (
                <option key={voice.name} value={voice.name}>
                  {voice.name} ({voice.lang})
                </option>
              ))}
            </>
          )}
        </select>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
          {voices.length} voice{voices.length !== 1 ? 's' : ''} available
        </p>
      </div>

      {/* Speech rate */}
      <div>
        <label
          htmlFor="rate-slider"
          className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
        >
          Speech Rate: {preferences.rate.toFixed(1)}x
        </label>
        <input
          id="rate-slider"
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={preferences.rate}
          onChange={(e) => updatePreference('rate', parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-1">
          <span>Slower (0.5x)</span>
          <span>Normal (1.0x)</span>
          <span>Faster (2.0x)</span>
        </div>
      </div>

      {/* Pitch */}
      <div>
        <label
          htmlFor="pitch-slider"
          className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
        >
          Pitch: {preferences.pitch.toFixed(1)}x
        </label>
        <input
          id="pitch-slider"
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={preferences.pitch}
          onChange={(e) => updatePreference('pitch', parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-1">
          <span>Lower (0.5x)</span>
          <span>Normal (1.0x)</span>
          <span>Higher (2.0x)</span>
        </div>
      </div>

      {/* Volume */}
      <div>
        <label
          htmlFor="volume-slider"
          className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
        >
          Volume: {preferences.volume}%
        </label>
        <input
          id="volume-slider"
          type="range"
          min="0"
          max="100"
          step="5"
          value={preferences.volume}
          onChange={(e) => updatePreference('volume', parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-1">
          <span>Mute (0%)</span>
          <span>Half (50%)</span>
          <span>Max (100%)</span>
        </div>
      </div>

      {/* Test button */}
      <button
        onClick={handleTestSpeech}
        className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path d="M10.5 3.75a.75.75 0 00-1.264-.546L5.203 7H2.667a.75.75 0 00-.7.48A6.985 6.985 0 001.5 10c0 .887.165 1.737.468 2.52.111.29.39.48.7.48h2.535l4.033 3.796a.75.75 0 001.264-.546V3.75zM16.45 5.05a.75.75 0 00-1.06 1.061 5.5 5.5 0 010 7.778.75.75 0 001.06 1.06 7 7 0 000-9.899z" />
          <path d="M14.329 7.172a.75.75 0 00-1.061 1.06 2.5 2.5 0 010 3.536.75.75 0 001.06 1.06 4 4 0 000-5.656z" />
        </svg>
        Test Speech
      </button>

      {/* Browser compatibility note */}
      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p className="text-xs text-blue-800 dark:text-blue-200">
          <strong>Browser Support:</strong> Text-to-Speech works best in Chrome, Edge, Safari, and Firefox. Available voices may vary by browser and operating system.
        </p>
      </div>
    </div>
  );
}
