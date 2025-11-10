'use client';

import { useTranslations } from 'next-intl';
import { LanguageCode, LANGUAGE_CONFIGS } from '@/types/language';

interface LanguageSettingsProps {
  currentLanguage: LanguageCode;
  onLanguageChange: (language: LanguageCode) => void;
}

export function LanguageSettings({ currentLanguage, onLanguageChange }: LanguageSettingsProps) {
  const t = useTranslations('settings.language');
  const languages = Object.values(LANGUAGE_CONFIGS);

  return (
    <div className="space-y-3">
      <div className="mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t('description')}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {languages.map((language) => (
          <button
            key={language.code}
            onClick={() => onLanguageChange(language.code)}
            className={`
              relative p-3 rounded-lg border-2 transition-all duration-200 text-left
              hover:scale-[1.01] active:scale-95 focus:ring-2 focus:ring-blue-500 focus:outline-none
              ${
                currentLanguage === language.code
                  ? 'border-blue-500 bg-blue-600 dark:bg-blue-600 shadow-md'
                  : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 hover:border-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }
            `}
            aria-label={t('setLanguageAriaLabel', { name: language.name })}
            aria-pressed={currentLanguage === language.code}
          >
            <div className="flex items-center gap-3">
              <div className="text-3xl">{language.flag}</div>
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-semibold ${
                  currentLanguage === language.code
                    ? 'text-white'
                    : 'text-gray-900 dark:text-white'
                }`}>
                  {language.nativeName}
                </div>
                <div className={`text-xs ${
                  currentLanguage === language.code
                    ? 'text-blue-100'
                    : 'text-gray-600 dark:text-gray-300'
                }`}>
                  {language.name}
                </div>
              </div>
            </div>
            {currentLanguage === language.code && (
              <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
