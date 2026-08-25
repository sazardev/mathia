import { Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { ROUTE_PATHS as ROUTES } from "@/app/router/paths";
import { AppShell } from "@/features/navigation";
import type { NavItem } from "@/features/navigation";
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

  if (pathname.startsWith("/leccion") || pathname.startsWith("/onboarding")) {
    return <Outlet />;
  }

  return (
    <AppShell
      items={NAV_ITEMS}
      activeId={activeNavId(pathname)}
      onNavigate={(path) => void navigate({ to: path })}
    >
      <div className={styles["content"]}>
        <Outlet />
      </div>
    </AppShell>
  );
}
