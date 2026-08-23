import { createFileRoute } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboard } from "@/hooks/use-dashboard";
import { formatNumber } from "@/lib/utils";

export const Route = createFileRoute("/app/visibility")({
  component: VisibilityPage,
});

function VisibilityPage() {
  const dash = useDashboard();
  const data = dash.data;
  const suburbs = data?.suburbScores ?? [];
  const last = data?.metrics.slice(-1)[0];

  return (
    <div>
      <PageHeader
        eyebrow="Analytics"
        title="Local visibility"
        description="Suburb-level scores from published clusters plus modelled impressions. Swap in Search Console when the property is connected."
      />
      <div className="grid gap-3 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Score</p>
            <p className="mt-2 font-mono text-3xl tabular-nums">{data?.totals.visibility ?? "—"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Today impressions</p>
            <p className="mt-2 font-mono text-3xl tabular-nums">
              {last ? formatNumber(last.impressions) : "—"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Est. bookings · 14d</p>
            <p className="mt-2 font-mono text-3xl tabular-nums">{data?.totals.bookings.toFixed(1)}</p>
          </CardContent>
        </Card>
      </div>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Service-area cluster</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={suburbs} margin={{ top: 8, right: 8, left: 0, bottom: 24 }}>
                <CartesianGrid stroke="var(--color-border)" vertical={false} />
                <XAxis
                  dataKey="suburb"
                  tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
                  interval={0}
                  angle={-25}
                  textAnchor="end"
                  height={50}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={32}
                />
                <RTooltip
                  contentStyle={{
                    background: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="score" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
