import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { LogoMark } from "@/components/ornaments/LogoMark";
import { OrnamentRule } from "@/components/ornaments/OrnamentRule";
import { MountainRule } from "@/components/ornaments/MountainRule";
import { CookieSettingsTrigger } from "@/components/cookies/CookieBanner";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="bg-forest-800 text-parchment-100 above-grain mt-32 relative">
      {/* Mountain silhouette runs along the top edge — house meets sky */}
      <div className="text-parchment-100 absolute -top-16 left-0 right-0 h-16 overflow-hidden">
        <MountainRule className="h-full" />
      </div>

      <Container className="relative pt-24 pb-12">
        {/* Letterhead row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          {/* Crest + name */}
          <div className="md:col-span-4 flex flex-col items-center md:items-start text-center md:text-left">
            <LogoMark size={140} variant="light" />
            <p className="font-display text-3xl mt-6 text-parchment-50">Chalet Aletsch</p>
            <p className="editorial-caps mt-3 text-parchment-200/80">{t("tagline")}</p>
          </div>

          {/* Address block */}
          <div className="md:col-span-3">
            <p className="editorial-caps mb-4 text-parchment-200/70">{t("address.label")}</p>
            <address className="not-italic text-[1.02rem] leading-relaxed text-parchment-100">
              Chalet Aletsch<br />
              Furkastrasse 14<br />
              3987 Riederalp<br />
              Wallis, Schweiz
            </address>
          </div>

          {/* Contact block */}
          <div className="md:col-span-3">
            <p className="editorial-caps mb-4 text-parchment-200/70">{t("contact.label")}</p>
            <ul className="space-y-2 text-[1.02rem] text-parchment-100">
              <li>+41 27 928 00 23</li>
              <li>
                <a href="mailto:hallo@chalet-aletsch.ch" className="hover:text-parchment-50 underline decoration-parchment-200/30 underline-offset-4">
                  hallo@chalet-aletsch.ch
                </a>
              </li>
              <li className="text-parchment-200/70 text-sm pt-2">
                {t("hours.front")}<br />
                {t("hours.kitchen")}
              </li>
            </ul>
          </div>

          {/* Pages */}
          <div className="md:col-span-2">
            <p className="editorial-caps mb-4 text-parchment-200/70">{t("pages.label")}</p>
            <ul className="space-y-2 text-[1.02rem] text-parchment-100">
              <li><Link href="/rooms" className="hover:text-parchment-50 underline decoration-parchment-200/30 underline-offset-4">{t("pages.rooms")}</Link></li>
              <li><Link href="/story" className="hover:text-parchment-50 underline decoration-parchment-200/30 underline-offset-4">{t("pages.story")}</Link></li>
              <li><Link href="/contact" className="hover:text-parchment-50 underline decoration-parchment-200/30 underline-offset-4">{t("pages.contact")}</Link></li>
              <li><Link href="/legal/imprint" className="hover:text-parchment-50 underline decoration-parchment-200/30 underline-offset-4">{t("pages.imprint")}</Link></li>
              <li><Link href="/legal/privacy" className="hover:text-parchment-50 underline decoration-parchment-200/30 underline-offset-4">{t("pages.privacy")}</Link></li>
            </ul>
          </div>
        </div>

        <div className="my-16">
          <OrnamentRule className="text-parchment-200/40" />
        </div>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 text-sm text-parchment-200/70">
          <p>
            © 2023–2026 Chalet Aletsch · {t("copyright.held")}
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <CookieSettingsTrigger className="text-parchment-200/70 hover:text-parchment-100" />
            <span className="text-parchment-200/30">·</span>
            <p className="editorial-caps">{t("colophon")}</p>
            <span className="text-parchment-200/30">·</span>
            <p className="editorial-caps text-parchment-200/70">
              {t("by")}{" "}
              <a
                href="https://morenodev.ch"
                target="_blank"
                rel="noopener noreferrer"
                className="text-parchment-100 hover:text-parchment-50 underline decoration-parchment-200/40 underline-offset-4 hover:decoration-parchment-50"
              >
                Morenodev
              </a>
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
