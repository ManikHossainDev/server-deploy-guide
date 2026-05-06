import type { MetadataRoute } from "next";
import { absoluteUrl, getMetadataBase } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const base = getMetadataBase().origin;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: base,
  };
}
