"use client";

import { useEffect, useState } from "react";
import { event } from "@/config/site";
import { RegisterCta } from "./ui/Cta";

/**
 * Mobile-only sticky registration bar.
 *
 * Appears once the hero has scrolled away and hides again over the final CTA,
 * so the two never compete. Hidden entirely on tablet and desktop, where the
 * header CTA is always visible.
 */
export function StickyCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const past = window.scrollY > window.innerHeight * 0.85;

      // suppress while the closing CTA section is on screen
      const finalCta = document.getElementById("register");
      let overlapping = false;
      if (finalCta) {
        const rect = finalCta.getBoundingClientRect();
        overlapping = rect.top < window.innerHeight && rect.bottom > 0;
      }

      setVisible(past && !overlapping);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      className={`border-line bg-ink/95 fixed inset-x-0 bottom-0 z-40 border-t px-4 py-3 backdrop-blur-xl transition-transform duration-400 ease-[cubic-bezier(.22,1,.36,1)] sm:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      // keep it out of the tab order and off screen readers while hidden
      aria-hidden={!visible}
      inert={!visible}
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="hidden min-w-0 min-[360px]:block">
          <p className="text-cream truncate text-sm font-semibold">
            Catalyst Connect 3.0
          </p>
          <p className="text-cream-faint truncate text-xs">
            {event.dateLabel} · {event.city}
          </p>
        </div>
        <RegisterCta size="md" className="w-full shrink-0 min-[360px]:w-auto" />
      </div>
    </div>
  );
}
