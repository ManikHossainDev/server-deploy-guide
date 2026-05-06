"use client";

import * as React from "react";

export type GithubRepoStats = { stars: number; forks: number };

export function useGithubRepoStats(): GithubRepoStats | null {
  const [data, setData] = React.useState<GithubRepoStats | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    fetch("/api/github-repo")
      .then((r) => (r.ok ? r.json() : null))
      .then((j: { stars?: number; forks?: number } | null) => {
        if (
          cancelled ||
          j == null ||
          typeof j.stars !== "number" ||
          typeof j.forks !== "number"
        ) {
          return;
        }
        setData({ stars: j.stars, forks: j.forks });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return data;
}
