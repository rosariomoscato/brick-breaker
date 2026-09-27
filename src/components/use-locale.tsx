"use client";

import { createContext, useContext, useState, useSyncExternalStore } from "react";
import type { Locale } from "@/lib/i18n";

const subscribe = () => () => {};
const browserLocale = (): Locale => navigator.language.toLowerCase().startsWith("it") ? "it" : "en";
const serverLocale = (): Locale => "it";
const LocaleContext = createContext<readonly [Locale, (locale: Locale) => void] | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const detected = useSyncExternalStore(subscribe, browserLocale, serverLocale);
  const [chosen, setChosen] = useState<Locale | null>(null);
  return <LocaleContext.Provider value={[chosen ?? detected, setChosen]}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("LocaleProvider is missing");
  return context;
}
