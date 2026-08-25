import { Component, type ReactNode } from "react";
import styles from "./ErrorBoundary.module.css";

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  error: Error | null;
};

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  override state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  handleReset = () => {
    this.setState({ error: null });
  };

  override render(): ReactNode {
    const { error } = this.state;
    const { children } = this.props;

    if (error !== null) {
      return (
        <main className={styles["error"]}>
          <h1>No se pudo mostrar esta pantalla</h1>
          <p>
            Ha ocurrido un error inesperado. Puedes reintentar o volver al
            inicio.
          </p>
          <div className={styles["actions"]}>
            <button type="button" onClick={this.handleReset}>
              Reintentar
            </button>
            <a href="/">Volver al inicio</a>
          </div>
          <details>
            <summary>Detalle técnico</summary>
            <pre>{error.message}</pre>
          </details>
        </main>
      );
    }

    return children;
  }
}
