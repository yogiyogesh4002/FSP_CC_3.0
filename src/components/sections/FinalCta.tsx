import { CalendarDays, MapPin } from "lucide-react";
import { event, finalCta, registration } from "@/config/site";
import { Container, Section } from "../ui/Section";
import { Reveal } from "../ui/Reveal";
import { RegisterCta } from "../ui/Cta";

export function FinalCta() {
  return (
    <Section id="register" labelledBy="final-cta-heading" className="grain overflow-hidden">
      <div
        aria-hidden="true"
        className="glow-accent pointer-events-none absolute inset-x-0 bottom-0 mx-auto h-[36rem] w-[64rem] opacity-55"
      />

      <Container size="default" className="relative text-center">
        <Reveal>
          <h2
            id="final-cta-heading"
            className="mx-auto max-w-4xl text-[length:var(--text-headline)] leading-[var(--text-headline--line-height)] font-semibold tracking-[var(--text-headline--letter-spacing)]"
          >
            Your Next Connection Could{" "}
            <span className="accent-serif text-accent">
              Change Your Journey.
            </span>
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="text-cream-dim mx-auto mt-7 max-w-2xl type-body">
            {finalCta.body}
          </p>
        </Reveal>

        <Reveal delay={0.16}>
          <div className="mt-10 flex flex-col items-center gap-4">
            <RegisterCta label={registration.ctaFinal} />
            {registration.isPlaceholder && (
              <p className="text-cream-faint text-xs">
                {registration.placeholderNote}
              </p>
            )}
          </div>
        </Reveal>

        <Reveal delay={0.22}>
          <div className="text-cream-dim mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm">
            <span className="flex items-center gap-2.5">
              <CalendarDays aria-hidden="true" className="text-accent size-4" />
              <time dateTime={event.isoDate}>{event.dateLabelLong}</time>
            </span>
            <span className="flex items-center gap-2.5">
              <MapPin aria-hidden="true" className="text-accent size-4" />
              {event.locationLabel}
            </span>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
