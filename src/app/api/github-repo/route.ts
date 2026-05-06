import { NextResponse } from "next/server";
import { normalizeGithubRepo } from "@/lib/github-repo";

/** Cache GitHub metadata; avoids client hitting api.github.com directly. */
export const revalidate = 600;

export async function GET() {
  const repo = normalizeGithubRepo(process.env.NEXT_PUBLIC_GITHUB_REPO);
  if (!repo) {
    return NextResponse.json({ error: "no_repo" }, { status: 404 });
  }

  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
  };
  const token = process.env.GITHUB_TOKEN?.trim();
  if (token) {
    (headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`https://api.github.com/repos/${repo}`, {
    headers,
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "github_upstream", status: res.status },
      { status: 502 },
    );
  }

  const data = (await res.json()) as {
    stargazers_count?: number;
    forks_count?: number;
    full_name?: string;
  };

  return NextResponse.json({
    stars: data.stargazers_count ?? 0,
    forks: data.forks_count ?? 0,
    fullName: data.full_name ?? repo,
  });
}
