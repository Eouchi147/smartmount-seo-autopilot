import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { DASHBOARD_KEY, useDashboard } from "@/hooks/use-dashboard";
import { updateSettings } from "@/lib/seo/actions";
import type { Settings } from "@/lib/seo/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/settings")({ component: SettingsPage });

function SettingsPage() {
  const dash = useDashboard();
  const qc = useQueryClient();
  const settings = dash.data?.settings;
  const brand = dash.data?.brand;

  const save = useMutation({
    mutationFn: (patch: Partial<Pick<Settings, "autopilot_on" | "frequency_days" | "publish_mode" | "language_pref">>) =>
      updateSettings({ data: patch }),
    onSuccess: () => {
      toast.success("Saved");
      void qc.invalidateQueries({ queryKey: DASHBOARD_KEY });
    },
  });

  if (!settings) return null;

  return (
    <div>
      <PageHeader
        eyebrow="Settings"
        title="Autopilot"
        description="Cadence, gate, languages. Brand voice is locked to Smart Mount — no generic SaaS tone."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Publishing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">Autopilot</p>
                <p className="text-xs text-muted-foreground">Writes the next queued keyword on cadence.</p>
              </div>
              <Switch
                checked={settings.autopilot_on}
                onCheckedChange={(v) => save.mutate({ autopilot_on: v })}
              />
            </div>
            <div>
              <Label>Frequency</Label>
              <div className="mt-2 flex gap-2">
                {[1, 2, 3].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => save.mutate({ frequency_days: d })}
                    className={cn(
                      "h-11 flex-1 rounded-lg border text-sm",
                      settings.frequency_days === d
                        ? "border-primary bg-primary/10"
                        : "border-border text-muted-foreground",
                    )}
                  >
                    {d === 1 ? "Daily" : `Every ${d}d`}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label>Gate</Label>
              <div className="mt-2 flex gap-2">
                {(["approve", "auto"] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => save.mutate({ publish_mode: mode })}
                    className={cn(
                      "h-11 flex-1 rounded-lg border text-sm capitalize",
                      settings.publish_mode === mode
                        ? "border-primary bg-primary/10"
                        : "border-border text-muted-foreground",
                    )}
                  >
                    {mode === "approve" ? "Approve first" : "Auto-publish"}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label>Languages</Label>
              <div className="mt-2 flex gap-2">
                {(["en", "both"] as const).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => save.mutate({ language_pref: lang })}
                    className={cn(
                      "h-11 flex-1 rounded-lg border text-sm",
                      settings.language_pref === lang
                        ? "border-primary bg-primary/10"
                        : "border-border text-muted-foreground",
                    )}
                  >
                    {lang === "en" ? "English" : "English + French"}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Brand voice</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="leading-relaxed text-muted-foreground">{brand?.voice_summary}</p>
            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Differentiators</p>
            <ul className="space-y-1 text-muted-foreground">
              {(brand?.differentiators ?? []).map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Areas</p>
            <p className="text-muted-foreground">{(brand?.service_areas ?? []).join(" · ")}</p>
            <Button asChild variant="outline" className="mt-2">
              <a href={settings.site_url} target="_blank" rel="noreferrer">
                Open {settings.site_url.replace(/^https?:\/\//, "")}
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
