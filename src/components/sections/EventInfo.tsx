import { CalendarDays, CheckCircle2, Clock, MapPin, Ticket } from "lucide-react";
import { event, TODO_CONFIRM } from "@/config/site";
import { Container, Eyebrow, Section } from "../ui/Section";
import { Reveal } from "../ui/Reveal";

/**
 * Unconfirmed values (venue, timings) are shown as "to be confirmed" rather
 * than filled with a plausible guess.
 */
export function EventInfo() {
  const venueConfirmed = event.venue !== TODO_CONFIRM;
  const timeConfirmed = event.startTime !== TODO_CONFIRM;

  const rows = [
    {
      icon: CalendarDays,
      label: "Date",
      value: event.dateLabelLong,
      time: event.isoDate,
      note: null,
    },
    {
      icon: Clock,
      label: "Timing",
      value: timeConfirmed
        ? `${event.startTime} – ${event.endTime}`
        : "To be confirmed",
      time: null,
      note: timeConfirmed ? null : "Session timings will be shared ahead of the event.",
    },
    {
      icon: MapPin,
      label: "Location",
      value: venueConfirmed ? event.venue : event.locationLabel,
      time: null,
      note: venueConfirmed ? null : event.venueFallback,
    },
    {
      icon: Ticket,
      label: "Registration fee",
      value: event.price.memberLabel,
      time: null,
      note: event.price.note,
    },
  ];

  return (
    <Section id="event-information" labelledBy="event-info-heading" className="overflow-hidden">
      <Container size="wide">
        <div className="border-line bg-surface-2/50 relative overflow-hidden rounded-[2rem] border p-8 sm:p-12 lg:p-16">
          <div
            aria-hidden="true"
            className="glow-accent pointer-events-none absolute -top-32 -right-24 h-96 w-96 opacity-45"
          />

          <div className="relative grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <div>
              <Reveal>
                <Eyebrow>Event Information</Eyebrow>
              </Reveal>
              <Reveal delay={0.06}>
                <h2
                  id="event-info-heading"
                  className="mt-6 text-[length:var(--text-headline)] leading-[var(--text-headline--line-height)] font-semibold tracking-[var(--text-headline--letter-spacing)]"
                >
                  The <span className="accent-serif text-accent">Details.</span>
                </h2>
              </Reveal>
              <Reveal delay={0.12}>
                <p className="text-cream-dim mt-6 type-body">
                  A day to learn from experienced trainers, exchange practical ideas, and connect with people who understand your journey.
                </p>
                <ul className="mt-6 space-y-4">
                  {["Learn from experienced trainers", "Share real experiences with your peers", "Build meaningful professional connections"].map(benefit => (
                    <li key={benefit} className="text-cream flex items-start gap-3 text-base leading-relaxed">
                      <CheckCircle2 aria-hidden="true" className="text-accent mt-1 size-5 shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            <dl className="space-y-px">
              {rows.map((row, i) => (
                <Reveal key={row.label} delay={i * 0.07}>
                  <div className="border-line flex items-start gap-4 border-t py-5">
                    <span className="border-line bg-ink/40 text-accent mt-0.5 grid size-10 shrink-0 place-items-center rounded-xl border">
                      <row.icon aria-hidden="true" className="size-4" />
                    </span>
                    <div className="min-w-0">
                      <dt className="text-cream-faint text-[13px] leading-5 font-semibold tracking-[0.12em] uppercase">
                        {row.label}
                      </dt>
                      <dd className="text-cream mt-1 text-[16px] leading-6 font-medium">
                        {row.time ? (
                          <time dateTime={row.time}>{row.value}</time>
                        ) : (
                          row.value
                        )}
                      </dd>
                      {row.note && (
                        <p className="text-cream-faint mt-1 text-[14px] leading-[1.6]">
                          {row.note}
                        </p>
                      )}
                    </div>
                  </div>
                </Reveal>
              ))}
            </dl>
          </div>
        </div>
      </Container>
    </Section>
  );
}
