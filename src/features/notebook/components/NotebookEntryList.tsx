import { Icon } from "@/components/ui/atoms/Icon";
import { IconButton } from "@/components/ui/atoms/IconButton";
import type { NotebookEntryRow } from "@/lib/storage";
import styles from "./NotebookPanel.module.css";

interface NotebookEntryListProps {
  entries: NotebookEntryRow[];
  loading: boolean;
  onSelect: (entry: NotebookEntryRow) => void;
  onDelete: (id: string) => void;
}

function formatRelativeTime(updatedAt: number): string {
  const diffMinutes = Math.round((Date.now() - updatedAt) / 60_000);
  if (diffMinutes < 1) return "ahora";
  if (diffMinutes < 60) return `hace ${diffMinutes} min`;
  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `hace ${diffHours} h`;
  return `hace ${Math.round(diffHours / 24)} d`;
}

export function NotebookEntryList({
  entries,
  loading,
  onSelect,
  onDelete,
}: NotebookEntryListProps) {
  return (
    <ul className={styles["list"]}>
      {loading && <li className={styles["empty"]}>Cargando…</li>}
      {!loading && entries.length === 0 && (
        <li className={styles["empty"]}>Sin notas todavía</li>
      )}
      {entries.map((entry) => (
        <li key={entry.id} className={styles["entry"]}>
          <button
            type="button"
            className={styles["entryMain"]}
            onClick={() => onSelect(entry)}
          >
            <Icon
              name={entry.kind === "drawing" ? "pencil" : "notebook"}
              size={16}
            />
            <span className={styles["entryInfo"]}>
              <span className={styles["entryTitle"]}>
                {entry.title || "Sin título"}
              </span>
              <span className={styles["entryMeta"]}>
                {formatRelativeTime(entry.updatedAt)}
              </span>
            </span>
          </button>
          <IconButton
            icon="trash"
            label="Borrar nota"
            size="sm"
            variant="ghost"
            onPress={() => onDelete(entry.id)}
          />
        </li>
      ))}
    </ul>
  );
}
