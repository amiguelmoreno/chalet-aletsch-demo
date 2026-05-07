/**
 * Hand-written sample reviews shown in the Guestbook carousel when the
 * database has fewer than four approved reviews for the active locale.
 *
 * Voice: heritage Walliser guesthouse — concrete details (the bread, the
 * stove, a specific room), no marketing-speak, no superlatives.
 */

export type Locale = "de" | "en" | "fr" | "it";

export type SampleReview = {
  id: string;
  body: string;
  authorName: string;
  /** Hometown of the guest, displayed alongside the name. */
  location: string;
  rating: number; // 1..5
  publishedAt: string; // ISO date
};

export const SAMPLE_REVIEWS: Record<Locale, SampleReview[]> = {
  de: [
    {
      id: "lehnherr",
      body: "Selten sind wir so weit gefahren, um so wenig zu tun. Es war genau richtig.",
      authorName: "Familie Lehnherr",
      location: "Bern",
      rating: 5,
      publishedAt: "2026-02-14",
    },
    {
      id: "marti",
      body: "Das Brot vom Sonntag, der Specksteinofen, die Stille im Aletschwald. Wir haben Annelies versprochen, im Februar wiederzukommen.",
      authorName: "Hans und Verena Marti",
      location: "Aarau",
      rating: 5,
      publishedAt: "2025-11-03",
    },
    {
      id: "burkhalter",
      body: "Drei Tage Regen, drei Bücher gelesen, dreimal Halbpension. Die Stube Konkordia ist ein Trost an Schlechtwettertagen.",
      authorName: "Dr. M. Burkhalter",
      location: "Zürich",
      rating: 5,
      publishedAt: "2025-09-21",
    },
    {
      id: "frischknecht",
      body: "Ich war zum Schreiben hier. Die Blauseeli mit ihrem schmalen Sekretär ist genau das, was meine Lektorin vorgeschlagen hatte.",
      authorName: "Lena Frischknecht",
      location: "St. Gallen",
      rating: 5,
      publishedAt: "2025-06-12",
    },
    {
      id: "studer",
      body: "Zwei Wochen mit zwei Kindern in der Fiescher. Der Specksteinofen wärmte uns Abend für Abend. Walter zeigte den Buben Steinböcke oberhalb des Riedergletschers.",
      authorName: "Familie Studer",
      location: "Thun",
      rating: 4,
      publishedAt: "2025-04-08",
    },
    {
      id: "henchoz",
      body: "Wir kamen wegen des Gletschers, blieben wegen des Roggenbrots. Und wegen Annelies' Geschichten am Specksteinofen.",
      authorName: "Pierre und Sophie Henchoz",
      location: "Lausanne",
      rating: 5,
      publishedAt: "2024-12-30",
    },
  ],
  en: [
    {
      id: "lehnherr",
      body: "Rarely have we travelled so far to do so little. It was exactly right.",
      authorName: "The Lehnherr family",
      location: "Bern",
      rating: 5,
      publishedAt: "2026-02-14",
    },
    {
      id: "marti",
      body: "The Sunday bread, the soapstone stove, the silence of the Aletsch forest. We promised Annelies we would be back in February.",
      authorName: "Hans and Verena Marti",
      location: "Aarau",
      rating: 5,
      publishedAt: "2025-11-03",
    },
    {
      id: "burkhalter",
      body: "Three days of rain, three books read, three half-board dinners. The Konkordia suite is a comfort on bad-weather days.",
      authorName: "Dr. M. Burkhalter",
      location: "Zürich",
      rating: 5,
      publishedAt: "2025-09-21",
    },
    {
      id: "frischknecht",
      body: "I came here to write. The Blauseeli, with its narrow secretary desk, is exactly what my editor had suggested.",
      authorName: "Lena Frischknecht",
      location: "St. Gallen",
      rating: 5,
      publishedAt: "2025-06-12",
    },
    {
      id: "studer",
      body: "Two weeks with two children in the Fiescher. The soapstone stove kept us warm evening after evening. Walter showed the boys ibex above the Rieder glacier.",
      authorName: "The Studer family",
      location: "Thun",
      rating: 4,
      publishedAt: "2025-04-08",
    },
    {
      id: "henchoz",
      body: "We came for the glacier, stayed for the rye bread. And for Annelies' stories beside the soapstone stove.",
      authorName: "Pierre and Sophie Henchoz",
      location: "Lausanne",
      rating: 5,
      publishedAt: "2024-12-30",
    },
  ],
  fr: [
    {
      id: "lehnherr",
      body: "Rarement nous avons voyagé si loin pour faire si peu. C'était exactement ce qu'il fallait.",
      authorName: "Famille Lehnherr",
      location: "Berne",
      rating: 5,
      publishedAt: "2026-02-14",
    },
    {
      id: "marti",
      body: "Le pain du dimanche, le poêle en stéatite, le silence de la forêt d'Aletsch. Nous avons promis à Annelies de revenir en février.",
      authorName: "Hans et Verena Marti",
      location: "Aarau",
      rating: 5,
      publishedAt: "2025-11-03",
    },
    {
      id: "burkhalter",
      body: "Trois jours de pluie, trois livres lus, trois demi-pensions. La suite Konkordia est un réconfort par mauvais temps.",
      authorName: "Dr M. Burkhalter",
      location: "Zurich",
      rating: 5,
      publishedAt: "2025-09-21",
    },
    {
      id: "frischknecht",
      body: "Je suis venue pour écrire. Le Blauseeli, avec son petit secrétaire, est exactement ce que mon éditrice m'avait suggéré.",
      authorName: "Lena Frischknecht",
      location: "Saint-Gall",
      rating: 5,
      publishedAt: "2025-06-12",
    },
    {
      id: "studer",
      body: "Deux semaines avec deux enfants dans le Fiescher. Le poêle en stéatite nous a tenus au chaud soir après soir. Walter a montré aux garçons des bouquetins au-dessus du glacier de Rieder.",
      authorName: "Famille Studer",
      location: "Thoune",
      rating: 4,
      publishedAt: "2025-04-08",
    },
    {
      id: "henchoz",
      body: "Nous sommes venus pour le glacier, restés pour le pain de seigle. Et pour les histoires d'Annelies au coin du poêle.",
      authorName: "Pierre et Sophie Henchoz",
      location: "Lausanne",
      rating: 5,
      publishedAt: "2024-12-30",
    },
  ],
  it: [
    {
      id: "lehnherr",
      body: "Raramente abbiamo viaggiato così lontano per fare così poco. Era esattamente ciò che serviva.",
      authorName: "Famiglia Lehnherr",
      location: "Berna",
      rating: 5,
      publishedAt: "2026-02-14",
    },
    {
      id: "marti",
      body: "Il pane della domenica, la stufa in pietra ollare, il silenzio della foresta dell'Aletsch. Abbiamo promesso ad Annelies di tornare a febbraio.",
      authorName: "Hans e Verena Marti",
      location: "Aarau",
      rating: 5,
      publishedAt: "2025-11-03",
    },
    {
      id: "burkhalter",
      body: "Tre giorni di pioggia, tre libri letti, tre mezze pensioni. La suite Konkordia è una consolazione nei giorni di brutto tempo.",
      authorName: "Dr. M. Burkhalter",
      location: "Zurigo",
      rating: 5,
      publishedAt: "2025-09-21",
    },
    {
      id: "frischknecht",
      body: "Sono venuta per scrivere. La Blauseeli, con il suo piccolo scrittoio, è esattamente ciò che mi aveva suggerito la mia redattrice.",
      authorName: "Lena Frischknecht",
      location: "San Gallo",
      rating: 5,
      publishedAt: "2025-06-12",
    },
    {
      id: "studer",
      body: "Due settimane con due bambini nella Fiescher. La stufa in pietra ollare ci ha tenuti al caldo sera dopo sera. Walter ha mostrato ai ragazzi gli stambecchi sopra il ghiacciaio del Rieder.",
      authorName: "Famiglia Studer",
      location: "Thun",
      rating: 4,
      publishedAt: "2025-04-08",
    },
    {
      id: "henchoz",
      body: "Siamo venuti per il ghiacciaio, siamo rimasti per il pane di segale. E per i racconti di Annelies accanto alla stufa.",
      authorName: "Pierre e Sophie Henchoz",
      location: "Losanna",
      rating: 5,
      publishedAt: "2024-12-30",
    },
  ],
};
