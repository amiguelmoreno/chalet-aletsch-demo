import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { OrnamentRule } from "@/components/ornaments/OrnamentRule";
import { Monogram } from "@/components/ornaments/Monogram";
import { ContactMapWrapper } from "@/components/marketing/ContactMapWrapper";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isEn = locale === "en";
  return {
    title: isEn ? "Find us" : "Anreise",
    description: isEn
      ? "Train to Mörel, then cable car to the Riederalp. Reception 7.30 to 22.00 daily."
      : "Mit der Bahn nach Mörel, dann mit der Seilbahn auf die Riederalp. Empfang täglich 7.30 bis 22.00 Uhr.",
    alternates: { canonical: `/${locale}/contact` },
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ContactContent />;
}

function ContactContent() {
  const t = useTranslations("contact");

  return (
    <>
      <section className="pt-16 md:pt-24 pb-12">
        <Container width="narrow" className="text-center">
          <Eyebrow ornament>{t("eyebrow")}</Eyebrow>
          <h1 className="font-display italic text-display-lg mt-6">
            {t("title")}
          </h1>
          <p className="mt-7 text-[1.1rem] leading-relaxed text-ink-600 max-w-prose mx-auto">
            {t("intro")}
          </p>
        </Container>
        <div className="mt-12">
          <OrnamentRule />
        </div>
      </section>

      <section className="pb-24">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-14">
            {/* Letter form */}
            <div className="lg:col-span-7 border border-ink-700/15 p-8 md:p-12 bg-parchment-100/30 relative">
              <div className="flex items-center justify-between mb-8 border-b border-ink-700/15 pb-6">
                <Monogram size={56} />
                <p className="editorial-caps text-forest-700">
                  {t("form.heading")}
                </p>
              </div>

              <form className="space-y-7" action="#">
                <UnderlineField label={t("form.name")} name="name" />
                <UnderlineField label={t("form.email")} type="email" name="email" />
                <UnderlineField label={t("form.subject")} name="subject" />
                <label className="block">
                  <span className="editorial-caps text-forest-700 mb-2 block">
                    {t("form.message")}
                  </span>
                  <textarea
                    name="message"
                    rows={6}
                    className="w-full bg-transparent border-0 border-b border-ink-700/40 focus:border-ink-700 focus:outline-none py-2 font-serif text-[1.05rem] text-ink-700 resize-none"
                  />
                </label>
                <div className="pt-3">
                  <button
                    type="submit"
                    className="editorial-caps border border-ink-700 px-8 py-3.5 text-ink-700 hover:bg-ink-700 hover:text-parchment-50 transition-colors"
                  >
                    {t("form.send")}
                  </button>
                </div>
              </form>

              <p className="mt-8 text-xs italic text-ink-500">
                {t("form.note")}
              </p>
            </div>

            {/* Letterhead column */}
            <div className="lg:col-span-5 lg:pl-8">
              <Eyebrow>{t("info.eyebrow")}</Eyebrow>
              <h2 className="font-display text-display-sm mt-4 text-ink-700">
                {t("info.title")}
              </h2>

              <dl className="mt-10 space-y-7 text-ink-700">
                <Field label={t("info.address")}>
                  Chalet Aletsch<br />
                  Furkastrasse 14<br />
                  3987 Riederalp<br />
                  Wallis, Schweiz
                </Field>
                <Field label={t("info.phone")}>+41 27 928 00 23</Field>
                <Field label={t("info.email")}>
                  <a className="ink-link" href="mailto:hallo@chalet-aletsch.ch">
                    hallo@chalet-aletsch.ch
                  </a>
                </Field>
                <Field label={t("info.hours")}>
                  {t("info.frontDesk")}<br />
                  {t("info.kitchen")}
                </Field>
                <Field label={t("info.access")}>
                  {t("info.accessBody")}
                </Field>
              </dl>
            </div>
          </div>
        </Container>
      </section>

      <section className="pb-24">
        <Container>
          <div className="text-center mb-10">
            <Eyebrow ornament>{t("map.eyebrow")}</Eyebrow>
            <h2 className="font-display italic text-display-md mt-4">
              {t("map.title")}
            </h2>
          </div>
          <ContactMapWrapper
            labels={{
              popupTitle: t("map.popupTitle"),
              popupAddress: t("map.popupAddress"),
              popupHint: t("map.popupHint"),
            }}
          />
        </Container>
      </section>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="editorial-caps text-forest-700 mb-2">{label}</dt>
      <dd className="text-[1.05rem] leading-relaxed">{children}</dd>
    </div>
  );
}

function UnderlineField({
  label,
  name,
  type = "text",
}: {
  label: string;
  name: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="editorial-caps text-forest-700 mb-2 block">{label}</span>
      <input
        type={type}
        name={name}
        className="w-full bg-transparent border-0 border-b border-ink-700/40 focus:border-ink-700 focus:outline-none py-2 font-serif text-[1.05rem] text-ink-700"
      />
    </label>
  );
}
