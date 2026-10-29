import { challenge } from "@/config/site";
import { Container, Eyebrow, Section } from "../ui/Section";
import { Reveal } from "../ui/Reveal";

const pointColors = ["#ffc163", "#b9a3ff", "#70e0ce"];

export function Challenge() {
  return (
    <Section id="challenge" labelledBy="challenge-heading" className="overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-32 size-[420px] rounded-full bg-accent/[0.07] blur-[90px]" />
        <div className="absolute -right-24 bottom-0 size-[360px] rounded-full bg-violet-500/[0.08] blur-[90px]" />
        <div
          className="absolute bottom-12 left-0 h-64 w-72 opacity-20"
          style={{
            backgroundImage: "radial-gradient(#faa81c 1px, transparent 1px)",
            backgroundSize: "18px 18px",
            maskImage: "radial-gradient(ellipse at left, black, transparent 72%)",
          }}
        />
        <svg viewBox="0 0 700 520" fill="none" className="absolute -left-24 bottom-0 w-[600px] max-w-none opacity-50 sm:w-[750px]">
          <defs>
            <linearGradient id="challenge-flow" x1="0" y1="450" x2="650" y2="120" gradientUnits="userSpaceOnUse">
              <stop stopColor="#faa81c" stopOpacity="0" />
              <stop offset=".48" stopColor="#faa81c" stopOpacity=".45" />
              <stop offset="1" stopColor="#a89bff" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0, 24, 48, 72, 96].map((offset) => (
            <path key={offset} d={`M-80 ${390 + offset} C120 ${100 + offset}, 280 ${590 + offset}, 720 ${90 + offset}`} stroke="url(#challenge-flow)" strokeWidth="1" />
          ))}
          <path d="M145 335h12m-6-6v12M470 305h10m-5-5v10" stroke="#faa81c" strokeOpacity=".5" strokeLinecap="round" />
          <circle cx="310" cy="345" r="3" fill="#faa81c" fillOpacity=".55" />
          <circle cx="310" cy="345" r="9" stroke="#faa81c" strokeOpacity=".2" />
        </svg>
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
      </div>
      <Container size="wide" className="relative">
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16 xl:gap-20">
          <div className="max-w-xl">
            <Reveal>
              <Eyebrow>{challenge.eyebrow}</Eyebrow>
            </Reveal>
            <Reveal delay={0.06}>
              <h2
                id="challenge-heading"
                className="mt-6 text-[length:var(--text-headline)] leading-[var(--text-headline--line-height)] font-semibold tracking-[var(--text-headline--letter-spacing)]"
              >
                Growing as a Trainer Should Not Be a{" "}
                <span className="accent-serif text-accent">Solo Journey</span>
              </h2>
            </Reveal>
            <div className="mt-7 space-y-5">
              {challenge.body.map((paragraph, i) => (
                <Reveal key={paragraph} delay={0.12 + i * 0.06}>
                  <p className="text-cream-dim type-body">{paragraph}</p>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="max-w-xl lg:pt-1">
            <ul className="mt-7 space-y-3">
              {challenge.points.map((point, i) => (
                <Reveal as="li" key={point.title} delay={i * 0.08}>
                  <div style={{ borderColor: `${pointColors[i]}35`, backgroundImage: `linear-gradient(90deg, ${pointColors[i]}0c, transparent 85%)` }} className="group rounded-xl border p-4 transition-colors duration-300 hover:bg-white/[0.025] sm:p-5">
                    <div className="grid grid-cols-[2.5rem_minmax(0,1fr)] items-start gap-3 sm:gap-4">
                      <span style={{ color: pointColors[i] }} className="pt-0.5 text-[2rem] leading-none font-semibold tracking-tight tabular-nums">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h3 className="text-cream text-[1.125rem] leading-[1.4] font-semibold tracking-normal sm:text-[1.25rem]">
                          {point.title}
                        </h3>
                        <p className="text-cream-dim mt-2 text-[1rem] leading-[1.65] sm:text-[1.125rem]">
                          {point.body}
                        </p>
                      </div>
                    </div>
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
