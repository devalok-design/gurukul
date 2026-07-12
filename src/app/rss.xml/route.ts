import { getAllGuides } from "@/lib/guides";
import { SITE_URL, SITE_TITLE, SITE_DESCRIPTION } from "@/lib/site";

export const dynamic = "force-static";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function GET() {
  const guides = getAllGuides().filter((g) => !g.data.draft);

  const items = guides
    .map(
      (g) => `    <item>
      <title>${escapeXml(g.data.title)}</title>
      <description>${escapeXml(g.data.description)}</description>
      <pubDate>${g.data.date.toUTCString()}</pubDate>
      <link>${SITE_URL}/${g.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/${g.slug}</guid>
    </item>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <link>${SITE_URL}/</link>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
