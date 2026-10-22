import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { brand, event, seo } from "@/config/site";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/geist-latin.woff2",
  weight: "100 900",
  variable: "--font-geist-sans",
  display: "swap",
});

const instrumentSerif = localFont({
  src: [
    { path: "./fonts/instrument-serif-latin.woff2", weight: "400", style: "normal" },
    { path: "./fonts/instrument-serif-latin-italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-instrument-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(seo.siteUrl),
  title: seo.title,
  description: seo.description,
  keywords: [
    "FSP",
    "Facilitator Support Program",
    "Catalyst Connect",
    "trainer community",
    "facilitators",
    "corporate trainers",
    "L&D professionals",
    "Chennai",
  ],
  openGraph: {
    type: "website",
    locale: seo.locale,
    title: seo.title,
    description: seo.description,
    siteName: brand.eventFull,
    url: "/",
    // TODO_CONFIRM: add a 1200x630 share image and set seo.ogImage
    ...(seo.ogImage ? { images: [{ url: seo.ogImage, width: 1200, height: 630 }] } : {}),
  },
  twitter: {
    card: "summary_large_image",
    title: seo.title,
    description: seo.description,
    ...(seo.ogImage ? { images: [seo.ogImage] } : {}),
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#080d20",
  colorScheme: "dark",
};

/** Event structured data — only facts that are confirmed in the config. */
function EventJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: brand.eventFull,
    description: brand.description,
    startDate: event.isoDate,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: event.locationLabel,
      address: {
        "@type": "PostalAddress",
        addressLocality: event.city,
        addressCountry: event.country,
      },
    },
    organizer: { "@type": "Organization", name: brand.fullName },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-IN"
      className={`${geistSans.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="bg-ink text-cream flex min-h-full flex-col">
        <a
          href="#main"
          className="bg-accent text-on-accent sr-only rounded-full px-5 py-3 font-semibold focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100]"
        >
          Skip to content
        </a>
        {children}
        <EventJsonLd />
      </body>
    </html>
  );
}
