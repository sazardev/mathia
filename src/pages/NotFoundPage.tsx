import { Link } from "@tanstack/react-router";

export function NotFoundPage() {
  return (
    <main>
      <h1>Página no encontrada</h1>
      <p>La ruta que buscas no existe o fue movida.</p>
      <Link to="/">Volver al inicio</Link>
    </main>
  );
}

export default NotFoundPage;
