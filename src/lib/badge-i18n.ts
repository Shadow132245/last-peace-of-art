export function i18nBadge(val: string, lang: "ar" | "en"): string {
  const i = val.indexOf("||");
  if (i === -1) return val;
  return lang === "ar" ? val.slice(i + 2) : val.slice(0, i);
}
