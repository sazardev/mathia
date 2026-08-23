import {
  Outlet,
  createRootRoute,
  createRoute,
  lazyRouteComponent,
} from "@tanstack/react-router";
import { z } from "zod";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { RouteErrorPage } from "@/pages/RouteErrorPage";

export const ROUTE_PATHS = {
  home: "/",
  path: "/ruta",
  lesson: "/leccion/$lessonId",
  stats: "/stats",
  achievements: "/logros",
  settings: "/ajustes",
  settingsSection: "/ajustes/$section",
  onboarding: "/onboarding",
} as const;

const stepSearch = z.object({ step: z.coerce.number().int().min(1).optional() });

const rangeSearch = z.object({
  range: z.enum(["7d", "30d", "90d"]).optional(),
});

const rootRoute = createRootRoute({
  component: () => <Outlet />,
  notFoundComponent: NotFoundPage,
  errorComponent: RouteErrorPage,
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: lazyRouteComponent(() => import("@/pages/HomePage")),
});

const pathRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "ruta",
  component: lazyRouteComponent(() => import("@/pages/PathPage")),
});

const lessonRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "leccion/$lessonId",
  validateSearch: stepSearch,
  component: lazyRouteComponent(() => import("@/pages/LessonPage")),
});

const statsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "stats",
  validateSearch: rangeSearch,
  component: lazyRouteComponent(() => import("@/pages/StatsPage")),
});

const achievementsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "logros",
  component: lazyRouteComponent(() => import("@/pages/AchievementsPage")),
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "ajustes",
  component: lazyRouteComponent(() => import("@/pages/SettingsPage")),
});

const settingsSectionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "ajustes/$section",
  component: lazyRouteComponent(() => import("@/pages/SettingsPage")),
});

const onboardingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "onboarding",
  validateSearch: stepSearch,
  component: lazyRouteComponent(() => import("@/pages/OnboardingPage")),
});

export const routeTree = rootRoute.addChildren([
  homeRoute,
  pathRoute,
  lessonRoute,
  statsRoute,
  achievementsRoute,
  settingsRoute,
  settingsSectionRoute,
  onboardingRoute,
]);
