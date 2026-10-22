import { Handshake, Lightbulb, TrendingUp, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { experience } from "@/config/site";
import { Container, Eyebrow, Section } from "../ui/Section";
import { Reveal } from "../ui/Reveal";

const icons: Record<string, LucideIcon> = {
  Users,
  Lightbulb,
  Handshake,
  TrendingUp,
};

/**
 * Asymmetric bento grid.
 *
 * Desktop runs on a 6-column grid: 4+2 on the first row, 2+4 on the second,
 * so no two adjacent cards share a width. Each card keeps the same spacing,
 * radius and type scale but gets its own surface treatment.
 */
const layout = [
  "lg:col-span-4",
  "lg:col-span-2",
  "lg:col-span-2",
  "lg:col-span-4",
] as const;

const surfaces = [
  // 1 — feature card, accent wash
  "bg-gradient-to-br from-[color-mix(in_oklab,var(--color-accent)_16%,var(--color-surface-2))] to-surface-2 border-[color-mix(in_oklab,var(--color-accent)_28%,transparent)]",
  // 2 — plain raised surface
  "bg-surface-2 border-line",
  // 3 — outlined, lighter fill
  "bg-surface/60 border-line-strong",
  // 4 — deep card with a glow pool
  "bg-ink-deep border-line",
] as const;

export function Experience() {
  return (
    <Section id="experience" labelledBy="experience-heading">
      <Container size="wide">
        <div className="max-w-2xl">
          <Reveal>
            <Eyebrow>{experience.eyebrow}</Eyebrow>
          </Reveal>
          <Reveal delay={0.06}>
            <h2
              id="experience-heading"
              className="mt-6 text-[length:var(--text-headline)] leading-[var(--text-headline--line-height)] font-semibold tracking-[var(--text-headline--letter-spacing)]"
            >
              What the Day Is{" "}
              <span className="accent-serif text-accent">Built Around.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="text-cream-dim mt-5 type-body">
              {experience.intro}
            </p>
          </Reveal>
        </div>

        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {experience.cards.map((card, i) => {
            const Icon = icons[card.icon] ?? Users;

            return (
              <Reveal
                as="li"
                key={card.id}
                delay={i * 0.08}
                className={layout[i]}
              >
                <article
                  className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border p-7 transition-[transform,box-shadow,border-color] duration-500 ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-1.5 hover:shadow-[0_24px_60px_-20px_rgba(0,0,0,0.8)] sm:p-9 ${surfaces[i]}`}
                >
                  {/* card 4 gets an accent pool that warms on hover */}
                  {i === 3 && (
                    <div
                      aria-hidden="true"
                      className="glow-accent pointer-events-none absolute -right-20 -bottom-24 h-64 w-64 opacity-50 transition-opacity duration-500 group-hover:opacity-80"
                    />
                  )}

                  <div className="relative flex items-start justify-between gap-4">
                    <span className="border-line bg-ink/40 text-accent grid size-12 shrink-0 place-items-center rounded-2xl border backdrop-blur-sm transition-transform duration-500 group-hover:scale-110">
                      <Icon aria-hidden="true" className="size-5" />
                    </span>
                    <span className="text-cream-faint font-mono text-xs">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h3
                    className="relative mt-7 type-card-title"
                  >
                    {card.title}
                  </h3>

                  <p
                    className="text-cream-dim relative mt-3 type-body"
                  >
                    {card.body}
                  </p>
                </article>
              </Reveal>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}
