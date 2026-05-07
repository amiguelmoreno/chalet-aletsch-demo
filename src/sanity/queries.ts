export const RECENT_BLOG_POSTS = /* groq */ `
  *[_type == "blogPost" && locale == $locale && defined(slug.current)]
    | order(publishedAt desc)[0...$limit]
  {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    author,
    "heroImage": heroImage.asset->url
  }
`;

export const BLOG_POST_BY_SLUG = /* groq */ `
  *[_type == "blogPost" && slug.current == $slug && locale == $locale][0]
  {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    body,
    publishedAt,
    author,
    "heroImage": heroImage.asset->url
  }
`;
