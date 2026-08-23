import { useQuery } from "@tanstack/react-query";
import { getDashboard } from "@/lib/seo/actions";

export const DASHBOARD_KEY = ["dashboard"] as const;

export function useDashboard() {
  return useQuery({
    queryKey: DASHBOARD_KEY,
    queryFn: () => getDashboard(),
  });
}
