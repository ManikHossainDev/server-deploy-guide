import type { MetadataRoute } from "next";
import { absoluteUrl, getMetadataBase } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getMetadataBase().origin;
  const now = new Date();

  return [
    {
      url: base,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/contributors"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];
}
