import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { IconButton } from "@/components/ui/atoms/IconButton";
import { MathText } from "@/components/ui/molecules/MathText";
import { previewLatex } from "@/lib/math/function-eval";
import { applyKeyAction, type KeyAction } from "../lib/algebraic-keys";
import { AlgebraicKeyboard } from "./AlgebraicKeyboard";
import styles from "./FunctionInput.module.css";

interface FunctionInputProps {
  expression: string;
  onChange: (expression: string) => void;
  error: string | null;
}

export function FunctionInput({
  expression,
  onChange,
  error,
}: FunctionInputProps) {
  const latex = useMemo(() => previewLatex(expression), [expression]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  // Objeto nuevo en cada inserción (nunca se limpia a null) para que el
  // efecto siempre dispare, incluso si dos inserciones seguidas calculan el
  // mismo cursor numérico — React compara por referencia, no por valor.
  const [pendingCursor, setPendingCursor] = useState<{
    position: number;
  } | null>(null);

  // El cursor solo puede reubicarse una vez que el DOM ya refleja el nuevo
  // `expression` (controlado desde el padre) — ambos updates quedan en el
  // mismo commit, así que el layout effect ya ve el valor nuevo en el input.
  useLayoutEffect(() => {
    if (pendingCursor === null) return;
    inputRef.current?.setSelectionRange(
      pendingCursor.position,
      pendingCursor.position,
    );
    inputRef.current?.focus();
  }, [pendingCursor]);

  function handleKeyboardAction(action: KeyAction): void {
    const el = inputRef.current;
    const start = el?.selectionStart ?? expression.length;
    const end = el?.selectionEnd ?? expression.length;
    const result = applyKeyAction(expression, action, start, end);
    setPendingCursor({ position: result.cursor });
    onChange(result.next);
  }

  return (
    <div className={styles["field"]}>
      <div className={styles["labelRow"]}>
        <label
          className={styles["label"]}
          htmlFor="function-grapher-expression"
        >
          f(x) =
        </label>
        <IconButton
          icon="keyboard"
          label={
            keyboardOpen
              ? "Ocultar teclado algebraico"
              : "Mostrar teclado algebraico"
          }
          size="sm"
          variant={keyboardOpen ? "primary" : "ghost"}
          onPress={() => setKeyboardOpen((v) => !v)}
        />
      </div>
      <input
        ref={inputRef}
        id="function-grapher-expression"
        type="text"
        className={styles["input"]}
        value={expression}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Ejemplo: x^2 - 4"
        autoComplete="off"
        spellCheck={false}
      />
      {error !== null ? (
        <p className={styles["error"]} role="alert">
          {error}
        </p>
      ) : latex !== null ? (
        <p className={styles["preview"]}>
          <MathText text={`$f(x) = ${latex}$`} />
        </p>
      ) : null}
      {keyboardOpen && (
        <AlgebraicKeyboard
          onAction={handleKeyboardAction}
          onClose={() => setKeyboardOpen(false)}
        />
      )}
    </div>
  );
}
