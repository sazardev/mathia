import { useReducer } from "react";
import { IconButton } from "@/components/ui/atoms/IconButton";
import { useDraggable } from "../hooks/useDraggable";
import {
  INITIAL_CALC_STATE,
  pressBackspace,
  pressClear,
  pressDecimal,
  pressDigit,
  pressEquals,
  pressOperator,
  pressPercent,
  type CalcOperator,
  type CalcState,
} from "../lib/calculator-engine";
import styles from "./Calculator.module.css";

type CalcAction =
  | { type: "digit"; value: string }
  | { type: "decimal" }
  | { type: "operator"; value: CalcOperator }
  | { type: "equals" }
  | { type: "percent" }
  | { type: "backspace" }
  | { type: "clear" };

function reducer(state: CalcState, action: CalcAction): CalcState {
  switch (action.type) {
    case "digit":
      return pressDigit(state, action.value);
    case "decimal":
      return pressDecimal(state);
    case "operator":
      return pressOperator(state, action.value);
    case "equals":
      return pressEquals(state);
    case "percent":
      return pressPercent(state);
    case "backspace":
      return pressBackspace(state);
    case "clear":
      return pressClear();
  }
}

const KEYS: { label: string; action: CalcAction; wide?: boolean }[] = [
  { label: "C", action: { type: "clear" } },
  { label: "⌫", action: { type: "backspace" } },
  { label: "%", action: { type: "percent" } },
  { label: "÷", action: { type: "operator", value: "÷" } },
  { label: "7", action: { type: "digit", value: "7" } },
  { label: "8", action: { type: "digit", value: "8" } },
  { label: "9", action: { type: "digit", value: "9" } },
  { label: "×", action: { type: "operator", value: "×" } },
  { label: "4", action: { type: "digit", value: "4" } },
  { label: "5", action: { type: "digit", value: "5" } },
  { label: "6", action: { type: "digit", value: "6" } },
  { label: "-", action: { type: "operator", value: "-" } },
  { label: "1", action: { type: "digit", value: "1" } },
  { label: "2", action: { type: "digit", value: "2" } },
  { label: "3", action: { type: "digit", value: "3" } },
  { label: "+", action: { type: "operator", value: "+" } },
  { label: "0", action: { type: "digit", value: "0" }, wide: true },
  { label: ".", action: { type: "decimal" } },
  { label: "=", action: { type: "equals" } },
];

interface CalculatorProps {
  onClose: () => void;
}

export function Calculator({ onClose }: CalculatorProps) {
  const [state, dispatch] = useReducer(reducer, INITIAL_CALC_STATE);
  const drag = useDraggable({ x: 24, y: 96 });

  return (
    <div
      className={styles["window"]}
      style={{ left: drag.position.x, top: drag.position.y }}
      data-toolkit-chrome="true"
      aria-label="Calculadora"
    >
      <div
        className={styles["header"]}
        onPointerDown={drag.onPointerDown}
        onPointerMove={drag.onPointerMove}
        onPointerUp={drag.onPointerUp}
      >
        <span>Calculadora</span>
        {/* stopPropagation: si el pointerdown llega al header, useDraggable llama
            setPointerCapture y el click de este botón deja de disparar (el clic
            termina yendo al header, no al botón). */}
        <span onPointerDown={(e) => e.stopPropagation()}>
          <IconButton
            icon="x"
            label="Cerrar calculadora"
            size="sm"
            onPress={onClose}
          />
        </span>
      </div>
      <div className={styles["display"]}>{state.display}</div>
      <div className={styles["keys"]}>
        {KEYS.map(({ label, action, wide }) => (
          <button
            key={label}
            type="button"
            className={wide === true ? styles["keyWide"] : styles["key"]}
            onClick={() => dispatch(action)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
