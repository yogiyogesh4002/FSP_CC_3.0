"use client";

import { useId, useState } from "react";
import { Plus } from "lucide-react";
import { faqs } from "@/config/site";
import { Container, Eyebrow, Section } from "../ui/Section";
import { Reveal } from "../ui/Reveal";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();

  return (
    <Section id="faq" labelledBy="faq-heading">
      <Container size="default">
        <div className="max-w-2xl">
          <Reveal>
            <Eyebrow>FAQ</Eyebrow>
          </Reveal>
          <Reveal delay={0.06}>
            <h2
              id="faq-heading"
              className="mt-6 text-[length:var(--text-headline)] leading-[var(--text-headline--line-height)] font-semibold tracking-[var(--text-headline--letter-spacing)]"
            >
              Questions,{" "}
              <span className="accent-serif text-accent">Answered.</span>
            </h2>
          </Reveal>
        </div>

        <div className="mt-12">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            const panelId = `${baseId}-panel-${i}`;
            const buttonId = `${baseId}-button-${i}`;

            return (
              <Reveal key={faq.q} delay={i * 0.05}>
                <div className="border-line border-t last:border-b">
                  <h3>
                    <button
                      type="button"
                      id={buttonId}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="group grid w-full grid-cols-[minmax(0,1fr)_2rem] items-start gap-4 py-5 text-left [text-wrap:wrap]"
                    >
                      <span className="text-cream min-w-0 [overflow-wrap:anywhere] group-hover:text-accent type-card-title transition-colors duration-200">
                        {faq.q}
                      </span>
                      <span
                        aria-hidden="true"
                        className="border-line text-accent mt-0.5 grid size-8 shrink-0 place-items-center rounded-full border"
                      >
                        <Plus className={`size-4 transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`} />
                      </span>
                    </button>
                  </h3>

                  <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!isOpen}>
                    <p className="text-cream-dim max-w-3xl pb-6 type-body sm:pr-12">{faq.a}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
