import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { OrnamentRule } from "@/components/ornaments/OrnamentRule";
import { LogoMark } from "@/components/ornaments/LogoMark";
import { authConfigured, auth } from "@/auth";
import { Link } from "@/i18n/routing";
import { SignInActions } from "./SignInActions";
import { SwitchAccountButton } from "./SwitchAccountButton";

export default async function SignInPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await auth();
  return <Content alreadySignedInAs={session?.user?.email ?? null} />;
}

function Content({ alreadySignedInAs }: { alreadySignedInAs: string | null }) {
  const t = useTranslations("signIn");
  const googleEnabled = !!process.env.AUTH_GOOGLE_ID;
  const emailEnabled = !!process.env.RESEND_API_KEY;

  return (
    <section className="py-20 md:py-28">
      <Container width="narrow">
        <div className="border border-ink-700/15 bg-parchment-100/30 p-8 md:p-14">
          <div className="flex flex-col items-center text-center mb-10">
            <LogoMark size={88} />
            <Eyebrow className="mt-6">{t("eyebrow")}</Eyebrow>
            <h1 className="font-display italic text-display-md mt-3 text-ink-700">
              {t("title")}
            </h1>
            <p className="mt-5 max-w-md text-ink-600 leading-relaxed">
              {t("intro")}
            </p>
          </div>

          <OrnamentRule className="mb-10" />

          {alreadySignedInAs ? (
            <div className="text-center space-y-6">
              <div>
                <p className="editorial-caps text-forest-700 mb-2">
                  {t("alreadyEyebrow")}
                </p>
                <p className="font-display italic text-xl text-ink-700">
                  {alreadySignedInAs}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <Link
                  href="/account"
                  className="editorial-caps border border-ink-700 bg-ink-700 text-parchment-50 px-7 py-3 hover:bg-ink-800 transition-colors"
                >
                  {t("continueToAccount")}
                </Link>
                <SwitchAccountButton label={t("switchAccount")} />
              </div>
            </div>
          ) : !authConfigured ? (
            <div className="text-center">
              <p className="editorial-caps text-seal mb-3">{t("notConfiguredEyebrow")}</p>
              <p className="text-ink-600 leading-relaxed max-w-md mx-auto">
                {t("notConfigured")}
              </p>
            </div>
          ) : (
            <SignInActions googleEnabled={googleEnabled} emailEnabled={emailEnabled} />
          )}
        </div>

        <p className="mt-8 text-center text-sm text-ink-500 italic">
          {t("note")}
        </p>
      </Container>
    </section>
  );
}
