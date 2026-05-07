import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { safeFetch } from "@/sanity/client";
import { RECENT_BLOG_POSTS } from "@/sanity/queries";
import { Link } from "@/i18n/routing";
import { SAMPLE_NOTES, type Locale as SampleLocale } from "@/lib/sample-notes";
import { PageHero } from "@/components/marketing/PageHero";

type SanityPost = {
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
      ? "Letters, recipes and dispatches from the mountain. Four to five times a year."
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
  const sanityPosts = await safeFetch<SanityPost[]>(
    RECENT_BLOG_POSTS,
    { locale, limit: 24 },
    [],
  );

  // Sample notes are shown when Sanity returns nothing for this locale.
  const sampleLocale: SampleLocale = (["de", "en", "fr", "it"] as SampleLocale[]).includes(
    locale as SampleLocale,
  )
    ? (locale as SampleLocale)
    : "de";
  const sampleNotes = SAMPLE_NOTES[sampleLocale];

  // Two render modes: linked Sanity posts, or inline sample notes (no detail page).
  const useSanity = sanityPosts.length > 0;

  return (
    <>
      <PageHero
        imageSrc="https://images.unsplash.com/photo-1747137985267-2cee0fad023a?w=2400&q=88&auto=format&fit=crop"
        imageAlt="Walliser Chalet auf einer Bergwiese mit Aussicht"
        eyebrow={t("eyebrow")}
        title={t("title")}
        intro={t("intro")}
      />

      <section className="pb-24">
        <Container width="narrow">
          {useSanity ? (
            <ol className="border-t border-ink-700/15">
              {sanityPosts.map((post, i) => (
                <li key={post._id} className="border-b border-ink-700/15">
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
                      <p className="mt-3 italic text-forest-700 text-sm">{post.author}</p>
                    )}
                  </Link>
                </li>
              ))}
            </ol>
          ) : (
            <ol className="border-t border-ink-700/15">
              {sampleNotes.map((note, i) => (
                <li key={note.id} className="border-b border-ink-700/15">
                  <article className="py-12">
                    <div className="flex items-baseline gap-6 mb-4">
                      <span className="font-display italic text-forest-700/70">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="editorial-caps text-forest-700/70">
                        {new Date(note.publishedAt).toLocaleDateString(locale, {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <h2 className="font-display text-2xl md:text-3xl text-ink-700">
                      {note.title}
                    </h2>
                    <p className="mt-4 italic text-forest-700 text-sm">
                      {note.author}
                    </p>
                    <div className="mt-6 space-y-4 text-[1.05rem] leading-relaxed text-ink-700 max-w-prose">
                      {note.body.map((paragraph, idx) => (
                        <p key={idx} className={idx === 0 ? "first-letter:font-display first-letter:text-3xl first-letter:text-forest-700 first-letter:mr-1" : undefined}>
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </article>
                </li>
              ))}
            </ol>
          )}
        </Container>
      </section>
    </>
  );
}
