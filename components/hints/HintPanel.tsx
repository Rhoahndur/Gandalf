'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { MathRenderer } from '@/components/chat/MathRenderer';
import { HintLevelIndicator } from './HintLevelIndicator';
import type { HintLevel } from '@/types/hints';

interface HintPanelProps {
  hint: string;
  level: HintLevel;
  hasNext: boolean;
  hasPrevious: boolean;
  canRequestNew: boolean;
  onRequestNext?: () => void;
  onViewPrevious?: () => void;
  onViewNext?: () => void;
  onClose: () => void;
  isLoading?: boolean;
}

/**
 * HintPanel Component
 *
 * Displays a hint in a styled panel with level indicator,
 * controls to request the next hint, and close button.
 * Supports LaTeX rendering for mathematical content.
 *
 * @param hint - The hint text content (may contain LaTeX)
 * @param level - The current hint level (0-4)
 * @param hasNext - Whether there's a next hint level available
 * @param onRequestNext - Callback to request the next hint
 * @param onClose - Callback to close the hint panel
 * @param isLoading - Whether the next hint is being generated
 */
export function HintPanel({
  hint,
  level,
  hasNext,
  hasPrevious,
  canRequestNew,
  onRequestNext,
  onViewPrevious,
  onViewNext,
  onClose,
  isLoading = false,
}: HintPanelProps) {
  const t = useTranslations('common.hints');

  // Handle Escape key to close hint panel
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div className="mb-4 animate-in slide-in-from-top-2 duration-300">
      <div className="bg-blue-50 dark:bg-blue-950 border-2 border-blue-300 dark:border-blue-500 rounded-lg p-4 shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {/* Lightbulb icon */}
            <svg
              className="w-5 h-5 text-blue-600 dark:text-blue-400"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
            </svg>

            <span className="font-semibold text-blue-900 dark:text-blue-300">
              {t('hintTitle')}
            </span>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="p-1 hover:bg-blue-200 dark:hover:bg-blue-800 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={t('closeHint')}
          >
            <svg
              className="w-4 h-4 text-blue-700 dark:text-blue-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Level Indicator */}
        <div className="mb-3">
          <HintLevelIndicator currentLevel={level} showLevelName />
        </div>

        {/* Hint Content */}
        <div className="text-sm text-blue-900 dark:text-blue-50 mb-3 p-3 bg-white dark:bg-gray-900 rounded-lg border border-blue-200 dark:border-blue-800">
          <MathRenderer content={hint} />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-2">
          {/* Navigation buttons */}
          <div className="flex items-center gap-2">
            {/* Previous hint button */}
            {hasPrevious && onViewPrevious && (
              <button
                onClick={onViewPrevious}
                className="p-2 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                title="Previous hint"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            {/* Next hint in history button */}
            {hasNext && !canRequestNew && onViewNext && (
              <button
                onClick={onViewNext}
                className="p-2 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                title="Next hint"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>

          {/* Request new hint button */}
          {canRequestNew && onRequestNext ? (
            <button
              onClick={onRequestNext}
              disabled={isLoading}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isLoading
                  ? 'bg-blue-400 text-white cursor-wait'
                  : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
              }`}
              aria-busy={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  {t('loadingHint')}
                </span>
              ) : (
                t('nextHint')
              )}
            </button>
          ) : !canRequestNew ? (
            <span className="text-xs text-blue-700 dark:text-blue-300 italic">
              {t('maxHintReached')}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
