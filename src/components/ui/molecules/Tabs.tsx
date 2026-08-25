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
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(item.id)}
            onKeyDown={(event) => {
              if (
                event.key !== "ArrowRight" &&
                event.key !== "ArrowLeft" &&
                event.key !== "Home" &&
                event.key !== "End"
              )
                return;
              event.preventDefault();
              let nextIndex: number;
              const currentIndex = items.findIndex((tab) => tab.id === value);
              if (currentIndex === -1) return;
              if (event.key === "Home") nextIndex = 0;
              else if (event.key === "End") nextIndex = items.length - 1;
              else {
                const direction = event.key === "ArrowRight" ? 1 : -1;
                nextIndex =
                  (currentIndex + direction + items.length) % items.length;
              }
              const target = items[nextIndex];
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
