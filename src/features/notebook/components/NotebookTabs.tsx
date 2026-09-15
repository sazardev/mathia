import { cn } from "@/lib/cn";
import type { ScopeTab } from "../types";
import styles from "./NotebookPanel.module.css";

interface NotebookTabsProps {
  tabs: ScopeTab[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

export function NotebookTabs({
  tabs,
  activeIndex,
  onSelect,
}: NotebookTabsProps) {
  return (
    <div className={styles["tabs"]} role="tablist">
      {tabs.map((tab, index) => (
        <button
          key={`${tab.scopeType}-${tab.scopeId ?? "global"}`}
          type="button"
          role="tab"
          aria-selected={index === activeIndex}
          className={cn(
            styles["tab"],
            index === activeIndex && styles["tabActive"],
          )}
          onClick={() => onSelect(index)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
