import { createFileRoute, Link } from "@tanstack/react-router";
import { addDays, format, isSameDay, parseISO, startOfWeek } from "date-fns";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { useDashboard } from "@/hooks/use-dashboard";

export const Route = createFileRoute("/app/calendar")({ component: CalendarPage });

function CalendarPage() {
  const dash = useDashboard();
  const articles = dash.data?.articles ?? [];
  const start = startOfWeek(new Date(), { weekStartsOn: 1 });
  const days = Array.from({ length: 14 }, (_, i) => addDays(start, i));

  return (
    <div>
      <PageHeader
        eyebrow="Calendar"
        title="Two-week board"
        description="Published and scheduled Smart Mount posts. Autopilot fills the next empty slot."
      />
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
        {days.map((day) => {
          const items = articles.filter((a) => {
            const d = a.scheduled_for || (a.published_at ? a.published_at.slice(0, 10) : null);
            if (!d) return false;
            try {
              return isSameDay(parseISO(d), day);
            } catch {
              return false;
            }
          });
          const today = isSameDay(day, new Date());
          return (
            <Card key={day.toISOString()} className={today ? "ring-1 ring-primary/40" : ""}>
              <CardContent className="min-h-36 p-3">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  {format(day, "EEE")}
                </p>
                <p className="font-mono text-lg tabular-nums">{format(day, "d")}</p>
                <div className="mt-2 space-y-2">
                  {items.length === 0 ? (
                    <p className="text-xs text-muted-foreground">Open</p>
                  ) : (
                    items.map((a) => (
                      <Link
                        key={a.id}
                        to="/app/content/$articleId"
                        params={{ articleId: String(a.id) }}
                        className="block rounded-md bg-secondary/80 p-2"
                      >
                        <StatusBadge status={a.status} />
                        <p className="mt-1 line-clamp-3 text-xs leading-snug">{a.title}</p>
                      </Link>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
