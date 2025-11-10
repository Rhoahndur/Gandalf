'use client';

import { useTranslations } from 'next-intl';
import type { HintLevel } from '@/types/hints';
import { MAX_HINT_LEVEL } from '@/types/hints';

interface HintButtonProps {
  currentLevel: HintLevel;
  onRequestHint: () => void;
  onReopenHints: () => void;
  onCloseHints: () => void;
  hasHints: boolean;
  isHintOpen: boolean;
  disabled?: boolean;
  isLoading?: boolean;
}

/**
 * HintButton Component
 *
 * A floating action button that allows users to request progressive hints.
 * The button is disabled when the maximum hint level is reached or when loading.
 *
 * @param currentLevel - The current hint level (0-4)
 * @param onRequestHint - Callback function when hint is requested
 * @param disabled - Whether the button should be disabled
 * @param isLoading - Whether a hint is currently being generated
 */
export function HintButton({
  currentLevel,
  onRequestHint,
  onReopenHints,
  onCloseHints,
  hasHints,
  isHintOpen,
  disabled = false,
  isLoading = false,
}: HintButtonProps) {
  const t = useTranslations('common.hints');

  const isMaxLevel = currentLevel >= MAX_HINT_LEVEL;
  const isDisabled = disabled || isLoading;

  // Determine button action and text
  const handleClick = () => {
    if (hasHints && !isHintOpen) {
      // Reopen hints if closed
      onReopenHints();
    } else if (isHintOpen && isMaxLevel) {
      // Close hints if open at max level
      onCloseHints();
    } else if (!isMaxLevel) {
      // Request new hint
      onRequestHint();
    }
  };

  const buttonText = isLoading
    ? t('loadingHint')
    : hasHints && !isHintOpen
    ? 'View hints'
    : isMaxLevel && isHintOpen
    ? 'Close hints'
    : isMaxLevel
    ? 'View hints'
    : t('needHint');

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled}
      className={`
        inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium
        transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${
          isDisabled
            ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
            : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-2 border-blue-500 hover:bg-blue-200 dark:hover:bg-blue-900/40 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md'
        }
      `}
      aria-label={hasHints && !isHintOpen ? 'View hints' : t('requestHint')}
      aria-busy={isLoading}
    >
      {/* Lightbulb icon */}
      <svg
        className={`w-5 h-5 ${isLoading ? 'animate-pulse' : ''}`}
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
      </svg>

      {/* Button text */}
      <span>{buttonText}</span>

      {/* Level indicator */}
      {hasHints && (
        <span className="text-xs opacity-75">
          ({currentLevel}/{MAX_HINT_LEVEL})
        </span>
      )}
    </button>
  );
}
