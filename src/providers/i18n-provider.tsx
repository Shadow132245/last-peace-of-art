"use client";

import { useState, useEffect, useRef, useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { type Locale, defaultLocale, getLocaleFromCookie, setLocaleCookie, lookup } from "@/lib/i18n";
import en from "../../messages/en.json";
import ar from "../../messages/ar.json";

const messagesMap = { en, ar } as const;

// --- Module-level store (no React involved) ---
let currentLocale: Locale = defaultLocale;
const listeners = new Set<() => void>();

// Initialize from cookie immediately (before any component mounts)
if (typeof window !== "undefined") {
  const cookieLocale = getLocaleFromCookie();
  if (cookieLocale !== defaultLocale) {
    currentLocale = cookieLocale;
  }
}

function notify() {
  listeners.forEach((fn) => fn());
}

function setLocaleInStore(next: Locale) {
  currentLocale = next;
  setLocaleCookie(next);
  notify();
}

function getT(): (key: string) => string {
  const messages = messagesMap[currentLocale];
  return (key: string) => lookup(messages, key);
}

// --- Provider ---
export function I18nProvider({ children, locale: serverLocale }: { children: ReactNode; locale?: Locale }) {
  // On server, use the server-provided locale so dir matches hydration
  if (serverLocale && typeof window === "undefined") {
    currentLocale = serverLocale;
  }

  const [, forceUpdate] = useState(0);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const refreshRef = useRef(router.refresh);
  refreshRef.current = router.refresh;

  // Subscribe to locale changes
  useEffect(() => {
    const listener = () => {
      forceUpdate((n) => n + 1);
      startTransition(() => {
        refreshRef.current();
      });
    };
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  }, []);

  const dir = currentLocale === "ar" ? "rtl" : "ltr";

  return (
    <>
      <LoadingOverlay visible={isPending} />
      <div dir={dir}>
        {children}
      </div>
    </>
  );
}

// --- Hook ---
export function useI18n() {
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const listener = () => forceUpdate((n) => n + 1);
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  }, []);

  return {
    locale: currentLocale,
    setLocale: setLocaleInStore,
    t: getT(),
  };
}

// --- Loading overlay while locale transitions ---
function LoadingOverlay({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="locale-loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-white dark:bg-zinc-950"
        >
          <motion.div
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
            className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100"
          >
            Last Peace
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
