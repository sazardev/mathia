import { useEffect } from "react";
import { Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { ROUTE_PATHS as ROUTES } from "@/app/router/paths";
import { AppShell } from "@/features/navigation";
import type { NavItem } from "@/features/navigation";
import { applyTheme, loadSettings } from "@/features/settings";
import { Scratchpad } from "@/features/lesson/components/Scratchpad";
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
    void loadSettings()
      .then((settings) => applyTheme(settings.theme))
      .catch(() => applyTheme("light"));
  }, []);

  if (
    pathname.startsWith("/leccion") ||
    pathname.startsWith("/practica") ||
    pathname.startsWith("/repaso") ||
    pathname.startsWith("/onboarding")
  ) {
    return (
      <>
        <a href="#main-content" className={styles["skipLink"]}>
          Saltar al contenido
        </a>
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
        <Scratchpad />
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
      <Scratchpad />
    </>
  );
}
