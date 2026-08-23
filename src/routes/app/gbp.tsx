import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DASHBOARD_KEY, useDashboard } from "@/hooks/use-dashboard";
import { generateGbpPosts, markGbp } from "@/lib/seo/actions";

export const Route = createFileRoute("/app/gbp")({ component: GbpPage });

function GbpPage() {
  const dash = useDashboard();
  const qc = useQueryClient();
  const gen = useMutation({
    mutationFn: () => generateGbpPosts(),
    onSuccess: (res) => {
      void qc.invalidateQueries({ queryKey: DASHBOARD_KEY });
      if (res.ok) toast.success(`${res.inserted} GBP drafts`);
      else toast.error(res.error);
    },
  });
  const mark = useMutation({
    mutationFn: (id: number) => {
      const post = dash.data?.gbp.find((g) => g.id === id);
      if (post) void navigator.clipboard.writeText(`${post.title}\n\n${post.body}\n\n${post.cta ?? ""}`);
      return markGbp({ data: { id, status: "copied" } });
    },
    onSuccess: () => {
      toast.success("Copied for Google Business Profile");
      void qc.invalidateQueries({ queryKey: DASHBOARD_KEY });
    },
  });

  return (
    <div>
      <PageHeader
        eyebrow="Google Business"
        title="Profile posts"
        description="Short, local, no-hype updates Sam can paste into GBP. Same-day openings, suburbs, commercial, seasonal."
        action={
          <Button onClick={() => gen.mutate()} disabled={gen.isPending}>
            {gen.isPending ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            Draft more
          </Button>
        }
      />
      <div className="grid gap-3 md:grid-cols-2">
        {(dash.data?.gbp ?? []).map((post) => (
          <Card key={post.id}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between gap-2">
                <StatusBadge status={post.status} />
                <span className="text-xs text-muted-foreground">{post.scheduled_for}</span>
              </div>
              <h2 className="mt-3 font-semibold tracking-tight">{post.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{post.body}</p>
              <p className="mt-3 text-sm text-primary">{post.cta}</p>
              <Button
                className="mt-4"
                variant="outline"
                size="sm"
                onClick={() => mark.mutate(post.id)}
              >
                Copy to GBP
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
