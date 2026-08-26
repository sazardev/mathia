import type { NavItem } from "../types";
import { BottomNav } from "./BottomNav";
import { NavRail } from "./NavRail";
import styles from "./AppShell.module.css";

type AppShellProps = {
  items: NavItem[];
  activeId: string;
  onNavigate: (path: string) => void;
  children: React.ReactNode;
};

export function AppShell({
  items,
  activeId,
  onNavigate,
  children,
}: AppShellProps) {
  return (
    <div className={styles["shell"]}>
      <aside className={styles["sidebar"]}>
        <span className={styles["brand"]}>
          <img
            src="/favicon.svg"
            alt=""
            width={28}
            height={28}
            className={styles["logo"]}
          />
          <span className={styles["brandName"]}>Mathia</span>
        </span>
        <NavRail items={items} activeId={activeId} onNavigate={onNavigate} />
      </aside>
      <header className={styles["mobileHeader"]}>
        <span className={styles["brand"]}>
          <img
            src="/favicon.svg"
            alt=""
            width={24}
            height={24}
            className={styles["logo"]}
          />
          <span className={styles["brandName"]}>Mathia</span>
        </span>
      </header>
      <main className={styles["content"]}>{children}</main>
      <BottomNav items={items} activeId={activeId} onNavigate={onNavigate} />
    </div>
  );
}
