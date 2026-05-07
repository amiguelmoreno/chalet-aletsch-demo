/**
 * Hand-written sample blog posts shown on /blog when Sanity has no real
 * content yet (or isn't configured). Once posts exist in Sanity for a
 * given locale, those replace the samples for that locale.
 *
 * Voice: same as the rest of the site — heritage Walliser inn, restrained,
 * concrete details, no marketing-speak. Each post is a short note (~120 words).
 */

export type Locale = "de" | "en" | "fr" | "it";

export type SampleNote = {
  id: string;
  title: string;
  publishedAt: string; // ISO date
  author: string;
  excerpt: string;
  body: string[]; // paragraphs
};

export const SAMPLE_NOTES: Record<Locale, SampleNote[]> = {
  de: [
    {
      id: "erster-schnee-2026",
      title: "Der erste Schnee",
      publishedAt: "2026-10-29",
      author: "Annelies Imboden-Truffer",
      excerpt:
        "Heute Morgen lag eine dünne Decke auf den Steinen vor der Haustür. Walter sagt, jetzt geht es schnell.",
      body: [
        "Heute Morgen, kurz vor sieben, lag eine dünne weisse Decke auf den Steinen vor der Haustür. Sie ist im Laufe des Vormittags wieder verschwunden, aber die Luft hat sich verändert. Es riecht nach Holzrauch aus dem Tal.",
        "Walter, unser Bergführer, sagt, jetzt geht es schnell. Er rechnet mit dem ersten richtigen Wintertag in zwei Wochen. Der Specksteinofen wird heute angefeuert. Wer Mitte November kommt, sollte mit Schneeschuhen rechnen.",
      ],
    },
    {
      id: "brot-vom-sonntag",
      title: "Vom Brot, das wir am Sonntag backen",
      publishedAt: "2026-09-12",
      author: "Annelies Imboden-Truffer",
      excerpt:
        "Walliser Roggenbrot, drei Mehle, zwölf Stunden Teigruhe. Niemand erfindet hier etwas neu.",
      body: [
        "Walliser Roggenbrot besteht aus drei Mehlen: Roggen, Weizen und ein wenig Gerste, dazu Sauerteig, Wasser und Salz. Wir verwenden das Mehl der Mühle in Naters; den Sauerteig führe ich seit 1998. Mehr ist es nicht.",
        "Der Teig ruht zwölf Stunden. Sonntags um sechs Uhr früh kommen die Laibe in den Holzofen, der noch von der Glut des Vorabends warm ist. Um halb acht ist das Brot fertig. Um acht riecht das ganze Haus danach. Niemand erfindet hier etwas neu.",
      ],
    },
    {
      id: "edelweiss-am-hoehenweg",
      title: "Edelweiss am Höhenweg",
      publishedAt: "2026-07-04",
      author: "Annelies Imboden-Truffer",
      excerpt:
        "Drei Stunden ab unserer Tür, kurz vor der Bettmeralp. Bringen Sie keine Schere mit.",
      body: [
        "Das Edelweiss blüht zwischen Mitte Juli und Mitte August, am liebsten auf kalkhaltigem Schiefer in der Sonne. Etwa drei Stunden zu Fuss von uns entfernt, am Höhenweg in Richtung Bettmeralp, gibt es einen Hang, an dem es jedes Jahr von neuem auftaucht.",
        "Bitte bringen Sie keine Schere und keine Tüte mit. Edelweiss ist im Wallis geschützt; wir sehen es lieber dort, wo es ist, und kommen im nächsten Jahr wieder. Walter zeigt den Weg, wenn Sie ihn fragen.",
      ],
    },
  ],
  en: [
    {
      id: "first-snow-2026",
      title: "The first snow",
      publishedAt: "2026-10-29",
      author: "Annelies Imboden-Truffer",
      excerpt:
        "There was a thin white cover on the stones outside the door this morning. Walter says it goes quickly now.",
      body: [
        "Just before seven this morning a thin layer of snow lay on the stones outside our front door. It had disappeared by midday, but the air has changed. It smells of wood smoke from down in the valley.",
        "Walter, our mountain guide, reckons the first proper winter day will arrive in about two weeks. The soapstone stove is being lit tonight. If you're coming in mid-November, expect snowshoes.",
      ],
    },
    {
      id: "sunday-bread",
      title: "On the bread we bake on Sundays",
      publishedAt: "2026-09-12",
      author: "Annelies Imboden-Truffer",
      excerpt:
        "Valaisan rye bread: three flours, twelve hours of rest, no innovations.",
      body: [
        "Valaisan rye bread is made from three flours: rye, wheat and a small amount of barley, with sourdough, water and salt. We use flour from the mill at Naters; I've been keeping the sourdough since 1998. That's all there is.",
        "The dough rests for twelve hours. On Sunday at six in the morning the loaves go into the wood-fired oven, still warm from the embers of the night before. By half past seven the bread is done. By eight the whole house smells of it. No one is reinventing anything here.",
      ],
    },
    {
      id: "edelweiss-höhenweg",
      title: "Edelweiss along the high traverse",
      publishedAt: "2026-07-04",
      author: "Annelies Imboden-Truffer",
      excerpt:
        "Three hours from our front door, just before Bettmeralp. Please don't bring scissors.",
      body: [
        "Edelweiss flowers between mid-July and mid-August, by preference on chalky schist in the sun. About three hours' walk from us, on the high traverse towards Bettmeralp, there is a slope where it returns every year.",
        "Please don't bring scissors or a bag. Edelweiss is protected in Valais; we prefer to see it where it is and return the following year. Walter will show you the path if you ask him.",
      ],
    },
  ],
  fr: [
    {
      id: "premiere-neige-2026",
      title: "La première neige",
      publishedAt: "2026-10-29",
      author: "Annelies Imboden-Truffer",
      excerpt:
        "Une fine couverture blanche sur les pierres devant la porte ce matin. Walter dit que ça ira vite maintenant.",
      body: [
        "Ce matin, peu avant sept heures, une fine couche de neige reposait sur les pierres devant la porte d'entrée. Elle avait disparu à midi, mais l'air a changé. Il sent la fumée de bois depuis la vallée.",
        "Walter, notre guide, estime que le premier vrai jour d'hiver arrivera dans environ deux semaines. Le poêle en stéatite sera allumé ce soir. Si vous venez à la mi-novembre, comptez sur les raquettes.",
      ],
    },
    {
      id: "pain-du-dimanche",
      title: "Sur le pain que nous cuisons le dimanche",
      publishedAt: "2026-09-12",
      author: "Annelies Imboden-Truffer",
      excerpt:
        "Pain de seigle valaisan : trois farines, douze heures de repos. Personne n'invente rien ici.",
      body: [
        "Le pain de seigle valaisan se fait avec trois farines : seigle, blé et un peu d'orge, plus du levain, de l'eau et du sel. Nous utilisons la farine du moulin de Naters ; je conduis le levain depuis 1998. Il n'y a rien d'autre.",
        "La pâte repose douze heures. Le dimanche à six heures, les pains entrent dans le four à bois, encore chaud des braises de la veille. À sept heures et demie, le pain est cuit. À huit heures, toute la maison en sent. Personne n'invente rien ici.",
      ],
    },
    {
      id: "edelweiss-haute-route",
      title: "L'edelweiss sur le sentier de haute altitude",
      publishedAt: "2026-07-04",
      author: "Annelies Imboden-Truffer",
      excerpt:
        "Trois heures depuis notre porte, juste avant Bettmeralp. N'apportez pas de ciseaux.",
      body: [
        "L'edelweiss fleurit entre mi-juillet et mi-août, de préférence sur le schiste calcaire au soleil. À environ trois heures de marche d'ici, sur le sentier de haute altitude vers Bettmeralp, il y a une pente où il revient chaque année.",
        "Merci de ne pas apporter de ciseaux ni de sac. L'edelweiss est protégé en Valais ; nous préférons le voir là où il est et revenir l'année suivante. Walter vous indiquera le chemin si vous le lui demandez.",
      ],
    },
  ],
  it: [
    {
      id: "prima-neve-2026",
      title: "La prima neve",
      publishedAt: "2026-10-29",
      author: "Annelies Imboden-Truffer",
      excerpt:
        "Stamattina una sottile coltre bianca sulle pietre davanti alla porta. Walter dice che ora va veloce.",
      body: [
        "Stamattina, poco prima delle sette, una sottile coltre bianca posava sulle pietre davanti alla porta. È sparita a mezzogiorno, ma l'aria è cambiata. Sa di legna bruciata dalla valle.",
        "Walter, la nostra guida, calcola che il primo vero giorno d'inverno arriverà fra circa due settimane. La stufa in pietra ollare la accendiamo stasera. Chi viene a metà novembre porti le racchette da neve.",
      ],
    },
    {
      id: "pane-della-domenica",
      title: "Sul pane che cuociamo la domenica",
      publishedAt: "2026-09-12",
      author: "Annelies Imboden-Truffer",
      excerpt:
        "Pane di segale vallesano: tre farine, dodici ore di riposo. Qui nessuno inventa niente.",
      body: [
        "Il pane di segale vallesano si fa con tre farine: segale, frumento e un poco d'orzo, più lievito madre, acqua e sale. Usiamo la farina del mulino di Naters; il lievito madre lo conservo dal 1998. Non c'è altro.",
        "L'impasto riposa dodici ore. La domenica alle sei i pani entrano nel forno a legna, ancora caldo dalle braci della sera prima. Alle sette e mezza il pane è pronto. Alle otto tutta la casa profuma. Qui nessuno inventa niente.",
      ],
    },
    {
      id: "stella-alpina-sentiero",
      title: "Stella alpina lungo il sentiero d'alta quota",
      publishedAt: "2026-07-04",
      author: "Annelies Imboden-Truffer",
      excerpt:
        "Tre ore dalla nostra porta, poco prima di Bettmeralp. Per favore, non portate forbici.",
      body: [
        "La stella alpina fiorisce fra metà luglio e metà agosto, preferibilmente su scisto calcareo al sole. A circa tre ore a piedi da noi, sul sentiero d'alta quota verso Bettmeralp, c'è un pendio dove ricompare ogni anno.",
        "Per favore, non portate forbici né sacchetti. La stella alpina è protetta in Vallese; preferiamo vederla dov'è e tornare l'anno seguente. Walter vi indica il sentiero se glielo chiedete.",
      ],
    },
  ],
};
