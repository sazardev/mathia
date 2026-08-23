import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { IconButton } from "@/components/ui/atoms/IconButton";
import { Text } from "@/components/ui/atoms/Text";
import styles from "./Dialog.module.css";

type DialogProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export function Dialog({ open, title, onClose, children, footer }: DialogProps) {
  const panelRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className={styles["overlay"]}
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") onClose();
      }}
    >
      <dialog
        ref={panelRef}
        open
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={styles["panel"]}
      >
        <div className={styles["header"]}>
          <Text as="h2" size="lg" weight="bold">
            {title}
          </Text>
          <IconButton icon="x" label="Cerrar" size="sm" onPress={onClose} />
        </div>
        {children}
        {footer !== undefined && <div>{footer}</div>}
      </dialog>
    </div>,
    document.body,
  );
}
