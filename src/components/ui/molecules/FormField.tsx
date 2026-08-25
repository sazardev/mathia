import { cloneElement, isValidElement, useId } from "react";
import styles from "./FormField.module.css";

type FormFieldProps = {
  label: string;
  error?: string;
  children: React.ReactNode;
};

export function FormField({ label, error, children }: FormFieldProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const hasError = error !== undefined;

  const enhancedChildren = isValidElement<{
    id?: string;
    ariaDescribedBy?: string;
  }>(children)
    ? cloneElement(
        children,
        hasError ? { id, ariaDescribedBy: errorId } : { id },
      )
    : children;

  return (
    <div className={styles["field"]}>
      <label className={styles["labelText"]} htmlFor={id}>
        {label}
      </label>
      <span className={styles["slot"]}>{enhancedChildren}</span>
      {hasError && (
        <span id={errorId} role="alert" className={styles["errorText"]}>
          {error}
        </span>
      )}
    </div>
  );
}
