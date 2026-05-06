import type { MetadataRoute } from "next";
import { bn } from "@/lib/i18n/bn";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: bn.meta.title,
    short_name: "Deploy Guide",
    description: bn.meta.description,
    start_url: "/",
    display: "standalone",
    background_color: "#050505",
    theme_color: "#050505",
    lang: "bn",
  };
}
