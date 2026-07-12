/**
 * Sankalan newsletter nudge — compact, warm, not a billboard.
 * size="sm" for home page, default for post-article.
 */
interface Props {
  size?: "default" | "sm";
}

export default function SankalanCta({ size = "default" }: Props) {
  return (
    <a
      href="https://dvlk.in/sankalan"
      target="_blank"
      rel="noopener"
      className={[
        "group block rounded-ds-lg bg-accent-2 border border-accent-5 transition-[border-color,box-shadow] duration-fast-02 ease-productive-standard hover:border-accent-7 hover:shadow-brand",
        size === "sm" ? "px-ds-05 py-ds-04" : "px-ds-06 py-ds-06",
      ].join(" ")}
    >
      <p
        className={[
          "font-semibold text-accent-9 uppercase tracking-ds-wider",
          size === "sm" ? "text-[11px]" : "text-ds-sm",
        ].join(" ")}
      >
        Sankalan by Devalok
      </p>
      <p
        className={[
          "mt-ds-02 text-surface-fg-muted leading-ds-relaxed",
          size === "sm" ? "text-ds-md" : "text-ds-base",
        ].join(" ")}
      >
        A monthly ritual of reflections and notes on design, culture, and creative work.{" "}
        <span className="inline-block font-semibold text-accent-11 group-hover:text-accent-12 transition-colors duration-fast-01">
          Subscribe &rarr;
        </span>
      </p>
    </a>
  );
}
