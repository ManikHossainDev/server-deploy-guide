import type { Metadata } from "next";
import { ContributorsView } from "@/components/contributors/ContributorsView";
import { normalizeGithubRepo } from "@/lib/github-repo";
import { absoluteUrl } from "@/lib/seo";

export type Contributor = {
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
  type: string;
};

async function getContributors(): Promise<Contributor[]> {
  const repo = normalizeGithubRepo(process.env.NEXT_PUBLIC_GITHUB_REPO);
  if (!repo) return [];
  try {
    const res = await fetch(
      `https://api.github.com/repos/${repo}/contributors?per_page=100`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return [];
    const data: Contributor[] = await res.json();
    return data.filter((c) => c.type !== "Bot");
  } catch {
    return [];
  }
}

const title = "Contributors";
const descriptionEn =
  "Contributors to the Server Deploy Guide and how to contribute via GitHub, content files, and pull requests.";

export const metadata: Metadata = {
  title,
  description: descriptionEn,
  alternates: {
    canonical: "/contributors",
  },
  openGraph: {
    title: `${title} — Server Deploy Guide`,
    description: descriptionEn,
    url: absoluteUrl("/contributors"),
    type: "website",
    locale: "en_US",
    alternateLocale: ["bn_BD"],
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Server Deploy Guide — Contributors",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} — Server Deploy Guide`,
    description: descriptionEn,
  },
  robots: {
    index: true,
    follow: true,
  },
  keywords: [
    "open source contributors",
    "GitHub contributors",
    "documentation contributors",
    "অবদানকারী",
  ],
};

export default async function ContributorsPage() {
  const contributors = await getContributors();
  const repo = normalizeGithubRepo(process.env.NEXT_PUBLIC_GITHUB_REPO);

  return (
    <ContributorsView contributors={contributors} repo={repo} />
  );
}
