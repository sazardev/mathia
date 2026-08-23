import type { ErrorComponentProps } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";

export function RouteErrorPage({ error, reset }: ErrorComponentProps) {
  return (
    <main>
      <h1>No se pudo abrir esta pantalla</h1>
      <p>La ruta recibió datos inválidos o falló al cargarse.</p>
      <p>
        <code>{error instanceof Error ? error.message : String(error)}</code>
      </p>
      <button type="button" onClick={reset}>
        Reintentar
      </button>
      <Link to="/">Volver al inicio</Link>
    </main>
  );
}

export default RouteErrorPage;
