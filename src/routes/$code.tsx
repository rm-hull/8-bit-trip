import { createFileRoute } from "@tanstack/react-router";
import { Home } from "../pages/Home";

export const Route = createFileRoute("/$code")({
  component: RouteComponent,
});

function RouteComponent() {
  const { code } = Route.useParams();
  return <Home code={code} />;
}
