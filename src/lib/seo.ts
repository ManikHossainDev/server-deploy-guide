import { normalizeGithubRepo } from "@/lib/github-repo";

/** Base URL for canonical links, Open Graph, sitemap, and robots. */
export function getMetadataBase(): URL {
  const raw = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").trim();
  try {
    return new URL(raw.endsWith("/") ? raw.slice(0, -1) : raw);
  } catch {
    return new URL("http://localhost:3000");
  }
}

export function absoluteUrl(path: string): string {
  const base = getMetadataBase();
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalized, base).toString();
}

/** Primary + bilingual discovery terms (keep concise; avoid stuffing). */
export const seoKeywords: string[] = [
  "VPS deployment",
  "server deployment guide",
  "Linux server setup",
  "Nginx SSL",
  "PM2 deploy",
  "Docker deploy",
  "CI/CD VPS",
  "Bangla devops guide",
  "সার্ভার ডেপ্লয়",
  "ভিপিএস ডেপ্লয়",
  "Next.js production deploy",
];

export function getGithubRepoPublicUrl(): string | undefined {
  const repo = normalizeGithubRepo(process.env.NEXT_PUBLIC_GITHUB_REPO);
  return repo ? `https://github.com/${repo}` : undefined;
}
