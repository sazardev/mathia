import { Icon } from "@/components/ui/atoms/Icon";
import styles from "./Numpad.module.css";

type NumpadProps = {
  onDigit: (digit: string) => void;
  onBackspace?: (() => void) | undefined;
  onSubmit?: () => void;
  submitLabel?: string;
  submitDisabled?: boolean;
};

const DIGITS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0"];

export function Numpad({
  onDigit,
  onBackspace,
  onSubmit,
  submitLabel = "Comprobar",
  submitDisabled = false,
}: NumpadProps) {
  return (
    <div className={styles["grid"]}>
      {DIGITS.map((digit) => (
        <button
          key={digit}
          type="button"
          className={styles["key"]}
          aria-label={`Dígito ${digit}`}
          onClick={() => onDigit(digit)}
        >
          {digit}
        </button>
      ))}
      <button
        type="button"
        className={styles["key"]}
        aria-label="Borrar último dígito"
        onClick={onBackspace}
        disabled={onBackspace === undefined}
      >
        <Icon name="x" size={20} />
      </button>
      {onSubmit !== undefined && (
        <button
          type="button"
          className={styles["submitKey"]}
          onClick={onSubmit}
          disabled={submitDisabled}
        >
          {submitLabel}
        </button>
      )}
    </div>
  );
}
