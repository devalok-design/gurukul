"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Custom GA4 events for Gurukul. Tracks meaningful interactions, not vanity metrics.
 *
 * Events:
 * - sankalan_cta_click: user clicked the Sankalan subscribe CTA
 * - toc_click: user clicked a table of contents link (label = heading text)
 * - guide_scroll_25/50/75/100: scroll depth milestones on guide pages
 *
 * Re-binds on client navigation (keyed to pathname) to match the per-page
 * behaviour of the original Astro MPA. gtag is loaded globally in the layout.
 */
type Gtag = (...args: unknown[]) => void;

declare global {
  interface Window {
    gtag?: Gtag;
  }
}

export default function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window.gtag !== "function") return;
    // Bind to a definitely-typed const so the narrowing survives inside the
    // nested scroll/click closures below.
    const gtag: Gtag = window.gtag;

    const cleanups: Array<() => void> = [];

    // ── Sankalan CTA clicks ──
    document.querySelectorAll<HTMLElement>('a[href*="dvlk.in/sankalan"]').forEach((el) => {
      const handler = () => {
        gtag("event", "sankalan_cta_click", {
          event_category: "engagement",
          event_label: el.closest(".prose-gurukul") ? "in_article" : "standalone",
        });
      };
      el.addEventListener("click", handler);
      cleanups.push(() => el.removeEventListener("click", handler));
    });

    // ── Table of Contents clicks ──
    document
      .querySelectorAll<HTMLElement>('nav[aria-label="Table of contents"] a, details ul a[href^="#"]')
      .forEach((el) => {
        const handler = () => {
          gtag("event", "toc_click", {
            event_category: "navigation",
            event_label: el.textContent?.trim(),
          });
        };
        el.addEventListener("click", handler);
        cleanups.push(() => el.removeEventListener("click", handler));
      });

    // ── Scroll depth on guide pages ──
    const article = document.querySelector<HTMLElement>(".prose-gurukul");
    if (article) {
      const fired: Record<number, boolean> = {};
      const thresholds = [25, 50, 75, 100];

      function checkScroll() {
        const rect = article!.getBoundingClientRect();
        const articleTop = rect.top + window.scrollY;
        const articleHeight = rect.height;
        const scrollPos = window.scrollY + window.innerHeight - articleTop;
        const pct = Math.round((scrollPos / articleHeight) * 100);

        thresholds.forEach((t) => {
          if (pct >= t && !fired[t]) {
            fired[t] = true;
            gtag("event", "guide_scroll_" + t, {
              event_category: "engagement",
              event_label: document.title,
            });
          }
        });
      }

      let ticking = false;
      function onScroll() {
        if (!ticking) {
          requestAnimationFrame(function () {
            checkScroll();
            ticking = false;
          });
          ticking = true;
        }
      }

      window.addEventListener("scroll", onScroll, { passive: true });
      cleanups.push(() => window.removeEventListener("scroll", onScroll));
      checkScroll();
    }

    return () => cleanups.forEach((fn) => fn());
  }, [pathname]);

  return null;
}
