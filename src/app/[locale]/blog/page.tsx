import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { OrnamentRule } from "@/components/ornaments/OrnamentRule";
import { Edelweiss } from "@/components/ornaments/Edelweiss";
import { safeFetch } from "@/sanity/client";
import { sanityConfigured } from "@/sanity/env";
import { RECENT_BLOG_POSTS } from "@/sanity/queries";

type Post = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  publishedAt?: string;
  author?: string;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isEn = locale === "en";
  return {
    title: isEn ? "Notes from the house" : "Hausgeflüster",
    description: isEn
      ? "Letters, recipes and dispatches from the mountain — four to five times a year."
      : "Notizen, Rezepte und Berichte aus den Bergen. Vier- bis fünfmal im Jahr.",
    alternates: { canonical: `/${locale}/blog` },
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "blog" });
  const posts = await safeFetch<Post[]>(
    RECENT_BLOG_POSTS,
    { locale, limit: 24 },
    [],
  );

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
        <Container width="narrow">
          {posts.length === 0 ? (
            <EmptyState
              title={sanityConfigured ? t("emptyTitle") : t("comingSoonTitle")}
              body={sanityConfigured ? t("emptyBody") : t("comingSoonBody")}
            />
          ) : (
            <ol className="border-t border-ink-700/15">
              {posts.map((post, i) => (
                <li
                  key={post._id}
                  className="border-b border-ink-700/15"
                >
                  <Link
                    href={`/blog/${post.slug}` as never}
                    className="block py-10 group"
                  >
                    <div className="flex items-baseline gap-6 mb-3">
                      <span className="font-display italic text-forest-700/70">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {post.publishedAt && (
                        <span className="editorial-caps text-forest-700/70">
                          {new Date(post.publishedAt).toLocaleDateString(locale, {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      )}
                    </div>
                    <h2 className="font-display text-2xl md:text-3xl text-ink-700 group-hover:text-seal transition-colors">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="mt-3 text-ink-600 leading-relaxed max-w-prose">
                        {post.excerpt}
                      </p>
                    )}
                    {post.author && (
                      <p className="mt-3 italic text-forest-700 text-sm">— {post.author}</p>
                    )}
                  </Link>
                </li>
              ))}
            </ol>
          )}
        </Container>
      </section>
    </>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="text-center py-16 border border-ink-700/15 bg-parchment-100/40 px-8">
      <Edelweiss className="mx-auto opacity-60" size={42} />
      <p className="mt-6 font-display italic text-2xl text-ink-700">{title}</p>
      <p className="mt-4 text-ink-600 leading-relaxed max-w-prose mx-auto">{body}</p>
    </div>
  );
}
