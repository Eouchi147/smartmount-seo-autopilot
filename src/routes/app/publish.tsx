import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DASHBOARD_KEY, useDashboard } from "@/hooks/use-dashboard";
import { publishArticle, updateSettings } from "@/lib/seo/actions";

export const Route = createFileRoute("/app/publish")({ component: PublishPage });

function PublishPage() {
  const dash = useDashboard();
  const qc = useQueryClient();
  const [wpUser, setWpUser] = useState("");
  const [wpPass, setWpPass] = useState("");
  const [webhook, setWebhook] = useState("");

  useEffect(() => {
    setWpUser(localStorage.getItem("sm-wp-user") ?? "");
    setWpPass(localStorage.getItem("sm-wp-pass") ?? "");
    setWebhook(localStorage.getItem("sm-webhook") ?? "");
  }, []);

  const saveCreds = () => {
    localStorage.setItem("sm-wp-user", wpUser);
    localStorage.setItem("sm-wp-pass", wpPass);
    localStorage.setItem("sm-webhook", webhook);
    void updateSettings({ data: { webhook_url: webhook || null } });
    toast.success("Publishing credentials stored on this device");
  };

  const pub = useMutation({
    mutationFn: (id: number) =>
      publishArticle({
        data: {
          id,
          wpUser: wpUser || undefined,
          wpAppPassword: wpPass || undefined,
          webhookUrl: webhook || undefined,
        },
      }),
    onSuccess: (res) => {
      if (res.ok) {
        toast.success(res.detail);
        if (res.channel === "markdown") {
          void navigator.clipboard.writeText(res.markdown);
          toast.message("Markdown copied");
        }
        void qc.invalidateQueries({ queryKey: DASHBOARD_KEY });
      }
    },
  });

  const queue = (dash.data?.articles ?? []).filter(
    (a) => a.status === "review" || a.status === "scheduled" || a.status === "draft",
  );

  return (
    <div>
      <PageHeader
        eyebrow="CMS"
        title="Publishing"
        description="WordPress application passwords stay on this device — never in the shared database. Without them, Publish copies Markdown."
      />
      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Connection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Site: {dash.data?.settings.site_url} · {dash.data?.settings.cms_type}
            </p>
            <div className="space-y-2">
              <Label htmlFor="wp-user">WordPress username</Label>
              <Input id="wp-user" value={wpUser} onChange={(e) => setWpUser(e.target.value)} autoComplete="off" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wp-pass">Application password</Label>
              <Input
                id="wp-pass"
                type="password"
                value={wpPass}
                onChange={(e) => setWpPass(e.target.value)}
                autoComplete="off"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hook">Webhook fallback</Label>
              <Input
                id="hook"
                value={webhook}
                onChange={(e) => setWebhook(e.target.value)}
                placeholder="https://"
              />
            </div>
            <Button onClick={saveCreds} variant="outline" className="w-full">
              Save on this device
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Ready to ship</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {queue.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nothing waiting. Run Autopilot from Overview.</p>
            ) : (
              queue.map((a) => (
                <div
                  key={a.id}
                  className="flex flex-col gap-3 rounded-xl bg-secondary/50 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <StatusBadge status={a.status} />
                    <p className="mt-1 truncate font-medium">{a.title}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link to="/app/content/$articleId" params={{ articleId: String(a.id) }}>
                        Review
                      </Link>
                    </Button>
                    <Button size="sm" onClick={() => pub.mutate(a.id)} disabled={pub.isPending}>
                      Publish
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
