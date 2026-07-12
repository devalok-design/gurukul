import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";

/**
 * Content pipeline for Gurukul guides.
 * Filesystem markdown + unified (remark/rehype + shiki) + zod frontmatter.
 * Runs entirely at build time (RSC / generateStaticParams) — zero client JS.
 *
 * The zod schema is ported verbatim from the old src/content.config.ts.
 */
const GuideFrontmatter = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  description: z.string(),
  author: z.string().default("Mudit Baid"),
  authorRole: z.string().optional(),
  date: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  readTime: z.string(),
  tags: z.array(z.string()).optional(),
  ogImage: z.string().optional(),
  draft: z.boolean().default(false),
});

export type GuideData = z.infer<typeof GuideFrontmatter>;

export interface GuideHeading {
  depth: number;
  slug: string;
  text: string;
}

export interface Guide {
  slug: string;
  data: GuideData;
}

export interface RenderedGuide {
  data: GuideData;
  html: string;
  headings: GuideHeading[];
}

const GUIDES_DIR = path.join(process.cwd(), "src", "content", "guides");

function parseGuideFile(slug: string): { data: GuideData; content: string } {
  const raw = fs.readFileSync(path.join(GUIDES_DIR, `${slug}.md`), "utf8");
  const { data, content } = matter(raw);
  return { data: GuideFrontmatter.parse(data), content };
}

/** All guides (drafts included), sorted by date descending. Callers filter drafts. */
export function getAllGuides(): Guide[] {
  if (!fs.existsSync(GUIDES_DIR)) return [];
  return fs
    .readdirSync(GUIDES_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const slug = f.replace(/\.md$/, "");
      return { slug, data: parseGuideFile(slug).data };
    })
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

interface HastNode {
  type: string;
  value?: string;
  tagName?: string;
  properties?: { id?: string | number };
  children?: HastNode[];
}

function collectText(node: HastNode): string {
  if (node.type === "text") return node.value ?? "";
  if (Array.isArray(node.children)) return node.children.map(collectText).join("");
  return "";
}

/**
 * Collect depth-2 and depth-3 headings from the rendered hast tree, reading the
 * `id` that rehype-slug assigned. This guarantees the TOC #anchor links match the
 * heading ids exactly (same source of truth, no re-derivation of the slug).
 */
function collectHeadings(tree: HastNode): GuideHeading[] {
  const out: GuideHeading[] = [];
  function walk(node: HastNode) {
    if (
      node.type === "element" &&
      (node.tagName === "h2" || node.tagName === "h3") &&
      node.properties?.id
    ) {
      out.push({
        depth: node.tagName === "h2" ? 2 : 3,
        slug: String(node.properties.id),
        text: collectText(node).trim(),
      });
    }
    if (Array.isArray(node.children)) node.children.forEach(walk);
  }
  walk(tree);
  return out;
}

export async function getGuide(slug: string): Promise<RenderedGuide | null> {
  const filePath = path.join(GUIDES_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const { data, content } = parseGuideFile(slug);

  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeSlug)
    // Append an (empty) anchor so heading ids get a jump target without changing
    // the visible article — content:[] keeps it invisible (parity with Astro,
    // which added ids but no visible autolink markup).
    .use(rehypeAutolinkHeadings, { behavior: "append", content: [] })
    // github-dark: dark code blocks on the light page (matches astro.config shikiConfig).
    .use(rehypePrettyCode, { theme: "github-dark", keepBackground: true })
    .use(rehypeStringify, { allowDangerousHtml: true });

  const tree = processor.parse(content);
  const transformed = await processor.run(tree);
  const html = processor.stringify(transformed);
  const headings = collectHeadings(transformed as unknown as HastNode);

  return { data, html, headings };
}
