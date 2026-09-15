import { useState } from "react";
import { IconButton } from "@/components/ui/atoms/IconButton";
import { useDraggable } from "../hooks/useDraggable";
import {
  ALGEBRAIC_KEYS,
  CATEGORY_LABELS,
  filterKeys,
  type AlgebraicKey,
  type KeyAction,
  type KeyCategory,
} from "../lib/algebraic-keys";
import styles from "./AlgebraicKeyboard.module.css";

interface AlgebraicKeyboardProps {
  onAction: (action: KeyAction) => void;
  onClose: () => void;
}

const CATEGORY_ORDER: KeyCategory[] = [
  "numero",
  "variable",
  "operador",
  "trigonometrica",
  "funcion",
  "constante",
  "casos",
  "edicion",
];

function groupByCategory(
  keys: AlgebraicKey[],
): [KeyCategory, AlgebraicKey[]][] {
  return CATEGORY_ORDER.map((category): [KeyCategory, AlgebraicKey[]] => [
    category,
    keys.filter((key) => key.category === category),
  ]).filter(([, items]) => items.length > 0);
}

export function AlgebraicKeyboard({
  onAction,
  onClose,
}: AlgebraicKeyboardProps) {
  const drag = useDraggable({ x: 730, y: 96 });
  const [query, setQuery] = useState("");
  const groups = groupByCategory(filterKeys(ALGEBRAIC_KEYS, query));

  return (
    <div
      className={styles["window"]}
      style={{ left: drag.position.x, top: drag.position.y }}
      data-toolkit-chrome="true"
      aria-label="Teclado algebraico"
    >
      <div
        className={styles["header"]}
        onPointerDown={drag.onPointerDown}
        onPointerMove={drag.onPointerMove}
        onPointerUp={drag.onPointerUp}
      >
        <span>Teclado algebraico</span>
        <span onPointerDown={(e) => e.stopPropagation()}>
          <IconButton
            icon="x"
            label="Cerrar teclado algebraico"
            size="sm"
            onPress={onClose}
          />
        </span>
      </div>

      <div className={styles["body"]}>
        <input
          type="search"
          className={styles["search"]}
          placeholder="Buscar símbolo… (ej. raíz, seno, pi)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Buscar símbolo del teclado algebraico"
        />
        {groups.length === 0 ? (
          <p className={styles["empty"]}>Sin resultados.</p>
        ) : (
          groups.map(([category, items]) => (
            <div key={category} className={styles["group"]}>
              <span className={styles["groupLabel"]}>
                {CATEGORY_LABELS[category]}
              </span>
              <div className={styles["grid"]}>
                {items.map((key) => (
                  <button
                    key={key.id}
                    type="button"
                    className={styles["key"]}
                    title={key.keywords[0]}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => onAction(key.action)}
                  >
                    {key.display}
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
