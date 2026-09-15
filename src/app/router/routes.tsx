import {
  createRootRoute,
  createRoute,
  lazyRouteComponent,
  redirect,
} from "@tanstack/react-router";
import { z } from "zod";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { RouteErrorPage } from "@/pages/RouteErrorPage";
import { RootLayout } from "@/app/RootLayout";
import { Splash } from "@/app/Splash";
import { firstIncompleteProfile } from "@/features/onboarding";
import { ROUTE_PATHS } from "./paths";

export { ROUTE_PATHS };

const stepSearch = z.object({
  step: z.coerce.number().int().min(1).optional(),
});

const rangeSearch = z.object({
  range: z.enum(["7d", "30d", "90d"]).optional(),
});

const onboardingStepSearch = z.object({
  step: z
    .enum(["bienvenida", "perfil", "test_nivel", "meta", "minileccion"])
    .optional(),
});

/**
 * Guard de onboarding (F1/BR-M9-3): corre ANTES de que cualquier ruta monte
 * su componente, así ninguna página llega a llamar getDefaultProfile() (que
 * auto-crea un perfil "Estudiante" de respaldo) mientras el usuario todavía
 * no ha terminado de crear su perfil real en /onboarding.
 */
const rootRoute = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFoundPage,
  errorComponent: RouteErrorPage,
  pendingComponent: Splash,
  beforeLoad: async ({ location }) => {
    const { profile, step } = await firstIncompleteProfile();
    const needsOnboarding = profile === null || step !== "completado";
    const onOnboarding = location.pathname === "/onboarding";
    if (needsOnboarding && !onOnboarding) {
      throw redirect({
        to: "/onboarding",
        search: { step: step === "completado" ? "bienvenida" : step },
      });
    }
    if (!needsOnboarding && onOnboarding) {
      throw redirect({ to: "/" });
    }
  },
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

const practiceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "practica",
  component: lazyRouteComponent(() => import("@/pages/PracticePage")),
});

const reviewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "repaso",
  component: lazyRouteComponent(() => import("@/pages/ReviewPage")),
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
  validateSearch: onboardingStepSearch,
  component: lazyRouteComponent(() => import("@/pages/OnboardingPage")),
});

export const routeTree = rootRoute.addChildren([
  homeRoute,
  pathRoute,
  practiceRoute,
  reviewRoute,
  lessonRoute,
  statsRoute,
  achievementsRoute,
  settingsRoute,
  settingsSectionRoute,
  onboardingRoute,
]);
