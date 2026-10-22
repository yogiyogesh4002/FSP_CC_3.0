import { ImageIcon } from "lucide-react";

type PhotoPlaceholderProps = {
  /** What should eventually go here, e.g. "Catalyst Connect, August 2026". */
  caption: string;
  /** CSS aspect-ratio value, e.g. "4 / 5". Reserves space to avoid layout shift. */
  ratio?: string;
  className?: string;
};

/**
 * A deliberately labelled stand-in for real FSP event photography.
 *
 * The brief forbids presenting stock imagery as genuine FSP event photos, and
 * no real photographs were supplied, so every image slot renders this instead.
 * Add real files to the config (`pastEdition.photos`, `speaker.portrait`) and
 * the components swap to <Image> automatically.
 */
export function PhotoPlaceholder({
  caption,
  ratio = "4 / 3",
  className = "",
}: PhotoPlaceholderProps) {
  return (
    <div
      role="img"
      aria-label={`Image placeholder: ${caption}`}
      style={{ aspectRatio: ratio }}
      className={`border-line bg-surface-2 relative flex w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border border-dashed p-6 text-center ${className}`}
    >
      {/* subtle accent wash so the slot still reads as designed space */}
      <div
        aria-hidden="true"
        className="from-accent/10 pointer-events-none absolute inset-0 bg-gradient-to-br via-transparent to-transparent"
      />
      <ImageIcon aria-hidden="true" className="text-cream-faint size-6" />
      <p className="text-cream-dim relative text-sm font-medium">{caption}</p>
      <p className="text-cream-faint relative text-xs">
        Photo placeholder — awaiting real FSP event photography
      </p>
    </div>
  );
}
