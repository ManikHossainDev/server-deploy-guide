"use client";

import * as React from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, Users } from "lucide-react";
import { GithubMark } from "@/components/icons/GithubMark";
import type { GuideSection } from "@/types/guide";
import { useLanguage } from "@/hooks/useLanguage";
import { PathSelector } from "@/components/guide/PathSelector";
import { SectionTierIcon } from "@/components/guide/SectionTierPanel";
import { cn } from "@/lib/utils";
import type { SectionTier } from "@/types/guide";
import { normalizeGithubRepo } from "@/lib/github-repo";
import { useGithubRepoStats } from "@/hooks/useGithubRepoStats";

const GITHUB_REPO =
  normalizeGithubRepo(process.env.NEXT_PUBLIC_GITHUB_REPO) ?? "";

export function MobileNav({ sections }: { sections: GuideSection[] }) {
  const [open, setOpen] = React.useState(false);
  const { lang, t } = useLanguage();
  const ghStats = useGithubRepoStats();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className={cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          "border-border bg-background text-foreground hover:bg-muted sm:hidden",
        )}
        aria-label={t.nav.openMenu}
      >
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="h-[85vh] border-t border-border bg-background p-0"
      >
        <SheetHeader className="border-b border-border px-4 py-3 text-left">
          <SheetTitle
            className={cn(
              "text-base text-foreground",
              lang === "bn" ? "font-bengali font-semibold" : "font-mono",
            )}
          >
            {t.nav.sections}
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-wrap gap-2 border-b border-border px-4 py-2.5">
          <Link
            href="/contributors"
            onClick={() => setOpen(false)}
            aria-label={t.nav.contributorsAria}
            title={t.nav.contributorsAria}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "border-border bg-muted/30 font-mono text-xs text-muted-foreground hover:text-foreground",
              lang === "bn" && "font-bengali",
            )}
          >
            <Users className="size-3.5 shrink-0" aria-hidden />
            {t.nav.contributeTab}
          </Link>
          {GITHUB_REPO ? (
            <a
              href={`https://github.com/${GITHUB_REPO}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={
                ghStats != null
                  ? `${t.nav.githubAria} · ${t.nav.githubStarsCount.replace("{n}", String(ghStats.stars))}`
                  : t.nav.githubAria
              }
              title={
                ghStats != null
                  ? `${t.nav.githubAria} · ${t.nav.githubStarsCount.replace("{n}", String(ghStats.stars))}`
                  : t.nav.githubAria
              }
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "border-border bg-muted/30 font-mono text-xs text-muted-foreground hover:text-foreground",
              )}
            >
              <GithubMark className="size-3.5 shrink-0" />
              <span className="tabular-nums">{t.nav.githubTab}</span>
              {ghStats != null ? (
                <span className="tabular-nums text-muted-foreground/90">
                  {" · "}
                  {ghStats.stars.toLocaleString()}
                </span>
              ) : null}
            </a>
          ) : null}
        </div>
        <div className="flex h-[calc(85vh-3.5rem)] flex-col">
          <div className="border-b border-border p-4">
            <PathSelector />
          </div>
          <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-2">
            <ul className="space-y-1">
              {sections.map((s) => {
                const title = lang === "bn" ? s.titleBn : s.titleEn;
                const tier: SectionTier = s.tier ?? "recommended";
                return (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      onClick={() => setOpen(false)}
                      className="flex min-w-0 cursor-pointer items-start gap-3 rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted"
                    >
                      <span className="shrink-0 font-mono text-xl text-muted-foreground">
                        {s.index}
                      </span>
                      <span className="min-w-0 flex-1 break-words font-medium">
                        {title}
                      </span>
                      <SectionTierIcon tier={tier} className="mt-0.5" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}
