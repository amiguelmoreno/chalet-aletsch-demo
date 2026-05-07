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
        "https://images.unsplash.com/photo-1722603931808-d5ddd71f4924?w=1600&q=80&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1723258345401-793598c38e10?w=1600&q=80&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1722650364897-33fb86a44592?w=1600&q=80&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1645640929991-867520dce42a?w=1600&q=80&auto=format&fit=crop",
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
        "https://images.unsplash.com/photo-1721824297615-bdce9177708d?w=1600&q=80&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1721743170664-55c9602291ac?w=1600&q=80&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1721396187257-a2bcdabb25c0?w=1600&q=80&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1606602266678-d29114013ac6?w=1600&q=80&auto=format&fit=crop",
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
        "https://images.unsplash.com/photo-1631941392209-70cad44ecfb7?w=1600&q=80&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1698933787104-3f91cf25909c?w=1600&q=80&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1631756964162-25c8c07579b5?w=1600&q=80&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1721396187827-8606a4a6b4e3?w=1600&q=80&auto=format&fit=crop",
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
        "https://images.unsplash.com/photo-1774627868171-0a08bcc8d9ca?w=1600&q=80&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1670914120781-4b7c8512fc41?w=1600&q=80&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1773423391716-04e278b07b1b?w=1600&q=80&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1551927411-95e412943b58?w=1600&q=80&auto=format&fit=crop",
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
