import type { GuideHeading } from "@/lib/guides";

interface Props {
  headings: GuideHeading[];
}

export default function TableOfContents({ headings }: Props) {
  const tocHeadings = headings.filter((h) => h.depth === 2 || h.depth === 3);
  if (tocHeadings.length === 0) return null;

  return (
    <nav aria-label="Table of contents">
      <div className="sticky top-ds-10">
        <p className="text-ds-sm font-semibold text-surface-fg-subtle uppercase tracking-ds-wider mb-ds-04">
          Contents
        </p>
        <ul className="space-y-ds-02b">
          {tocHeadings.map((h) => (
            <li key={h.slug}>
              <a
                href={`#${h.slug}`}
                className={[
                  "block text-ds-sm leading-ds-relaxed transition-colors duration-fast-01 ease-productive-standard",
                  "text-surface-fg-subtle hover:text-accent-11",
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
      </div>
    </nav>
  );
}
