import "server-only";
import { cookies } from "next/headers";
import { defaultLocale, type Locale, lookup } from "./i18n";
import en from "../../messages/en.json";
import ar from "../../messages/ar.json";

const allMessages = { en, ar } as const;

export async function getServerT() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || defaultLocale;
  const messages = allMessages[locale];
  return {
    locale,
    t: (key: string) => lookup(messages as unknown as Record<string, string | Record<string, unknown>>, key),
  };
}
