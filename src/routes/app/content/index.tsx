import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useDashboard } from "@/hooks/use-dashboard";

export const Route = createFileRoute("/app/content/")({
  component: ContentPage,
});

function ContentPage() {
  const dash = useDashboard();
  const articles = dash.data?.articles ?? [];

  return (
    <div>
      <PageHeader
        eyebrow="Content"
        title="Articles"
        description="Every piece is written for a booking-intent keyword. Open one to edit, generate an install photo, or publish."
        action={
          <Button asChild variant="outline">
            <Link to="/app/keywords">Write from a keyword</Link>
          </Button>
        }
      />
      <div className="grid gap-3">
        {articles.map((a) => (
          <Card key={a.id} className="min-w-0 overflow-hidden">
            <CardContent className="flex min-w-0 flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={a.status} />
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">
                    {a.language}
                  </span>
                </div>
                <h2 className="mt-2 text-base font-semibold tracking-tight text-pretty">
                  {a.title}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {a.keyword ?? a.slug} · {a.word_count ?? 0} words
                  {a.avg_position ? ` · pos ${a.avg_position}` : ""}
                </p>
              </div>
              <Button asChild className="self-start">
                <Link to="/app/content/$articleId" params={{ articleId: String(a.id) }}>
                  Open
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
