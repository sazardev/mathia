import { IconButton } from "@/components/ui/atoms/IconButton";
import styles from "./StudyToolkitFab.module.css";

interface StudyToolkitFabProps {
  onOpen: () => void;
}

export function StudyToolkitFab({ onOpen }: StudyToolkitFabProps) {
  return (
    <IconButton
      icon="pencil"
      label="Abrir kit de estudio"
      variant="primary"
      size="lg"
      className={styles["fab"]}
      onPress={onOpen}
    />
  );
}
