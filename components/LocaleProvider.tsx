"use client";

import { createContext, useContext } from "react";
import { DEFAULT_LOCALE, type Locale, type MsgKey, t as translate } from "@/lib/i18n";

const LocaleCtx = createContext<Locale>(DEFAULT_LOCALE);

export function LocaleProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return <LocaleCtx.Provider value={locale}>{children}</LocaleCtx.Provider>;
}

export function useLocale(): Locale {
  return useContext(LocaleCtx);
}

export function useT() {
  const locale = useContext(LocaleCtx);
  return (key: MsgKey, vars?: Record<string, string | number>) => translate(locale, key, vars);
}
