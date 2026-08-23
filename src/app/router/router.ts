import { createRouter } from "@tanstack/react-router";
import { createRouteHistory } from "@/lib/route-history";
import { routeTree } from "./routes";

export const routeHistory = createRouteHistory(100);

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
});

router.subscribe("onResolved", ({ toLocation }) => {
  routeHistory.record(toLocation.pathname, toLocation.searchStr);
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
