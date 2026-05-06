"use client";

import { Badge } from "@/components/ui/badge";
import type { SectionScope } from "@/types/guide";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";

export function StepBadge({ scope }: { scope: SectionScope }) {
  const { lang, t } = useLanguage();
  const label =
    scope === "both"
      ? t.badges.both
      : scope === "manual"
        ? t.badges.manual
        : t.badges.docker;
  return (
    <Badge
      variant="outline"
      className={cn(
        "mt-2 border-border bg-transparent text-xs tracking-wide text-muted-foreground",
        lang === "bn"
          ? "font-bengali normal-case"
          : "font-mono uppercase",
      )}
    >
      {label}
    </Badge>
  );
}
