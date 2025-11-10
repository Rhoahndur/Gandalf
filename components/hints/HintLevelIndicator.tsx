'use client';

import { useTranslations } from 'next-intl';
import type { HintLevel } from '@/types/hints';
import { MAX_HINT_LEVEL } from '@/types/hints';

interface HintLevelIndicatorProps {
  currentLevel: HintLevel;
  showLevelName?: boolean;
}

/**
 * HintLevelIndicator Component
 *
 * Displays the current hint level as a visual progress indicator
 * with dots representing each level. Optionally shows the level name.
 *
 * @param currentLevel - The current hint level (0-4)
 * @param showLevelName - Whether to display the level name text
 */
export function HintLevelIndicator({
  currentLevel,
  showLevelName = false,
}: HintLevelIndicatorProps) {
  const t = useTranslations('common.hints');

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
        {t('hintLevel')}:
      </span>

      {/* Dot indicators */}
      <div className="flex gap-1" role="progressbar" aria-valuenow={currentLevel} aria-valuemin={0} aria-valuemax={MAX_HINT_LEVEL}>
        {Array.from({ length: MAX_HINT_LEVEL + 1 }).map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i <= currentLevel
                ? 'bg-blue-500 scale-110'
                : 'bg-gray-300 dark:bg-gray-600'
            }`}
            aria-label={`Level ${i}${i <= currentLevel ? ' completed' : ''}`}
          />
        ))}
      </div>

      {/* Numeric indicator */}
      <span className="text-xs text-gray-500 dark:text-gray-400">
        {currentLevel}/{MAX_HINT_LEVEL}
      </span>

      {/* Optional level name */}
      {showLevelName && (
        <span className="text-xs font-medium text-blue-600 dark:text-blue-400 ml-1">
          ({t(`levelNames.${currentLevel}`)})
        </span>
      )}
    </div>
  );
}
