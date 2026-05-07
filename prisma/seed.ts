import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("· Seeding Chalet Aletsch …");

  const property = await prisma.property.upsert({
    where: { slug: "chalet-aletsch" },
    update: {},
    create: {
      slug: "chalet-aletsch",
      name: "Chalet Aletsch",
      taglineDe: "Berghaus seit MCMXXIII",
      taglineEn: "A mountain house since MCMXXIII",
      street: "Furkastrasse 14",
      zip: "3987",
      city: "Riederalp",
      country: "CH",
      email: "hallo@chalet-aletsch.ch",
      phone: "+41 27 928 00 23",
      iban: "CH00 0000 0000 0000 0000 0",
      vatNumber: null,
      uid: "CHE-XXX.XXX.XXX",
    },
  });

  const roomDefs = [
    {
      slug: "arvenstube",
      nameDe: "Arvenstube",
      nameEn: "Arvenstube",
      subtitleDe: "Doppelstube · Süd · Erdgeschoss",
      subtitleEn: "Double · south-facing · ground floor",
      capacity: 2,
      basePrice: 320,
      areaSqm: 22,
      position: 1,
      photos: [
        "https://picsum.photos/seed/arvenstube/1600/1000",
        "https://picsum.photos/seed/arvenstube-2/1600/1000",
        "https://picsum.photos/seed/arvenstube-3/1600/1000",
      ],
    },
    {
      slug: "blauseeli",
      nameDe: "Blauseeli",
      nameEn: "Blauseeli",
      subtitleDe: "Einzelstube · Ost · Erdgeschoss",
      subtitleEn: "Single · east-facing · ground floor",
      capacity: 1,
      basePrice: 280,
      areaSqm: 18,
      position: 2,
      photos: [
        "https://picsum.photos/seed/blauseeli/1600/1000",
        "https://picsum.photos/seed/blauseeli-2/1600/1000",
      ],
    },
    {
      slug: "fiescher",
      nameDe: "Fiescher",
      nameEn: "Fiescher",
      subtitleDe: "Familienstube · West · 1. Stock",
      subtitleEn: "Family · west-facing · first floor",
      capacity: 4,
      basePrice: 410,
      areaSqm: 36,
      position: 3,
      photos: [
        "https://picsum.photos/seed/fiescher/1600/1000",
        "https://picsum.photos/seed/fiescher-2/1600/1000",
        "https://picsum.photos/seed/fiescher-3/1600/1000",
      ],
    },
    {
      slug: "konkordia",
      nameDe: "Konkordia",
      nameEn: "Konkordia",
      subtitleDe: "Suite · Dachgeschoss",
      subtitleEn: "Suite · attic floor",
      capacity: 6,
      basePrice: 540,
      areaSqm: 58,
      position: 4,
      photos: [
        "https://picsum.photos/seed/konkordia/1600/1000",
        "https://picsum.photos/seed/konkordia-2/1600/1000",
        "https://picsum.photos/seed/konkordia-3/1600/1000",
        "https://picsum.photos/seed/konkordia-4/1600/1000",
      ],
    },
  ];

  for (const def of roomDefs) {
    const type = await prisma.roomType.upsert({
      where: { slug: def.slug },
      update: { ...def, propertyId: property.id },
      create: { ...def, propertyId: property.id },
    });
    await prisma.room.upsert({
      where: { roomTypeId_number: { roomTypeId: type.id, number: "1" } },
      update: {},
      create: { roomTypeId: type.id, number: "1" },
    });
  }

  const experienceDefs = [
    {
      slug: "halbpension",
      nameDe: "Halbpension",
      nameEn: "Half board",
      descriptionDe: "Frühstück und viergängiges Abendessen in der Stube.",
      descriptionEn: "Breakfast and a four-course dinner in the parlour.",
      unitPrice: 78,
      unit: "person",
    },
    {
      slug: "transfer-moerel",
      nameDe: "Bahnhoftransfer Mörel",
      nameEn: "Transfer from Mörel station",
      descriptionDe: "Abholung am Bahnhof Mörel und Begleitung mit der Seilbahn.",
      descriptionEn: "Pickup at Mörel station and accompaniment up the cable car.",
      unitPrice: 25,
      unit: "person",
    },
    {
      slug: "bergführer-tag",
      nameDe: "Bergführer · ein Tag",
      nameEn: "Mountain guide · one day",
      descriptionDe: "Geführte Tagestour mit unserem Hausbergführer Walter.",
      descriptionEn: "Guided day-hike with our house mountain guide Walter.",
      unitPrice: 480,
      unit: "day",
    },
    {
      slug: "raclette-abend",
      nameDe: "Raclette-Abend",
      nameEn: "Raclette evening",
      descriptionDe: "Walliser Raclette mit hausgemachten Beilagen am Specksteinofen.",
      descriptionEn: "Valaisan raclette with home-made sides by the soapstone stove.",
      unitPrice: 52,
      unit: "person",
    },
  ];

  for (const def of experienceDefs) {
    await prisma.experience.upsert({
      where: { slug: def.slug },
      update: { ...def, propertyId: property.id },
      create: { ...def, propertyId: property.id },
    });
  }

  // Seasonal pricing example — Christmas/New Year +35%
  await prisma.pricingRule.upsert({
    where: { id: "seed-xmas-2026" },
    update: {},
    create: {
      id: "seed-xmas-2026",
      name: "Festtage 2026/27",
      dateFrom: new Date("2026-12-22"),
      dateTo: new Date("2027-01-04"),
      multiplier: 1.35,
      minStay: 4,
      priority: 10,
      notes: "Festtagsaufschlag, Mindestaufenthalt vier Nächte.",
    },
  });

  // App settings — keys mirror Ginda's pattern
  const settings: Record<string, string> = {
    "business.name": "Chalet Aletsch",
    "business.email": "hallo@chalet-aletsch.ch",
    "business.phone": "+41 27 928 00 23",
    "business.iban": "CH00 0000 0000 0000 0000 0",
    "quotes.defaultValidityDays": "30",
    "invoices.defaultDueDays": "21",
  };
  for (const [key, value] of Object.entries(settings)) {
    await prisma.appSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value, category: "core" },
    });
  }

  console.log("✓ Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
