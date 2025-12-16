import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import vi from '../locales/vi.json';
import en from '../locales/en.json';

type Lang = 'vi' | 'en';

type Dict = Record<string, any>;

const DICTS: Record<Lang, Dict> = { vi, en };

function get(obj: Dict, path: string): any {
  return path.split('.').reduce((acc, k) => (acc ? acc[k] : undefined), obj);
}

function format(str: string, params?: Record<string, string | number>) {
  if (!params) return str;
  return Object.entries(params).reduce((s, [k, v]) => s.replaceAll(`{${k}}`, String(v)), str);
}

interface I18nContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export const I18nProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLangState] = useState<Lang>('vi');

  useEffect(() => {
    const saved = localStorage.getItem('lang') as Lang | null;
    if (saved === 'vi' || saved === 'en') setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem('lang', l);
  };

  const t = useMemo(() => {
    return (key: string, params?: Record<string, string | number>) => {
      const val = get(DICTS[lang], key) as string | undefined;
      return val ? format(val, params) : key;
    };
  }, [lang]);

  const value: I18nContextValue = { lang, setLang, t };
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
};
