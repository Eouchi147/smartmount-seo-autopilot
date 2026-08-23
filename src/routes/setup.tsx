import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { LogoMark, Wordmark } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { completeOnboarding, getSettings, learnBrand } from "@/lib/seo/actions";
import type { CmsType, PublishMode } from "@/lib/seo/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/setup")({ component: Setup });

const STEPS = ["Connect", "Brand", "Cadence", "Extras"] as const;

function Setup() {
  const navigate = useNavigate();
  const settingsQ = useQuery({ queryKey: ["settings"], queryFn: () => getSettings() });
  const [step, setStep] = useState(0);
  const [siteUrl, setSiteUrl] = useState("https://smartmount.ca");
  const [cms, setCms] = useState<CmsType>("wordpress");
  const [mode, setMode] = useState<PublishMode>("approve");
  const [freq, setFreq] = useState(1);
  const [lang, setLang] = useState<"en" | "both">("both");
  const [gbp, setGbp] = useState(false);
  const [gsc, setGsc] = useState(false);
  const [learned, setLearned] = useState(false);

  const learn = useMutation({
    mutationFn: () => learnBrand({ data: { site_url: siteUrl } }),
    onSuccess: (res) => {
      if (res.ok) setLearned(true);
    },
  });

  const finish = useMutation({
    mutationFn: () =>
      completeOnboarding({
        data: {
          site_url: siteUrl,
          cms_type: cms,
          publish_mode: mode,
          frequency_days: freq,
          language_pref: lang,
          gbp_connected: gbp,
          gsc_connected: gsc,
        },
      }),
    onSuccess: () => navigate({ to: "/app" }),
  });

  if (settingsQ.data?.onboarded) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6">
        <p className="text-sm text-muted-foreground">Setup already complete.</p>
        <Button asChild>
          <Link to="/app">Open dashboard</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-background">
      <header className="mx-auto flex w-full max-w-2xl items-center gap-3 px-4 py-5">
        <LogoMark />
        <Wordmark />
      </header>
      <main className="mx-auto w-full max-w-2xl px-4 pb-16">
        <ol className="mb-8 flex gap-2">
          {STEPS.map((label, i) => (
            <li key={label} className="flex-1">
              <div
                className={cn(
                  "h-1 rounded-full",
                  i <= step ? "bg-primary" : "bg-secondary",
                )}
              />
              <p
                className={cn(
                  "mt-2 text-[11px] uppercase tracking-[0.14em]",
                  i === step ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {label}
              </p>
            </li>
          ))}
        </ol>

        {step === 0 && (
          <section className="stagger-in rounded-2xl bg-card p-5 shadow-[var(--shadow-border)] sm:p-7">
            <h1 className="text-xl font-semibold tracking-tight">Connect smartmount.ca</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              WordPress is preferred. Webflow and custom sites export Markdown or hit a webhook.
            </p>
            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="site">Site URL</Label>
                <Input
                  id="site"
                  value={siteUrl}
                  onChange={(e) => setSiteUrl(e.target.value)}
                  inputMode="url"
                />
              </div>
              <div className="space-y-2">
                <Label>CMS</Label>
                <div className="grid grid-cols-3 gap-2">
                  {(["wordpress", "webflow", "custom"] as const).map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setCms(value)}
                      className={cn(
                        "h-11 rounded-lg border text-sm capitalize transition-colors",
                        cms === value
                          ? "border-primary bg-primary/10 text-foreground"
                          : "border-border text-muted-foreground hover:bg-accent",
                      )}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button onClick={() => setStep(1)}>
                Continue <ArrowRight className="size-4" />
              </Button>
            </div>
          </section>
        )}

        {step === 1 && (
          <section className="stagger-in rounded-2xl bg-card p-5 shadow-[var(--shadow-border)] sm:p-7">
            <h1 className="text-xl font-semibold tracking-tight">Learn the brand</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Pulls live copy from the site, then locks the Smart Mount voice: no hype, studs, same-day, exact price.
            </p>
            <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
              {[
                "Services, suburbs, pricing language",
                "Testimonials and warranty claims",
                "Commercial vs residential CTAs",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Check className="size-4 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
            {learned ? (
              <p className="mt-4 rounded-lg bg-success/10 px-3 py-2 text-sm text-success">
                Brand profile loaded{learn.data && "scraped" in learn.data && learn.data.scraped ? " from live pages" : " from the Smart Mount brief"}.
              </p>
            ) : null}
            {learn.isError ? (
              <p className="mt-4 text-sm text-destructive">Could not reach the site. Voice still loaded from the brief.</p>
            ) : null}
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button variant="ghost" onClick={() => setStep(0)}>
                Back
              </Button>
              {!learned ? (
                <Button onClick={() => learn.mutate()} disabled={learn.isPending}>
                  {learn.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
                  Scrape & learn
                </Button>
              ) : (
                <Button onClick={() => setStep(2)}>
                  Continue <ArrowRight className="size-4" />
                </Button>
              )}
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="stagger-in rounded-2xl bg-card p-5 shadow-[var(--shadow-border)] sm:p-7">
            <h1 className="text-xl font-semibold tracking-tight">Publishing cadence</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Default is one high-quality post every day. Approve first until you trust the voice.
            </p>
            <div className="mt-6 space-y-5">
              <div>
                <Label>Frequency</Label>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {[
                    { v: 1, l: "Daily" },
                    { v: 2, l: "Every 2 days" },
                    { v: 3, l: "3× week" },
                  ].map((opt) => (
                    <button
                      key={opt.v}
                      type="button"
                      onClick={() => setFreq(opt.v)}
                      className={cn(
                        "h-11 rounded-lg border text-sm transition-colors",
                        freq === opt.v
                          ? "border-primary bg-primary/10"
                          : "border-border text-muted-foreground hover:bg-accent",
                      )}
                    >
                      {opt.l}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label>Gate</Label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setMode("approve")}
                    className={cn(
                      "h-11 rounded-lg border text-sm",
                      mode === "approve"
                        ? "border-primary bg-primary/10"
                        : "border-border text-muted-foreground",
                    )}
                  >
                    Approve first
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode("auto")}
                    className={cn(
                      "h-11 rounded-lg border text-sm",
                      mode === "auto"
                        ? "border-primary bg-primary/10"
                        : "border-border text-muted-foreground",
                    )}
                  >
                    Auto-publish
                  </button>
                </div>
              </div>
              <div>
                <Label>Languages</Label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setLang("en")}
                    className={cn(
                      "h-11 rounded-lg border text-sm",
                      lang === "en"
                        ? "border-primary bg-primary/10"
                        : "border-border text-muted-foreground",
                    )}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => setLang("both")}
                    className={cn(
                      "h-11 rounded-lg border text-sm",
                      lang === "both"
                        ? "border-primary bg-primary/10"
                        : "border-border text-muted-foreground",
                    )}
                  >
                    English + French
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button onClick={() => setStep(3)}>
                Continue <ArrowRight className="size-4" />
              </Button>
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="stagger-in rounded-2xl bg-card p-5 shadow-[var(--shadow-border)] sm:p-7">
            <h1 className="text-xl font-semibold tracking-tight">Optional connections</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Search Console and Google Business Profile deepen the dashboard. You can skip and add them later.
            </p>
            <div className="mt-5 space-y-3">
              <label className="flex min-h-11 cursor-pointer items-center justify-between rounded-xl border border-border px-4">
                <span className="text-sm">Google Business Profile</span>
                <input
                  type="checkbox"
                  className="size-4 accent-primary"
                  checked={gbp}
                  onChange={(e) => setGbp(e.target.checked)}
                />
              </label>
              <label className="flex min-h-11 cursor-pointer items-center justify-between rounded-xl border border-border px-4">
                <span className="text-sm">Search Console</span>
                <input
                  type="checkbox"
                  className="size-4 accent-primary"
                  checked={gsc}
                  onChange={(e) => setGsc(e.target.checked)}
                />
              </label>
              <p className="text-xs text-muted-foreground">
                Visibility metrics start from a local SERP model. Connecting GSC later replaces the model with your property.
              </p>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button onClick={() => finish.mutate()} disabled={finish.isPending}>
                {finish.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
                Launch Autopilot
              </Button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
