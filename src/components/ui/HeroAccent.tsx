"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * The hero's single animated flourish: a slow orange arc drifting behind the
 * image card. Decorative only, and held completely still when the visitor
 * prefers reduced motion.
 */
export function HeroAccent() {
  const reduced = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -inset-8 -z-10 overflow-hidden rounded-[2.5rem]"
    >
      <motion.div
        className="absolute top-1/2 left-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-45 blur-2xl"
        style={{
          background:
            "conic-gradient(from 0deg, transparent 0deg, var(--color-accent) 70deg, transparent 180deg, transparent 360deg)",
        }}
        animate={reduced ? undefined : { rotate: 360 }}
        transition={
          reduced
            ? undefined
            : { duration: 28, repeat: Infinity, ease: "linear" }
        }
      />
      <div className="bg-ink/55 absolute inset-0 rounded-[2.5rem]" />
    </div>
  );
}
