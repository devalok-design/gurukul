import type { NextConfig } from "next";

const SECURITY_HEADERS = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const config: NextConfig = {
  // Static export: the site has 3 routes, all prerendered (rss.xml is already
  // force-static). Cloudflare serves the output directly; security headers move
  // to public/_headers because headers() has no effect in export mode.
  output: "export",
  transpilePackages: ["@devalok/shilp-sutra"],
  async headers() {
    return [{ source: "/:path*", headers: SECURITY_HEADERS }];
  },
};

export default config;
