import { Icon } from "@/components/ui/atoms/Icon";
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
          <Icon name="flame" size={26} />
          <span className={styles["brandName"]}>Mathia</span>
        </span>
        <NavRail items={items} activeId={activeId} onNavigate={onNavigate} />
      </aside>
      <header className={styles["mobileHeader"]}>
        <span className={styles["brand"]}>
          <Icon name="flame" size={22} />
          <span className={styles["brandName"]}>Mathia</span>
        </span>
      </header>
      <main className={styles["content"]}>{children}</main>
      <BottomNav items={items} activeId={activeId} onNavigate={onNavigate} />
    </div>
  );
}
