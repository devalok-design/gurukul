import Link from "next/link";

/**
 * The only navigation bar. Light pink bg, deep pink text.
 * Left: Devalok link (parent brand). Right: Gurukul nav (About).
 */
export default function TopBar() {
  return (
    <nav className="w-full bg-accent-2 border-b border-accent-5">
      <div className="max-w-page mx-auto px-ds-06 py-ds-03 flex items-center justify-between">
        <a
          href="https://devalok.in"
          className="text-ds-sm font-semibold text-accent-11 hover:text-accent-12 transition-colors duration-fast-01 ease-productive-standard"
        >
          Devalok
        </a>
        <div className="flex items-center gap-ds-06">
          <Link
            href="/about"
            className="text-ds-sm font-medium text-accent-11 opacity-70 hover:opacity-100 transition-opacity duration-fast-01 ease-productive-standard"
          >
            About
          </Link>
          <a
            href="https://devalok.in/#book-a-call"
            className="text-ds-sm font-medium text-accent-11 opacity-70 hover:opacity-100 transition-opacity duration-fast-01 ease-productive-standard"
          >
            Book a Call
          </a>
        </div>
      </div>
    </nav>
  );
}
