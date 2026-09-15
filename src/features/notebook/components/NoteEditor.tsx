import { useState } from "react";
import { Dialog } from "@/components/ui/molecules/Dialog";
import styles from "./NoteEditor.module.css";

interface NoteEditorProps {
  open: boolean;
  initialTitle: string;
  initialContent: string;
  onSave: (title: string, content: string) => void;
  onClose: () => void;
}

export function NoteEditor({
  open,
  initialTitle,
  initialContent,
  onSave,
  onClose,
}: NoteEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);

  if (!open) return null;

  return (
    <Dialog
      open={open}
      title="Nota de texto"
      onClose={onClose}
      footer={
        <button
          type="button"
          className={styles["saveButton"]}
          onClick={() => {
            onSave(title.trim() || "Sin título", content);
            onClose();
          }}
        >
          Guardar nota
        </button>
      }
    >
      <div className={styles["form"]}>
        <input
          className={styles["titleInput"]}
          type="text"
          placeholder="Título (opcional)"
          value={title}
          maxLength={120}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className={styles["textarea"]}
          placeholder="Escribe tu nota…"
          value={content}
          rows={8}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
    </Dialog>
  );
}
