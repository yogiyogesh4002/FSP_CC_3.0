import Image from "next/image";
import { pastEdition } from "@/config/site";
import { Container, Eyebrow, Section } from "../ui/Section";
import { Reveal } from "../ui/Reveal";
import { PhotoPlaceholder } from "../ui/PhotoPlaceholder";

/**
 * Community proof from the previous edition.
 *
 * The 60+ figure is stated only as a fact about the August 2026 edition.
 * No testimonials, outcomes or projections for 3.0 are invented, and no stock
 * photography stands in for real FSP event photos — while
 * `pastEdition.photos` is empty, labelled placeholders render instead.
 */
export function CommunityProof() {
  const photos = pastEdition.photos;
  const hasPhotos = photos.length > 0;

  // All three photos are portrait (2:3). A triptych reads better than a bento
  // here; the middle frame drops to give the row an asymmetric baseline.
  // On mobile the lead frame goes full width with the other two beneath it.
  const frames = [
    { ratio: "2 / 3", className: "col-span-2 sm:col-span-1" },
    { ratio: "2 / 3", className: "sm:mt-10" },
    { ratio: "2 / 3", className: "" },
  ];

  return (
    <Section id="community" labelledBy="community-heading" className="overflow-hidden">
      <Container size="wide">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end lg:gap-16">
          <div>
            <Reveal>
              <Eyebrow>Community Proof</Eyebrow>
            </Reveal>

            <Reveal delay={0.06}>
              <h2
                id="community-heading"
                className="mt-6 text-[length:var(--text-headline)] leading-[var(--text-headline--line-height)] font-semibold tracking-[var(--text-headline--letter-spacing)]"
              >
                It Has Happened{" "}
                <span className="accent-serif text-accent">Before.</span>
              </h2>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="text-cream-dim mt-6 max-w-lg type-body">
                {pastEdition.attendeesContext}
              </p>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="border-line mt-10 flex items-end gap-5 border-t pt-8">
                <p className="text-accent type-stat">
                  {pastEdition.attendees}
                </p>
                <p className="text-cream-dim pb-2 text-sm leading-snug">
                  participants at the
                  <br />
                  <span className="text-cream font-medium">
                    {pastEdition.label}
                  </span>
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.12} y={32}>
            {/* 3 columns: a tall lead frame (2x2) with two stacked beside it,
                so the grid fills completely with no empty cell */}
            <div className="grid grid-cols-2 items-start gap-3 sm:grid-cols-3">
              {frames.map((frame, i) => {
                const photo = hasPhotos ? photos[i] : undefined;

                return (
                  <div key={i} className={frame.className}>
                    {photo ? (
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        width={photo.width}
                        height={photo.height}
                        loading="lazy"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 240px"
                        style={{ aspectRatio: frame.ratio }}
                        className="border-line-strong w-full rounded-2xl border object-cover transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] hover:scale-[1.03]"
                      />
                    ) : (
                      <PhotoPlaceholder
                        caption={`${pastEdition.label} — photo ${i + 1}`}
                        ratio={frame.ratio}
                        className="h-full"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
