import Image from "next/image";
import { Check } from "lucide-react";
import { about } from "@/config/site";
import { Container, Eyebrow, Section } from "../ui/Section";
import { Reveal } from "../ui/Reveal";

export function About() {
  return (
    <Section id="about" labelledBy="about-heading" className="bg-surface/40 overflow-hidden">
      <Container size="wide">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">
          {/* visual first on desktop, second on mobile for faster copy access */}
          <Reveal className="order-2 lg:order-1" y={32}>
            <figure className="relative">
              <Image
                src={about.photo.src}
                alt={about.photo.alt}
                width={about.photo.width}
                height={about.photo.height}
                loading="lazy"
                sizes="(max-width: 1024px) 100vw, 600px"
                className="border-line-strong w-full rounded-2xl border shadow-[0_28px_70px_-24px_rgba(0,0,0,0.9)] sm:rounded-3xl"
              />
              <figcaption className="text-cream-faint mt-4 text-sm">
                {about.photo.caption}
              </figcaption>
              <div
                aria-hidden="true"
                className="glow-accent pointer-events-none absolute -inset-10 -z-10 opacity-40"
              />
            </figure>
          </Reveal>

          <div className="order-1 lg:order-2">
            <Reveal>
              <Eyebrow>{about.eyebrow}</Eyebrow>
            </Reveal>

            <Reveal delay={0.06}>
              <h2
                id="about-heading"
                className="mt-6 text-[length:var(--text-headline)] leading-[var(--text-headline--line-height)] font-semibold tracking-[var(--text-headline--letter-spacing)]"
              >
                More Than a Meetup. A Community That{" "}
                <span className="accent-serif text-accent">
                  Moves You Forward.
                </span>
              </h2>
            </Reveal>

            <div className="mt-7 space-y-5">
              {about.body.map((paragraph, i) => (
                <Reveal key={i} delay={0.12 + i * 0.06}>
                  <p className="text-cream-dim type-body">
                    {paragraph}
                  </p>
                </Reveal>
              ))}
            </div>

            <ul className="mt-9 grid gap-3 sm:grid-cols-2">
              {about.pillars.map((pillar, i) => (
                <Reveal as="li" key={pillar} delay={0.2 + i * 0.06}>
                  <div className="border-line bg-surface-2/60 flex items-center gap-3 rounded-xl border px-4 py-3">
                    <Check
                      aria-hidden="true"
                      className="text-accent size-4 shrink-0"
                    />
                    <span className="text-cream text-sm font-medium">
                      {pillar}
                    </span>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  );
}
