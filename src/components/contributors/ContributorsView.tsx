"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink, GitFork, Moon, Sun, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import { GithubMark } from "@/components/icons/GithubMark";

export type ContributorRow = {
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
  type: string;
};

export function ContributorsView({
  contributors,
  repo,
}: {
  contributors: ContributorRow[];
  repo: string | undefined;
}) {
  const { lang, setLang, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const c = t.contributorsPage;
  const repoUrl = repo ? `https://github.com/${repo}` : "#";

  const countHeading =
    contributors.length === 0
      ? c.contributorsSectionTitle
      : contributors.length === 1
        ? c.contributorCountOne
        : c.contributorCountMany.replace(
            "{n}",
            String(contributors.length),
          );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-100 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between gap-2 px-4">
          <div className="relative z-0 min-w-0 flex-1 overflow-hidden">
            <Link
              href="/"
              className={cn(
                "block truncate text-sm font-bold text-foreground transition-colors hover:text-primary md:text-base",
                lang === "bn" ? "font-bengali" : "font-mono",
              )}
            >
              {c.backToGuide}
            </Link>
          </div>
          <div className="relative z-10 flex shrink-0 items-center gap-1.5 sm:gap-2">
            {repo ? (
              <a
                href={repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex max-w-[40vw] items-center gap-1.5 truncate rounded-md border border-border bg-muted/40 px-2 py-1.5 font-mono text-[10px] text-muted-foreground transition-colors hover:text-foreground sm:max-w-[14rem] sm:text-xs"
                title={t.nav.githubAria}
                aria-label={t.nav.githubAria}
              >
                <ExternalLink className="size-3 shrink-0 sm:size-3.5" />
                <span className="truncate">{repo}</span>
              </a>
            ) : null}
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="border-border bg-muted/40 text-foreground hover:bg-muted"
              aria-label={t.theme.toggleAria}
              title={t.theme.toggleAria}
              onClick={() => toggleTheme()}
            >
              {theme === "dark" ? (
                <Sun className="size-4" aria-hidden />
              ) : (
                <Moon className="size-4" aria-hidden />
              )}
            </Button>
            <div
              className="flex items-center rounded-md border border-border bg-muted/30 p-0.5"
              role="group"
              aria-label="Language"
            >
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className={cn(
                  "h-8 px-2.5 font-bengali text-xs text-muted-foreground hover:bg-muted sm:px-3",
                  lang === "bn" &&
                    "border border-border bg-accent text-foreground",
                )}
                onClick={() => setLang("bn")}
              >
                {t.langSwitch.bn}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className={cn(
                  "h-8 px-2.5 font-mono text-xs text-muted-foreground hover:bg-muted sm:px-3",
                  lang === "en" &&
                    "border border-border bg-accent text-foreground",
                )}
                onClick={() => setLang("en")}
              >
                {t.langSwitch.en}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-12">
        <div className="mb-12">
          <div className="mb-3 flex items-center gap-3">
            <Users className="size-7 shrink-0 text-primary" />
            <h1
              className={cn(
                "text-3xl font-bold",
                lang === "bn" ? "font-bengali" : "font-mono",
              )}
            >
              {c.pageTitle}
            </h1>
          </div>
          <p
            className={cn(
              "text-muted-foreground",
              lang === "bn" ? "font-bengali text-base leading-relaxed" : "font-mono text-sm leading-relaxed",
            )}
          >
            {c.intro}
          </p>
        </div>

        <section className="mb-12 rounded-xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <GitFork className="size-5 shrink-0 text-primary" />
            <h2
              className={cn(
                "text-lg font-semibold",
                lang === "bn" ? "font-bengali" : "font-mono",
              )}
            >
              {c.howToTitle}
            </h2>
          </div>

          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <ol
              className={cn(
                "list-decimal space-y-2 pl-4 text-sm leading-relaxed text-foreground/90",
                lang === "bn" ? "font-bengali" : "font-mono",
              )}
            >
              {c.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>

          <div className="mt-4 rounded-lg border border-border bg-muted/20 px-4 py-3">
            <p
              className={cn(
                "text-sm text-muted-foreground",
                lang === "bn" ? "font-bengali" : "font-mono",
              )}
            >
              <span className="font-mono font-semibold text-foreground">
                {c.contentFilesLabel}{" "}
              </span>
              <code className="font-mono text-xs">src/lib/content/part0.ts</code>{" "}
              {c.contentFilesThrough}{" "}
              <code className="font-mono text-xs">src/lib/content/part4.ts</code>{" "}
              {c.contentFilesSuffix}
            </p>
          </div>

          {repo ? (
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href={repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-4 py-2 font-mono text-sm text-foreground transition-colors hover:bg-muted"
              >
                <GithubMark className="size-4 shrink-0" />
                {c.viewGithub}
              </a>
              <a
                href={`${repoUrl}/fork`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 px-4 py-2 font-mono text-sm text-primary transition-colors hover:bg-primary/20"
              >
                <GitFork className="size-4 shrink-0" />
                {c.forkContribute}
              </a>
              <a
                href={`${repoUrl}/issues/new`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-4 py-2 font-mono text-sm text-foreground transition-colors hover:bg-muted"
              >
                {c.reportIssue}
              </a>
            </div>
          ) : null}
        </section>

        <section>
          <h2
            className={cn(
              "mb-6 text-lg font-semibold",
              lang === "bn" ? "font-bengali" : "font-mono",
            )}
          >
            {countHeading}
          </h2>

          {contributors.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-12 text-center">
              <Users className="mx-auto mb-4 size-10 text-muted-foreground/40" />
              <p
                className={cn(
                  "text-sm text-muted-foreground",
                  lang === "bn" ? "font-bengali" : "font-mono",
                )}
              >
                {repo ? c.emptyNoContributors : c.emptySetRepo}
              </p>
              {repo ? (
                <a
                  href={`${repoUrl}/fork`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 px-4 py-2 font-mono text-sm text-primary transition-colors hover:bg-primary/20"
                >
                  <GitFork className="size-4 shrink-0" />
                  {c.beFirstContributor}
                </a>
              ) : null}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {contributors.map((row) => (
                <a
                  key={row.login}
                  href={row.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-4 text-center transition-all hover:border-primary/40 hover:bg-muted/40"
                >
                  <Image
                    src={row.avatar_url}
                    alt={row.login}
                    width={64}
                    height={64}
                    className="rounded-full ring-2 ring-border transition-all group-hover:ring-primary/40"
                  />
                  <div className="w-full min-w-0">
                    <p className="truncate font-mono text-sm font-semibold text-foreground">
                      {row.login}
                    </p>
                    <p
                      className={cn(
                        "mt-0.5 text-xs text-muted-foreground",
                        lang === "bn" ? "font-bengali" : "font-mono",
                      )}
                    >
                      {row.contributions === 1
                        ? c.commitOne
                        : c.commitMany.replace(
                            "{n}",
                            String(row.contributions),
                          )}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
