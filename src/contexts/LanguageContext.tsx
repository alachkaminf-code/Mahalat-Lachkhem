import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import type { Language } from '../types';

interface LanguageContextValue {
  language: Language;
  dir: 'rtl' | 'ltr';
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const STORAGE_KEY = 'lachkhem_lang';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation();
  const [language, setLang] = useState<Language>(
    (typeof localStorage !== 'undefined' && (localStorage.getItem(STORAGE_KEY) as Language)) || 'ar'
  );

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    i18n.changeLanguage(language);
    localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
  }, [language, dir, i18n]);

  const setLanguage = (lang: Language) => setLang(lang);
  const toggleLanguage = () => setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));

  return (
    <LanguageContext.Provider value={{ language, dir, toggleLanguage, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
