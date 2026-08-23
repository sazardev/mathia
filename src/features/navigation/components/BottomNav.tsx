import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/atoms/Icon";
import type { NavItem } from "../types";
import styles from "./BottomNav.module.css";

type BottomNavProps = {
  items: NavItem[];
  activeId: string;
  onNavigate: (path: string) => void;
};

export function BottomNav({ items, activeId, onNavigate }: BottomNavProps) {
  return (
    <nav aria-label="Navegación principal" className={styles["bottomNav"]}>
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          aria-current={item.id === activeId ? "page" : undefined}
          onClick={() => onNavigate(item.path)}
          className={cn(
            styles["item"],
            item.id === activeId && styles["active"],
          )}
        >
          <Icon name={item.icon} size={22} />
          {item.label}
        </button>
      ))}
    </nav>
  );
}
