/**
 * ============================================================================
 * CENTRAL CONTENT CONFIGURATION — FSP Catalyst Connect 3.0
 * ============================================================================
 * Every event fact, price, URL, date and piece of speaker information lives
 * here. Edit this file to update the site; no component should hard-code
 * event data.
 *
 * Anything marked `TODO_CONFIRM` is NOT yet verified. Those values are
 * rendered on the page as "to be confirmed" rather than guessed at.
 * Search this file for "TODO_CONFIRM" to find everything outstanding.
 * ============================================================================
 */

export const TODO_CONFIRM = "TODO_CONFIRM" as const;

/* -------------------------------------------------------------- brand ---- */
export const brand = {
  name: "FSP",
  fullName: "Facilitator Support Program",
  event: "Catalyst Connect 3.0",
  eventFull: "FSP Catalyst Connect 3.0",
  tagline: "Connect. Learn. Share. Grow.",
  headline: "Your Growth Is Not a Solo Journey.",
  description:
    "A powerful community gathering for trainers, facilitators, coaches, and learning professionals who believe in growing together.",
  /**
   * Official FSP Catalyst Connect logo. Brand colours: navy #0F1940,
   * amber #FAA81C — these drive the whole site palette in globals.css.
   *
   * Three assets ship in /public/brand/:
   *   logo-reversed.png              navy recoloured to warm white, amber kept
   *                                  — used on the dark canvas
   *   logo-colour.png                original colours, cropped
   *                                  — for light backgrounds, email, print
   *   fsp-catalyst-connect-logo.png  untouched original as supplied
   */
  logo: {
    src: "/brand/logo-reversed.png",
    srcColour: "/brand/logo-colour.png",
    alt: "FSP Catalyst Connect",
    width: 714,
    height: 442,
    /** The reversed asset is already light, so no CSS filter is applied. */
    needsReversing: false,
  },
} as const;

/* -------------------------------------------------------------- event ---- */
export const event = {
  /** Machine-readable date, used for <time> and structured data. */
  isoDate: "2026-11-22",
  dayOfWeek: "Sunday",
  dateLabel: "22 November 2026",
  dateLabelLong: "Sunday, 22 November 2026",

  city: "Chennai",
  country: "India",
  locationLabel: "Chennai, India",

  /** TODO_CONFIRM — exact venue has not been announced. */
  venue: TODO_CONFIRM,
  venueFallback: "Exact venue to be confirmed",

  /** TODO_CONFIRM — start/end times have not been supplied. */
  startTime: TODO_CONFIRM,
  endTime: TODO_CONFIRM,

  price: {
    /** Member price. TODO_CONFIRM — subject to confirmation of current pricing and eligibility. */
    memberAmount: 1999,
    memberLabel: "₹1,999",
    currency: "INR",
    note: "Member price, subject to confirmation of current pricing and eligibility.",
  },
} as const;

/* -------------------------------------------------------------- video ---- */
/**
 * Hero video.
 *
 * The page does NOT embed the YouTube player on load — it shows `poster` with
 * a play button and only loads the iframe when someone clicks it. That keeps
 * the hero fast and sends nothing to YouTube until the visitor opts in.
 *
 * If you change `id`, refresh the poster too:
 *   curl -s "https://i.ytimg.com/vi/<ID>/maxresdefault.jpg" \
 *     -o public/video/catalyst-connect-poster.jpg
 */
export const video = {
  provider: "youtube" as const,
  id: "nIEqBprksns",
  /** Used as the iframe title and the play button's accessible name. */
  title: "FSP Catalyst Connect",
  poster: "/video/catalyst-connect-poster.jpg",
  posterWidth: 1280,
  posterHeight: 720,
  /** Shown under the play button. */
  label: "Watch the film",
} as const;

/* ------------------------------------------------------- registration ---- */
/**
 * TODO_CONFIRM — no registration destination has been supplied.
 *
 * When the Google Form / registration platform / payment link is ready:
 *   1. set `url` to the real destination
 *   2. set `isPlaceholder` to false
 * Every CTA on the page reads from here, so that is the only change needed.
 */
export const registration = {
  url: null as string | null,
  isPlaceholder: true,
  /** Where CTAs point while the real URL is missing. */
  fallbackAnchor: "#event-information",
  ctaPrimary: "Register Now",
  ctaFinal: "Register for Catalyst Connect 3.0",
  ctaSecondary: "Discover the Experience",
  placeholderNote: "Registration link to be confirmed.",
} as const;

/* ------------------------------------------------------------ speaker ---- */
/**
 * Only the name, role and organisation supplied in the brief are used.
 * No credentials, achievements, awards or session titles are invented.
 */
export const speaker = {
  name: "Prakash Sharma",
  role: "Leadership Coach",
  organisation: "Bija Training Pvt. Ltd.",
  /**
   * TODO_CONFIRM — PROVENANCE.
   *
   * The supplied portrait carries a four-pointed sparkle watermark in its
   * lower-right corner, which indicates it was AI-generated rather than
   * photographed. It was supplied and confirmed for use by FSP.
   *
   * This is worth revisiting: the image sits under the name of a real, named
   * person at a real organisation, so a synthetic likeness misrepresents him
   * to every visitor. Replacing it with a genuine photograph of Prakash Sharma
   * is a one-line change here.
   *
   * The image is rendered uncropped at its natural aspect ratio and the
   * watermark is left intact — do not crop or retouch it out, as removing an
   * AI provenance mark is what turns a generated image into a deceptive one.
   */
  portrait: "/speakers/prakash-sharma.jpg" as string | null,
  portraitWidth: 864,
  portraitHeight: 1184,
  intro:
    "Prakash Sharma joins Catalyst Connect 3.0 as our special guest. He works as a Leadership Coach with Bija Training Pvt. Ltd., and will be spending the session in conversation with the FSP community.",
  /** TODO_CONFIRM — session title / topic not announced. */
  sessionTitle: TODO_CONFIRM,
} as const;

export const priyaRamasamy = {
  name: "Priya Ramasamy",
  role: "Emcee | Soft Skills Trainer | Public Speaking Coach",
  organisation: null,
  portrait: "/speakers/priya-ramasamy.jpeg" as string | null,
  portraitWidth: 853,
  portraitHeight: 1280,
  highlights: [
    { value: "10+", label: "Years in Public Speaking" },
    { value: "250+", label: "Events Hosted" },
    { value: "5,000+", label: "People Trained" },
  ],
  biography: [
    "Hailing from Tiruppur, Priya Ramasamy is an MBA graduate from Bengaluru and a communication professional with a diverse corporate background in training, merchandising, purchasing and sales.",
    "Her soft skills sessions use interactive activities and practical learning to help people overcome hesitation and communicate with confidence. She brings energy, creativity and a warm stage presence to her work as an emcee, voice-over artist and video presenter for various brands.",
    "A JCI member since 2024, Priya has completed Effective Public Speaking, Speechcraft and Zyla, earning Outstanding Participant recognition in all three programmes. She is working towards becoming a JCI Zone Trainer.",
    "Passionate about music, singing, dancing and travel, Priya believes in continuous learning, meaningful connections and the power of communication to inspire and transform lives.",
  ],
} as const;

export const karunaiPrakash = {
  name: "Karunai Prakash",
  role: "Team Building & Leadership Coach",
  organisation: null,
  portrait: "/speakers/karunai-prakash.png" as string | null,
  portraitWidth: 500,
  portraitHeight: 700,
  highlights: [
    { value: "10+", label: "Years of Experience" },
    { value: "600+", label: "Team-Building OBT Programs" },
    { value: "3", label: "International Programs" },
  ],
  biography: [
    "Karunai Prakash is a mechanical engineer by education and a professional trainer by passion. He is a Certified Professional Trainer in the Design and Facilitation of Experiential Learning from IIPE, Canada, and an NLP Master Practitioner.",
    "With over 10 years of experience, he specializes in team building, employee engagement, outbound leadership training, and Train the Trainer programs. He has conducted more than 600 team-building OBT programs across India and facilitated three international programs.",
    "Known for his dynamic sessions combining humour, interactive activities, and real-world case studies, Karunai helps organizations strengthen collaboration, leadership, and team performance.",
    "He previously worked at Hindustan Coca-Cola Beverages Pvt. Ltd. and gained training experience with Live Life Education.",
    "His philosophy is simple: true leadership means empowering others, fostering collaboration, and inspiring teams to reach their full potential.",
  ],
} as const;

export const panelDiscussionLeader = {
  name: "Sharon Priyanka",
  role: "Counselling Psychologist | Experiential Trainer | Educator",
  organisation: null,
  // Actual photograph supplied by the user.
  portrait: "/speakers/sharon-priyanka.jpeg" as string | null,
  portraitWidth: 1200,
  portraitHeight: 1600,
  careerHighlight: "7+",
  careerHighlightLabel: "Years in the Field of Psychology",
  biography: [
    "Sharon Priyanka is the Founder of Just Bee Wellbeing Services, a compassionate counselling psychologist and passionate facilitator who brings elements of presence and play into her sessions.",
    "She holds an MSc in Counselling Psychology from Christ (Deemed to be University), Bangalore, and a Bachelor's degree in Psychology from Women's Christian College, Chennai.",
    "She is also a Certified Professional Trainer in the Design and Facilitation of Experiential Learning from the International Institute for Professional Excellence (IIPE), Canada.",
    "Through her sessions and training programs, she aims to make psychology and mental healthcare more engaging, practical, and accessible.",
  ],
} as const;

/* ------------------------------------------------------- past edition ---- */
/**
 * The 60+ figure belongs to the August 2026 edition only.
 * Do not reuse it as a projection for 3.0.
 */
export const pastEdition = {
  label: "August 2026 edition",
  attendees: "60+",
  attendeesContext:
    "60+ participants joined the August 2026 edition of Catalyst Connect, travelling in from different parts of Tamil Nadu.",
  region: "Tamil Nadu",
  /**
   * Real FSP Catalyst Connect session photography, supplied by FSP.
   *
   * TODO_CONFIRM — that these three are from the August 2026 edition
   * specifically. They sit in a section about that edition, so if any is from
   * a different gathering either move it or soften the surrounding copy.
   *
   * Alt text describes only what is visibly happening; no speaker is named,
   * since the people in frame have not been identified.
   */
  photos: [
    {
      src: "/community/session-01.jpg",
      alt: "A facilitator presenting at an FSP Catalyst Connect session, beside a slide listing uniqueness, presence, emotional connection and relevance.",
      width: 1200,
      height: 1800,
    },
    {
      src: "/community/session-02.jpg",
      alt: "A facilitator speaking into a microphone at an FSP Catalyst Connect session while participants raise their hands to respond.",
      width: 1200,
      height: 1800,
    },
    {
      src: "/community/session-03.jpg",
      alt: "A facilitator addressing the room with a microphone at an FSP Catalyst Connect session.",
      width: 1200,
      height: 1800,
    },
  ] as { src: string; alt: string; width: number; height: number }[],
} as const;

/* --------------------------------------------------------- navigation ---- */
export const navLinks = [
  { label: "The Challenge", href: "#challenge" },
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Speaker", href: "#speaker" },
  { label: "Event Info", href: "#event-information" },
  { label: "FAQ", href: "#faq" },
] as const;

/* ------------------------------------------------- shared photography ---- */
/**
 * Real FSP Catalyst Connect event photography, supplied by FSP.
 *
 * TODO_CONFIRM — which edition this group photo is from. Captions that use it
 * stay neutral until that is confirmed; do not attribute it to a specific date
 * or tie it to an attendance figure without checking.
 */
export const communityPhoto = {
  src: "/community/catalyst-connect-group.jpg",
  alt: "Participants at an FSP Catalyst Connect gathering standing together on the steps outside the venue, giving a thumbs up to the camera.",
  width: 1920,
  height: 1281,
} as const;

/* ---------------------------------------------------------- section 2 ---- */
export const challenge = {
  eyebrow: "The Challenge",
  headline: "Being a Trainer Can Feel Like a Solo Journey.",
  body: [
    "You design the session alone. You deliver it alone. You drive home and replay the room in your head — alone.",
    "There is no team debrief, no corridor conversation, no one who instinctively understands why a particular activity landed flat or why that one quiet participant mattered more than the rest.",
    "Growth in this profession rarely arrives from another certificate. It arrives from the people who understand the work, who ask the sharper question and who have already stood where you are standing.",
  ],
  points: [
    {
      title: "Few people to think out loud with",
      body: "Independent trainers often have no peer group to test ideas against before a session goes live.",
    },
    {
      title: "Feedback is hard to come by",
      body: "Client feedback tells you whether they were happy. It rarely tells you how to get better.",
    },
    {
      title: "The craft keeps moving",
      body: "Formats, expectations and room dynamics shift. Staying current alone takes a great deal of energy.",
    },
  ],
} as const;

/* ---------------------------------------------------------- section 3 ---- */
export const about = {
  eyebrow: "About Catalyst Connect",
  headline: "More Than a Meetup. A Community That Moves You Forward.",
  body: [
    "Catalyst Connect brings facilitators into the same room for a day built around learning from each other rather than being talked at.",
    "It is part peer learning, part knowledge sharing, part the kind of unhurried conversation that turns a contact into a collaborator. People arrive with questions from their own practice and leave with perspectives they could not have reached on their own.",
  ],
  photo: {
    ...communityPhoto,
    caption: "Catalyst Connect — the room in conversation.",
  },
  pillars: [
    "Learning together",
    "Knowledge sharing",
    "Meaningful relationships",
    "Potential collaboration",
  ],
} as const;

/* ---------------------------------------------------------- section 4 ---- */
export const experience = {
  eyebrow: "The Experience",
  headline: "What the Day Is Built Around.",
  intro:
    "Four things shape every Catalyst Connect gathering. None of them happen by accident.",
  cards: [
    {
      id: "connections",
      icon: "Users",
      title: "Meaningful Connections",
      body: "Time and space to meet people who do what you do — long enough for the conversation to get past introductions and into the actual work.",
    },
    {
      id: "perspectives",
      icon: "Lightbulb",
      title: "Fresh Perspectives",
      body: "Someone in the room has already solved the thing you are stuck on, and will happily tell you how. Different practices, different industries, different answers.",
    },
    {
      id: "collaboration",
      icon: "Handshake",
      title: "Collaboration Opportunities",
      body: "Co-facilitation, referrals, shared proposals and projects that need more than one pair of hands often begin as a conversation at a gathering like this.",
    },
    {
      id: "growth",
      icon: "TrendingUp",
      title: "Collective Growth",
      body: "When one facilitator raises their standard, the people around them follow. Growth here compounds across the whole community.",
    },
  ],
} as const;

/* ---------------------------------------------------------- section 7 ---- */
export const audience = {
  eyebrow: "Who Should Attend",
  headline: "Built for People Who Hold the Room.",
  intro:
    "You help others grow. Here is a space to invest in your own growth?through fresh perspectives, shared experiences and people who understand your work.",
  roles: [
    { title: "Corporate Trainers", icon: "Presentation", description: "Exchange practical ideas for engaging teams and making workplace learning stick." },
    { title: "Soft Skills Trainers", icon: "MessageSquare", description: "Explore fresh approaches to communication, confidence and people skills." },
    { title: "Facilitators", icon: "Users", description: "Share ways to spark participation, guide conversations and bring groups together." },
    { title: "Coaches", icon: "Compass", description: "Connect with peers who help people reflect, find direction and take action." },
    { title: "Learning & Development Professionals", icon: "GraduationCap", description: "Bring fresh perspectives to learning experiences and the challenges your teams face." },
    { title: "Aspiring Independent Trainers", icon: "Sprout", description: "Learn from fellow practitioners as you shape your voice and your training journey." },
  ],
} as const;

/* ---------------------------------------------------------- section 9 ---- */
/**
 * `needsConfirmation: true` marks an answer that depends on an event policy
 * which has not been confirmed. Those answers say so plainly rather than
 * stating a policy that may turn out to be wrong.
 */
export const faqs = [
  {
    q: "Who can attend Catalyst Connect?",
    a: "Catalyst Connect is built for corporate trainers, soft skills trainers, facilitators, coaches, Learning & Development professionals, and those preparing to go independent. If facilitation is part of how you work, you will find your people in the room.",
    needsConfirmation: false,
  },
  {
    q: "What can I expect from the event?",
    a: "A day built around peer learning and knowledge sharing rather than a lecture. Expect conversations with other facilitators, fresh perspectives on your own practice, and a session with our special guest, Prakash Sharma, Leadership Coach at Bija Training Pvt. Ltd. A detailed agenda will be shared closer to the date.",
    needsConfirmation: true,
  },
  {
    q: "Where will the event take place?",
    a: "Catalyst Connect 3.0 takes place in Chennai, India on Sunday, 22 November 2026. The exact venue is being finalised and will be confirmed ahead of the event.",
    needsConfirmation: true,
  },
  {
    q: "What is the registration fee?",
    a: "The member price is ₹1,999. This is subject to confirmation of current pricing and eligibility — please check the latest details with the FSP team before registering.",
    needsConfirmation: true,
  },
  {
    q: "How do I register?",
    a: "Registration for Catalyst Connect 3.0 is opening shortly. The registration link will be published on this page and shared with the FSP community as soon as it is live.",
    needsConfirmation: true,
  },
  {
    q: "Is the event open to non-FSP members?",
    a: "The price listed above is the member price. Eligibility and pricing for non-members has not been confirmed yet — please reach out to the FSP team for the current position.",
    needsConfirmation: true,
  },
] as const;

/* --------------------------------------------------------- section 10 ---- */
export const finalCta = {
  headline: "Your Next Connection Could Change Your Journey.",
  body: "You don't have to grow alone. Connect with people who understand your world and believe in the power of learning.",
} as const;

/* ------------------------------------------------------------- footer ---- */
/**
 * TODO_CONFIRM — no contact address, phone number or social profiles supplied.
 * Add entries here and they render automatically; empty arrays render nothing.
 */
export const contact = {
  email: null as string | null,
  phone: null as string | null,
  socials: [] as { label: string; href: string; icon: string }[],
} as const;

/* ---------------------------------------------------------------- SEO ---- */
export const seo = {
  title: "FSP Catalyst Connect 3.0 — Your Growth Is Not a Solo Journey",
  description:
    "A community gathering for trainers, facilitators, coaches and L&D professionals. Chennai, India — Sunday, 22 November 2026. Connect. Learn. Share. Grow.",
  /** TODO_CONFIRM — set once the site has a live domain. */
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  /** TODO_CONFIRM — add a 1200x630 share image at /public/og.png */
  ogImage: null as string | null,
  locale: "en_IN",
} as const;
