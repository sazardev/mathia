import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/atoms/Icon";
import type { NavItem } from "../types";
import styles from "./NavRail.module.css";

type NavRailProps = {
  items: NavItem[];
  activeId: string;
  onNavigate: (path: string) => void;
};

export function NavRail({ items, activeId, onNavigate }: NavRailProps) {
  return (
    <nav aria-label="Navegación principal">
      <ul className={styles["navList"]}>
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              aria-current={item.id === activeId ? "page" : undefined}
              aria-label={item.label}
              onClick={() => onNavigate(item.path)}
              className={cn(
                styles["item"],
                item.id === activeId && styles["active"],
              )}
            >
              <Icon name={item.icon} size={20} />
              <span className={styles["label"]}>{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
