import { getStore } from "@/lib/storage";
import type {
  NotebookEntryInput,
  NotebookEntryRow,
  NotebookScopeType,
} from "@/lib/storage";

export async function listNotes(
  profileId: string,
  scopeType: NotebookScopeType,
  scopeId: string | null,
): Promise<NotebookEntryRow[]> {
  const store = await getStore();
  return store.listNotebookEntries(profileId, scopeType, scopeId);
}

export async function saveNote(
  profileId: string,
  entry: NotebookEntryInput,
): Promise<NotebookEntryRow> {
  const store = await getStore();
  const saved = await store.saveNotebookEntry(profileId, entry);
  await store.flush();
  return saved;
}

export async function deleteNote(profileId: string, id: string): Promise<void> {
  const store = await getStore();
  await store.deleteNotebookEntry(profileId, id);
  await store.flush();
}
