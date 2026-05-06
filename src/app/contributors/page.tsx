import { ContributorsView } from "@/components/contributors/ContributorsView";
import { normalizeGithubRepo } from "@/lib/github-repo";

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

export const metadata = {
  title: "Contributors — Server Deploy Guide",
  description: "Everyone who has contributed to the Server Deploy Guide.",
};

export default async function ContributorsPage() {
  const contributors = await getContributors();
  const repo = normalizeGithubRepo(process.env.NEXT_PUBLIC_GITHUB_REPO);

  return (
    <ContributorsView contributors={contributors} repo={repo} />
  );
}
