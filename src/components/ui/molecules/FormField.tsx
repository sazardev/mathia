import { useId } from "react";
import styles from "./FormField.module.css";

type FormFieldProps = {
  label: string;
  error?: string;
  children: React.ReactNode;
};

export function FormField({ label, error, children }: FormFieldProps) {
  const id = useId();
  return (
    <label className={styles["field"]} htmlFor={id}>
      <span className={styles["labelText"]}>{label}</span>
      <span id={id} className={styles["slot"]}>
        {children}
      </span>
      {error !== undefined && (
        <span role="alert" className={styles["errorText"]}>
          {error}
        </span>
      )}
    </label>
  );
}
