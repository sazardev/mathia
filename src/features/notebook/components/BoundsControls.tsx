import { useState } from "react";
import { DEFAULT_BOUNDS, type Bounds } from "@/lib/math/graph-scale";
import styles from "./BoundsControls.module.css";

interface BoundsControlsProps {
  bounds: Bounds;
  onChange: (bounds: Bounds) => void;
}

const FIELDS: { key: keyof Bounds; label: string }[] = [
  { key: "xMin", label: "x mín" },
  { key: "xMax", label: "x máx" },
  { key: "yMin", label: "y mín" },
  { key: "yMax", label: "y máx" },
];

function isValidBounds(bounds: Bounds): boolean {
  return bounds.xMax - bounds.xMin >= 0.1 && bounds.yMax - bounds.yMin >= 0.1;
}

type TextFields = Record<keyof Bounds, string>;

function toTextFields(bounds: Bounds): TextFields {
  return {
    xMin: String(bounds.xMin),
    xMax: String(bounds.xMax),
    yMin: String(bounds.yMin),
    yMax: String(bounds.yMax),
  };
}

export function BoundsControls({ bounds, onChange }: BoundsControlsProps) {
  const [text, setText] = useState<TextFields>(() => toTextFields(bounds));
  const [syncedBounds, setSyncedBounds] = useState(bounds);

  // Ajuste de estado durante el render (patrón oficial de React), no en un
  // efecto: solo resincroniza el texto cuando `bounds` cambia de verdad (por
  // este componente o por pan/zoom externo). Así un dígito inválido a medio
  // escribir (p. ej. "-" o "") no hace que el campo "rebote" al último valor
  // válido en cada tecla, que es lo que pasaba al ligar `value` directo a `bounds[key]`.
  if (
    bounds.xMin !== syncedBounds.xMin ||
    bounds.xMax !== syncedBounds.xMax ||
    bounds.yMin !== syncedBounds.yMin ||
    bounds.yMax !== syncedBounds.yMax
  ) {
    setSyncedBounds(bounds);
    setText(toTextFields(bounds));
  }

  function handleFieldChange(key: keyof Bounds, raw: string): void {
    setText((prev) => ({ ...prev, [key]: raw }));
    const value = Number(raw);
    if (raw.trim() === "" || !Number.isFinite(value)) return;
    const next = { ...bounds, [key]: value };
    if (isValidBounds(next)) onChange(next);
  }

  return (
    <div className={styles["grid"]}>
      {FIELDS.map(({ key, label }) => (
        <label key={key} className={styles["field"]}>
          <span className={styles["label"]}>{label}</span>
          <input
            type="number"
            className={styles["input"]}
            value={text[key]}
            onChange={(e) => handleFieldChange(key, e.target.value)}
          />
        </label>
      ))}
      <button
        type="button"
        className={styles["reset"]}
        onClick={() => onChange(DEFAULT_BOUNDS)}
      >
        Restablecer vista
      </button>
    </div>
  );
}
