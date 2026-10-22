import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { registration } from "@/config/site";

type CtaProps = {
  /** Button label. Defaults to the configured primary CTA. */
  label?: string;
  variant?: "primary" | "secondary";
  size?: "md" | "lg";
  className?: string;
  /** Render the "link to be confirmed" caption beneath the button. */
  showPlaceholderNote?: boolean;
};

const base =
  "group inline-flex items-center justify-center gap-2 min-h-11 max-w-full text-center rounded-full font-semibold " +
  "transition-[transform,background-color,border-color,color,box-shadow] duration-300 " +
  "ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-0.5 active:translate-y-0";

const variants = {
  // amber is light, so the label sits in logo navy rather than white
  primary:
    "bg-accent text-on-accent hover:bg-accent-bright hover:shadow-[0_12px_40px_-8px_var(--color-accent)]",
  secondary:
    "border border-line-strong text-cream hover:border-cream/50 hover:bg-cream/5",
} as const;

const sizes = {
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
} as const;

/**
 * Every registration CTA on the page routes through here.
 *
 * While `registration.isPlaceholder` is true there is no real destination, so
 * the button scrolls to the event information block instead of inventing a URL.
 * Set `registration.url` and flip `isPlaceholder` to false in config/site.ts
 * and every CTA switches over at once.
 */
export function RegisterCta({
  label,
  variant = "primary",
  size = "lg",
  className = "",
  showPlaceholderNote = false,
}: CtaProps) {
  const text = registration.isPlaceholder ? "View event details" : label ?? registration.ctaPrimary;
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  const isExternal = !registration.isPlaceholder && registration.url !== null;
  const href = isExternal ? registration.url! : registration.fallbackAnchor;

  const button = isExternal ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={classes}
    >
      {text}
      <ArrowRight
        aria-hidden="true"
        className="size-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
      />
    </a>
  ) : (
    <Link href={href} className={classes}>
      {text}
      <ArrowRight
        aria-hidden="true"
        className="size-4 transition-transform duration-300 group-hover:translate-x-1"
      />
    </Link>
  );

  if (!showPlaceholderNote || !registration.isPlaceholder) return button;

  return (
    <span className="inline-flex flex-col items-start gap-2">
      {button}
      <span className="text-cream-faint text-xs">
        {registration.placeholderNote}
      </span>
    </span>
  );
}

/** Non-registration link styled as a secondary button. */
export function AnchorCta({
  href,
  label,
  size = "lg",
  className = "",
}: {
  href: string;
  label: string;
  size?: "md" | "lg";
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`${base} ${variants.secondary} ${sizes[size]} ${className}`}
    >
      {label}
    </Link>
  );
}
