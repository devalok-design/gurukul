import Link from "next/link";
import ChakraSvg from "@/components/ChakraSvg";

export default function NotFound() {
  return (
    <div className="max-w-article mx-auto px-ds-06 py-ds-13 text-center stagger-children">
      <ChakraSvg size={40} className="text-accent-9 opacity-30 mx-auto" />
      <h1 className="mt-ds-06 font-bold text-ds-4xl text-surface-fg leading-ds-tight">Page not found</h1>
      <p className="mt-ds-03 text-ds-lg text-surface-fg-muted">This page doesn&apos;t exist, or it was moved.</p>
      <Link
        href="/"
        className="inline-block mt-ds-08 text-ds-md font-semibold text-accent-11 hover:text-accent-12 transition-colors duration-fast-01 ease-productive-standard"
      >
        &larr; Back to Gurukul
      </Link>
    </div>
  );
}
