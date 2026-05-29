export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export function getLocaleFromCookie(): Locale {
  if (typeof window === "undefined") return defaultLocale;
  const match = document.cookie.match(/(?:^|;\s*)locale=([^;]*)/);
  const value = match?.[1];
  if (value && (locales as readonly string[]).includes(value)) return value as Locale;
  return defaultLocale;
}

export function setLocaleCookie(locale: Locale) {
  document.cookie = `locale=${locale};path=/;max-age=${60 * 60 * 24 * 365};SameSite=Lax`;
}

type Messages = Record<string, string | Record<string, unknown>>;

export function lookup(obj: Messages, path: string): string {
  const keys = path.split(".");
  let current: unknown = obj;
  for (const key of keys) {
    if (current && typeof current === "object" && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return path;
    }
  }
  return typeof current === "string" ? current : path;
}
