"use client";

import { Container, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePath } from "@/hooks/usePath";
import { useLanguage } from "@/hooks/useLanguage";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function PathSelector({ className }: { className?: string }) {
  const { path, setPath } = usePath();
  const { lang, t } = useLanguage();

  return (
    <div
      className={cn(
        "w-full rounded-xl border border-border bg-muted/20 px-4 py-3 sm:px-5 sm:py-3.5",
        className,
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <p
          className={cn(
            "text-[11px] font-medium uppercase tracking-wider text-muted-foreground sm:shrink-0",
            lang === "bn" ? "font-bengali normal-case tracking-normal" : "font-mono",
          )}
        >
          {t.path.label}
        </p>

        <Tabs
          value={path}
          onValueChange={(v) => {
            if (v === "manual" || v === "docker") setPath(v);
          }}
          className="flex w-full shrink-0 justify-center sm:w-auto sm:justify-end"
        >
          <TabsList
            variant="default"
            className="inline-flex h-auto w-fit max-w-full gap-0.5 rounded-lg border border-border/60 bg-muted/50 p-0.5 shadow-sm"
          >
            <TabsTrigger
              value="manual"
              className={cn(
                "flex-none rounded-md px-3 py-2 text-xs shadow-none ring-0 ring-offset-0 transition-colors after:hidden sm:px-4 sm:py-2 sm:text-[13px]",
                lang === "bn" ? "font-bengali" : "font-mono",
                "gap-2 data-active:shadow-sm [&_svg]:text-muted-foreground data-active:[&_svg]:text-foreground",
              )}
            >
              <Settings2 className="size-3.5 shrink-0 sm:size-4" aria-hidden />
              {t.path.manual}
            </TabsTrigger>
            <TabsTrigger
              value="docker"
              className={cn(
                "flex-none rounded-md px-3 py-2 text-xs shadow-none ring-0 ring-offset-0 transition-colors after:hidden sm:px-4 sm:py-2 sm:text-[13px]",
                lang === "bn" ? "font-bengali" : "font-mono",
                "gap-2 data-active:shadow-sm [&_svg]:text-muted-foreground data-active:[&_svg]:text-foreground",
              )}
            >
              <Container className="size-3.5 shrink-0 sm:size-4" aria-hidden />
              {t.path.docker}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}
