'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { VoicePreferences, DEFAULT_VOICE_PREFERENCES, RECOGNITION_LANGUAGES } from '@/types/voice';

interface VoiceSettingsProps {
  preferences: VoicePreferences;
  onPreferencesChange: (preferences: VoicePreferences) => void;
  onVoiceTest?: () => void;
}

export function VoiceSettings({ preferences, onPreferencesChange, onVoiceTest }: VoiceSettingsProps) {
  const t = useTranslations('settings.voice');
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isTestingSpeech, setIsTestingSpeech] = useState(false);

  // Get the language prefix from recognition language (e.g., 'en' from 'en-US')
  const currentLangPrefix = preferences.recognitionLang.split('-')[0];

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      console.log('[VoiceSettings] Loaded voices:', voices.length, 'Current recognition language:', preferences.recognitionLang);
      setAvailableVoices(voices);

      // If no voice is selected or selected voice doesn't match current language, set a default
      if (voices.length > 0) {
        const currentVoiceValid = preferences.voiceName && voices.some(v => v.name === preferences.voiceName);

        if (!currentVoiceValid) {
          // Find a voice matching the current language
          const matchingVoice = voices.find(v => v.lang.startsWith(currentLangPrefix));
          const defaultVoice = matchingVoice || voices[0];

          console.log('[VoiceSettings] Setting default voice:', defaultVoice.name, 'for language:', preferences.recognitionLang);
          onPreferencesChange({
            ...preferences,
            voiceName: defaultVoice.name,
          });
        }
      }
    };

    loadVoices();

    // Chrome loads voices asynchronously
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [preferences.recognitionLang, currentLangPrefix]); // Reload when language changes

  const handleToggleAutoRead = () => {
    // Mark user interaction when enabling auto-read
    if (!preferences.autoRead) {
      onVoiceTest?.();
    }

    onPreferencesChange({
      ...preferences,
      autoRead: !preferences.autoRead,
    });
  };

  const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onPreferencesChange({
      ...preferences,
      voiceName: e.target.value,
    });
  };

  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onPreferencesChange({
      ...preferences,
      rate: parseFloat(e.target.value),
    });
  };

  const handlePitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onPreferencesChange({
      ...preferences,
      pitch: parseFloat(e.target.value),
    });
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onPreferencesChange({
      ...preferences,
      volume: parseInt(e.target.value),
    });
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    const newLangPrefix = newLang.split('-')[0];

    console.log('[VoiceSettings] Language changed to:', newLang);

    // Find a voice matching the new language
    const matchingVoice = availableVoices.find(v => v.lang.startsWith(newLangPrefix));

    console.log('[VoiceSettings] Auto-selecting voice for new language:', matchingVoice?.name || 'none found');

    onPreferencesChange({
      ...preferences,
      recognitionLang: newLang,
      // Auto-select a matching voice if available
      voiceName: matchingVoice ? matchingVoice.name : preferences.voiceName,
    });
  };

  const handleTestVoice = () => {
    if (isTestingSpeech) {
      window.speechSynthesis.cancel();
      setIsTestingSpeech(false);
      return;
    }

    // Mark that user has interacted (needed for browser auto-play restrictions)
    onVoiceTest?.();

    const utterance = new SpeechSynthesisUtterance(
      t('testVoice.testUtterance')
    );

    // Find and set the selected voice
    const selectedVoice = availableVoices.find(v => v.name === preferences.voiceName);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.rate = preferences.rate;
    utterance.pitch = preferences.pitch;
    utterance.volume = preferences.volume / 100;

    utterance.onstart = () => setIsTestingSpeech(true);
    utterance.onend = () => setIsTestingSpeech(false);
    utterance.onerror = () => setIsTestingSpeech(false);

    window.speechSynthesis.speak(utterance);
  };

  // Filter and group voices - prioritize current language
  const filteredVoices = availableVoices;

  // Separate voices into current language and others
  const currentLangVoices = filteredVoices.filter(v => v.lang.startsWith(currentLangPrefix));
  const otherVoices = filteredVoices.filter(v => !v.lang.startsWith(currentLangPrefix));

  // Group voices by language
  const groupedVoices = filteredVoices.reduce((acc, voice) => {
    const lang = voice.lang || 'Other';
    if (!acc[lang]) acc[lang] = [];
    acc[lang].push(voice);
    return acc;
  }, {} as Record<string, SpeechSynthesisVoice[]>);

  console.log('[VoiceSettings] Voices filtered - Current language:', currentLangVoices.length, 'Others:', otherVoices.length);

  return (
    <div className="space-y-6">
      {/* Auto-Read Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <label className="text-sm font-semibold text-gray-900 dark:text-white">
            {t('autoRead.label')}
          </label>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
            {t('autoRead.description')}
          </p>
        </div>
        <button
          onClick={handleToggleAutoRead}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${
            preferences.autoRead
              ? 'bg-blue-600'
              : 'bg-gray-300 dark:bg-gray-600'
          }`}
          role="switch"
          aria-checked={preferences.autoRead}
          aria-label={t('toggleAutoReadAriaLabel')}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
              preferences.autoRead ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Voice Selection */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
          {t('voiceSelect.label')}
        </label>
        <select
          value={preferences.voiceName || ''}
          onChange={handleVoiceChange}
          className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        >
          {Object.keys(groupedVoices).length === 0 ? (
            <option>{t('voiceSelect.loading')}</option>
          ) : (
            <>
              {/* Current language voices first */}
              {currentLangVoices.length > 0 && (
                <optgroup label={`${preferences.recognitionLang} (Current Language)`}>
                  {currentLangVoices.map((voice) => (
                    <option key={voice.name} value={voice.name}>
                      {voice.name} {voice.localService ? t('voiceSelect.local') : t('voiceSelect.network')}
                    </option>
                  ))}
                </optgroup>
              )}

              {/* Other language voices - grouped by language */}
              {otherVoices.length > 0 && (
                <>
                  {Object.entries(groupedVoices)
                    .filter(([lang]) => !lang.startsWith(currentLangPrefix))
                    .sort(([langA], [langB]) => langA.localeCompare(langB))
                    .map(([lang, voices]) => (
                      <optgroup key={lang} label={lang}>
                        {voices.map((voice) => (
                          <option key={voice.name} value={voice.name}>
                            {voice.name} {voice.localService ? t('voiceSelect.local') : t('voiceSelect.network')}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                </>
              )}
            </>
          )}
        </select>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
          {t('voiceSelect.description')}
        </p>
      </div>

      {/* Speech Rate */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-semibold text-gray-900 dark:text-white">
            {t('speechRate.label')}
          </label>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {preferences.rate.toFixed(1)}x
          </span>
        </div>
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={preferences.rate}
          onChange={handleRateChange}
          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-1">
          <span>{t('speechRate.slower')}</span>
          <span>{t('speechRate.faster')}</span>
        </div>
      </div>

      {/* Speech Pitch */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-semibold text-gray-900 dark:text-white">
            {t('speechPitch.label')}
          </label>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {preferences.pitch.toFixed(1)}
          </span>
        </div>
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={preferences.pitch}
          onChange={handlePitchChange}
          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-1">
          <span>{t('speechPitch.lower')}</span>
          <span>{t('speechPitch.higher')}</span>
        </div>
      </div>

      {/* Volume */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-semibold text-gray-900 dark:text-white">
            {t('volume.label')}
          </label>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {preferences.volume}%
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          step="5"
          value={preferences.volume}
          onChange={handleVolumeChange}
          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-1">
          <span>{t('volume.mute')}</span>
          <span>{t('volume.max')}</span>
        </div>
      </div>

      {/* Recognition Language */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
          {t('recognitionLanguage.label')}
        </label>
        <select
          value={preferences.recognitionLang}
          onChange={handleLanguageChange}
          className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        >
          {RECOGNITION_LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
          {t('recognitionLanguage.description')}
        </p>
      </div>

      {/* Test Voice Button */}
      <div className="pt-2">
        <button
          onClick={handleTestVoice}
          className={`w-full px-4 py-3 rounded-lg font-medium transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${
            isTestingSpeech
              ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-2 border-red-500 hover:bg-red-200 dark:hover:bg-red-900/40'
              : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-2 border-blue-500 hover:bg-blue-200 dark:hover:bg-blue-900/40'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            {isTestingSpeech ? (
              <>
                <svg className="w-5 h-5 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
                <span>{t('testVoice.stopButton')}</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span>{t('testVoice.button')}</span>
              </>
            )}
          </div>
        </button>
      </div>
    </div>
  );
}
