/**
 * Self-contained, FREE FAQ chatbot.
 * No external API, no monthly cost — just keyword matching against
 * a curated set of Q&A pairs in 4 languages.
 *
 * Add/edit FAQs below as the showcase evolves.
 */

export type Locale = "de" | "en" | "fr" | "it";

export type Faq = {
  id: string;
  /** Keywords trigger the FAQ when any one appears in the user's input. */
  keywords: Record<Locale, string[]>;
  /** Pre-written answer per locale. */
  answer: Record<Locale, string>;
};

export const FAQS: Faq[] = [
  {
    id: "location",
    keywords: {
      de: ["wo", "lage", "ort", "adresse", "befindet", "liegt"],
      en: ["where", "location", "address", "located"],
      fr: ["ou", "où", "adresse", "emplacement", "situé"],
      it: ["dove", "indirizzo", "posizione", "ubicazione", "trovate"],
    },
    answer: {
      de: "Wir liegen auf der Riederalp im Wallis, auf 1925 Metern, am Rand des Aletschwaldes. Adresse: Furkastrasse 14, 3987 Riederalp.",
      en: "We're on the Riederalp in Valais, at 1,925 metres, at the edge of the Aletschwald. Address: Furkastrasse 14, 3987 Riederalp.",
      fr: "Nous sommes sur la Riederalp en Valais, à 1925 mètres, à la lisière de l'Aletschwald. Adresse : Furkastrasse 14, 3987 Riederalp.",
      it: "Ci troviamo sulla Riederalp in Vallese, a 1925 metri, sul margine dell'Aletschwald. Indirizzo: Furkastrasse 14, 3987 Riederalp.",
    },
  },
  {
    id: "access",
    keywords: {
      de: ["anreise", "anfahrt", "ankommen", "bahn", "auto", "parkplatz", "seilbahn", "moerel", "mörel"],
      en: ["how to get", "directions", "travel", "train", "cable car", "drive", "parking", "moerel", "mörel"],
      fr: ["comment venir", "acces", "accès", "train", "telepherique", "téléphérique", "voiture", "parking"],
      it: ["come arrivare", "accesso", "treno", "funivia", "auto", "parcheggio"],
    },
    answer: {
      de: "Mit der Bahn nach Mörel (BLS), dann mit der Seilbahn auf die Riederalp — etwa 15 Minuten von der Tür zur Tür. Das Dorf ist autofrei, Parkplätze gibt es im Tal.",
      en: "Train to Mörel (BLS), then cable car up to the Riederalp — about 15 minutes door to door. The village is car-free; parking is down in the valley.",
      fr: "Train jusqu'à Mörel (BLS), puis téléphérique jusqu'à la Riederalp — environ 15 minutes porte à porte. Le village est sans voiture ; le parking est dans la vallée.",
      it: "Treno fino a Mörel (BLS), poi funivia per la Riederalp — circa 15 minuti dalla porta alla porta. Il villaggio è senza auto; il parcheggio è in valle.",
    },
  },
  {
    id: "rooms",
    keywords: {
      de: ["zimmer", "stuben", "stube", "wie viele", "anzahl"],
      en: ["rooms", "how many rooms", "what rooms"],
      fr: ["chambres", "combien de chambres", "quelles chambres"],
      it: ["camere", "quante camere", "che camere"],
    },
    answer: {
      de: "Wir haben vier Stuben: Arvenstube (Doppel, ab CHF 320), Blauseeli (Einzel, ab CHF 280), Fiescher (Familie, ab CHF 410) und Konkordia (Suite, ab CHF 540). Auf der Seite Stuben finden Sie alle Details.",
      en: "We have four rooms: Arvenstube (double, from CHF 320), Blauseeli (single, from CHF 280), Fiescher (family, from CHF 410) and Konkordia (suite, from CHF 540). Full details on the Rooms page.",
      fr: "Nous avons quatre chambres : Arvenstube (double, dès CHF 320), Blauseeli (single, dès CHF 280), Fiescher (familiale, dès CHF 410) et Konkordia (suite, dès CHF 540). Tous les détails sur la page Chambres.",
      it: "Abbiamo quattro camere: Arvenstube (doppia, da CHF 320), Blauseeli (singola, da CHF 280), Fiescher (familiare, da CHF 410) e Konkordia (suite, da CHF 540). Tutti i dettagli nella pagina Camere.",
    },
  },
  {
    id: "price",
    keywords: {
      de: ["preis", "preise", "kostet", "kosten", "tarif", "günstig", "guenstig"],
      en: ["price", "prices", "cost", "rate", "rates", "how much"],
      fr: ["prix", "tarif", "coute", "coûte", "combien"],
      it: ["prezzo", "prezzi", "costa", "tariffa", "quanto"],
    },
    answer: {
      de: "Die Stuben gehen von CHF 280 bis CHF 540 pro Nacht, je nach Grösse. Halbpension kostet CHF 78 pro Person. Während der Festtage (22.12.–4.1.) gilt ein Aufschlag von 35 % bei Mindestaufenthalt von vier Nächten.",
      en: "Rooms range from CHF 280 to CHF 540 per night depending on size. Half board is CHF 78 per person. During the festive period (22 Dec–4 Jan) a 35% surcharge applies with a minimum 4-night stay.",
      fr: "Les chambres vont de CHF 280 à CHF 540 par nuit selon la taille. La demi-pension coûte CHF 78 par personne. Pendant les fêtes (22.12–4.1) un supplément de 35 % s'applique avec un séjour minimum de quatre nuits.",
      it: "Le camere vanno da CHF 280 a CHF 540 a notte secondo la grandezza. La mezza pensione costa CHF 78 a persona. Nel periodo natalizio (22.12–4.1) si applica un supplemento del 35% con soggiorno minimo di quattro notti.",
    },
  },
  {
    id: "booking",
    keywords: {
      de: ["buchen", "reservieren", "reservation", "wie buche"],
      en: ["book", "booking", "reserve", "reservation", "how do i book"],
      fr: ["reserver", "réserver", "reservation", "réservation", "comment réserver"],
      it: ["prenotare", "prenotazione", "come prenoto"],
    },
    answer: {
      de: "Sie können direkt über das Formular auf unserer Seite reservieren — fünf einfache Schritte. Oder rufen Sie uns an unter +41 27 928 00 23.",
      en: "You can reserve directly through the form on our site — five simple steps. Or call us on +41 27 928 00 23.",
      fr: "Vous pouvez réserver directement via le formulaire sur notre site — cinq étapes simples. Ou appelez-nous au +41 27 928 00 23.",
      it: "Potete prenotare direttamente dal modulo sul nostro sito — cinque semplici passaggi. Oppure chiamateci allo +41 27 928 00 23.",
    },
  },
  {
    id: "cancellation",
    keywords: {
      de: ["storno", "stornieren", "absagen", "rücktritt", "ruecktritt"],
      en: ["cancel", "cancellation", "refund"],
      fr: ["annulation", "annuler", "annulé"],
      it: ["annullamento", "annullare", "cancellazione"],
    },
    answer: {
      de: "Bis sieben Tage vor Ihrer Anreise können Sie kostenlos stornieren. Danach behalten wir die Anzahlung von 30 % ein.",
      en: "You can cancel free of charge up to seven days before your arrival. After that, the 30% deposit is retained.",
      fr: "Vous pouvez annuler gratuitement jusqu'à sept jours avant votre arrivée. Au-delà, l'acompte de 30 % est retenu.",
      it: "Potete annullare gratuitamente fino a sette giorni prima dell'arrivo. Dopo, l'acconto del 30% viene trattenuto.",
    },
  },
  {
    id: "deposit",
    keywords: {
      de: ["anzahlung", "vorauszahlung", "zahlung", "bezahlen", "twint"],
      en: ["deposit", "payment", "pay", "twint"],
      fr: ["acompte", "paiement", "payer", "twint"],
      it: ["acconto", "pagamento", "pagare", "twint"],
    },
    answer: {
      de: "Eine Anzahlung von 30 % ist bei der Reservation fällig. Sie können mit Karte oder Twint bezahlen. Den Restbetrag begleichen Sie bei der Anreise.",
      en: "A 30% deposit is due on booking. You can pay by card or Twint. The balance is settled on arrival.",
      fr: "Un acompte de 30 % est dû à la réservation. Vous pouvez payer par carte ou Twint. Le solde se règle à l'arrivée.",
      it: "Un acconto del 30% è dovuto alla prenotazione. Potete pagare con carta o Twint. Il saldo si paga all'arrivo.",
    },
  },
  {
    id: "pets",
    keywords: {
      de: ["hund", "hunde", "haustier", "haustiere", "katze"],
      en: ["pet", "pets", "dog", "dogs", "cat"],
      fr: ["chien", "chiens", "animaux", "animal"],
      it: ["cane", "cani", "animali", "animale"],
    },
    answer: {
      de: "Brave Hunde sind willkommen. Es fällt eine kleine Reinigungsgebühr an. Bitte geben Sie uns bei der Reservation Bescheid.",
      en: "Well-behaved dogs are welcome. A small cleaning fee applies. Please let us know at the time of booking.",
      fr: "Les chiens calmes sont les bienvenus. Un petit forfait de nettoyage s'applique. Indiquez-le-nous à la réservation.",
      it: "I cani educati sono benvenuti. Si applica un piccolo supplemento per la pulizia. Indicatelo alla prenotazione.",
    },
  },
  {
    id: "children",
    keywords: {
      de: ["kind", "kinder", "kinderbett", "familien"],
      en: ["children", "kids", "child", "family"],
      fr: ["enfant", "enfants", "famille"],
      it: ["bambino", "bambini", "famiglia"],
    },
    answer: {
      de: "Kinder sind willkommen. Die Stuben Fiescher und Konkordia haben Schlafkojen für Kinder. In den anderen Stuben kann ein Kinderbett auf Anfrage gestellt werden.",
      en: "Children are welcome. Rooms Fiescher and Konkordia have child berths. A cot can be arranged on request in the other rooms.",
      fr: "Les enfants sont les bienvenus. Les chambres Fiescher et Konkordia ont des couchettes pour enfants. Un lit bébé peut être ajouté sur demande dans les autres chambres.",
      it: "I bambini sono benvenuti. Le camere Fiescher e Konkordia hanno giacigli per bambini. Su richiesta possiamo aggiungere un lettino nelle altre camere.",
    },
  },
  {
    id: "breakfast",
    keywords: {
      de: ["frühstück", "fruehstueck", "essen", "verpflegung", "halbpension", "abendessen"],
      en: ["breakfast", "meal", "meals", "dinner", "half board", "food"],
      fr: ["petit-déjeuner", "petit dejeuner", "repas", "diner", "dîner", "demi-pension"],
      it: ["colazione", "pasto", "pasti", "cena", "mezza pensione"],
    },
    answer: {
      de: "Ein einfaches Frühstück ist im Zimmerpreis inbegriffen. Halbpension (Frühstück und viergängiges Abendessen in der Stube) kostet CHF 78 pro Person — das Menü kocht Annelies, je nach Markt und Saison.",
      en: "A simple breakfast is included in every room rate. Half board (breakfast and a four-course dinner in the parlour) is CHF 78 per person — Annelies cooks the menu, depending on the market and season.",
      fr: "Un petit-déjeuner simple est inclus dans toutes les chambres. La demi-pension (petit-déjeuner et dîner quatre services dans la Stube) coûte CHF 78 par personne — c'est Annelies qui cuisine, selon le marché et la saison.",
      it: "Una colazione semplice è inclusa in ogni camera. La mezza pensione (colazione e cena di quattro portate nella Stube) costa CHF 78 a persona — Annelies cucina secondo il mercato e la stagione.",
    },
  },
  {
    id: "wifi",
    keywords: {
      de: ["wlan", "wifi", "internet"],
      en: ["wifi", "wi-fi", "internet"],
      fr: ["wifi", "internet"],
      it: ["wifi", "internet"],
    },
    answer: {
      de: "WLAN ist im ganzen Haus kostenlos verfügbar. In den Bergen ist die Verbindung manchmal schwächer als im Tal — aber für Lesen und E-Mails reicht es immer.",
      en: "Wi-Fi is free throughout the house. In the mountains the connection is sometimes weaker than down in the valley — but it's always enough for reading and email.",
      fr: "Le wifi est gratuit dans toute la maison. À la montagne, la connexion est parfois plus faible qu'en plaine — mais elle suffit toujours pour lire et envoyer des courriels.",
      it: "Il wifi è gratuito in tutta la casa. In montagna la connessione a volte è più debole che in pianura — ma basta sempre per leggere e per le e-mail.",
    },
  },
  {
    id: "hours",
    keywords: {
      de: ["öffnungszeiten", "oeffnungszeiten", "uhrzeit", "rezeption", "wann offen", "check"],
      en: ["hours", "opening", "reception", "open", "check-in", "check-out"],
      fr: ["horaires", "ouverture", "réception", "reception", "check-in", "check-out"],
      it: ["orari", "apertura", "reception", "check-in", "check-out"],
    },
    answer: {
      de: "Die Réception ist täglich von 7.30 bis 22.00 Uhr besetzt. Die Stube serviert von 12 bis 14 und von 18.30 bis 21.30 Uhr. Check-in ab 15 Uhr, Check-out bis 11 Uhr.",
      en: "Reception is open 7.30–22.00 daily. The dining room serves 12.00–14.00 and 18.30–21.30. Check-in from 15.00, check-out by 11.00.",
      fr: "La réception est ouverte de 7h30 à 22h00 tous les jours. La salle sert de 12h à 14h et de 18h30 à 21h30. Arrivée dès 15h, départ jusqu'à 11h.",
      it: "La reception è aperta dalle 7.30 alle 22.00 tutti i giorni. La sala serve dalle 12 alle 14 e dalle 18.30 alle 21.30. Check-in dalle 15, check-out entro le 11.",
    },
  },
  {
    id: "languages",
    keywords: {
      de: ["sprachen", "sprache", "sprechen", "deutsch", "französisch", "englisch"],
      en: ["languages", "speak", "english", "french", "german", "italian"],
      fr: ["langues", "parlez", "anglais", "francais", "français", "allemand"],
      it: ["lingue", "parlate", "inglese", "francese", "tedesco", "italiano"],
    },
    answer: {
      de: "Wir sprechen Deutsch, Englisch, Französisch und Italienisch.",
      en: "We speak German, English, French and Italian.",
      fr: "Nous parlons allemand, anglais, français et italien.",
      it: "Parliamo tedesco, inglese, francese e italiano.",
    },
  },
  {
    id: "festtage",
    keywords: {
      de: ["weihnachten", "silvester", "festtage", "neujahr"],
      en: ["christmas", "new year", "festive", "holidays"],
      fr: ["noel", "noël", "nouvel an", "fêtes", "fetes"],
      it: ["natale", "capodanno", "feste"],
    },
    answer: {
      de: "Während der Festtage (22. Dezember bis 4. Januar) gilt ein Aufschlag von 35 % auf den Zimmerpreis und ein Mindestaufenthalt von vier Nächten.",
      en: "During the festive period (22 December to 4 January) a 35% surcharge applies and a minimum stay of four nights.",
      fr: "Pendant les fêtes (22 décembre au 4 janvier) un supplément de 35 % s'applique et un séjour minimum de quatre nuits.",
      it: "Durante il periodo natalizio (22 dicembre – 4 gennaio) si applica un supplemento del 35% e un soggiorno minimo di quattro notti.",
    },
  },
  {
    id: "around",
    keywords: {
      de: ["umgebung", "ausflug", "wandern", "ski", "gletscher", "aletsch", "in der nähe", "naehe"],
      en: ["nearby", "around", "hiking", "skiing", "glacier", "aletsch", "what to do"],
      fr: ["environs", "à faire", "randonnée", "randonnee", "ski", "glacier", "aletsch"],
      it: ["dintorni", "escursione", "sci", "ghiacciaio", "aletsch", "cosa fare"],
    },
    answer: {
      de: "Direkt vor der Tür liegt der Aletschwald, der grösste Arvenwald der Alpen. Im Sommer beginnt der Höhenweg, im Winter die Loipe. Der Aletschgletscher (UNESCO-Welterbe) ist eine Tagestour entfernt.",
      en: "The Aletschwald — the largest stone pine forest in the Alps — starts at the door. In summer the high traverse begins here; in winter, the cross-country trail. The Aletsch glacier (UNESCO World Heritage) is one day's walk away.",
      fr: "Devant la porte commence l'Aletschwald, la plus grande forêt de pins cembro des Alpes. L'été, le sentier de haute altitude part d'ici ; l'hiver, la piste de fond. Le glacier d'Aletsch (UNESCO) est à une journée de marche.",
      it: "Davanti alla porta inizia l'Aletschwald, la più grande foresta di pino cembro delle Alpi. D'estate parte da qui il sentiero d'alta quota; d'inverno la pista di fondo. Il ghiacciaio d'Aletsch (UNESCO) è a una giornata di cammino.",
    },
  },
  {
    id: "smoking",
    keywords: {
      de: ["rauchen", "raucher", "zigarette"],
      en: ["smoking", "smoke", "cigarette"],
      fr: ["fumer", "fumeur", "cigarette"],
      it: ["fumare", "fumatori", "sigaretta"],
    },
    answer: {
      de: "Im Haus ist Rauchen nicht gestattet. Auf den Balkonen und im Garten ist es kein Problem.",
      en: "Smoking is not allowed inside the house. On the balconies and in the garden it's no problem.",
      fr: "Il n'est pas permis de fumer dans la maison. Sur les balcons et au jardin, aucun souci.",
      it: "Non è permesso fumare in casa. Sui balconi e in giardino nessun problema.",
    },
  },
  {
    id: "contact",
    keywords: {
      de: ["telefon", "kontakt", "anrufen", "email", "e-mail", "schreiben"],
      en: ["phone", "contact", "call", "email", "write"],
      fr: ["telephone", "téléphone", "contact", "appeler", "courriel", "ecrire", "écrire"],
      it: ["telefono", "contatto", "chiamare", "email", "scrivere"],
    },
    answer: {
      de: "Telefon: +41 27 928 00 23 · E-Mail: hallo@chalet-aletsch.ch. Wir antworten meist innerhalb eines Tages.",
      en: "Phone: +41 27 928 00 23 · Email: hallo@chalet-aletsch.ch. We usually reply within a day.",
      fr: "Téléphone : +41 27 928 00 23 · Courriel : hallo@chalet-aletsch.ch. Nous répondons généralement dans la journée.",
      it: "Telefono: +41 27 928 00 23 · E-mail: hallo@chalet-aletsch.ch. Di solito rispondiamo entro la giornata.",
    },
  },
];

/** Common one-click suggestions shown when the chat opens. */
export const SUGGESTIONS: Record<Locale, Array<{ label: string; faqId: string }>> = {
  de: [
    { label: "Wo seid ihr?", faqId: "location" },
    { label: "Wie viel kostet eine Stube?", faqId: "price" },
    { label: "Wie reise ich an?", faqId: "access" },
    { label: "Stornobedingungen?", faqId: "cancellation" },
    { label: "Sind Hunde erlaubt?", faqId: "pets" },
  ],
  en: [
    { label: "Where are you?", faqId: "location" },
    { label: "How much per night?", faqId: "price" },
    { label: "How do I get there?", faqId: "access" },
    { label: "Cancellation policy?", faqId: "cancellation" },
    { label: "Are pets allowed?", faqId: "pets" },
  ],
  fr: [
    { label: "Où êtes-vous ?", faqId: "location" },
    { label: "Combien par nuit ?", faqId: "price" },
    { label: "Comment venir ?", faqId: "access" },
    { label: "Annulation ?", faqId: "cancellation" },
    { label: "Chiens autorisés ?", faqId: "pets" },
  ],
  it: [
    { label: "Dove siete?", faqId: "location" },
    { label: "Quanto costa a notte?", faqId: "price" },
    { label: "Come arrivare?", faqId: "access" },
    { label: "Annullamento?", faqId: "cancellation" },
    { label: "Si accettano cani?", faqId: "pets" },
  ],
};

/** Normalise a string for matching: lowercase + strip diacritics. */
function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/ß/g, "ss")
    .replace(/[^\w\s'’]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Match a user's message to the best FAQ.
 * Returns the answer for the locale, or null if no FAQ matched well enough.
 */
export function matchFaq(
  input: string,
  locale: Locale,
): { faqId: string; answer: string } | null {
  const norm = normalize(input);
  if (!norm) return null;

  let best: { faq: Faq; score: number } | null = null;
  for (const faq of FAQS) {
    const keywords = faq.keywords[locale] ?? faq.keywords.en;
    let score = 0;
    for (const kw of keywords) {
      const k = normalize(kw);
      if (!k) continue;
      if (norm.includes(k)) score += k.length; // longer matches score higher
    }
    if (score > 0 && (!best || score > best.score)) {
      best = { faq, score };
    }
  }

  if (!best) return null;
  return { faqId: best.faq.id, answer: best.faq.answer[locale] };
}

export function getFaqAnswerById(id: string, locale: Locale): string | null {
  const faq = FAQS.find((f) => f.id === id);
  return faq ? faq.answer[locale] : null;
}
