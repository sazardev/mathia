import { router, routeHistory } from "./router";
import { ROUTE_PATHS as ROUTES, routeTree } from "./routes";

export { router, routeHistory };
export { ROUTES, routeTree };
export { DEEP_LINK_SCHEME } from "@/lib/deeplink";
export type { DeepLink } from "@/lib/deeplink";

export function navigate(to: string): void {
  void router.navigate({ to });
}
