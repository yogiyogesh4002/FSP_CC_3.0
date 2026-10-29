"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { video } from "@/config/site";

type VideoEmbedProps = {
  className?: string;
  /**
   * Self-hosted video file served from /public, e.g. "/videos/testimonial-1.mp4".
   * Takes precedence over `id` — nothing goes to YouTube at all.
   */
  src?: string | null;
  /** YouTube video id. Used when `src` is not set. Defaults to the hero film. */
  id?: string;
  /** Iframe/player title and the play button's accessible name. */
  title?: string;
  /** Local poster path. Null renders a branded panel instead of an image. */
  poster?: string | null;
  /** Caption under the play button. Null hides it. */
  label?: string | null;
  /** CSS aspect-ratio value. */
  ratio?: string;
  /**
   * Preload the poster in <head>. Only for an above-the-fold LCP candidate —
   * `priority` is deprecated in Next 16, so this maps to `preload`.
   */
  preload?: boolean;
  /** Image `sizes` hint. Defaults to the hero's full-width layout. */
  sizes?: string;
};

/**
 * Pause every other player on the page.
 *
 * Only one testimonial should ever be audible at a time, so starting one
 * stops the rest. Self-hosted files are paused directly; YouTube embeds are
 * asked to pause over postMessage, which is why the embed URL carries
 * `enablejsapi=1`. `except` is the element that is starting, so it is left alone.
 */
function stopOtherPlayers(except?: HTMLVideoElement | null) {
  for (const el of document.querySelectorAll("video")) {
    if (el !== except) el.pause();
  }

  for (const frame of document.querySelectorAll<HTMLIFrameElement>(
    'iframe[src*="youtube-nocookie.com"]',
  )) {
    frame.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func: "pauseVideo", args: "" }),
      "*",
    );
  }
}

/**
 * Click-to-load video facade.
 *
 * On load this renders only a poster image and a play button — no player, no
 * YouTube iframe, no third-party scripts, no cookies, and for a self-hosted
 * file not a single byte of the video itself. Everything is injected on the
 * first click, which keeps the page's LCP fast and means nothing is fetched
 * (or sent to YouTube) unless the visitor chooses to watch.
 *
 * YouTube embeds use youtube-nocookie.com, and the poster is served locally
 * rather than from ytimg so the page makes no external request at all before
 * interaction. A video with no poster yet still works — it falls back to an
 * accent panel.
 */
export function VideoEmbed({
  className = "",
  src = null,
  id = video.id,
  title = video.title,
  poster = video.poster,
  label = video.label,
  ratio = "16 / 9",
  preload = false,
  sizes = "(max-width: 1024px) 100vw, 1000px",
}: VideoEmbedProps) {
  const [playing, setPlaying] = useState(false);

  const embedSrc =
    `https://www.youtube-nocookie.com/embed/${id}` +
    `?autoplay=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`;

  return (
    <div
      className={`border-line-strong bg-ink-deep relative overflow-hidden rounded-2xl border shadow-[0_32px_80px_-24px_rgba(0,0,0,0.9)] sm:rounded-3xl ${className}`}
      style={{ aspectRatio: ratio }}
    >
      {playing ? (
        src ? (
          /* No <track kind="captions"> yet — no transcript or subtitle file
             has been supplied for this clip. Add one here when it exists. */
          <video
            src={src}
            title={title}
            poster={poster ?? undefined}
            onPlay={(e) => stopOtherPlayers(e.currentTarget)}
            controls
            autoPlay
            playsInline
            preload="auto"
            className="absolute inset-0 h-full w-full bg-black object-contain"
          />
        ) : (
          <iframe
            src={embedSrc}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        )
      ) : (
        <button
          type="button"
          onClick={() => {
            stopOtherPlayers();
            setPlaying(true);
          }}
          aria-label={`Play video: ${title}`}
          className="group absolute inset-0 h-full w-full cursor-pointer"
        >
          {poster ? (
            <Image
              src={poster}
              alt=""
              fill
              sizes={sizes}
              {...(preload ? { preload: true } : { loading: "lazy" as const })}
              className="object-cover transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.03]"
            />
          ) : (
            /* No poster frame supplied — a quiet accent panel stands in so the
               card still reads as a player rather than a broken image. */
            <span
              aria-hidden="true"
              className="from-accent/15 via-surface-2 to-ink-deep absolute inset-0 bg-gradient-to-br"
            />
          )}

          {/* Legibility scrim: a light overall wash so the amber control
              separates from a bright frame, plus a stronger foot for the
              caption. The wash lifts on hover to reward the pointer. */}
          <span
            aria-hidden="true"
            className="bg-ink-deep/25 absolute inset-0 transition-colors duration-500 group-hover:bg-transparent"
          />
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

          {label ? (
            <span
              aria-hidden="true"
              className="text-cream absolute inset-x-0 bottom-5 text-center text-sm font-medium sm:bottom-7"
            >
              {label}
            </span>
          ) : null}
        </button>
      )}
    </div>
  );
}
