import { useCallback, useEffect, useState } from "react";
import type {
  NotebookEntryInput,
  NotebookEntryRow,
  NotebookScopeType,
} from "@/lib/storage";
import { deleteNote, listNotes, saveNote } from "../services/notebookService";

interface UseNotebookEntries {
  entries: NotebookEntryRow[];
  loading: boolean;
  save: (entry: NotebookEntryInput) => Promise<NotebookEntryRow | null>;
  remove: (id: string) => Promise<void>;
}

export function useNotebookEntries(
  profileId: string | null,
  scopeType: NotebookScopeType,
  scopeId: string | null,
): UseNotebookEntries {
  const [entries, setEntries] = useState<NotebookEntryRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (profileId === null) return;
    let alive = true;
    void (async () => {
      setLoading(true);
      const rows = await listNotes(profileId, scopeType, scopeId);
      if (!alive) return;
      setEntries(rows);
      setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, [profileId, scopeType, scopeId, version]);

  const save = useCallback(
    async (entry: NotebookEntryInput) => {
      if (profileId === null) return null;
      const saved = await saveNote(profileId, entry);
      setVersion((v) => v + 1);
      return saved;
    },
    [profileId],
  );

  const remove = useCallback(
    async (id: string) => {
      if (profileId === null) return;
      await deleteNote(profileId, id);
      setVersion((v) => v + 1);
    },
    [profileId],
  );

  return { entries, loading, save, remove };
}
