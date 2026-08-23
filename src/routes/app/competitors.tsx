import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useDashboard } from "@/hooks/use-dashboard";

export const Route = createFileRoute("/app/competitors")({
  component: CompetitorsPage,
});

function CompetitorsPage() {
  const dash = useDashboard();
  const list = dash.data?.competitors ?? [];

  return (
    <div>
      <PageHeader
        eyebrow="Gap watch"
        title="Ottawa TV-mounting field"
        description="National install add-ons and marketplace handymen rank on generic terms. Neighborhood and warranty pages are the opening."
      />
      <div className="grid gap-3">
        {list.map((c) => (
          <Card key={c.id}>
            <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-semibold tracking-tight">{c.name}</h2>
                  <Badge
                    variant={
                      c.threat === "high"
                        ? "destructive"
                        : c.threat === "medium"
                          ? "warning"
                          : "secondary"
                    }
                  >
                    {c.threat} threat
                  </Badge>
                </div>
                <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{c.notes}</p>
                {c.last_seen ? (
                  <p className="mt-2 text-xs text-muted-foreground">{c.last_seen}</p>
                ) : null}
              </div>
              <p className="font-mono text-sm tabular-nums text-muted-foreground">
                {c.overlapping_keywords} overlapping terms
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
