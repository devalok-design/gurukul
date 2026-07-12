import type { MetadataRoute } from "next";
import { getAllGuides } from "@/lib/guides";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const guides = getAllGuides().filter((g) => !g.data.draft);

  return [
    { url: `${SITE_URL}/` },
    { url: `${SITE_URL}/about` },
    ...guides.map((g) => ({
      url: `${SITE_URL}/${g.slug}`,
      lastModified: g.data.updatedDate ?? g.data.date,
    })),
  ];
}
