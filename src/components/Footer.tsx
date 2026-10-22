import { Backdrop } from "./ui/Backdrop";
import Image from "next/image";
import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { brand, contact, event, navLinks } from "@/config/site";

/**
 * Contact details and social profiles render only when supplied in config.
 * Nothing is invented — if `contact` stays empty, the block is simply omitted.
 */
export function Footer() {
  const hasContact = contact.email || contact.phone || contact.socials.length > 0;

  return (
    <footer className="page-panel relative isolate border-line bg-ink-deep border-t">
      <Backdrop />
      <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr] lg:gap-16">
          {/* brand */}
          <div>
            <Image
              src={brand.logo.src}
              alt={brand.logo.alt}
              width={brand.logo.width}
              height={brand.logo.height}
              loading="lazy"
              sizes="130px"
              className={`h-20 w-auto ${
                brand.logo.needsReversing ? "opacity-90 brightness-0 invert" : ""
              }`}
            />
            <p className="text-cream-dim mt-6 max-w-sm text-sm leading-relaxed">
              {brand.description}
            </p>
            <p className="text-accent mt-6 text-sm font-medium">
              {brand.tagline}
            </p>
          </div>

          {/* navigation */}
          <nav aria-label="Footer">
            <h2 className="text-cream-faint text-xs font-semibold tracking-[0.16em] uppercase">
              Explore
            </h2>
            <ul className="mt-5 space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-cream-dim hover:text-accent text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* event summary + contact */}
          <div>
            <h2 className="text-cream-faint text-xs font-semibold tracking-[0.16em] uppercase">
              {brand.event}
            </h2>
            <ul className="text-cream-dim mt-5 space-y-3 text-sm">
              <li>
                <time dateTime={event.isoDate}>{event.dateLabelLong}</time>
              </li>
              <li>{event.locationLabel}</li>
              <li className="text-cream-faint">{event.venueFallback}</li>
            </ul>

            {hasContact && (
              <ul className="mt-6 space-y-3 text-sm">
                {contact.email && (
                  <li>
                    <a
                      href={`mailto:${contact.email}`}
                      className="text-cream-dim hover:text-accent inline-flex items-center gap-2 transition-colors"
                    >
                      <Mail aria-hidden="true" className="size-4" />
                      {contact.email}
                    </a>
                  </li>
                )}
                {contact.phone && (
                  <li>
                    <a
                      href={`tel:${contact.phone.replace(/\s+/g, "")}`}
                      className="text-cream-dim hover:text-accent inline-flex items-center gap-2 transition-colors"
                    >
                      <Phone aria-hidden="true" className="size-4" />
                      {contact.phone}
                    </a>
                  </li>
                )}
              </ul>
            )}

            {contact.socials.length > 0 && (
              <ul className="mt-6 flex gap-3">
                {contact.socials.map((social) => (
                  <li key={social.href}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border-line text-cream-dim hover:border-accent hover:text-accent grid size-10 place-items-center rounded-full border transition-colors"
                    >
                      <span className="sr-only">{social.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="border-line mt-14 flex flex-col gap-3 border-t pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-cream-faint text-xs">
            {/* Derived from the event date so the page stays fully static. */}©{" "}
            {event.isoDate.slice(0, 4)} {brand.fullName}. All rights reserved.
          </p>
          <p className="text-cream-faint text-xs">{brand.eventFull}</p>
        </div>
      </div>
    </footer>
  );
}
