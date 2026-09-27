import type { Metadata } from "next";
import { SystemScreen } from "@/components/system-screen";
import { translations } from "@/lib/i18n";

export const metadata: Metadata = {
  title: translations.it.systemTitle,
  description: "Come funziona Brick Breaker nel browser: controlli e stato del gioco.",
  alternates: { canonical: "/status" },
};

export default function StatusPage() {
  return <SystemScreen />;
}
