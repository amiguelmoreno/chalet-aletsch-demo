import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Monogram } from "@/components/ornaments/Monogram";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Header() {
  const t = useTranslations("nav");

  const items: Array<{ key: string; href: string }> = [
    { key: "rooms", href: "/rooms" },
    { key: "story", href: "/story" },
    { key: "blog", href: "/blog" },
    { key: "contact", href: "/contact" },
  ];

  return (
    <header className="border-b border-ink-700/10 bg-parchment-50/85 backdrop-blur-[2px] above-grain sticky top-0 z-30">
      {/* Top hairline strip — like an old letterhead margin */}
      <div className="border-b border-ink-700/10 bg-forest-800 text-parchment-100">
        <Container className="flex items-center justify-between py-2.5">
          <span className="editorial-caps-sm">Riederalp · Wallis · Schweiz</span>
          <span className="hidden md:inline editorial-caps-sm">+41 27 928 00 23</span>
          <LanguageSwitcher />
        </Container>
      </div>

      <Container className="flex items-center justify-between py-5 md:py-7">
        <Link
          href="/"
          className="flex items-center gap-3 group"
          aria-label="Chalet Aletsch — Startseite"
        >
          <Monogram size={56} className="transition-opacity duration-300 group-hover:opacity-80" />
          <span className="hidden md:flex flex-col leading-none">
            <span className="font-display text-[1.55rem] tracking-tight text-ink-700">
              Chalet Aletsch
            </span>
            <span className="editorial-caps mt-1 text-forest-700">
              {t("tagline")}
            </span>
          </span>
        </Link>

        <nav aria-label="Hauptmenü" className="hidden md:flex items-center gap-10">
          {items.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="editorial-caps text-ink-700 hover:text-seal transition-colors"
            >
              {t(item.key)}
            </Link>
          ))}
          <Link
            href="/booking/new"
            className="editorial-caps border border-ink-700 px-5 py-2.5 text-ink-700 hover:bg-ink-700 hover:text-parchment-50 transition-colors"
          >
            {t("reserve")}
          </Link>
        </nav>
      </Container>
    </header>
  );
}
