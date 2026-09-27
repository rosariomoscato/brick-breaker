"use client";

import Link from "next/link";
import { useEffect, useSyncExternalStore } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/components/use-locale";
import { translations } from "@/lib/i18n";

const subscribe = () => () => {};
const hasCanvas = () => Boolean(document.createElement("canvas").getContext("2d"));
const serverCanvas = () => null;

export function SystemScreen() {
  const [locale, setLocale] = useLocale();
  const canvasAvailable = useSyncExternalStore(subscribe, hasCanvas, serverCanvas);
  const t = translations[locale];

  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = `${t.systemTitle} | ${t.title}`;
  }, [locale, t.systemTitle, t.title]);

  const facts = [
    [t.systemGame, t.systemGameValue],
    [t.systemCanvas, canvasAvailable === null ? "—" : canvasAvailable ? t.systemCanvasYes : t.systemCanvasNo],
    [t.systemInput, t.systemInputValue],
    [t.systemStorage, t.systemStorageValue],
    [t.systemNetwork, t.systemNetworkValue],
    [t.systemActivity, t.systemActivityValue],
  ];

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[var(--content-width)] flex-col px-4 py-8 sm:px-8 sm:py-12">
      <header className="flex items-center justify-between border-b border-border pb-5">
        <Link href="/" className="font-heading text-[length:var(--text-arcade-label)] sm:text-xs">{t.title.toUpperCase()}</Link>
        <Button variant="outline" size="sm" onClick={() => setLocale(locale === "it" ? "en" : "it")} aria-label={`${t.languageLabel}: ${locale.toUpperCase()}. ${t.alternateLanguage}`}>{locale.toUpperCase()} / {locale === "it" ? "EN" : "IT"}</Button>
      </header>
      <div className="flex flex-1 flex-col justify-center gap-8 py-12">
        <div className="flex flex-col gap-5"><span className="text-xs tracking-[0.2em] text-primary">{t.eyebrow}</span><h1 className="font-heading text-xl leading-relaxed sm:text-3xl">{t.systemTitle}</h1><p className="text-sm text-muted-foreground">{t.systemIntro}</p></div>
        <dl className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2">
          {facts.map(([label, value]) => <div key={label} className="flex flex-col gap-2 bg-card p-5"><dt className="text-xs tracking-widest text-primary">{label}</dt><dd className="text-sm leading-relaxed text-foreground">{value}</dd></div>)}
        </dl>
        <Link href="/" className="inline-flex w-fit items-center gap-2 text-sm text-primary underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-ring"><ArrowLeft aria-hidden="true" className="size-4" />{t.back}</Link>
      </div>
    </main>
  );
}
