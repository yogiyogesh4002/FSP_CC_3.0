import Image from "next/image";
import { speaker as specialGuest, panelDiscussionLeader, karunaiPrakash, priyaRamasamy, TODO_CONFIRM } from "@/config/site";
import { Container, Eyebrow, Section } from "../ui/Section";
import { Reveal } from "../ui/Reveal";
import { PhotoPlaceholder } from "../ui/PhotoPlaceholder";

/**
 * Only the name, role and organisation supplied in the brief appear here.
 * No credentials, achievements or session title are invented — if
 * `speaker.sessionTitle` is still TODO_CONFIRM, nothing is shown in its place.
 */
export function Speaker({ panelLeader = false, karunai = false, guest = false }: { panelLeader?: boolean; karunai?: boolean; guest?: boolean }) {
  const speaker = guest ? priyaRamasamy : karunai ? karunaiPrakash : panelLeader ? panelDiscussionLeader : specialGuest;
  const profile = guest ? priyaRamasamy : karunai ? karunaiPrakash : panelDiscussionLeader;
  const sectionId = guest ? "priya-ramasamy" : karunai ? "karunai-prakash" : panelLeader ? "panel-discussion-leader" : "speaker";
  const headingId = `${sectionId}-heading`;
  const specialties = "team building, employee engagement, outbound leadership training, and Train the Trainer programs";
  const hasPortrait = speaker.portrait !== null;
  const hasSessionTitle = !panelLeader && !karunai && !guest && specialGuest.sessionTitle !== TODO_CONFIRM;

  return (
    <Section id={sectionId} labelledBy={headingId} className="bg-surface/40 overflow-hidden">
      <Container size="wide">
        <div className={`grid gap-12 ${karunai || panelLeader || guest ? "lg:grid-cols-[1fr_1.2fr] lg:items-center lg:gap-14" : "lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:gap-20"}`}>
          <Reveal y={32}>
            <div className="relative">
              {hasPortrait ? (
                <Image
                  src={speaker.portrait!}
                  alt={`${speaker.name}, ${speaker.role}${speaker.organisation ? ` at ${speaker.organisation}` : ""}`}
                  width={speaker.portraitWidth}
                  height={speaker.portraitHeight}
                  loading="lazy"
                  sizes="(max-width: 1024px) 100vw, 420px"
                  /* natural aspect ratio — no object-cover, so nothing in the
                     frame gets cropped away */
                  className={`border-line-strong mx-auto h-auto w-full ${karunai || panelLeader || guest ? "max-w-[340px] lg:max-w-[440px]" : "max-w-[380px]"} rounded-2xl border shadow-[0_28px_70px_-24px_rgba(0,0,0,0.9)] sm:rounded-3xl`}
                />
              ) : (
                <PhotoPlaceholder
                  caption={`Portrait — ${speaker.name}`}
                  ratio={panelLeader ? `${speaker.portraitWidth} / ${speaker.portraitHeight}` : "4 / 5"}
                />
              )}
              <div
                aria-hidden="true"
                className="glow-accent pointer-events-none absolute -inset-10 -z-10 opacity-40"
              />
            </div>
          </Reveal>

          <div>
            <Reveal>
              <Eyebrow>{guest ? "Guest Speaker" : karunai ? "Founder" : panelLeader ? "Panel Discussion Leader" : "Special Guest"}</Eyebrow>
            </Reveal>

            <Reveal delay={0.06}>
              <h2
                id={headingId}
                className="mt-6 type-speaker-name leading-[var(--text-headline--line-height)] font-semibold tracking-[var(--text-headline--letter-spacing)]"
              >
                {speaker.name}
              </h2>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="text-accent mt-4 type-role">
                {speaker.role}
                {speaker.organisation && (
                  <>
                    <span className="text-cream-faint mx-2.5" aria-hidden="true">
                      /
                    </span>
                    <span className="text-cream-dim">{speaker.organisation}</span>
                  </>
                )}
              </p>
            </Reveal>

            {panelLeader || karunai || guest ? (
              <>
                <Reveal delay={0.16}>
                  <div className="border-line mt-7 border-t pt-6">
                    <h3 className="text-cream text-sm font-medium">Career Highlights</h3>
                    {karunai || guest ? (
                      <dl className="mt-4 grid grid-cols-3 gap-3 sm:gap-5">
                        {(guest ? priyaRamasamy : karunaiPrakash).highlights.map((highlight) => (
                          <div key={highlight.label} className="flex flex-col">
                            <dt className="text-cream-dim order-2 mt-2 type-small">{highlight.label}</dt>
                            <dd className="text-accent type-stat">{highlight.value}</dd>
                          </div>
                        ))}
                      </dl>
                    ) : <div className="mt-4 flex flex-wrap items-end gap-5">
                      <p className="text-accent type-stat">
                        {panelDiscussionLeader.careerHighlight}
                      </p>
                      <p className="text-cream-dim pb-2 text-sm leading-snug">
                        {panelDiscussionLeader.careerHighlightLabel}
                      </p>
                    </div>}
                  </div>
                </Reveal>
                {profile.biography.map((paragraph, index) => (
                  <Reveal key={paragraph} delay={0.2 + index * 0.04}>
                    <p className="text-cream-dim mt-5 max-w-xl type-body">
                      {karunai && paragraph.includes(specialties) ? (
                        <>
                          <span className="text-cream mb-2 block text-sm font-semibold tracking-wide">Core Expertise</span>
                          <strong className="text-accent font-semibold">Team Building, Employee Engagement, Outbound Leadership Training, and Train the Trainer Programs</strong>
                          {paragraph.split(specialties)[1]}
                        </>
                      ) : paragraph}
                    </p>
                  </Reveal>
                ))}
              </>
            ) : (
              <Reveal delay={0.16}>
                <p className="text-cream-dim mt-7 max-w-xl type-body">
                  {specialGuest.intro}
                </p>
              </Reveal>
            )}

            {hasSessionTitle && (
              <Reveal delay={0.2}>
                <p className="border-line text-cream mt-7 border-l-2 pl-5 text-base">
                  {specialGuest.sessionTitle}
                </p>
              </Reveal>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}
