'use client';

import { useTranslations } from 'next-intl';
import { DarkModeToggle } from '@/components/settings/DarkModeToggle';

interface HeaderProps {
  onToggleSidebar: () => void;
  conversationTitle: string;
  onOpenSettings?: () => void;
  onNewChat?: () => void;
  onShowShortcuts?: () => void;
  onToggleMathKeyboard?: () => void;
  showMathKeyboard?: boolean;
  onToggleWhiteboard?: () => void;
  showWhiteboard?: boolean;
}

export function Header({ onToggleSidebar, conversationTitle, onOpenSettings, onNewChat, onShowShortcuts, onToggleMathKeyboard, showMathKeyboard, onToggleWhiteboard, showWhiteboard }: HeaderProps) {
  const t = useTranslations('common.header');
  return (
    <header className="sticky top-0 z-10 px-4 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md transition-colors duration-200">
      <div className="flex items-center gap-2 sm:gap-3 max-w-7xl mx-auto">
        {/* History Button - Left Side */}
        <button
          onClick={onToggleSidebar}
          className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 hover:scale-105 active:scale-95 border border-gray-300 dark:border-gray-600"
          aria-label={t('historyAriaLabel')}
          title={`${t('history')} (Ctrl/Cmd+H)`}
        >
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">📜 {t('history')}</span>
        </button>

        {/* Title Section */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {/* Logo/Icon */}
            <div className="hidden sm:flex w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg items-center justify-center flex-shrink-0 shadow-sm">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>

            {/* Title and subtitle */}
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white truncate">
                {t('appTitle')} <span className="text-gray-500 dark:text-gray-400 font-normal">({t('appSubtitle')})</span>
              </h1>
              {conversationTitle && conversationTitle !== 'New Conversation' && (
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate animate-in fade-in slide-in-from-top-1 duration-300">
                  {conversationTitle}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* New Chat Button */}
        {onNewChat && (
          <button
            onClick={onNewChat}
            className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 hover:scale-105 active:scale-95 border border-gray-300 dark:border-gray-600"
            aria-label={t('newChatAriaLabel')}
            title={`${t('newChat')} (Ctrl/Cmd+N)`}
          >
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">➕ {t('newChat')}</span>
          </button>
        )}

        {/* Math Symbols Toggle Button */}
        {onToggleMathKeyboard && (
          <button
            onClick={onToggleMathKeyboard}
            className={`px-3 py-2 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 hover:scale-105 active:scale-95 border ${
              showMathKeyboard
                ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-500 dark:border-blue-600'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800 border-gray-300 dark:border-gray-600'
            }`}
            aria-label={showMathKeyboard ? t('mathKeyboardHide') : t('mathKeyboardShow')}
            aria-pressed={showMathKeyboard}
            title={showMathKeyboard ? t('mathKeyboardHide') : t('mathKeyboardShow')}
          >
            <span className={`text-sm font-medium ${
              showMathKeyboard
                ? 'text-blue-700 dark:text-blue-400'
                : 'text-gray-700 dark:text-gray-300'
            }`}>∑ {t('mathKeyboard')}</span>
          </button>
        )}

        {/* Whiteboard Toggle Button */}
        {onToggleWhiteboard && (
          <button
            onClick={onToggleWhiteboard}
            className={`px-3 py-2 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 hover:scale-105 active:scale-95 border ${
              showWhiteboard
                ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-500 dark:border-blue-600'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800 border-gray-300 dark:border-gray-600'
            }`}
            aria-label={showWhiteboard ? 'Hide Whiteboard' : 'Show Whiteboard'}
            aria-pressed={showWhiteboard}
            title="Toggle Whiteboard (Ctrl/Cmd+B)"
          >
            <svg
              className={`w-5 h-5 ${
                showWhiteboard
                  ? 'text-blue-700 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </button>
        )}

        {/* Dark Mode Toggle */}
        <DarkModeToggle />

        {/* Keyboard Shortcuts Button */}
        {onShowShortcuts && (
          <button
            onClick={onShowShortcuts}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 hover:scale-105 active:scale-95 border border-gray-300 dark:border-gray-600"
            aria-label={t('shortcutsAriaLabel')}
            title={t('shortcutsTitle')}
          >
            <svg
              className="w-5 h-5 text-gray-700 dark:text-gray-300"
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
          </button>
        )}

        {/* Settings Button */}
        {onOpenSettings && (
          <button
            onClick={onOpenSettings}
            className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 hover:scale-105 active:scale-95 border border-gray-300 dark:border-gray-600"
            aria-label={t('settingsAriaLabel')}
            title={t('settings')}
          >
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">⚙️ {t('settings')}</span>
          </button>
        )}
      </div>
    </header>
  );
}
