import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { useDashboard } from "@/hooks/use-dashboard";

export const Route = createFileRoute("/app")({
  component: AppLayout,
});

function AppLayout() {
  const dash = useDashboard();
  return (
    <AppShell
      autopilotOn={Boolean(dash.data?.settings.autopilot_on)}
      siteUrl={dash.data?.settings.site_url ?? "https://smartmount.ca"}
    />
  );
}
