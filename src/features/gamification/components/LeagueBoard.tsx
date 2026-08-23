import { useMemo } from "react";
import { Icon } from "@/components/ui/atoms/Icon";
import { Text } from "@/components/ui/atoms/Text";
import { cn } from "@/lib/cn";
import { useWindowedRange } from "../hooks/useWindowedRange";
import type { LeagueEntry } from "../types";
import styles from "./LeagueBoard.module.css";

type LeagueBoardProps = {
  entries: LeagueEntry[];
};

const ROW_HEIGHT = 52;
const VIRTUALIZE_THRESHOLD = 50;

export function LeagueBoard({ entries }: LeagueBoardProps) {
  const ranked = useMemo(
    () => [...entries].sort((a, b) => b.xp - a.xp),
    [entries],
  );
  const { containerRef, onScroll, range } = useWindowedRange(
    ranked.length,
    ROW_HEIGHT,
  );

  if (ranked.length === 0) {
    return (
      <Text size="sm" tone="muted">
        La liga aún no ha comenzado.
      </Text>
    );
  }

  const virtualized = ranked.length > VIRTUALIZE_THRESHOLD;
  const visible = virtualized
    ? ranked.slice(range.start, range.end)
    : ranked;

  return (
    <div
      ref={containerRef}
      onScroll={onScroll}
      className={styles["board"]}
      style={
        virtualized
          ? { height: 480, overflowY: "auto" }
          : undefined
      }
    >
      <ul  className={styles["list"]}>
        {visible.map((entry, offset) => {
          const rank = (virtualized ? range.start : 0) + offset + 1;
          return (
            <li
              key={entry.id}
              className={entry.isUser ? cn(styles["row"], styles["userRow"]) : styles["row"]}
              aria-current={entry.isUser ? "true" : undefined}
            >
              <span className={styles["rank"]}>
                {rank === 1 && (
                  <span className={styles["crown"]}>
                    <Icon name="crown" size={16} />
                  </span>
                )}
                {rank}
              </span>
              <span className={styles["name"]}>{entry.name}</span>
              <span className={styles["xp"]}>{entry.xp} XP</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
