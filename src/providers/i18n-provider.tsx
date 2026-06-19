"use client";

import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from "react";
import { type Locale, defaultLocale, getLocaleFromCookie, setLocaleCookie, lookup } from "@/lib/i18n";
import en from "../../messages/en.json";
import ar from "../../messages/ar.json";

const messagesMap = { en, ar } as const;

type Messages = typeof en;

interface I18nContextValue {
  locale: Locale;
  messages: Messages;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [tick, setTick] = useState(0);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const cookieLocale = getLocaleFromCookie();
    if (cookieLocale !== locale) {
      setLocaleState(cookieLocale);
      setTick((t) => t + 1);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    setLocaleCookie(next);
    setTick((t) => t + 1);
  }, []);

  const messages = messagesMap[locale];
  const t = useCallback((key: string) => lookup(messages as unknown as Record<string, string | Record<string, unknown>>, key), [messages]);

  return (
    <I18nContext.Provider value={{ locale, messages, setLocale, t }}>
      <div key={tick} dir={locale === "ar" ? "rtl" : "ltr"}>
        {children}
      </div>
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
