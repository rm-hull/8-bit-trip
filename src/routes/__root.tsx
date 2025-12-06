import { ErrorFallback } from "@rm-hull/chakra-error-fallback";
import { CatchBoundary, createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
  component: () => (
    <>
      <CatchBoundary getResetKey={() => "reset"} errorComponent={ErrorFallback}>
        <Outlet />
      </CatchBoundary>
      <TanStackRouterDevtools initialIsOpen={false} />
    </>
  ),
});
