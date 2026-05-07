/**
 * Schema.org JSON-LD generators for Chalet Aletsch.
 * All builders return plain objects suitable for `JSON.stringify` inside
 * a `<script type="application/ld+json">` tag.
 */

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://chalet.morenodev.ch";

export const HOUSE = {
  name: "Chalet Aletsch",
  legalName: "Chalet Aletsch GmbH",
  street: "Furkastrasse 14",
  zip: "3987",
  city: "Riederalp",
  region: "Wallis",
  country: "CH",
  email: "hallo@chalet-aletsch.ch",
  phone: "+41279280023",
  founded: "1923-08-01",
  geo: { lat: 46.3833, lng: 8.0333 }, // Riederalp approx.
  priceRange: "CHF 280–540",
  starRating: 4,
  amenities: [
    "Free WiFi",
    "Mountain view",
    "Wood-burning stove",
    "Half board",
    "Pet friendly",
    "Ski-in / ski-out access",
  ],
  rooms: [
    { slug: "arvenstube", name: { de: "Arvenstube", en: "Arvenstube" }, capacity: 2, basePrice: 320 },
    { slug: "blauseeli", name: { de: "Blauseeli", en: "Blauseeli" }, capacity: 1, basePrice: 280 },
    { slug: "fiescher", name: { de: "Fiescher", en: "Fiescher" }, capacity: 4, basePrice: 410 },
    { slug: "konkordia", name: { de: "Konkordia", en: "Konkordia" }, capacity: 6, basePrice: 540 },
  ],
} as const;

const baseAddress = {
  "@type": "PostalAddress" as const,
  streetAddress: HOUSE.street,
  postalCode: HOUSE.zip,
  addressLocality: HOUSE.city,
  addressRegion: HOUSE.region,
  addressCountry: HOUSE.country,
};

const baseGeo = {
  "@type": "GeoCoordinates" as const,
  latitude: HOUSE.geo.lat,
  longitude: HOUSE.geo.lng,
};

export function lodgingBusinessJsonLd(locale: "de" | "en") {
  return {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    "@id": `${SITE_URL}/#business`,
    name: HOUSE.name,
    legalName: HOUSE.legalName,
    description:
      locale === "en"
        ? "A traditional Swiss alpine guest house on the Riederalp, in the shadow of the Aletsch glacier. Family-run since 1923."
        : "Ein traditionelles Berghaus auf der Riederalp im Schatten des Aletschgletschers. In Familienführung seit 1923.",
    url: SITE_URL,
    image: `${SITE_URL}/og.png`,
    telephone: HOUSE.phone,
    email: HOUSE.email,
    priceRange: HOUSE.priceRange,
    starRating: { "@type": "Rating", ratingValue: HOUSE.starRating },
    address: baseAddress,
    geo: baseGeo,
    foundingDate: HOUSE.founded,
    amenityFeature: HOUSE.amenities.map((amenity) => ({
      "@type": "LocationFeatureSpecification",
      name: amenity,
      value: true,
    })),
    sameAs: [],
    inLanguage: ["de", "en"],
    knowsLanguage: ["de", "en", "fr"],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "07:30",
        closes: "22:00",
      },
    ],
  };
}

export function hotelJsonLd(locale: "de" | "en") {
  return {
    "@context": "https://schema.org",
    "@type": "Hotel",
    "@id": `${SITE_URL}/#hotel`,
    name: HOUSE.name,
    url: SITE_URL,
    image: `${SITE_URL}/og.png`,
    telephone: HOUSE.phone,
    email: HOUSE.email,
    address: baseAddress,
    geo: baseGeo,
    priceRange: HOUSE.priceRange,
    starRating: { "@type": "Rating", ratingValue: HOUSE.starRating },
    amenityFeature: HOUSE.amenities.map((a) => ({
      "@type": "LocationFeatureSpecification",
      name: a,
      value: true,
    })),
    containsPlace: HOUSE.rooms.map((room) => ({
      "@type": "HotelRoom",
      "@id": `${SITE_URL}/${locale}/rooms#${room.slug}`,
      name: room.name[locale],
      occupancy: { "@type": "QuantitativeValue", maxValue: room.capacity },
      offers: {
        "@type": "Offer",
        price: room.basePrice,
        priceCurrency: "CHF",
        availability: "https://schema.org/InStock",
        url: `${SITE_URL}/${locale}/rooms`,
      },
    })),
  };
}

export function breadcrumbJsonLd(
  locale: string,
  trail: Array<{ name: string; href: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}/${locale}${item.href === "/" ? "" : item.href}`,
    })),
  };
}

export function faqJsonLd(faqs: Array<{ q: string; a: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function articleJsonLd(args: {
  title: string;
  description: string;
  url: string;
  image?: string;
  publishedAt?: string;
  author?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: args.title,
    description: args.description,
    image: args.image ?? `${SITE_URL}/og.png`,
    datePublished: args.publishedAt,
    author: { "@type": "Person", name: args.author ?? "Annelies Imboden-Truffer" },
    publisher: {
      "@type": "Organization",
      name: HOUSE.name,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/og.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": args.url },
  };
}
