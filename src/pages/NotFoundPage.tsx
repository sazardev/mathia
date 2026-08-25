import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/atoms/Button";
import { Text } from "@/components/ui/atoms/Text";
import styles from "./shared.module.css";

export function NotFoundPage() {
  return (
    <main className={styles["card"]}>
      <h1 className={styles["pageTitle"]}>Página no encontrada</h1>
      <Text tone="secondary">La ruta que buscas no existe o fue movida.</Text>
      <Link to="/" className={styles["row"]}>
        <Button>Volver al inicio</Button>
      </Link>
    </main>
  );
}

export default NotFoundPage;
