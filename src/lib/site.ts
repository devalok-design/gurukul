import type { Metadata } from "next";

/** Site-wide constants shared by layout, pages, RSS and sitemap. */
export const SITE_URL = "https://gurukul.devalok.in";

export const SITE_TITLE = "Gurukul — Devalok";
export const SITE_DESCRIPTION =
  "Practical knowledge from the Devalok studio — for founders, designers, and builders.";

/** Default OG/Twitter image (Devalok monogram wordmark). */
export const OG_DEFAULT_IMAGE =
  "https://devalok-public-assets.s3.ap-south-1.amazonaws.com/brand/devalok/logos/monogram-wordmark-brand-1024.png";

export const FAVICON_SVG =
  "https://devalok-public-assets.s3.ap-south-1.amazonaws.com/brand/devalok/favicons/favicon.svg";
export const FAVICON_PNG =
  "https://devalok-public-assets.s3.ap-south-1.amazonaws.com/brand/devalok/favicons/favicon.png";
export const APPLE_TOUCH_ICON =
  "https://devalok-public-assets.s3.ap-south-1.amazonaws.com/brand/devalok/favicons/apple-touch-icon.png";

/**
 * Complete Twitter card metadata. Next replaces (does not deep-merge) the
 * `twitter`/`openGraph` objects when a page sets its own, so any page that
 * overrides these must re-declare the full set to keep parity with the layout.
 */
export const TWITTER_METADATA: Metadata["twitter"] = {
  card: "summary_large_image",
  site: "@devalokstudio",
  creator: "@devalokstudio",
  images: [OG_DEFAULT_IMAGE],
};

/**
 * Per-page `alternates`: canonical + the RSS feed link. Every page must include
 * the RSS type here — Next replaces (not merges) `alternates`, so a page that
 * only sets `canonical` would otherwise drop the layout's feed link.
 */
export function alternatesFor(canonical: string): NonNullable<Metadata["alternates"]> {
  return {
    canonical,
    types: {
      "application/rss+xml": [{ url: "/rss.xml", title: "Gurukul RSS" }],
    },
  };
}

/** Complete Open Graph metadata for a page (siteName/locale always included). */
export function openGraphMetadata(opts: {
  type: "website" | "article";
  url: string;
  images?: string[];
}): Metadata["openGraph"] {
  return {
    type: opts.type,
    url: opts.url,
    siteName: SITE_TITLE,
    locale: "en_IN",
    images: opts.images ?? [OG_DEFAULT_IMAGE],
  } as Metadata["openGraph"];
}
