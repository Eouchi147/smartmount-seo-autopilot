import { useMemo, useState, type ReactNode } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Pause, Play, PenLine, Radar } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DASHBOARD_KEY, useDashboard } from "@/hooks/use-dashboard";
import {
  discoverKeywords,
  generateArticle,
  setKeywordStatus,
} from "@/lib/seo/actions";
import { CATEGORIES, CATEGORY_LABEL, type KeywordCategory } from "@/lib/seo/brand";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/keywords")({ component: KeywordsPage });

function KeywordsPage() {
  const dash = useDashboard();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");
  const [writingId, setWritingId] = useState<number | null>(null);

  const discover = useMutation({
    mutationFn: () => discoverKeywords(),
    onSuccess: (res) => {
      void qc.invalidateQueries({ queryKey: DASHBOARD_KEY });
      if (res.ok) toast.success(`${res.inserted} new local keywords`);
      else toast.error(res.error);
    },
  });

  const pause = useMutation({
    mutationFn: (input: { id: number; status: "queued" | "paused" }) =>
      setKeywordStatus({ data: input }),
    onSuccess: () => void qc.invalidateQueries({ queryKey: DASHBOARD_KEY }),
  });

  const write = useMutation({
    mutationFn: (id: number) => {
      setWritingId(id);
      return generateArticle({ data: { keywordId: id } });
    },
    onSettled: () => setWritingId(null),
    onSuccess: (res) => {
      void qc.invalidateQueries({ queryKey: DASHBOARD_KEY });
      if (res.ok) {
        toast.success("Article drafted");
        void navigate({
          to: "/app/content/$articleId",
          params: { articleId: String(res.id) },
        });
      } else toast.error(res.error);
    },
  });

  const rows = useMemo(() => {
    const list = dash.data?.keywords ?? [];
    return list.filter((k) => {
      if (cat !== "all" && k.category !== cat) return false;
      if (q && !k.keyword.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [dash.data?.keywords, q, cat]);

  return (
    <div>
      <PageHeader
        eyebrow="Keyword engine"
        title="Ottawa & Gatineau terms"
        description="Scored for booking intent. Neighborhood, commercial, seasonal, and People Also Ask — never national."
        action={
          <Button onClick={() => discover.mutate()} disabled={discover.isPending}>
            {discover.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Radar className="size-4" />
            )}
            Discover more
          </Button>
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Filter keywords"
          className="sm:max-w-xs"
        />
        <div className="flex flex-wrap gap-1.5">
          <FilterChip active={cat === "all"} onClick={() => setCat("all")}>
            All
          </FilterChip>
          {CATEGORIES.map((c) => (
            <FilterChip key={c} active={cat === c} onClick={() => setCat(c)}>
              {CATEGORY_LABEL[c as KeywordCategory]}
            </FilterChip>
          ))}
        </div>
      </div>

      <Card>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full min-w-[52rem] text-left text-sm">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground">
              <tr className="border-b border-border">
                <th className="px-5 py-3 font-medium">Keyword</th>
                <th className="px-3 py-3 font-medium">Opp</th>
                <th className="px-3 py-3 font-medium">Intent</th>
                <th className="px-3 py-3 font-medium">Vol</th>
                <th className="px-3 py-3 font-medium">Comp</th>
                <th className="px-3 py-3 font-medium">Conv</th>
                <th className="px-3 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {rows.map((k) => (
                <tr key={k.id} className="border-b border-border last:border-0">
                  <td className="px-5 py-3">
                    <p className="font-medium">{k.keyword}</p>
                    <p className="text-xs text-muted-foreground">
                      {k.suburb ?? "Region"} · {k.language.toUpperCase()} · {k.category}
                    </p>
                  </td>
                  <td className="px-3 py-3 font-mono tabular-nums text-primary">
                    {k.opportunity_score}
                  </td>
                  <td className="px-3 py-3 capitalize text-muted-foreground">{k.intent}</td>
                  <td className="px-3 py-3 font-mono tabular-nums">{k.volume_score}</td>
                  <td className="px-3 py-3 font-mono tabular-nums">{k.competition_score}</td>
                  <td className="px-3 py-3 font-mono tabular-nums">{k.conversion_score}</td>
                  <td className="px-3 py-3">
                    <StatusBadge status={k.status} />
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-1">
                      {k.status !== "published" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={write.isPending}
                          onClick={() => write.mutate(k.id)}
                        >
                          {writingId === k.id ? (
                            <Loader2 className="size-3.5 animate-spin" />
                          ) : (
                            <PenLine className="size-3.5" />
                          )}
                          Write
                        </Button>
                      ) : null}
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label={k.status === "paused" ? "Resume" : "Pause"}
                        onClick={() =>
                          pause.mutate({
                            id: k.id,
                            status: k.status === "paused" ? "queued" : "paused",
                          })
                        }
                      >
                        {k.status === "paused" ? (
                          <Play className="size-4" />
                        ) : (
                          <Pause className="size-4" />
                        )}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-9 rounded-full px-3 text-xs font-medium transition-colors",
        active ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground",
      )}
    >
      {children}
    </button>
  );
}
