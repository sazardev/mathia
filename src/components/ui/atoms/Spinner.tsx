import styles from "./Spinner.module.css";

type SpinnerProps = {
  size?: number;
};

export function Spinner({ size = 32 }: SpinnerProps) {
  return (
    <span
      className={styles["spinner"]}
      style={{ width: size, height: size, borderWidth: Math.max(2, size / 10) }}
      aria-live="polite"
      aria-label="Cargando"
    />
  );
}
