/**
 * GitHub REST paths expect `owner/repo` only. Accepts full github.com URLs or
 * pasted repo paths so env mistakes don't produce URLs like
 * `.../repos/https:/owner/repo/...`.
 */
export function normalizeGithubRepo(
  raw: string | undefined,
): string | undefined {
  if (!raw) return undefined;
  let s = raw.trim();
  if (!s) return undefined;

  const fromGithubCom = s.match(
    /github\.com\/([^/\s#?]+\/[^/\s#?]+)/i,
  );
  if (fromGithubCom) {
    return stripGitSuffix(fromGithubCom[1]);
  }

  s = s.replace(/^https?:\/+/i, "").replace(/^\/+/, "");
  const parts = s.split("/").filter(Boolean);
  if (
    parts.length === 2 &&
    parts.every((p) => /^[\w.-]+$/.test(p))
  ) {
    return stripGitSuffix(`${parts[0]}/${parts[1]}`);
  }

  return undefined;
}

function stripGitSuffix(segmentPath: string): string {
  return segmentPath.replace(/\.git$/i, "");
}
