import type { Metadata } from "next";
import { Press_Start_2P, Space_Mono } from "next/font/google";
import { site, siteUrl } from "@/lib/site";
import { LocaleProvider } from "@/components/use-locale";
import "./globals.css";

const display = Press_Start_2P({ weight: "400", subsets: ["latin"], variable: "--font-display" });
const body = Space_Mono({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: site.name, template: `%s | ${site.name}` },
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: { type: "website", title: site.name, description: site.description, url: "/", locale: "it_IT", alternateLocale: ["en_US"] },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it" className={`${display.variable} ${body.variable} antialiased`}>
      <body><LocaleProvider>{children}</LocaleProvider></body>
    </html>
  );
}
