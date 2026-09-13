import Link from "next/link";

/**
 * Guide listing entry — designed as a substantial, interactive element.
 * Hover lifts the entire entry with a subtle shadow shift (Shilp Sutra Card pattern).
 * Tags are displayed as small muted chips. The whole block is a link.
 */
interface Props {
  title: string;
  subtitle?: string;
  description: string;
  date: Date;
  readTime: string;
  slug: string;
  tags?: string[];
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export default function GuideEntry({ title, subtitle, description, date, readTime, slug, tags }: Props) {
  const formattedDate = dateFormatter.format(date);
  return (
    <Link href={`/${slug}`} className="group block guide-entry-hover">
      <article className="py-ds-09 sm:py-ds-10 border-b border-surface-border-subtle transition-colors duration-moderate-01 ease-productive-standard group-hover:border-accent-5">
        {/* Title — leads the card. Nothing sits above it: a label above a
            heading is the eyebrow pattern (Setu §3.4), banned outright. */}
        <h2 className="font-semibold text-ds-2xl sm:text-ds-3xl text-surface-fg leading-ds-tight tracking-ds-tight transition-colors duration-fast-02 ease-productive-standard group-hover:text-accent-11">
          {title}
        </h2>

        {/* Subtitle / description — hugs the title it belongs to */}
        {(subtitle || description) && (
          <p className="mt-ds-03 text-ds-lg text-surface-fg-muted leading-ds-relaxed max-w-[640px]">
            {subtitle || description}
          </p>
        )}

        {/* Meta line: date + read time — card meta belongs below the name it
            describes, in mixed case. */}
        <p className="mt-ds-05 text-ds-sm font-medium text-surface-fg-subtle">
          {formattedDate}
          <span className="mx-ds-03">/</span>
          {readTime}
        </p>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="mt-ds-05 flex flex-wrap gap-ds-02b">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-block text-ds-sm font-medium text-surface-fg-subtle bg-surface-panel border border-surface-border-subtle rounded-pill px-ds-03 py-ds-01"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </article>
    </Link>
  );
}
