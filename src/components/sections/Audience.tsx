import {
  Compass,
  GraduationCap,
  MessageSquare,
  Presentation,
  Sprout,
  Users,
} from "lucide-react";
import { Sparkles } from "lucide-react";
import { RegisterCta } from "../ui/Cta";
import type { LucideIcon } from "lucide-react";
import { audience } from "@/config/site";
import { Container, Eyebrow, Section } from "../ui/Section";
import { Reveal } from "../ui/Reveal";

const icons: Record<string, LucideIcon> = {
  Presentation,
  MessageSquare,
  Users,
  Compass,
  GraduationCap,
  Sprout,
};

export function Audience() {
  return (
    <Section
      id="who-should-attend"
      labelledBy="audience-heading"
      className="relative isolate overflow-hidden border-y border-white/5 bg-[#0b1024]"
    >
      <Container size="wide" className="relative">
        <div className="grid items-start gap-8 lg:grid-cols-[0.85fr_1.4fr] lg:gap-10">
        <div className="self-start lg:sticky lg:top-28">
          <Reveal>
            <Eyebrow>{audience.eyebrow}</Eyebrow>
          </Reveal>
          <Reveal delay={0.06}>
            <h2
              id="audience-heading"
              className="mt-6 text-[length:var(--text-headline)] leading-[var(--text-headline--line-height)] font-semibold tracking-[var(--text-headline--letter-spacing)]"
            >
              Your people. Your spark.{" "}
              <span className="accent-serif text-accent">Your next chapter.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="text-cream-dim mt-5 type-body">
              {audience.intro}
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <div className="mt-8 flex flex-wrap gap-2">
              {["Connect", "Exchange", "Grow"].map((word) => <span key={word} className="border-accent/20 bg-accent/5 text-accent rounded-full border px-4 py-2 text-xs font-medium tracking-wide">{word}</span>)}
            </div>
            <div className="mt-9"><RegisterCta label="Find your place in the room" size="md" /></div>
            <div className="border-line mt-10 flex items-center gap-4 border-t pt-6">
              <span className="bg-accent/10 text-accent grid size-12 shrink-0 place-items-center rounded-full"><Sparkles aria-hidden="true" className="size-5" /></span>
              <p className="text-cream-dim max-w-xs type-small">Many perspectives.<br /><span className="text-cream">One community that gets you.</span></p>
            </div>
          </Reveal>
        </div>

        <div>
        <ul className="grid content-start gap-3 sm:grid-cols-2 lg:pt-2">
          {audience.roles.map((role, i) => {
            const Icon = icons[role.icon] ?? Users;
            const tones = [
              { color: "#ffc163", wash: "rgba(255,193,99,.12)" },
              { color: "#a89bff", wash: "rgba(168,155,255,.12)" },
              { color: "#73dccc", wash: "rgba(115,220,204,.12)" },
              { color: "#f2a3c2", wash: "rgba(242,163,194,.12)" },
              { color: "#8abaff", wash: "rgba(138,186,255,.12)" },
              { color: "#c0df8b", wash: "rgba(192,223,139,.12)" },
            ];
            const tone = tones[i % tones.length];

            return (
              <Reveal as="li" key={role.title} delay={i * 0.06}>
                <div style={{ background: `radial-gradient(ellipse at top right, ${tone.wash}, transparent 75%), #10172d` }} className="border-line group relative flex h-full flex-col overflow-hidden rounded-2xl border p-4 sm:p-5 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-cream/25 hover:shadow-[0_18px_45px_-18px_rgba(0,0,0,.6)] motion-reduce:transform-none">
                  <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="flex items-center justify-between">
                    <span style={{ color: tone.color, backgroundColor: tone.wash, borderColor: `${tone.color}30` }} className="grid size-9 shrink-0 place-items-center rounded-xl border transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6 motion-reduce:transform-none">
                      <Icon aria-hidden="true" className="size-4" />
                    </span>
                    <span aria-hidden="true" className="text-cream/15 text-2xl font-semibold tracking-tight">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <h3 className="text-cream mt-3 type-card-title">
                    {role.title}
                  </h3>
                  <p className="text-cream-dim mt-2 type-small">{role.description}</p>
                </div>
              </Reveal>
            );
          })}
        </ul>
        </div>
        </div>
        <Reveal delay={0.12}>
          <div className="border-accent/20 bg-gradient-to-r from-accent/15 via-accent/5 to-transparent mt-8 flex flex-col gap-3 rounded-2xl border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-cream text-lg font-medium">Different strengths. <span className="text-accent">A shared drive to grow.</span></p>
            <p className="text-cream-dim text-sm">Come with your experience. Leave with new perspectives.</p>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
