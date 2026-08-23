import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Check,
  Languages,
  MapPin,
  PenLine,
  Radar,
} from "lucide-react";
import { LogoMark, Wordmark } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { getSettings } from "@/lib/seo/actions";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const settings = useQuery({ queryKey: ["settings"], queryFn: () => getSettings() });
  const onboarded = settings.data?.onboarded;

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <div className="flex items-center gap-3">
          <LogoMark />
          <Wordmark stacked />
        </div>
        <Button asChild variant={onboarded ? "default" : "outline"} size="sm">
          <Link to={onboarded ? "/app" : "/setup"}>
            {onboarded ? "Open dashboard" : "Start setup"}
          </Link>
        </Button>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6">
        <section className="stagger-in grid items-center gap-10 pb-16 pt-6 lg:grid-cols-[1.15fr_0.85fr] lg:pt-10">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-primary">
              Built only for smartmount.ca
            </p>
            <h1 className="mt-3 max-w-xl text-3xl font-semibold tracking-tight text-balance sm:text-5xl sm:leading-[1.08]">
              Rank for TV mounting in Ottawa. While Sam is on the truck.
            </h1>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground">
              Finds the exact local keywords homeowners in Kanata, Barrhaven, and
              Gatineau type, writes them in Smart Mount’s voice, and publishes to
              the live site. Google, Maps, ChatGPT — same pages.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-12 px-5">
                <Link to={onboarded ? "/app" : "/setup"}>
                  {onboarded ? "Open Autopilot" : "Start 5-minute setup"}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12">
                <a href="https://smartmount.ca" target="_blank" rel="noreferrer">
                  View smartmount.ca
                </a>
              </Button>
            </div>
            <ul className="mt-8 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
              {[
                "Same-day, insured, 1-year warranty — already in the copy",
                "Neighborhood pages, not national blog filler",
                "Approve-first or auto-publish",
                "English + French for Gatineau",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <HeroPanel />
        </section>

        <section className="grid gap-3 sm:grid-cols-3">
          <Feature
            icon={Radar}
            title="Local keyword engine"
            body="Scores Ottawa-Gatineau terms by booking intent, competition, and suburb. Never ranks 'TV mounting Canada'."
          />
          <Feature
            icon={PenLine}
            title="Brand-perfect articles"
            body="1,200–2,200 words in Sam’s voice: studs, exact price, $25 to lock the day. Schema, FAQ, CTA included."
          />
          <Feature
            icon={MapPin}
            title="Service-area clusters"
            body="Kanata, Orléans, Aylmer, Hull, the Glebe — landing-style posts that feed the Maps pack."
          />
        </section>

        <section className="mt-12 rounded-2xl bg-card px-5 py-8 shadow-[var(--shadow-border)] sm:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                The loop
              </p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight">
                Discover. Write. Publish. Watch bookings.
              </h2>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Languages className="size-4 text-primary" />
              EN + FR
            </div>
          </div>
          <ol className="mt-6 grid gap-4 sm:grid-cols-4">
            {[
              { n: "01", t: "Learn the site", d: "Scrapes smartmount.ca for voice, services, suburbs, and pricing language." },
              { n: "02", t: "Score keywords", d: "Long-tail, neighborhood, commercial, seasonal, People Also Ask." },
              { n: "03", t: "Write the piece", d: "Title, meta, H2s, FAQ schema, install photo, booking CTA." },
              { n: "04", t: "Push live", d: "WordPress, webhook, or clean Markdown. Approve-first by default." },
            ].map((step) => (
              <li key={step.n} className="rounded-xl bg-secondary/60 p-4">
                <p className="font-mono text-xs text-primary">{step.n}</p>
                <p className="mt-2 font-medium">{step.t}</p>
                <p className="mt-1 text-sm text-muted-foreground">{step.d}</p>
              </li>
            ))}
          </ol>
        </section>
      </main>
    </div>
  );
}

function Feature({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof Radar;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
      <Icon className="size-4 text-primary" />
      <h2 className="mt-3 font-semibold tracking-tight">{title}</h2>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}

function HeroPanel() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-card p-5 shadow-[var(--shadow-border)]">
      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
        Local visibility
      </p>
      <p className="mt-1 font-mono text-4xl font-medium tabular-nums text-foreground">
        72
        <span className="ml-1 text-base font-normal text-muted-foreground">/100</span>
      </p>
      <p className="mt-1 text-sm text-muted-foreground">Ottawa–Gatineau cluster</p>
      <div className="mt-5 space-y-3">
        {[
          { k: "TV mounting Kanata", p: 9, s: "rising" },
          { k: "how much does TV mounting cost Ottawa", p: 6, s: "page one" },
          { k: "hide TV wires Ottawa", p: 12, s: "moving" },
          { k: "installation tele Gatineau", p: 18, s: "new" },
        ].map((row) => (
          <div key={row.k} className="flex items-center justify-between gap-3 border-t border-border pt-3">
            <div className="min-w-0">
              <p className="truncate text-sm">{row.k}</p>
              <p className="text-xs text-muted-foreground">{row.s}</p>
            </div>
            <p className="font-mono text-sm tabular-nums text-primary">#{row.p}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
