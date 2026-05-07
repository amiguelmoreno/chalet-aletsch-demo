import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ConsentProvider } from "@/components/cookies/ConsentProvider";
import { CookieBanner } from "@/components/cookies/CookieBanner";
import { AnalyticsLoader } from "@/components/cookies/AnalyticsLoader";
import { AuthSessionProvider } from "@/components/providers/SessionProvider";
import { ChatWidget } from "@/components/chat/ChatWidget";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as Locale)) notFound();
  setRequestLocale(locale);

  return (
    <NextIntlClientProvider>
      <AuthSessionProvider>
        <ConsentProvider>
          <Header />
          <main className="above-grain">{children}</main>
          <Footer />
          <ChatWidget />
          <CookieBanner />
          <AnalyticsLoader />
        </ConsentProvider>
      </AuthSessionProvider>
    </NextIntlClientProvider>
  );
}
