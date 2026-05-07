import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { routing, type Locale, Link } from "@/i18n/routing";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";

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

  return (
    <div className="min-h-[60vh]">
      <div className="border-b border-ink-700/15 bg-parchment-100/40">
        <Container className="py-5 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-6">
            <Eyebrow>{t("eyebrow")}</Eyebrow>
            <nav aria-label="admin" className="flex items-center gap-5 editorial-caps text-xs flex-wrap">
              <Link href="/admin" className="text-ink-700 hover:text-seal transition-colors">
                {t("overview")}
              </Link>
              <Link href="/admin/calendar" className="text-ink-700 hover:text-seal transition-colors">
                {t("calendar")}
              </Link>
              <Link href="/admin/bookings" className="text-ink-700 hover:text-seal transition-colors">
                {t("bookings")}
              </Link>
              <Link href="/admin/reviews" className="text-ink-700 hover:text-seal transition-colors">
                {t("reviews")}
              </Link>
              <span className="text-ink-700/30">·</span>
              <Link href="/admin/rooms" className="text-ink-700 hover:text-seal transition-colors">
                {t("rooms")}
              </Link>
              <Link href="/admin/pricing" className="text-ink-700 hover:text-seal transition-colors">
                {t("pricing")}
              </Link>
              <Link href="/admin/experiences" className="text-ink-700 hover:text-seal transition-colors">
                {t("experiences")}
              </Link>
            </nav>
          </div>
          <div className="text-xs text-ink-500 italic">
            {session.user.email}
          </div>
        </Container>
      </div>
      <main>{children}</main>
    </div>
  );
}
