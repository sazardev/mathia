import { useState } from "react";
import { cn } from "@/lib/cn";
import styles from "./Toolbar.module.css";

interface SizePopoverProps {
  activeWidth: number;
  widthRange: { min: number; max: number };
  onWidthChange: (width: number) => void;
}

export function SizePopover({
  activeWidth,
  widthRange,
  onWidthChange,
}: SizePopoverProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles["group"]}>
      <button
        type="button"
        className={cn(styles["sizeToggle"], open && styles["sizeToggleActive"])}
        aria-expanded={open}
        aria-controls="toolkit-size-panel"
        onClick={() => setOpen((v) => !v)}
      >
        Grosor {activeWidth}
      </button>
      {open && (
        <div id="toolkit-size-panel" className={styles["sizePanel"]}>
          <input
            type="range"
            min={widthRange.min}
            max={widthRange.max}
            value={activeWidth}
            aria-label="Grosor del trazo"
            onChange={(e) => onWidthChange(Number(e.target.value))}
          />
          <span className={styles["sliderValue"]}>{activeWidth}</span>
        </div>
      )}
    </div>
  );
}
