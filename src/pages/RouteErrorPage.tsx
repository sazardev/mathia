import type { ErrorComponentProps } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/atoms/Button";
import { Text } from "@/components/ui/atoms/Text";
import styles from "./shared.module.css";

export function RouteErrorPage({ error, reset }: ErrorComponentProps) {
  return (
    <main className={styles["card"]}>
      <h1 className={styles["pageTitle"]}>No se pudo abrir esta pantalla</h1>
      <Text tone="secondary">
        La ruta recibió datos inválidos o falló al cargarse.
      </Text>
      <Text as="p" size="sm" tone="muted">
        <code>{error instanceof Error ? error.message : String(error)}</code>
      </Text>
      <div className={styles["row"]}>
        <Button onPress={reset}>Reintentar</Button>
        <Link to="/">
          <Button variant="secondary">Volver al inicio</Button>
        </Link>
      </div>
    </main>
  );
}

export default RouteErrorPage;
