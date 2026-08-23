import { useState } from "react";
import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  CalendarDays,
  FileText,
  Gauge,
  KeyRound,
  LayoutDashboard,
  MapPinned,
  Menu,
  Settings2,
  Store,
  Upload,
} from "lucide-react";
import { LogoMark, Wordmark } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/app", label: "Overview", icon: LayoutDashboard },
  { to: "/app/keywords", label: "Keywords", icon: KeyRound },
  { to: "/app/content", label: "Content", icon: FileText },
  { to: "/app/calendar", label: "Calendar", icon: CalendarDays },
  { to: "/app/publish", label: "Publish", icon: Upload },
  { to: "/app/visibility", label: "Visibility", icon: Gauge },
  { to: "/app/gbp", label: "GBP posts", icon: Store },
  { to: "/app/competitors", label: "Competitors", icon: MapPinned },
  { to: "/app/settings", label: "Settings", icon: Settings2 },
] as const;

export function AppShell({
  autopilotOn,
  siteUrl,
}: {
  autopilotOn: boolean;
  siteUrl: string;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div className="flex min-h-dvh">
        <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-sidebar lg:flex">
          <SidebarBody pathname={pathname} siteUrl={siteUrl} autopilotOn={autopilotOn} />
        </aside>
        <div className="flex min-w-0 flex-1 flex-col overflow-x-hidden">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur-sm lg:px-6">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <SidebarBody
                  pathname={pathname}
                  siteUrl={siteUrl}
                  autopilotOn={autopilotOn}
                  onNavigate={() => setOpen(false)}
                />
              </SheetContent>
            </Sheet>
            <div className="flex min-w-0 items-center gap-2 lg:hidden">
              <LogoMark className="size-7" />
              <Wordmark stacked />
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium",
                  autopilotOn
                    ? "bg-success/15 text-success"
                    : "bg-secondary text-muted-foreground",
                )}
              >
                <span
                  className={cn(
                    "size-1.5 rounded-full",
                    autopilotOn ? "bg-success" : "bg-muted-foreground",
                  )}
                />
                {autopilotOn ? "Autopilot on" : "Autopilot paused"}
              </span>
            </div>
          </header>
          <main className="min-w-0 flex-1 px-4 py-5 lg:px-8 lg:py-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

function SidebarBody({
  pathname,
  siteUrl,
  autopilotOn,
  onNavigate,
}: {
  pathname: string;
  siteUrl: string;
  autopilotOn: boolean;
  onNavigate?: () => void;
}) {
  const host = siteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-4 py-5">
        <LogoMark />
        <Wordmark stacked />
      </div>
      <nav className="flex flex-1 flex-col gap-0.5 px-2 pb-4">
        {NAV.map((item) => {
          const active =
            item.to === "/app"
              ? pathname === "/app"
              : pathname === item.to || pathname.startsWith(`${item.to}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={cn(
                "flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors duration-150",
                active
                  ? "bg-sidebar-accent text-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent/70 hover:text-foreground",
              )}
            >
              <Icon className="size-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-border px-4 py-4">
        <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          Publishing to
        </p>
        <p className="mt-1 truncate text-sm text-foreground">{host}</p>
        <p className="mt-2 text-xs text-muted-foreground">
          {autopilotOn ? "Daily cycle armed." : "Waiting on setup."}
        </p>
      </div>
    </div>
  );
}
