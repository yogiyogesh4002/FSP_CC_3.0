import type { CSSProperties, ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** Stagger offset in seconds. */
  delay?: number;
  /** Travel distance in px before settling. */
  y?: number;
  className?: string;
  as?: "div" | "section" | "li" | "span";
};

/**
 * Progressive enhancement: content is visible before JavaScript loads and
 * remains visible with reduced motion. Animation never gates page content.
 */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  as = "div",
}: RevealProps) {
  const Tag = as;
  return (
    <Tag
      className={`reveal-content ${className ?? ""}`}
      style={{ animationDelay: `${delay}s`, "--reveal-y": `${y}px` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
