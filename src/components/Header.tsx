"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { brand } from "@/config/site";
import { RegisterCta } from "./ui/Cta";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-line bg-ink/80 border-b backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between gap-6 px-5 sm:px-8 lg:px-10">
        <Link
          href="#top"
          className="flex shrink-0 items-center"
          aria-label={`${brand.eventFull} — home`}
        >
          <Image
            src={brand.logo.src}
            alt={brand.logo.alt}
            width={brand.logo.width}
            height={brand.logo.height}
            priority
            sizes="(max-width: 640px) 78px, 95px"
            /* stacked lockup (1.6:1) — needs more height than a wordmark */
            className={`h-12 w-auto sm:h-14 ${
              brand.logo.needsReversing ? "opacity-90 brightness-0 invert" : ""
            }`}
          />
        </Link>

        <div className="flex items-center gap-3">
          {/* wrapper owns the responsive display so it cannot collide with the
              button's own `inline-flex` base class */}
          <span className="hidden sm:block">
            <RegisterCta size="md" />
          </span>
        </div>
      </div>

    </header>
  );
}
