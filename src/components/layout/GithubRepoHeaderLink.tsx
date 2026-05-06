"use client";

import { Star } from "lucide-react";
import { GithubMark } from "@/components/icons/GithubMark";
import { useLanguage } from "@/hooks/useLanguage";
import { useGithubRepoStats } from "@/hooks/useGithubRepoStats";
import { cn } from "@/lib/utils";

export function GithubRepoHeaderLink({ repo }: { repo: string }) {
  const { t } = useLanguage();
  const stats = useGithubRepoStats();
  const stars = stats?.stars ?? null;

  const href = `https://github.com/${repo}`;
  const title =
    stars != null
      ? `${t.nav.githubAria} · ${t.nav.githubStarsCount.replace("{n}", String(stars))}`
      : t.nav.githubAria;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={title}
      aria-label={title}
      className={cn(
        "flex items-center gap-1 rounded-md border border-border bg-muted/40 p-1.5 text-muted-foreground transition-colors hover:text-foreground sm:gap-1.5 sm:px-2 sm:py-1.5",
        stars != null && "pr-1.5 sm:pr-2",
      )}
    >
      <GithubMark className="size-4 shrink-0" />
      {stars != null ? (
        <span
          className="hidden items-center gap-0.5 font-mono text-[10px] tabular-nums text-muted-foreground sm:inline-flex"
          aria-hidden
        >
          <Star className="size-3 shrink-0 opacity-80" />
          {stars.toLocaleString()}
        </span>
      ) : null}
    </a>
  );
}
