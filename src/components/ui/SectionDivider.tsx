const words = ["Practice", "Create", "Build", "Connect", "Grow", "Learn"];

export function SectionDivider() {
  return (
    <div className="border-line bg-ink-deep border-y py-3 sm:py-4">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-3 px-6 sm:px-10 lg:flex-row lg:items-center lg:gap-6">
        <p className="text-accent shrink-0 text-sm font-bold tracking-[0.16em] uppercase sm:text-base lg:border-r lg:border-line-strong lg:pr-6">
          Learn. Lead. Impact.
        </p>
        <div className="section-ticker min-w-0 flex-1 overflow-hidden">
          <div className="section-ticker-track flex w-max">
            {[0, 1].map((copy) => (
              <ul key={copy} aria-hidden={copy === 1 ? true : undefined} className="flex shrink-0 items-center" aria-label={copy === 0 ? "Practice, create, build, connect, grow, learn" : undefined}>
                {words.map((word) => (
                  <li key={word} className="flex shrink-0 items-center gap-6 pr-6 sm:gap-10 sm:pr-10">
                    <span className="text-cream text-xl leading-none font-black tracking-[-0.04em] uppercase sm:text-2xl xl:text-3xl">
                      {word}
                    </span>
                    <span aria-hidden="true" className="text-accent text-lg">✦</span>
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
