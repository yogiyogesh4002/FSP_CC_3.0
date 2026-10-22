import type { ReactNode } from "react";
import { Backdrop } from "./Backdrop";

/** Consistent page gutter + max width for every section. */
export function Container({
  children,
  className = "",
  size = "default",
}: {
  children: ReactNode;
  className?: string;
  size?: "default" | "narrow" | "wide";
}) {
  const widths = {
    narrow: "max-w-3xl",
    default: "max-w-6xl",
    wide: "max-w-7xl",
  } as const;

  return (
    <div className={`mx-auto w-full ${widths[size]} px-5 sm:px-8 lg:px-10 ${className}`}>
      {children}
    </div>
  );
}

/** Semantic section with the shared vertical rhythm. */
export function Section({
  id,
  children,
  className = "",
  labelledBy,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  labelledBy?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={`page-panel relative isolate py-16 sm:py-20 lg:py-24 ${className}`}
    >
      <Backdrop />
      {children}
    </section>
  );
}

/** Small uppercase section label with a leading accent rule. */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-cream-dim flex items-center gap-3 text-xs font-semibold tracking-[0.1em] uppercase">
      <span aria-hidden="true" className="bg-accent h-px w-8" />
      {children}
    </p>
  );
}
