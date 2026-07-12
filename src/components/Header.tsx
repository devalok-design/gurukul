import Link from "next/link";
import ChakraSvg from "./ChakraSvg";

/**
 * NOTE: unused. The Astro BaseLayout mounted TopBar, never Header. Ported for
 * parity but no page or layout references it. Safe to delete in a later cleanup.
 */
export default function Header() {
  return (
    <header className="w-full border-b border-surface-border-subtle">
      <div className="max-w-page mx-auto flex items-center justify-between px-ds-06 py-ds-05">
        <Link href="/" className="flex items-center gap-ds-03">
          <ChakraSvg size={28} className="text-accent-9" />
          <span className="font-bold text-ds-xl text-surface-fg leading-none">गुरुकुल</span>
          <span className="font-medium text-ds-md text-surface-fg-subtle leading-none hidden sm:inline">Gurukul</span>
          <span className="ml-ds-02 inline-flex items-center text-[10px] font-semibold uppercase tracking-ds-widest text-accent-9 bg-accent-2 border border-accent-5 rounded-ds-full px-ds-02b py-[1px] leading-none">Alpha</span>
        </Link>
        <Link
          href="/about"
          className="text-ds-md font-medium text-surface-fg-subtle transition-colors duration-fast-01 ease-productive-standard hover:text-surface-fg"
        >
          About
        </Link>
      </div>
    </header>
  );
}
