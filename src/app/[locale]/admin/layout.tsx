import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { routing, type Locale, Link } from "@/i18n/routing";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { LogoMark } from "@/components/ornaments/LogoMark";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await auth();
  const loc = routing.locales.includes(locale as Locale) ? locale : routing.defaultLocale;
  if (!session?.user) {
    redirect(`/${loc}/sign-in`);
  }

  const userRow = session.user.email
    ? await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { role: true },
      })
    : null;

  if (userRow?.role !== "admin") {
    redirect(`/${loc}/account`);
  }

  const t = await getTranslations({ locale, namespace: "admin.nav" });

  const primary = [
    { key: "overview", href: "/admin" },
    { key: "calendar", href: "/admin/calendar" },
    { key: "bookings", href: "/admin/bookings" },
    { key: "reviews", href: "/admin/reviews" },
  ] as const;
  const secondary = [
    { key: "rooms", href: "/admin/rooms" },
    { key: "pricing", href: "/admin/pricing" },
    { key: "experiences", href: "/admin/experiences" },
  ] as const;

  return (
    <div className="min-h-[60vh]">
      <div className="border-b border-ink-700/15 bg-parchment-100/40">
        <Container className="py-5 md:py-6">
          <div className="flex items-center gap-4 flex-wrap">
            <LogoMark size={40} className="shrink-0" />
            <div className="flex flex-col leading-tight min-w-0">
              <Eyebrow>{t("eyebrow")}</Eyebrow>
              <span className="font-display italic text-[1.1rem] md:text-[1.25rem] text-ink-700 mt-0.5">
                Chalet Aletsch
              </span>
            </div>
            <p className="ml-auto text-xs text-ink-500 italic truncate max-w-[160px] sm:max-w-[260px]">
              {session.user.email}
            </p>
          </div>

          <nav
            aria-label="admin"
            className="mt-5 flex items-center gap-x-5 md:gap-x-6 gap-y-2 editorial-caps text-xs flex-wrap"
          >
            {primary.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="text-ink-700 hover:text-seal transition-colors"
              >
                {t(item.key)}
              </Link>
            ))}
            <span className="text-ink-700/30">·</span>
            {secondary.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="text-ink-700 hover:text-seal transition-colors"
              >
                {t(item.key)}
              </Link>
            ))}
          </nav>
        </Container>
      </div>
      <main>{children}</main>
    </div>
  );
}
