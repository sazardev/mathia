import { useEffect } from "react";
import { Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { ROUTE_PATHS as ROUTES } from "@/app/router/paths";
import { AppShell } from "@/features/navigation";
import type { NavItem } from "@/features/navigation";
import { applyTheme, loadSettings } from "@/features/settings";
import { StudyToolkit } from "@/features/notebook";
import { ErrorBoundary } from "./ErrorBoundary";
import styles from "./RootLayout.module.css";

const NAV_ITEMS: NavItem[] = [
  { id: "inicio", label: "Inicio", path: ROUTES.home, icon: "home" },
  { id: "ruta", label: "Ruta", path: ROUTES.path, icon: "map" },
  { id: "stats", label: "Estadísticas", path: ROUTES.stats, icon: "chart" },
  {
    id: "logros",
    label: "Logros",
    path: ROUTES.achievements,
    icon: "trophy",
  },
  {
    id: "ajustes",
    label: "Ajustes",
    path: ROUTES.settings,
    icon: "settings",
  },
];

const NAV_ID_BY_PREFIX: Array<{ prefix: string; id: string }> = [
  { prefix: "/leccion", id: "ruta" },
  { prefix: "/ruta", id: "ruta" },
  { prefix: "/stats", id: "stats" },
  { prefix: "/logros", id: "logros" },
  { prefix: "/ajustes", id: "ajustes" },
];

function activeNavId(pathname: string): string {
  if (pathname === "/" || pathname === "") return "inicio";
  const match = NAV_ID_BY_PREFIX.find((entry) =>
    pathname.startsWith(entry.prefix),
  );
  return match?.id ?? "";
}

export function RootLayout() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const navigate = useNavigate();

  useEffect(() => {
    // El guard de onboarding (beforeLoad, router/routes.tsx) garantiza un
    // perfil real en toda ruta EXCEPTO /onboarding — ahí getDefaultProfile()
    // (vía loadSettings) crearía el perfil "Estudiante" de respaldo antes de
    // que el usuario cree el suyo (BR-M1-4).
    if (pathname.startsWith("/onboarding")) {
      applyTheme("light");
      return;
    }
    void loadSettings()
      .then((settings) => applyTheme(settings.theme))
      .catch(() => applyTheme("light"));
    // Solo debe reevaluar si cambiamos de/hacia onboarding, no en cada
    // navegación dentro de la app.
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname.startsWith("/onboarding")]);

  if (pathname.startsWith("/onboarding")) {
    return (
      <>
        <a href="#main-content" className={styles["skipLink"]}>
          Saltar al contenido
        </a>
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </>
    );
  }

  if (
    pathname.startsWith("/leccion") ||
    pathname.startsWith("/practica") ||
    pathname.startsWith("/repaso")
  ) {
    return (
      <>
        <a href="#main-content" className={styles["skipLink"]}>
          Saltar al contenido
        </a>
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
        <StudyToolkit />
      </>
    );
  }

  return (
    <>
      <a href="#main-content" className={styles["skipLink"]}>
        Saltar al contenido
      </a>
      <AppShell
        items={NAV_ITEMS}
        activeId={activeNavId(pathname)}
        onNavigate={(path) => void navigate({ to: path })}
      >
        <div id="main-content" tabIndex={-1} className={styles["content"]}>
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </div>
      </AppShell>
      <StudyToolkit />
    </>
  );
}
