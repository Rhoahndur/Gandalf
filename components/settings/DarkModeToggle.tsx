'use client';

import { useEffect, useState } from 'react';

export function DarkModeToggle() {
  const [isDark, setIsDark] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  // Apply theme to document
  const applyTheme = (dark: boolean) => {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Initialize dark mode from localStorage or system preference
  useEffect(() => {
    setMounted(true);

    // Migrate old localStorage key to new format
    const oldTheme = localStorage.getItem('theme');
    if (oldTheme && !localStorage.getItem('theme-preference')) {
      if (oldTheme === 'dark') {
        localStorage.setItem('theme-preference', 'user-dark');
      } else if (oldTheme === 'light') {
        localStorage.setItem('theme-preference', 'user-light');
      }
      localStorage.removeItem('theme'); // Clean up old key
    }

    // Check localStorage for user preference
    const storedPreference = localStorage.getItem('theme-preference');

    if (storedPreference === 'user-dark') {
      // User manually set dark mode
      setIsDark(true);
      applyTheme(true);
    } else if (storedPreference === 'user-light') {
      // User manually set light mode
      setIsDark(false);
      applyTheme(false);
    } else {
      // No manual preference - use system preference
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const prefersDark = mediaQuery.matches;
      setIsDark(prefersDark);
      applyTheme(prefersDark);

      // Listen for system theme changes (only if no manual preference)
      const handleSystemThemeChange = (e: MediaQueryListEvent) => {
        // Only update if user hasn't set a manual preference
        const currentPreference = localStorage.getItem('theme-preference');
        if (!currentPreference || currentPreference === 'system') {
          setIsDark(e.matches);
          applyTheme(e.matches);
        }
      };

      mediaQuery.addEventListener('change', handleSystemThemeChange);

      // Cleanup listener on unmount
      return () => {
        mediaQuery.removeEventListener('change', handleSystemThemeChange);
      };
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    applyTheme(newIsDark);

    // Save as user preference (not system preference)
    if (newIsDark) {
      localStorage.setItem('theme-preference', 'user-dark');
    } else {
      localStorage.setItem('theme-preference', 'user-light');
    }
  };

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 hover:scale-105 active:scale-95"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDark}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{ minWidth: '44px', minHeight: '44px' }}
    >
      {!mounted ? (
        // Show a placeholder while loading to prevent flash
        <div className="w-5 h-5 sm:w-6 sm:h-6" />
      ) : isDark ? (
        // Sun icon - shows when in dark mode (click to go light)
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
        </svg>
      ) : (
        // Moon icon - shows when in light mode (click to go dark)
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 dark:text-gray-300"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
        </svg>
      )}
    </button>
  );
}
