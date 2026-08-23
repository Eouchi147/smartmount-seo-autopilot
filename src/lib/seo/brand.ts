export const SMART_MOUNT = {
  name: "Smart Mount",
  site: "https://smartmount.ca",
  commercial: "https://smartmount.ca/commercial.html",
  owner: "Sam",
  city: "Ottawa",
  region: "Ottawa & Gatineau",
  rating: 4.8,
  tvsMounted: 600,
  warranty: "1-year workmanship warranty",
  insured: true,
  voice: [
    "Professional, reliable, fast, transparent.",
    "Local Ottawa pride. Zero hype. Safety-focused.",
    "Speak like a trusted local expert who shows up on time and leaves the place cleaner than he found it.",
    "Never corporate, never salesy, never motivational-poster copy.",
    "Short sentences. Concrete details. Name the suburb when it matters.",
  ].join(" "),
  forbiddenPhrases: [
    "game-changer",
    "unlock",
    "elevate your space",
    "leverage",
    "cutting-edge",
    "revolutionize",
    "don't miss out",
    "limited time only",
  ],
  facts: [
    "Book now, mounted today. Not next week.",
    "Fully insured. 1-year workmanship warranty.",
    "Exact upfront pricing, taxes included. $25 deposit locks the day.",
    "Price-match: beat any written quote from a registered business.",
    "600+ TVs mounted. 4.8 Google rating.",
    "Bolted into solid wood studs — the bones of the wall.",
    "Wire hiding: slim cover $45 or in-wall $219.",
    "Flush, tilt, or full-motion mounts.",
    "Residential plus commercial: offices, restaurants, gyms, retail.",
    "Referral: friends get 10% off; you get 5% credit, at least $15.",
    "Eye-level from where you sit. No sore neck, no guessing.",
    "Commercial: written quote, after-hours installs, one invoice.",
  ],
  services: [
    "TV wall mounting (flush, tilt, full-motion)",
    "Samsung Frame and specialty TV installs",
    "Above-fireplace mounting",
    "Cable management (slim cover or in-wall)",
    "Soundbar mounting",
    "Computer monitor arms (single, dual, ultrawide)",
    "Commercial screens: menu boards, boardrooms, gyms, waiting rooms",
    "Ikea furniture assembly on the same visit",
  ],
  areas: [
    "Ottawa",
    "Gatineau",
    "Kanata",
    "Nepean",
    "Barrhaven",
    "Orléans",
    "Orleans",
    "Stittsville",
    "Aylmer",
    "Hull",
    "Westboro",
    "Centretown",
    "The Glebe",
    "Vanier",
    "Riverside South",
    "Manotick",
    "Greely",
    "Bell's Corners",
    "Hintonburg",
    "New Edinburgh",
  ],
  pricingNotes:
    "TV mounting priced through the build-your-install tool on smartmount.ca (taxes included). Monitor labour: $125 up to 34\", $165 for 35–44\", $189 for 45\"+ ultrawide. Single desk arm $99, dual $165, wall mount from $65. Slim cover $45, in-wall $219. $25 books the day. Price-match any written quote.",
  cta: "See your exact price and book at smartmount.ca — or chat if you would rather ask first.",
  bookingUrl: "https://smartmount.ca",
  testimonials: [
    {
      author: "Mikaela Z.",
      quote:
        "I had my television & sound bar mounted today along with cable management and I am very impressed. The technician was professional & knowledgeable.",
    },
    {
      author: "Patrick Y.",
      quote:
        "Sam called before he arrived, was very professional and left the work area clean. He hung our TV and put together some Ikea furniture.",
    },
    {
      author: "Myriah M.",
      quote:
        "10/10. The worker was kind, efficient, and did such a great job with the TV placement.",
    },
  ],
} as const;

export const CATEGORIES = [
  "core",
  "neighborhood",
  "intent",
  "commercial",
  "seasonal",
  "paa",
] as const;

export type KeywordCategory = (typeof CATEGORIES)[number];

export const CATEGORY_LABEL: Record<KeywordCategory, string> = {
  core: "Core service",
  neighborhood: "Neighborhood",
  intent: "Booking intent",
  commercial: "Commercial",
  seasonal: "Seasonal",
  paa: "People also ask",
};

export function opportunityScore(
  volume: number,
  competition: number,
  conversion: number,
): number {
  return Math.round(conversion * 0.45 + (100 - competition) * 0.35 + volume * 0.2);
}
