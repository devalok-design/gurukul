import type { Metadata } from "next";
import Link from "next/link";
import ChakraSvg from "@/components/ChakraSvg";
import GuideEntry from "@/components/GuideEntry";
import SankalanCta from "@/components/SankalanCta";
import { getAllGuides } from "@/lib/guides";
import { SITE_DESCRIPTION, alternatesFor, openGraphMetadata } from "@/lib/site";

export const dynamic = "force-static";

export const metadata: Metadata = {
  // Home title is literally "Gurukul — Devalok" (the layout default, not templated).
  description: SITE_DESCRIPTION,
  alternates: alternatesFor("/"),
  openGraph: openGraphMetadata({ type: "website", url: "/" }),
};

export default function HomePage() {
  const guides = getAllGuides().filter((g) => !g.data.draft);

  return (
    <div className="max-w-page mx-auto px-ds-06">
      {/* Hero — identity + purpose */}
      <div className="max-w-article pt-ds-12 pb-ds-10 border-b border-surface-border-subtle animate-fade-up">
        <Link href="/about" className="inline-flex items-center gap-ds-03 mb-ds-06 group">
          <ChakraSvg size={32} className="text-accent-9" />
          <span className="font-bold text-ds-3xl text-surface-fg leading-none group-hover:text-accent-11 transition-colors duration-fast-01 ease-productive-standard">
            गुरुकुल
          </span>
          <span className="font-medium text-ds-lg text-surface-fg-subtle leading-none hidden sm:inline">
            Gurukul
          </span>
          <span className="ml-ds-02 inline-flex items-center text-[10px] font-semibold uppercase tracking-ds-widest text-accent-9 bg-accent-2 border border-accent-5 rounded-ds-full px-ds-02b py-[1px] leading-none">
            Alpha
          </span>
        </Link>
        <p className="text-ds-xl sm:text-ds-2xl text-surface-fg-muted leading-ds-relaxed max-w-[600px]">
          Practical knowledge from the Devalok studio — for founders, designers, and builders.
        </p>
      </div>

      {/* Guide listing */}
      <div className="max-w-article stagger-children">
        {guides.length === 0 && (
          <p className="py-ds-13 text-surface-fg-subtle text-ds-lg">Guides coming soon.</p>
        )}
        {guides.map((guide) => (
          <GuideEntry
            key={guide.slug}
            title={guide.data.title}
            subtitle={guide.data.subtitle}
            description={guide.data.description}
            date={guide.data.date}
            readTime={guide.data.readTime}
            slug={guide.slug}
            tags={guide.data.tags}
          />
        ))}
      </div>

      {/* Sankalan CTA */}
      <div className="max-w-article mt-ds-12">
        <SankalanCta size="sm" />
      </div>
    </div>
  );
}
