'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { DifficultyLevel, DIFFICULTY_CONFIGS } from '@/types/difficulty';
import { VoicePreferences } from '@/types/voice';
import { LanguageCode } from '@/types/language';
import { VoiceSettings } from './VoiceSettings';
import { LanguageSettings } from './LanguageSettings';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDifficulty: DifficultyLevel;
  onDifficultyChange: (difficulty: DifficultyLevel) => void;
  voicePreferences: VoicePreferences;
  onVoicePreferencesChange: (preferences: VoicePreferences) => void;
  onVoiceTest?: () => void;
  currentLanguage: LanguageCode;
  onLanguageChange: (language: LanguageCode) => void;
}

type TabType = 'difficulty' | 'voice' | 'language';

export function SettingsModal({
  isOpen,
  onClose,
  currentDifficulty,
  onDifficultyChange,
  voicePreferences,
  onVoicePreferencesChange,
  onVoiceTest,
  currentLanguage,
  onLanguageChange,
}: SettingsModalProps) {
  const t = useTranslations('settings');
  const tDifficulty = useTranslations('settings.difficulty.levels');
  const [activeTab, setActiveTab] = useState<TabType>('difficulty');
  const difficulties = Object.values(DIFFICULTY_CONFIGS);

  if (!isOpen) return null;

  const handleDifficultyChange = (difficulty: DifficultyLevel) => {
    onDifficultyChange(difficulty);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
        style={{ pointerEvents: 'auto' }}
      />

      {/* Modal */}
      <div
        className="fixed z-50"
        style={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          pointerEvents: 'none'
        }}
      >
        <div
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-[500px]"
          style={{
            maxHeight: '90vh',
            overflowY: 'auto',
            pointerEvents: 'auto'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between rounded-t-2xl z-10">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              {t('modal.title')}
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 hover:opacity-80 rounded-lg transition-opacity duration-200"
              aria-label={t('modal.closeAriaLabel')}
            >
              <svg className="w-5 h-5 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Tabs */}
          <div className="sticky top-[57px] bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 z-10">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('difficulty')}
                className={`px-4 py-2.5 font-medium text-sm transition-all duration-200 border-b-2 ${
                  activeTab === 'difficulty'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                {t('tabs.difficulty')}
              </button>
              <button
                onClick={() => setActiveTab('voice')}
                className={`px-4 py-2.5 font-medium text-sm transition-all duration-200 border-b-2 ${
                  activeTab === 'voice'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                {t('tabs.voice')}
              </button>
              <button
                onClick={() => setActiveTab('language')}
                className={`px-4 py-2.5 font-medium text-sm transition-all duration-200 border-b-2 ${
                  activeTab === 'language'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                {t('tabs.language')}
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 bg-white dark:bg-gray-900">
            {activeTab === 'difficulty' && (
              <div className="grid grid-cols-1 gap-2">
                {difficulties.map((difficulty) => (
                  <button
                    key={difficulty.id}
                    onClick={() => handleDifficultyChange(difficulty.id)}
                    className={`
                      relative p-3 rounded-lg border-2 transition-all duration-200 text-left
                      hover:scale-[1.01] active:scale-95 focus:ring-2 focus:ring-blue-500 focus:outline-none
                      ${
                        currentDifficulty === difficulty.id
                          ? 'border-blue-500 bg-blue-600 dark:bg-blue-600 shadow-md'
                          : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 hover:border-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }
                    `}
                    aria-label={t('difficulty.setDifficultyAriaLabel', { name: tDifficulty(`${difficulty.id}.name`) })}
                    aria-pressed={currentDifficulty === difficulty.id}
                  >
                    <div className="flex items-center gap-2">
                      <div className="text-2xl">{difficulty.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-semibold ${
                          currentDifficulty === difficulty.id
                            ? 'text-white'
                            : 'text-gray-900 dark:text-white'
                        }`}>
                          {tDifficulty(`${difficulty.id}.name`)}
                        </div>
                        <div className={`text-xs truncate ${
                          currentDifficulty === difficulty.id
                            ? 'text-blue-100'
                            : 'text-gray-600 dark:text-gray-300'
                        }`}>
                          {tDifficulty(`${difficulty.id}.description`)}
                        </div>
                      </div>
                    </div>
                    {currentDifficulty === difficulty.id && (
                      <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}

            {activeTab === 'voice' && (
              <VoiceSettings
                preferences={voicePreferences}
                onPreferencesChange={onVoicePreferencesChange}
                onVoiceTest={onVoiceTest}
              />
            )}

            {activeTab === 'language' && (
              <LanguageSettings
                currentLanguage={currentLanguage}
                onLanguageChange={onLanguageChange}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
