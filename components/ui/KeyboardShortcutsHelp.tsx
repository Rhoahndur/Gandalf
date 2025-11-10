'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { getModifierKey, isMac } from '@/hooks/useKeyboardShortcuts';

interface KeyboardShortcutsHelpProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ShortcutDisplay {
  keys: string[];
  description: string;
  category?: string;
}

export function KeyboardShortcutsHelp({ isOpen, onClose }: KeyboardShortcutsHelpProps) {
  const t = useTranslations('common.keyboardShortcuts');
  const modKey = getModifierKey();

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const shortcuts: ShortcutDisplay[] = [
    {
      keys: [modKey, 'Enter'],
      description: t('sendMessage'),
      category: t('categoryChat'),
    },
    {
      keys: [modKey, 'N'],
      description: t('startNewChat'),
      category: t('categoryChat'),
    },
    {
      keys: [modKey, 'H'],
      description: t('toggleHistorySidebar'),
      category: t('categoryNavigation'),
    },
    {
      keys: ['Escape'],
      description: t('closeModals'),
      category: t('categoryNavigation'),
    },
    {
      keys: [modKey, '/'],
      description: t('showHelp'),
      category: t('categoryHelp'),
    },
    {
      keys: ['Enter'],
      description: t('sendMessageInInput'),
      category: t('categoryChat'),
    },
    {
      keys: ['Shift', 'Enter'],
      description: t('newLineInInput'),
      category: t('categoryChat'),
    },
    {
      keys: [modKey, 'V'],
      description: t('pasteImages'),
      category: t('categoryChat'),
    },
    {
      keys: [modKey, 'M'],
      description: t('toggleMicrophone'),
      category: t('categoryVoice'),
    },
    {
      keys: [modKey, 'Ctrl', 'Shift', 'R'],
      description: t('readLastMessage'),
      category: t('categoryVoice'),
    },
    {
      keys: ['Escape'],
      description: t('stopRecordingSpeaking'),
      category: t('categoryVoice'),
    },
  ];

  // Group shortcuts by category
  const categories = Array.from(new Set(shortcuts.map(s => s.category || 'Other')));

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortcuts-title"
      >
        <div
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden pointer-events-auto animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 border-2 border-gray-200 dark:border-gray-700"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                    />
                  </svg>
                </div>
                <div>
                  <h2
                    id="shortcuts-title"
                    className="text-xl font-bold text-gray-900 dark:text-white"
                  >
                    {t('title')}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t('subtitle')}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 hover:scale-105 active:scale-95"
                aria-label={t('closeAriaLabel')}
              >
                <svg
                  className="w-6 h-6 text-gray-600 dark:text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
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
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(80vh-120px)] p-6">
            {categories.map((category) => {
              const categoryShortcuts = shortcuts.filter(s => (s.category || 'Other') === category);

              return (
                <div key={category} className="mb-6 last:mb-0">
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                    {category}
                  </h3>
                  <div className="space-y-2">
                    {categoryShortcuts.map((shortcut, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-200 group"
                      >
                        <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                          {shortcut.description}
                        </span>
                        <div className="flex items-center gap-1">
                          {shortcut.keys.map((key, keyIndex) => (
                            <span key={keyIndex} className="flex items-center gap-1">
                              <kbd className="px-2.5 py-1.5 bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 rounded-md text-xs font-semibold text-gray-800 dark:text-gray-200 shadow-sm min-w-[2rem] text-center">
                                {key}
                              </kbd>
                              {keyIndex < shortcut.keys.length - 1 && (
                                <span className="text-gray-400 dark:text-gray-500 text-xs font-medium">
                                  +
                                </span>
                              )}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="space-y-3">
              {/* File Upload Info */}
              <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm">
                  <p className="font-medium text-blue-900 dark:text-blue-300 mb-1">{t('imageUploadTitle')}</p>
                  <p className="text-blue-700 dark:text-blue-400">
                    {t('imageUploadFormats')} <span className="font-mono">JPG, PNG, WebP</span> {t('imageUploadMaxSize')}
                  </p>
                  <p className="text-blue-700 dark:text-blue-400 mt-1">
                    {t('imageUploadInstructions', { modKey })}
                  </p>
                </div>
              </div>

              {/* Platform and close info */}
              <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>
                    {t('platformEnabled', { platform: isMac() ? t('platformMac') : t('platformOther') })}
                  </span>
                </div>
                <span>
                  {t('pressEscToClose')} <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs font-mono">Esc</kbd> {t('toClose')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
