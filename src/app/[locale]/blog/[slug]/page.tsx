import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { PortableText } from "@portabletext/react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { OrnamentRule } from "@/components/ornaments/OrnamentRule";
import { Link } from "@/i18n/routing";
import { safeFetch } from "@/sanity/client";
import { BLOG_POST_BY_SLUG } from "@/sanity/queries";

type Post = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  body?: unknown[];
  publishedAt?: string;
  author?: string;
  heroImage?: string;
};

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "blog" });

  const post = await safeFetch<Post | null>(
    BLOG_POST_BY_SLUG,
    { slug, locale },
    null,
  );
  if (!post) notFound();

  return (
    <article className="pt-16 md:pt-24 pb-24">
      <Container width="narrow">
        <Link href="/blog" className="ink-link editorial-caps">
          ← {t("back")}
        </Link>
        <header className="mt-10 text-center">
          <Eyebrow ornament>{t("eyebrow")}</Eyebrow>
          <h1 className="font-display italic text-display-lg mt-5 text-ink-700">
            {post.title}
          </h1>
          <div className="mt-6 flex items-center justify-center gap-3 editorial-caps text-forest-700/80">
            {post.publishedAt && (
              <span>
                {new Date(post.publishedAt).toLocaleDateString(locale, {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            )}
            {post.author && (
              <>
                <span className="opacity-40">·</span>
                <span>{post.author}</span>
              </>
            )}
          </div>
        </header>

        <div className="my-12">
          <OrnamentRule />
        </div>

        <div className="prose-editorial space-y-6 text-[1.08rem] leading-[1.75] text-ink-700">
          {post.body && (
            <PortableText
              value={post.body as never}
              components={{
                block: {
                  normal: ({ children }) => <p>{children}</p>,
                  h2: ({ children }) => (
                    <h2 className="font-display text-2xl md:text-3xl mt-10 mb-4 text-ink-700">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="font-display text-xl mt-8 mb-3 text-ink-700">
                      {children}
                    </h3>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-2 border-forest-700/40 pl-5 italic font-display text-forest-700">
                      {children}
                    </blockquote>
                  ),
                },
                marks: {
                  link: ({ children, value }) => (
                    <a
                      href={value?.href}
                      className="ink-link"
                      target={value?.href?.startsWith("http") ? "_blank" : undefined}
                      rel={value?.href?.startsWith("http") ? "noreferrer" : undefined}
                    >
                      {children}
                    </a>
                  ),
                },
              }}
            />
          )}
        </div>
      </Container>
    </article>
  );
}
