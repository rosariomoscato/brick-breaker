import { ImageResponse } from "next/og";
import { translations } from "@/lib/i18n";

export const alt = `${translations.it.title} — ${translations.it.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// ImageResponse cannot resolve CSS custom properties; these values mirror DESIGN.md tokens.
export default function Image() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", background: "#111519", color: "#f4ebd7", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", fontFamily: "monospace" }}>
      <div style={{ display: "flex", gap: 12, marginBottom: 70 }}>
        {["#eb695e", "#f29554", "#f7c868", "#a5c9a0", "#6eafb5"].map((color) => <div key={color} style={{ width: 120, height: 38, background: color }} />)}
      </div>
      <div style={{ fontSize: 82, fontWeight: 700, letterSpacing: -4 }}>{translations.en.title.toUpperCase()}</div>
      <div style={{ fontSize: 24, marginTop: 30, color: "#f6b45b", letterSpacing: 2 }}>{translations.en.tagline}</div>
      <div style={{ width: 180, height: 16, background: "#f4ebd7", marginTop: 90 }} />
    </div>,
    size,
  );
}
