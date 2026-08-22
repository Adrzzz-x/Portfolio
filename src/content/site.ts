import type { StaticImageData } from "next/image";
import galleryFremantle from "@/assets/images/gallery-fremantle.jpeg";
import galleryPortraitCasual from "@/assets/images/gallery-portrait-casual.jpeg";

// hero-portrait.jpg, gallery-shed.jpg and swiftstatement-screenshot.png were re-fetched from the
// Claude Design canvas truncated (a 256KB response cap on the design-import tool) and fail to
// decode — Next's build-time image processing hard-crashes on a static import of a corrupt file,
// so these three are intentionally NOT imported. They render as labeled placeholders below until
// re-exported cleanly from the canvas and dropped into src/assets/images/.

export type NavItem = { label: string; href: string };

export type StatItem = { value: string; unit?: string; label: string };

export type CaseStudy = {
  id: string;
  period: string;
  role: string;
  badge?: string;
  title: string;
  description: string;
  tags: string[];
  ctaLabel: string;
  ctaHref: string;
  screenshot?: { src?: StaticImageData; alt: string; unoptimized?: boolean; pendingLabel?: string };
  placeholderLabel?: string;
};

export type Principle = { title: string; description: string };

export type CollagePhoto = {
  type: "photo";
  src?: StaticImageData;
  alt: string;
  rotationDeg: number;
  unoptimized?: boolean;
  pendingLabel?: string;
};

export type CollageVideo = {
  type: "video";
  posterSrc: string;
  videoSrc: string;
  alt: string;
  rotationDeg: number;
};

export type CollageItem = CollagePhoto | CollageVideo;

// The header nav labels don't literally match section titles on the page —
// "SwiftStatement" has a real dedicated case-study page now that the demo exists;
// "AFG Platform" and "Flying" point at in-page sections (no dedicated pages for those yet).
export const navItems: NavItem[] = [
  { label: "SwiftStatement", href: "/swiftstatement" },
  { label: "AFG Platform", href: "#afg-platform" },
  { label: "Flying", href: "#the-rest-of-me" },
];

export const cvHref = "#"; // placeholder — no CV file uploaded yet

export const hero = {
  eyebrow: "Product Owner & AI Native Designer · Perth, WA",
  heading: "Adrian Mullee",
  intro:
    "I'm a Product Owner in regulated fintech. I lead teams to ship things that work — and lately I design and prototype them myself. Here's one you can actually use.",
  primaryCta: { label: "See SwiftStatement →", href: "/swiftstatement" },
  secondaryCta: { label: "Download CV", href: cvHref },
  portrait: {
    alt: "Adrian Mullee, product owner and designer, portrait photo",
    pendingLabel: "Portrait pending re-export",
  },
};

export const stats: StatItem[] = [
  { value: "13", label: "devs & QAs at peak team size" },
  { value: "45", unit: "min", label: "cut from every home-loan lodgement at AFG" },
  { value: "2", label: "products taken from 0→1" },
  { value: "5", unit: "yrs", label: "in regulated fintech" },
];

export const workSection = {
  eyebrow: "Selected work",
  heading: "Two things worth clicking",
};

export const caseStudies: CaseStudy[] = [
  {
    id: "swiftstatement",
    period: "2025–2026 · Product Owner & Designer",
    role: "Product Owner & Designer",
    badge: "Live demo",
    title: "SwiftStatement",
    description:
      "Daily invoice reconciliation tool for businesses buying on a trade account. Replaces a month-end matching job that used to take a full day. In production with 100 users.",
    tags: ["Fintech", "Xero & MYOB plugin"],
    ctaLabel: "Try the live demo →",
    ctaHref: "/swiftstatement",
    screenshot: {
      alt: "SwiftStatement app screenshot showing a trade account statement with unmatched invoices",
      pendingLabel: "Screenshot pending re-export",
    },
  },
  {
    id: "afg-platform",
    period: "2021–2024 · Product Owner",
    role: "Product Owner",
    title: "AFG Platform",
    description:
      "An industry-first API that let brokers lodge a home loan once, instead of rekeying it into three systems.",
    tags: ["API platform", "BDD", "Workshops"],
    ctaLabel: "Read the case study →",
    ctaHref: "#",
    placeholderLabel: "Before / after lodgement diagram",
  },
];

export const howIWork = {
  eyebrow: "How I work",
  principles: [
    {
      title: "Problem-led design",
      description:
        "I start with the problem, not a list of features. I'm not afraid to keep executives from jumping ahead to solution mode, whilst keeping them engaged and getting the best out of them.",
    },
    {
      title: "Make the intangible tangible",
      description:
        "At AFG, I created a product vision for an API that everyone could get behind - from the devs who were building it to the execs who were paying for it.",
    },
    {
      title: "Agile coach, not a purist",
      description:
        "Agile isn't about process and ceremonies. It's a mindset and I love building a team culture where we work together, embracing change to deliver valuable increments, iteratively.",
    },
    {
      title: "Ship with AI, not slides",
      description:
        "I design, prototype and pressure-test in AI tools, then hand developers something real. It shortens the distance between an idea and a decision about it.",
    },
  ] satisfies Principle[],
};

export const personalSection = {
  eyebrow: "The rest of me",
  heading: "Checklists, a shed, and Fremantle",
  paragraphs: [
    "I'm building an aircraft in a shed in Perth. It's a slow project that rewards checklists, tolerances and finishing a job properly before starting the next one — the same instinct I bring to regulated software, where the cost of getting it wrong isn't evenly distributed.",
    "Weekends are usually Fremantle, without much of a plan. For the last few years I've also worked on reconciliation and DEI inside the organisations I've been part of — mostly the unglamorous end of it: getting commitments written down, funded, and reported on.",
    "I'm looking for product and UX work in Perth or remote, in industry or consulting. What I want next is work where the outcome still matters to someone after the quarter closes.",
  ],
  collage: <CollageItem[]>[
    {
      type: "photo",
      src: galleryPortraitCasual,
      alt: "Adrian Mullee outdoors on a weekend in Fremantle",
      rotationDeg: -2,
    },
    {
      type: "photo",
      alt: "The aircraft build in progress in Adrian's shed",
      rotationDeg: 1.6,
      pendingLabel: "Photo pending re-export",
    },
    {
      type: "video",
      posterSrc: "/video/aircraft-build-poster.jpg",
      videoSrc: "/video/aircraft-build.mp4",
      alt: "Video clip of the aircraft build in the shed",
      rotationDeg: 1.2,
    },
    {
      type: "photo",
      src: galleryFremantle,
      alt: "Fremantle waterfront on a weekend walk",
      rotationDeg: -1.4,
    },
  ],
};

export const closingCta = {
  heading: "I'm looking for a product or design role with more purpose. Let's talk.",
  emailHref: "mailto:adrian.mullee@gmail.com",
  emailLabel: "adrian.mullee@gmail.com",
  linkedinHref: "#", // placeholder — no LinkedIn URL provided yet
  linkedinLabel: "LinkedIn ↗",
  cvLabel: "Download CV ↓",
  cvHref,
  location: "Perth / remote",
};
