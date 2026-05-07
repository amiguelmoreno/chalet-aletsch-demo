import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { auth } from "@/auth";
import { routing, type Locale } from "@/i18n/routing";

export default async function AccountLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await auth();
  if (!session?.user) {
    const loc = routing.locales.includes(locale as Locale) ? locale : routing.defaultLocale;
    redirect(`/${loc}/sign-in`);
  }

  return <>{children}</>;
}
