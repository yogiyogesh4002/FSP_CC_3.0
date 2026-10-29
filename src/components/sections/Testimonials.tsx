import { Quote, Video as VideoIcon } from "lucide-react";
import { testimonials } from "@/config/site";
import { Container, Eyebrow, Section } from "../ui/Section";
import { Reveal } from "../ui/Reveal";
import { VideoEmbed } from "../ui/VideoEmbed";

/**
 * Participant testimonial videos.
 *
 * Nothing here is invented. The copy around the grid describes the format
 * only, and each card renders a labelled "awaiting footage" slot until a real
 * YouTube id is added to `testimonials` in the site config — at which point
 * that card becomes a click-to-load player, with the name, role and pull quote
 * appearing only if they were supplied too.
 */
export function Testimonials() {
  return (
    <Section
      id="testimonials"
      labelledBy="testimonials-heading"
      className="overflow-hidden"
    >
      <Container size="wide">
        <div className="max-w-2xl">
          <Reveal>
            <Eyebrow>In Their Words</Eyebrow>
          </Reveal>

          <Reveal delay={0.06}>
            <h2
              id="testimonials-heading"
              className="mt-6 text-[length:var(--text-headline)] leading-[var(--text-headline--line-height)] font-semibold tracking-[var(--text-headline--letter-spacing)]"
            >
              Hear It From the{" "}
              <span className="accent-serif text-accent">Room.</span>
            </h2>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="text-cream-dim type-body mt-6">
              Hear directly from participants of our previous edition about their experiences, key learnings, and connections made at FSP Catalyst Connect.
            </p>
          </Reveal>
        </div>

        {/* Capped width, left-aligned with the heading: three 9:16 cards at
            full container width would tower over a 1080px-tall viewport. */}
        <ul className="mt-12 grid max-w-5xl gap-6 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {testimonials.map((t, i) => {
            const ratio = t.ratio ?? "9 / 16";

            return (
              <Reveal
                key={t.slot}
                as="li"
                delay={0.08 + i * 0.08}
                y={32}
                className="mx-auto w-full max-w-[340px]"
              >
                {t.src || t.id ? (
                  <figure className="flex h-full flex-col">
                    <VideoEmbed
                      src={t.src}
                      {...(t.id ? { id: t.id } : {})}
                      title={
                        t.name
                          ? `${t.name} on FSP Catalyst Connect`
                          : `Participant testimonial — ${t.slot}`
                      }
                      poster={t.poster}
                      ratio={ratio}
                      label={null}
                      sizes="(max-width: 640px) 90vw, 340px"
                    />

                    {t.quote ? (
                      <blockquote className="text-cream-dim mt-6 flex gap-3 text-[0.975rem] leading-relaxed">
                        <Quote
                          aria-hidden="true"
                          className="text-accent mt-1 size-4 shrink-0 fill-current"
                        />
                        <p>{t.quote}</p>
                      </blockquote>
                    ) : null}

                    {t.name ? (
                      <figcaption className="border-line mt-5 border-t pt-4">
                        <p className="text-cream text-sm font-medium">
                          {t.name}
                        </p>
                        {t.role ? (
                          <p className="text-cream-faint mt-1 text-xs">
                            {t.role}
                          </p>
                        ) : null}
                      </figcaption>
                    ) : null}
                  </figure>
                ) : (
                  <div
                    role="img"
                    aria-label={`Video placeholder: ${t.slot} — awaiting participant footage`}
                    style={{ aspectRatio: ratio }}
                    className="border-line bg-surface-2 relative flex w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border border-dashed p-6 text-center sm:rounded-3xl"
                  >
                    <div
                      aria-hidden="true"
                      className="from-accent/10 pointer-events-none absolute inset-0 bg-gradient-to-br via-transparent to-transparent"
                    />
                    <VideoIcon
                      aria-hidden="true"
                      className="text-cream-faint size-6"
                    />
                    <p className="text-cream-dim relative text-sm font-medium">
                      {t.slot}
                    </p>
                    <p className="text-cream-faint relative text-xs">
                      Awaiting participant testimonial footage
                    </p>
                  </div>
                )}
              </Reveal>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}
