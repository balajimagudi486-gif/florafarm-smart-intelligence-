// FloraFarm — Language Context
import React, { createContext, useContext, useState, useCallback } from 'react';
import en from '../i18n/en';
import ta from '../i18n/ta';
import type { Language } from '../types';

type Translations = typeof en;

interface LanguageContextType {
  language: Language;
  t: Translations;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  t: en,
  setLanguage: () => {},
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLangState] = useState<Language>(() => {
    const stored = localStorage.getItem('flora_lang');
    return (stored === 'ta' ? 'ta' : 'en') as Language;
  });

  const t = language === 'ta' ? ta : en;

  const setLanguage = useCallback((lang: Language) => {
    setLangState(lang);
    localStorage.setItem('flora_lang', lang);
  }, []);

  return (
    <LanguageContext.Provider value={{ language, t, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

