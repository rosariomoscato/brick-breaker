"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ArrowUpRight, CircleHelp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GameBoard } from "@/components/game-board";
import { useLocale } from "@/components/use-locale";
import { translations } from "@/lib/i18n";

export function GameScreen() {
  const [locale, setLocale] = useLocale();
  const t = translations[locale];

  useEffect(() => { document.documentElement.lang = locale; document.title = t.title; }, [locale, t.title]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[var(--content-width)] flex-col px-4 pb-8 pt-6 sm:px-8 sm:pt-10">
      <header className="flex items-center justify-between gap-4 border-b border-border pb-5">
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="grid grid-cols-2 gap-1"><i className="size-2.5 bg-brick-red" /><i className="size-2.5 bg-brick-orange" /><i className="size-2.5 bg-brick-yellow" /><i className="size-2.5 bg-brick-blue" /></span>
          <span className="font-heading text-[length:var(--text-arcade-label)] tracking-tight sm:text-xs">{t.title.toUpperCase()}</span>
        </div>
        <Button variant="outline" size="sm" onClick={() => setLocale(locale === "it" ? "en" : "it")} aria-label={`${t.languageLabel}: ${locale.toUpperCase()}. ${t.alternateLanguage}`}>
          {locale.toUpperCase()} <span aria-hidden="true" className="text-muted-foreground">/</span> {locale === "it" ? "EN" : "IT"}
        </Button>
      </header>

      <div className="flex flex-1 flex-col justify-center gap-7 py-8 sm:gap-9 sm:py-12">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 text-xs tracking-[0.2em] text-primary"><span aria-hidden="true" className="h-px w-8 bg-primary" />{t.eyebrow}</div>
          <h1 className="font-heading text-[length:var(--text-arcade-hero)] leading-[1.5] tracking-tight">{t.title}</h1>
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">{t.tagline}</p>
        </div>

        <GameBoard locale={locale} />

        <div className="grid gap-5 border-t border-border pt-6 sm:grid-cols-[1fr_auto] sm:items-end">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-xs font-bold tracking-[0.13em] text-primary"><CircleHelp aria-hidden="true" className="size-4" />{t.instructions}</div>
            <p className="max-w-2xl text-xs leading-6 text-muted-foreground sm:text-sm">{t.desktopControls} {t.touchControls}</p>
          </div>
          <p className="text-xs text-muted-foreground">{t.mission}</p>
        </div>
      </div>

      <footer className="flex flex-col justify-between gap-4 border-t border-border pt-5 text-xs leading-relaxed text-muted-foreground sm:flex-row sm:items-center">
        <p>{t.creditBefore} <a href="https://rosmoscato.xyz" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">Rosario Moscato <ArrowUpRight aria-hidden="true" className="size-3" /></a></p>
        <Link href="/status" className="text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">{t.statusLink}</Link>
      </footer>
    </main>
  );
}
