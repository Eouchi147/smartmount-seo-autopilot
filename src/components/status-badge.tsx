import { Badge } from "@/components/ui/badge";

export function StatusBadge({ status }: { status: string }) {
  const variant =
    status === "published"
      ? "success"
      : status === "review" || status === "scheduled"
        ? "warning"
        : status === "paused"
          ? "destructive"
          : "secondary";
  return (
    <Badge variant={variant} className="capitalize">
      {status}
    </Badge>
  );
}
