import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("size-8 shrink-0", className)}
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="8" className="fill-secondary" />
      <rect
        x="6"
        y="8"
        width="20"
        height="13"
        rx="2"
        className="fill-none stroke-primary"
        strokeWidth="1.75"
      />
      <path
        d="M16 21v3.5M12 27h8"
        className="stroke-primary"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Wordmark({ stacked = false }: { stacked?: boolean }) {
  return (
    <div className={cn("min-w-0", stacked ? "leading-tight" : "flex items-baseline gap-2")}>
      <span className="block font-semibold tracking-tight text-foreground">
        SmartMount
      </span>
      <span className="hidden text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground sm:block">
        SEO Autopilot
      </span>
    </div>
  );
}
