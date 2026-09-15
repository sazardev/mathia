import { IconButton } from "@/components/ui/atoms/IconButton";
import type { IconName } from "@/components/ui/atoms/Icon";
import type { ShapeKind } from "../types";
import styles from "./ShapePicker.module.css";

const SHAPES: { kind: ShapeKind; icon: IconName; label: string }[] = [
  { kind: "arrow", icon: "arrow", label: "Flecha" },
  { kind: "line", icon: "line", label: "Línea recta" },
  { kind: "rectangle", icon: "rectangle", label: "Rectángulo" },
  { kind: "ellipse", icon: "ellipse", label: "Elipse" },
];

interface ShapePickerProps {
  active: ShapeKind;
  onChange: (shape: ShapeKind) => void;
}

export function ShapePicker({ active, onChange }: ShapePickerProps) {
  return (
    <fieldset aria-label="Formas preestablecidas" className={styles["group"]}>
      {SHAPES.map(({ kind, icon, label }) => (
        <IconButton
          key={kind}
          icon={icon}
          label={label}
          size="sm"
          variant={active === kind ? "primary" : "ghost"}
          onPress={() => onChange(kind)}
        />
      ))}
    </fieldset>
  );
}
