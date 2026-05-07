import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingMenu } from "@/components/layout/FloatingMenu";
import { ConsentProvider } from "@/components/cookies/ConsentProvider";
import { CookieBanner } from "@/components/cookies/CookieBanner";
import { AnalyticsLoader } from "@/components/cookies/AnalyticsLoader";
import { AuthSessionProvider } from "@/components/providers/SessionProvider";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { ScrollProgress } from "@/components/motion/ScrollProgress";

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
          <ScrollProgress />
          <Header />
          <main key={locale} className="page-fade">{children}</main>
          <Footer />
          <FloatingMenu />
          <ChatWidget />
          <CookieBanner />
          <AnalyticsLoader />
        </ConsentProvider>
      </AuthSessionProvider>
    </NextIntlClientProvider>
  );
}
