import { cn } from "@/lib/cn";
import styles from "./Toolbar.module.css";

interface ColorSwatchesProps {
  colors: readonly string[];
  active: string;
  onChange: (color: string) => void;
}

export function ColorSwatches({
  colors,
  active,
  onChange,
}: ColorSwatchesProps) {
  return (
    <div className={styles["group"]}>
      {colors.map((c) => (
        <button
          key={c}
          type="button"
          className={cn(
            styles["swatch"],
            active === c && styles["swatchActive"],
          )}
          style={{ background: c }}
          aria-label={`Color ${c}`}
          aria-pressed={active === c}
          onClick={() => onChange(c)}
        />
      ))}
    </div>
  );
}
