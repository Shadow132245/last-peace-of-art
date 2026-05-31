"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
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

function LocaleAnimation({ locale, children }: { locale: Locale; children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return <>{children}</>;

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        key={locale}
        initial={{ opacity: 0, x: locale === "ar" ? 20 : -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.15, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  useEffect(() => {
    const cookieLocale = getLocaleFromCookie();
    if (cookieLocale !== locale) {
      setLocaleState(cookieLocale);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    setLocaleCookie(next);
  }, []);

  const messages = messagesMap[locale];
  const t = useCallback((key: string) => lookup(messages as unknown as Record<string, string | Record<string, unknown>>, key), [messages]);

  return (
    <I18nContext.Provider value={{ locale, messages, setLocale, t }}>
      <div dir={locale === "ar" ? "rtl" : "ltr"}>
        <LocaleAnimation locale={locale}>{children}</LocaleAnimation>
      </div>
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
