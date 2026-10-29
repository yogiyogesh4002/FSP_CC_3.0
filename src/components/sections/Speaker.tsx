import Image from "next/image";
import type { SpeakerCardProfile } from "@/config/site";
import { Reveal } from "../ui/Reveal";
import { PhotoPlaceholder } from "../ui/PhotoPlaceholder";

/** Highlight a few key facts without oversized statistic counters. */
function HighlightedText({ text }: { text: string }) {
  const parts = text.split(/(20\+|10\+|600\+|3 international programs|7\+|2,500\+|200\+|250\+|5,000\+|The MASK Leadership|IIPE, Canada|NLP Master Practitioner)/g);
  return parts.map((part, index) => index % 2 === 1
    ? <strong key={index} className="text-accent font-semibold">{part}</strong>
    : part);
}

export function Speaker({ profile }: { profile: SpeakerCardProfile }) {
  const headingId = `${profile.id}-heading`;
  const isSpecialGuest = profile.id === "speaker";
  const badge = isSpecialGuest ? "Special Guest" : profile.id === "karunai-prakash" ? "Founder" : profile.id === "panel-discussion-leader" ? "Panel Discussion Leader" : profile.id === "priya-ramasamy" ? "Guest Speaker" : null;
  return (
    <article id={profile.id} aria-labelledby={headingId} className="border-line bg-surface/60 row-span-5 grid min-w-0 grid-rows-subgrid gap-y-0 rounded-3xl border p-5 lg:p-4">
      <Reveal y={16}>
        <div className={isSpecialGuest ? "border-accent/30 bg-ink/40 relative rounded-2xl border" : "border-line bg-ink/40 relative rounded-2xl border"}>
          {badge && (
            <span className="bg-accent text-on-accent absolute -top-3 left-1/2 z-10 -translate-x-1/2 rounded-full px-3 py-1 text-[11px] leading-4 font-bold tracking-[0.08em] whitespace-nowrap uppercase">{badge}</span>
          )}
          {profile.portrait ? (
            <Image
              src={profile.portrait}
              alt={`${profile.name} portrait`}
              width={profile.portraitWidth}
              height={profile.portraitHeight}
              loading="lazy"
              sizes="(min-width: 1280px) 260px, (min-width: 1024px) 220px, (min-width: 640px) 45vw, 90vw"
              className="h-[220px] w-full rounded-2xl object-contain lg:h-[180px] xl:h-[200px]"
            />
          ) : <PhotoPlaceholder caption={`${profile.name} portrait`} ratio="4 / 5" />}
        </div>
      </Reveal>

      <Reveal delay={0.06}>
        <div className="mt-4">
          <h2 id={headingId} className="text-2xl leading-tight tracking-tight lg:text-[22px] xl:text-2xl">{profile.name}</h2>
          {profile.designation && !badge && <p className="text-accent mt-2 text-[13px] leading-snug font-semibold tracking-wide uppercase">{profile.designation}</p>}
          {profile.company && <p className="text-cream mt-2 text-[15px] leading-snug font-medium">{profile.company}</p>}
          {profile.professionalProfile && <p className="text-cream mt-2 text-[15px] leading-snug font-medium">{profile.professionalProfile}</p>}
        </div>
      </Reveal>

      <Reveal delay={0.12}>
        <div className="border-line mt-4 border-t pt-4 text-base leading-relaxed lg:text-[15px]">
          <p className="text-cream mb-1 font-semibold">Experience</p>
          <p className="text-cream-dim"><HighlightedText text={profile.experience} /></p>
        </div>
      </Reveal>

      <Reveal delay={0.16}>
        <div className="mt-4 text-base leading-relaxed lg:text-[15px]">
          <p className="text-cream mb-1 font-semibold">Expertise</p>
          <p className="text-cream-dim">{profile.expertise}</p>
        </div>
      </Reveal>

      <Reveal delay={0.2}>
        {profile.credibility && <p className="text-cream-dim mt-4 text-base leading-relaxed lg:text-[15px]"><HighlightedText text={profile.credibility} /></p>}
      </Reveal>
    </article>
  );
}
