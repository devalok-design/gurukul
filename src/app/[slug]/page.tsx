import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import TableOfContents from "@/components/TableOfContents";
import SankalanCta from "@/components/SankalanCta";
import { getAllGuides, getGuide } from "@/lib/guides";
import { OG_DEFAULT_IMAGE, TWITTER_METADATA, alternatesFor, openGraphMetadata } from "@/lib/site";

export const dynamic = "force-static";
// Only the guides from generateStaticParams exist; any other slug hard-404s
// (no on-demand render → no soft-404 200s for bogus URLs). Matches Astro's getStaticPaths.
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllGuides()
    .filter((g) => !g.data.draft)
    .map((g) => ({ slug: g.slug }));
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = await getGuide(slug);
  if (!guide) return {};

  const image = guide.data.ogImage ?? OG_DEFAULT_IMAGE;

  return {
    title: guide.data.title,
    description: guide.data.description,
    alternates: alternatesFor(`/${slug}`),
    openGraph: openGraphMetadata({ type: "article", url: `/${slug}`, images: [image] }),
    twitter: { ...TWITTER_METADATA, images: [image] },
  };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = await getGuide(slug);
  if (!guide || guide.data.draft) notFound();

  const { data, html, headings } = guide;
  const formattedDate = dateFormatter.format(data.date);
  const formattedUpdatedDate = data.updatedDate ? dateFormatter.format(data.updatedDate) : null;
  const tocHeadings = headings.filter((h) => h.depth === 2 || h.depth === 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: data.title,
    description: data.description,
    datePublished: data.date.toISOString(),
    ...(data.updatedDate && { dateModified: data.updatedDate.toISOString() }),
    author: {
      "@type": "Person",
      name: data.author,
    },
    publisher: {
      "@type": "Organization",
      name: "Devalok Design and Strategy Studio",
      url: "https://devalok.in",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-page mx-auto px-ds-06">
        {/* Article header — cinematic, generous, editorial */}
        <header className="max-w-article pt-ds-10 pb-ds-10 border-b border-surface-border-subtle stagger-children">
          {/* Back link — subtle, doesn't compete with the title */}
          <Link
            href="/"
            className="inline-block text-ds-sm font-medium text-surface-fg-subtle uppercase tracking-ds-wide hover:text-accent-11 transition-colors duration-fast-01 ease-productive-standard"
          >
            &larr; Gurukul
          </Link>

          {/* Title area — big, bold, breathing */}
          <h1 className="mt-ds-08 font-bold text-ds-4xl sm:text-ds-5xl text-surface-fg leading-ds-tight tracking-ds-tight">
            {data.title}
          </h1>

          {data.subtitle && (
            <p className="mt-ds-05 text-ds-xl sm:text-ds-2xl text-surface-fg-muted leading-ds-relaxed">
              {data.subtitle}
            </p>
          )}

          {/* Author + meta — separated from title with space, editorial treatment */}
          <div className="mt-ds-08 flex flex-wrap items-center gap-x-ds-03 gap-y-ds-02 text-ds-md text-surface-fg-subtle">
            <span className="font-semibold text-surface-fg">{data.author}</span>
            {data.authorRole && (
              <>
                <span className="text-surface-border-strong">/</span>
                <span>{data.authorRole}</span>
              </>
            )}
            <span className="text-surface-border-strong">/</span>
            <span>{formattedDate}</span>
            {formattedUpdatedDate && (
              <span className="text-surface-fg-subtle"> · Updated {formattedUpdatedDate}</span>
            )}
            <span className="text-surface-border-strong">/</span>
            <span>{data.readTime}</span>
          </div>

          {/* Tags */}
          {data.tags && data.tags.length > 0 && (
            <div className="mt-ds-05 flex flex-wrap gap-ds-02b">
              {data.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-block text-ds-sm font-medium text-surface-fg-subtle bg-surface-raised border border-surface-border-subtle rounded-ds-full px-ds-03 py-ds-01"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Content area */}
        <div className="pt-ds-10">
          {/* Mobile ToC */}
          {tocHeadings.length > 0 && (
            <details className="xl:hidden mb-ds-10 max-w-article border border-surface-border-subtle rounded-ds-md">
              <summary className="cursor-pointer px-ds-05 py-ds-04 text-ds-sm font-semibold text-surface-fg-subtle select-none uppercase tracking-ds-wide">
                Contents
              </summary>
              <ul className="px-ds-05 pb-ds-04 space-y-ds-02b">
                {tocHeadings.map((h) => (
                  <li key={h.slug}>
                    <a
                      href={`#${h.slug}`}
                      className={[
                        "block text-ds-sm leading-ds-relaxed text-surface-fg-subtle hover:text-accent-11 transition-colors duration-fast-01 ease-productive-standard",
                        h.depth === 3 && "pl-ds-04",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      {h.text}
                    </a>
                  </li>
                ))}
              </ul>
            </details>
          )}

          <div className="flex gap-ds-12">
            <article
              className="prose-gurukul max-w-article min-w-0 flex-1"
              dangerouslySetInnerHTML={{ __html: html }}
            />
            <aside className="w-56 shrink-0 hidden xl:block">
              <TableOfContents headings={headings} />
            </aside>
          </div>
        </div>

        {/* Sankalan CTA — the reader just finished, this is the moment */}
        <div className="max-w-article mt-ds-13">
          <SankalanCta />
        </div>

        {/* Back to guides */}
        <div className="max-w-article py-ds-10">
          <Link
            href="/"
            className="inline-block text-ds-md font-semibold text-accent-11 hover:text-accent-12 transition-colors duration-fast-01 ease-productive-standard"
          >
            &larr; All guides
          </Link>
        </div>
      </div>
    </>
  );
}
