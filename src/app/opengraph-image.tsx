import { ImageResponse } from "next/og";
import { brand, event } from "@/config/site";

export const alt = "FSP Catalyst Connect 3.0 — Connect. Learn. Share. Grow.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", height: "100%", padding: "64px 72px", background: "linear-gradient(135deg, #0f1940, #080d20)", color: "#f7f3ed", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", color: "#faa81c", fontSize: 28 }}>{brand.eventFull}</div>
      <div style={{ display: "flex", flexDirection: "column", fontSize: 76, fontWeight: 700, letterSpacing: -3, lineHeight: 1.1 }}>
        <span>Your Growth Is Not</span>
        <span style={{ color: "#faa81c" }}>a Solo Journey.</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 25, color: "#c3c9da", borderTop: "1px solid #ffffff30", paddingTop: 28 }}>
        <span>{event.dateLabel} · {event.city}</span>
        <span>{brand.tagline}</span>
      </div>
    </div>,
    size,
  );
}
