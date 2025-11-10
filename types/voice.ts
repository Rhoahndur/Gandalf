export interface VoicePreferences {
  autoRead: boolean;
  voiceName: string | null;
  rate: number;
  pitch: number;
  volume: number;
  recognitionLang: string;
  uiLanguage?: string; // Optional UI language that syncs with recognition language
}

export const DEFAULT_VOICE_PREFERENCES: VoicePreferences = {
  autoRead: false,
  voiceName: null,
  rate: 1,
  pitch: 1,
  volume: 100,
  recognitionLang: 'en-US',
};

export const RECOGNITION_LANGUAGES = [
  { code: 'en-US', name: 'English (US)' },
  { code: 'en-GB', name: 'English (UK)' },
  { code: 'es-ES', name: 'Spanish (Spain)' },
  { code: 'es-MX', name: 'Spanish (Mexico)' },
  { code: 'fr-FR', name: 'French' },
  { code: 'de-DE', name: 'German' },
  { code: 'it-IT', name: 'Italian' },
  { code: 'pt-BR', name: 'Portuguese (Brazil)' },
  { code: 'pt-PT', name: 'Portuguese (Portugal)' },
  { code: 'zh-CN', name: 'Chinese (Mandarin)' },
  { code: 'ja-JP', name: 'Japanese' },
  { code: 'ko-KR', name: 'Korean' },
  { code: 'ru-RU', name: 'Russian' },
  { code: 'ar-SA', name: 'Arabic' },
  { code: 'hi-IN', name: 'Hindi' },
] as const;

/**
 * Maps UI language codes to Speech API language codes
 * Used to sync UI language with voice recognition and TTS
 */
export const UI_LANG_TO_SPEECH_LANG: Record<string, string> = {
  'en': 'en-US',
  'es': 'es-ES',
  'fr': 'fr-FR',
  'de': 'de-DE',
  'zh': 'zh-CN',
  'ja': 'ja-JP',
  'it': 'it-IT',
  'pt': 'pt-BR',
  'ko': 'ko-KR',
  'ru': 'ru-RU',
  'ar': 'ar-SA',
  'hi': 'hi-IN',
};

/**
 * Get the speech language code from UI language
 * Falls back to en-US if not found
 */
export function getSpeechLangFromUILang(uiLang?: string): string {
  if (!uiLang) return 'en-US';
  return UI_LANG_TO_SPEECH_LANG[uiLang] || 'en-US';
}
