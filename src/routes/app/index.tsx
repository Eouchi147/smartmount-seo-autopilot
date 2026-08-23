import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowRight,
  Loader2,
  Pause,
  Play,
  Sparkles,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DASHBOARD_KEY, useDashboard } from "@/hooks/use-dashboard";
import { runAutopilotCycle, updateSettings } from "@/lib/seo/actions";
import { formatCompact, formatNumber } from "@/lib/utils";

export const Route = createFileRoute("/app/")({ component: Overview });

function Overview() {
  const dash = useDashboard();
  const qc = useQueryClient();
  const cycle = useMutation({
    mutationFn: () => runAutopilotCycle(),
    onSuccess: (res) => {
      void qc.invalidateQueries({ queryKey: DASHBOARD_KEY });
      if (res.ok) toast.success("Draft ready for review");
      else toast.error(res.error);
    },
    onError: () => toast.error("Cycle failed"),
  });
  const toggle = useMutation({
    mutationFn: (on: boolean) => updateSettings({ data: { autopilot_on: on } }),
    onSuccess: () => void qc.invalidateQueries({ queryKey: DASHBOARD_KEY }),
  });

  if (dash.isLoading || !dash.data) {
    return (
      <div className="grid gap-4">
        <Skeleton className="h-16 w-64" />
        <div className="grid gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  const { totals, metrics, queue, activity, suburbScores, articles, settings } =
    dash.data;
  const chart = metrics.slice(-30).map((d) => ({
    day: d.day.slice(5),
    impressions: d.impressions,
    clicks: d.clicks,
  }));

  return (
    <div className="stagger-in">
      <PageHeader
        eyebrow="Overview"
        title="Ottawa visibility"
        description="Local impressions and estimated booking impact for smartmount.ca. Modelled SERP until Search Console is wired."
        action={
          <>
            <Button
              variant="outline"
              onClick={() => toggle.mutate(!settings.autopilot_on)}
              disabled={toggle.isPending}
            >
              {settings.autopilot_on ? (
                <Pause className="size-4" />
              ) : (
                <Play className="size-4" />
              )}
              {settings.autopilot_on ? "Pause" : "Resume"}
            </Button>
            <Button onClick={() => cycle.mutate()} disabled={cycle.isPending}>
              {cycle.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Sparkles className="size-4" />
              )}
              Run next article
            </Button>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Visibility score" value={`${totals.visibility}`} hint="Ottawa + Gatineau" />
        <Stat
          label="Impressions · 14d"
          value={formatCompact(totals.impressions)}
          hint={`${formatNumber(totals.clicks)} clicks`}
        />
        <Stat
          label="Avg position"
          value={totals.avgPosition.toFixed(1)}
          hint={`${(totals.ctr * 100).toFixed(1)}% CTR`}
        />
        <Stat
          label="Est. bookings"
          value={totals.bookings.toFixed(1)}
          hint="~3.8% of local clicks"
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Search traffic</CardTitle>
            <span className="text-xs text-muted-foreground">Last 30 days</span>
          </CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chart} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="imp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.28} />
                      <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="var(--color-border)" vertical={false} />
                  <XAxis
                    dataKey="day"
                    tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    width={36}
                  />
                  <RTooltip
                    contentStyle={{
                      background: "var(--color-popover)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="impressions"
                    stroke="var(--color-primary)"
                    fill="url(#imp)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="clicks"
                    stroke="var(--color-success)"
                    fill="none"
                    strokeWidth={1.5}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Autopilot queue</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <Row k="Next keyword" v={queue.nextKeyword?.keyword ?? "Queue empty"} />
            <Row
              k="Waiting on you"
              v={
                queue.nextArticle
                  ? queue.nextArticle.title
                  : `${queue.reviewCount} in review`
              }
            />
            <Row k="Published" v={`${queue.publishedCount} live posts`} />
            <Row k="Keywords queued" v={`${queue.queuedKeywords}`} />
            <Button asChild variant="outline" className="w-full">
              <Link to="/app/content">
                Review drafts <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Suburb scores</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link to="/app/visibility">Map</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {suburbScores.slice(0, 6).map((s) => (
              <div key={s.suburb}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span>{s.suburb}</span>
                  <span className="font-mono tabular-nums text-muted-foreground">
                    {s.score}
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${s.score}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {activity.map((item) => (
              <div key={item.id} className="flex items-start justify-between gap-3">
                <p className="text-sm">{item.message}</p>
                <Badge variant="outline" className="shrink-0 capitalize">
                  {item.kind}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Latest posts</CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link to="/app/content">All content</Link>
          </Button>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="pb-2 font-medium">Title</th>
                <th className="pb-2 font-medium">Status</th>
                <th className="pb-2 font-medium">Clicks</th>
                <th className="pb-2 font-medium">Pos</th>
              </tr>
            </thead>
            <tbody>
              {articles.slice(0, 5).map((a) => (
                <tr key={a.id} className="border-t border-border">
                  <td className="py-3">
                    <Link
                      to="/app/content/$articleId"
                      params={{ articleId: String(a.id) }}
                      className="hover:text-primary"
                    >
                      {a.title}
                    </Link>
                    <p className="text-xs text-muted-foreground">{a.keyword}</p>
                  </td>
                  <td className="py-3">
                    <StatusBadge status={a.status} />
                  </td>
                  <td className="py-3 font-mono tabular-nums">{a.clicks}</td>
                  <td className="py-3 font-mono tabular-nums">
                    {a.avg_position ?? "—"}
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

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
          {label}
        </p>
        <p className="mt-2 font-mono text-3xl tabular-nums tracking-tight">{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">{k}</p>
      <p className="mt-0.5 line-clamp-2">{v}</p>
    </div>
  );
}
