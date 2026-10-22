"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { video } from "@/config/site";

/**
 * Click-to-load video facade.
 *
 * On load this renders only a poster image and a play button — no YouTube
 * iframe, no third-party scripts, no cookies. The player is injected on the
 * first click, which keeps the hero's LCP fast and means nothing is sent to
 * YouTube unless the visitor chooses to watch.
 *
 * Uses youtube-nocookie.com, and the poster is served locally rather than from
 * ytimg so the page makes no external request at all before interaction.
 */
export function VideoEmbed({ className = "" }: { className?: string }) {
  const [playing, setPlaying] = useState(false);

  const src =
    `https://www.youtube-nocookie.com/embed/${video.id}` +
    `?autoplay=1&rel=0&modestbranding=1&playsinline=1`;

  return (
    <div
      className={`border-line-strong bg-ink-deep relative overflow-hidden rounded-2xl border shadow-[0_32px_80px_-24px_rgba(0,0,0,0.9)] sm:rounded-3xl ${className}`}
      style={{ aspectRatio: "16 / 9" }}
    >
      {playing ? (
        <iframe
          src={src}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Play video: ${video.title}`}
          className="group absolute inset-0 h-full w-full cursor-pointer"
        >
          <Image
            src={video.poster}
            alt=""
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 1000px"
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.03]"
          />

          {/* legibility scrim */}
          <span
            aria-hidden="true"
            className="from-ink-deep/80 absolute inset-0 bg-gradient-to-t via-transparent to-transparent"
          />

          {/* play control */}
          <span
            aria-hidden="true"
            className="absolute inset-0 grid place-items-center"
          >
            <span className="bg-accent text-on-accent grid size-16 place-items-center rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.45)] transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-110 sm:size-20">
              <Play className="ml-1 size-6 fill-current sm:size-7" />
            </span>
          </span>

          <span
            aria-hidden="true"
            className="text-cream absolute inset-x-0 bottom-5 text-center text-sm font-medium sm:bottom-7"
          >
            {video.label}
          </span>
        </button>
      )}
    </div>
  );
}
