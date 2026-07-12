"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Thin reading progress bar — fixed at the very top of the viewport.
 * Only active on article pages (where .prose-gurukul exists).
 * Accent-9 at 70% opacity. Hides when not on an article.
 * Re-initialises on client navigation (keyed to pathname) to match the
 * per-page behaviour of the original Astro MPA.
 */
export default function ReadingProgress() {
  const pathname = usePathname();

  useEffect(() => {
    const bar = document.getElementById("reading-progress");
    const article = document.querySelector<HTMLElement>(".prose-gurukul");
    if (!bar || !article) {
      if (bar) bar.style.display = "none";
      return;
    }
    bar.style.display = "";

    let ticking = false;
    function update() {
      const rect = article!.getBoundingClientRect();
      const articleTop = rect.top + window.scrollY;
      const articleHeight = rect.height;
      const scrolled = window.scrollY - articleTop + window.innerHeight * 0.3;
      const pct = Math.min(100, Math.max(0, (scrolled / articleHeight) * 100));
      bar!.style.width = pct + "%";
    }

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(function () {
          update();
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    update();

    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  return (
    <div
      id="reading-progress"
      className="fixed top-0 left-0 h-[2px] bg-accent-9 opacity-70 z-[60] transition-[width] duration-[50ms] ease-linear"
      style={{ width: "0%" }}
      aria-hidden="true"
    />
  );
}
