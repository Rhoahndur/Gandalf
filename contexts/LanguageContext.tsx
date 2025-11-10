'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { Language, DEFAULT_LANGUAGE } from '@/types/language';
import { loadLanguagePreference, saveLanguagePreference } from '@/utils/storageManager';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE);
  const [messages, setMessages] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Load language preference from localStorage on mount
    const savedLanguage = loadLanguagePreference();
    setLanguageState(savedLanguage);

    // Load translation messages for the saved language
    loadMessages(savedLanguage);
    setMounted(true);
  }, []);

  const loadMessages = async (lang: Language) => {
    try {
      const [common, settings] = await Promise.all([
        import(`@/locales/${lang}/common.json`),
        import(`@/locales/${lang}/settings.json`)
      ]);

      setMessages({
        common: common.default,
        settings: settings.default
      });
    } catch (error) {
      console.error(`Failed to load messages for language: ${lang}`, error);
      // Fallback to English if loading fails
      if (lang !== 'en') {
        loadMessages('en');
      }
    }
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    saveLanguagePreference(lang);
    loadMessages(lang);
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted || !messages) {
    return null;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      <NextIntlClientProvider key={language} locale={language} messages={messages}>
        {children}
      </NextIntlClientProvider>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
