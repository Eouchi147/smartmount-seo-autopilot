import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/app/content")({
  component: ContentLayout,
});

function ContentLayout() {
  return <Outlet />;
}
