const words = Array.from({ length: 4 }, () => ["Learn", "Lead", "Impact"]).flat();

export function SectionDivider() {
  return (
    <div className="border-line bg-ink-deep border-y py-3 sm:py-4">
      <p className="sr-only">Learn. Lead. Impact.</p>
      <div className="mx-auto max-w-[1600px] px-6 sm:px-10">
        <div className="section-ticker overflow-hidden" aria-hidden="true">
          <div className="section-ticker-track flex w-max">
            {[0, 1].map((copy) => (
              <ul key={copy} aria-hidden={copy === 1 ? true : undefined} className="flex shrink-0 items-center">
                {words.map((word, index) => (
                  <li key={index} className="flex shrink-0 items-center gap-6 pr-6 sm:gap-10 sm:pr-10">
                    <span className="text-[#F5F5F7] text-2xl leading-none font-normal tracking-normal uppercase sm:text-3xl xl:text-[34px]" style={{ fontFamily: 'Impact, Haettenschweiler, "Arial Narrow", sans-serif' }}>
                      {word}
                    </span>
                    <span className="text-accent text-lg">&#10022;</span>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}