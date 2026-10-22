import { Backdrop } from "../ui/Backdrop";
import { CalendarDays, MapPin, Sparkles } from "lucide-react";
import { brand, event, registration } from "@/config/site";
import { Container } from "../ui/Section";
import { Reveal } from "../ui/Reveal";
import { AnchorCta, RegisterCta } from "../ui/Cta";
import { VideoEmbed } from "../ui/VideoEmbed";
import { HeroAccent } from "../ui/HeroAccent";

export function Hero() {
  return (
    <section
      id="top"
      aria-labelledby="hero-heading"
      className="page-panel grain relative isolate overflow-hidden pt-28 pb-20 sm:pt-32 sm:pb-28 lg:pt-36"
    >
      <Backdrop />
      {/* ambient lighting pool behind the headline */}
      <div
        aria-hidden="true"
        className="glow-accent pointer-events-none absolute -top-40 left-1/2 h-[42rem] w-[72rem] -translate-x-1/2 opacity-70"
      />

      <Container size="wide" className="relative">
        <div className="flex flex-col items-center text-center">
          {/* ------------------------------------------------- eyebrow --- */}
          <Reveal>
            <p className="border-line-strong bg-surface/70 text-cream inline-flex items-center gap-2.5 rounded-full border px-5 py-2.5 text-sm font-semibold tracking-[0.14em] uppercase backdrop-blur-sm sm:gap-3 sm:px-7 sm:py-3.5 sm:text-base lg:text-lg">
              <Sparkles
                aria-hidden="true"
                className="text-accent size-4 shrink-0 sm:size-5"
              />
              {brand.eventFull}
            </p>
          </Reveal>

          {/* ------------------------------------------------ headline --- */}
          <Reveal delay={0.08}>
            <h1
              id="hero-heading"
              className="mt-7 max-w-5xl text-[length:var(--text-display)] leading-[var(--text-display--line-height)] font-semibold tracking-[var(--text-display--letter-spacing)]"
            >
              Your Growth Is Not a{" "}
              <span className="accent-serif text-accent">Solo Journey.</span>
            </h1>
          </Reveal>

          {/* --------------------------------------------------- video --- */}
          <Reveal delay={0.16} y={32} className="w-full">
            <div className="relative mx-auto mt-12 w-full max-w-5xl sm:mt-14">
              <HeroAccent />
              <VideoEmbed />
            </div>
          </Reveal>

          {/* -------------------------------------------------- tagline --- */}
          <Reveal delay={0.22}>
            <p className="text-cream mt-10 text-lg font-medium sm:mt-12 sm:text-xl">
              {brand.tagline}
            </p>
          </Reveal>

          <Reveal delay={0.26}>
            <p className="text-cream-dim mt-4 max-w-2xl type-body text-balance">
              {brand.description}
            </p>
          </Reveal>

          {/* ---------------------------------------------- event facts --- */}
          <Reveal delay={0.3}>
            <dl className="text-cream mt-9 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm">
              <div className="flex items-center gap-2.5">
                <CalendarDays
                  aria-hidden="true"
                  className="text-accent size-4 shrink-0"
                />
                <dt className="sr-only">Date</dt>
                <dd>
                  <time dateTime={event.isoDate}>{event.dateLabel}</time>
                </dd>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin
                  aria-hidden="true"
                  className="text-accent size-4 shrink-0"
                />
                <dt className="sr-only">Location</dt>
                <dd>{event.locationLabel}</dd>
              </div>
            </dl>
          </Reveal>

          {/* ------------------------------------------------------ CTAs --- */}
          <Reveal delay={0.34}>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <RegisterCta />
              <AnchorCta href="#experience" label={registration.ctaSecondary} />
            </div>
            {registration.isPlaceholder && (
              <p className="text-cream-faint mt-3 text-xs">
                {registration.placeholderNote}
              </p>
            )}
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
