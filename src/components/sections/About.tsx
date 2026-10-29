import Image from "next/image";
import { about } from "@/config/site";
import { Container, Eyebrow, Section } from "../ui/Section";
import { Reveal } from "../ui/Reveal";

export function About() {
  return (
    <Section id="about" labelledBy="about-heading" className="bg-surface/40 overflow-hidden">
      <Container size="wide">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">
          {/* Text comes first, with the photo alongside it on desktop. */}
          <Reveal className="order-2" y={32}>
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
              <div
                aria-hidden="true"
                className="glow-accent pointer-events-none absolute -inset-10 -z-10 opacity-40"
              />
            </figure>
          </Reveal>

          <div className="order-1">
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


          </div>
        </div>
      </Container>
    </Section>
  );
}
