import { cn } from "@/lib/cn";
import styles from "./Tabs.module.css";

export type TabItem = {
  id: string;
  label: string;
};

type TabsProps = {
  items: TabItem[];
  value: string;
  onChange: (id: string) => void;
};

export function Tabs({ items, value, onChange }: TabsProps) {
  return (
    <div role="tablist" className={styles["list"]}>
      {items.map((item) => {
        const active = item.id === value;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(item.id)}
            onKeyDown={(event) => {
              if (event.key !== "ArrowRight" && event.key !== "ArrowLeft")
                return;
              const direction = event.key === "ArrowRight" ? 1 : -1;
              const index = items.findIndex((tab) => tab.id === value);
              if (index === -1) return;
              const next = (index + direction + items.length) % items.length;
              const target = items[next];
              if (target !== undefined) onChange(target.id);
            }}
            className={cn(styles["tab"], active && styles["active"])}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
