import type { Metadata } from "next";
import { GuideShell } from "@/components/guide/GuideShell";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
  openGraph: {
    url: absoluteUrl("/"),
  },
};

export default function Home() {
  return <GuideShell />;
}
