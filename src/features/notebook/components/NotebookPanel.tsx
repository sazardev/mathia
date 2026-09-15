import { useState } from "react";
import { IconButton } from "@/components/ui/atoms/IconButton";
import { Text } from "@/components/ui/atoms/Text";
import type { NotebookEntryRow } from "@/lib/storage";
import { useNotebookEntries } from "../hooks/useNotebookEntries";
import { useNotebookScope } from "../hooks/useNotebookScope";
import type { Stroke } from "../types";
import { NotebookEntryList } from "./NotebookEntryList";
import { NotebookTabs } from "./NotebookTabs";
import { NoteEditor } from "./NoteEditor";
import styles from "./NotebookPanel.module.css";

interface NotebookPanelProps {
  onClose: () => void;
  profileId: string | null;
  getCurrentStrokes: () => Stroke[];
  onLoadStrokes: (strokes: Stroke[]) => void;
}

export function NotebookPanel({
  onClose,
  profileId,
  getCurrentStrokes,
  onLoadStrokes,
}: NotebookPanelProps) {
  const tabs = useNotebookScope();
  const [tabIndex, setTabIndex] = useState(0);
  const activeTab = tabs[Math.min(tabIndex, tabs.length - 1)] ?? tabs[0];
  const [editingEntry, setEditingEntry] = useState<
    NotebookEntryRow | "new" | null
  >(null);
  const { entries, loading, save, remove } = useNotebookEntries(
    profileId,
    activeTab?.scopeType ?? "global",
    activeTab?.scopeId ?? null,
  );

  if (activeTab === undefined) return null;

  function handleEntryClick(entry: NotebookEntryRow): void {
    if (entry.kind === "drawing") {
      onLoadStrokes(JSON.parse(entry.content) as Stroke[]);
      return;
    }
    setEditingEntry(entry);
  }

  function handleSaveDrawing(): void {
    const strokes = getCurrentStrokes();
    if (strokes.length === 0 || activeTab === undefined) return;
    const time = new Date().toLocaleTimeString("es", {
      hour: "2-digit",
      minute: "2-digit",
    });
    void save({
      scopeType: activeTab.scopeType,
      scopeId: activeTab.scopeId,
      kind: "drawing",
      title: `Dibujo · ${time}`,
      content: JSON.stringify(strokes),
    });
  }

  function handleSaveText(title: string, content: string): void {
    if (activeTab === undefined) return;
    const editingId =
      editingEntry !== "new" && editingEntry !== null
        ? editingEntry.id
        : undefined;
    void save({
      ...(editingId !== undefined ? { id: editingId } : {}),
      scopeType: activeTab.scopeType,
      scopeId: activeTab.scopeId,
      kind: "text",
      title,
      content,
    });
    setEditingEntry(null);
  }

  return (
    <aside
      className={styles["panel"]}
      data-toolkit-chrome="true"
      aria-label="Cuaderno de notas"
    >
      <div className={styles["header"]}>
        <Text as="h2" size="sm" weight="bold">
          Cuaderno
        </Text>
        <IconButton
          icon="x"
          label="Cerrar cuaderno"
          size="sm"
          onPress={onClose}
        />
      </div>

      <NotebookTabs tabs={tabs} activeIndex={tabIndex} onSelect={setTabIndex} />

      <div className={styles["actions"]}>
        <button
          type="button"
          className={styles["actionButton"]}
          onClick={handleSaveDrawing}
        >
          Guardar dibujo actual
        </button>
        <button
          type="button"
          className={styles["actionButton"]}
          onClick={() => setEditingEntry("new")}
        >
          Nota de texto
        </button>
      </div>

      <NotebookEntryList
        entries={entries}
        loading={loading}
        onSelect={handleEntryClick}
        onDelete={(id) => void remove(id)}
      />

      <NoteEditor
        key={editingEntry === "new" ? "new" : (editingEntry?.id ?? "closed")}
        open={editingEntry !== null}
        initialTitle={
          editingEntry !== "new" && editingEntry !== null
            ? editingEntry.title
            : ""
        }
        initialContent={
          editingEntry !== "new" && editingEntry !== null
            ? editingEntry.content
            : ""
        }
        onSave={handleSaveText}
        onClose={() => setEditingEntry(null)}
      />
    </aside>
  );
}
