import { cn } from "@/lib/cn";
import styles from "./Input.module.css";

type InputProps = {
  value: string;
  onChange: (value: string) => void;
  inputMode?: "text" | "numeric" | "decimal";
  placeholder?: string;
  ariaLabel?: string;
  id?: string | undefined;
  autoComplete?: string | undefined;
  ariaDescribedBy?: string | undefined;
  invalid?: boolean;
  disabled?: boolean;
  onBlur?: () => void;
};

export function Input({
  value,
  onChange,
  inputMode = "text",
  placeholder,
  ariaLabel,
  id,
  autoComplete,
  ariaDescribedBy,
  invalid = false,
  disabled = false,
  onBlur,
}: InputProps) {
  return (
    <input
      id={id}
      type="text"
      inputMode={inputMode}
      value={value}
      placeholder={placeholder}
      aria-label={ariaLabel}
      autoComplete={autoComplete}
      aria-describedby={ariaDescribedBy}
      aria-invalid={invalid || undefined}
      disabled={disabled}
      onChange={(event) => onChange(event.currentTarget.value)}
      onBlur={onBlur}
      className={cn(
        styles["input"],
        invalid && styles["invalid"],
        disabled && styles["disabled"],
      )}
    />
  );
}
