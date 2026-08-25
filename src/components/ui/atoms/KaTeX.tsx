/* oxlint-disable */
import { useEffect, useState } from "react";
import { Spinner } from "./Spinner";
import styles from "./KaTeX.module.css";

type KaTeXProps = {
  tex: string;
  displayMode?: boolean;
};

let katexModule: Promise<typeof import("katex")> | null = null;
let katexFailed = false;

function loadKatex() {
  if (katexFailed) katexModule = null;
  katexModule ??= Promise.all([
    import("katex"),
    import("katex/dist/katex.min.css"),
  ])
    .then(([mod]) => mod)
    .catch((error) => {
      katexFailed = true;
      katexModule = null;
      throw error;
    });
  return katexModule;
}

export function KaTeX({ tex, displayMode = false }: KaTeXProps) {
  const [html, setHtml] = useState<string | null>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let alive = true;
    setHtml(null);
    setLoadError(false);
    loadKatex()
      .then((katex) => {
        if (!alive) return;
        setHtml(
          katex.renderToString(tex, { throwOnError: false, displayMode }),
        );
      })
      .catch(() => {
        if (alive) setLoadError(true);
      });
    return () => {
      alive = false;
    };
  }, [tex, displayMode]);

  if (loadError) {
    return (
      <span className={styles["loading"]} aria-label={tex}>
        {tex}
      </span>
    );
  }

  if (html === null) {
    return (
      <span
        className={styles["loading"]}
        aria-busy="true"
        aria-label={`Cargando fórmula ${tex}`}
      >
        <Spinner size={16} />
      </span>
    );
  }
  return (
    <span
      className={styles["math"]}
      aria-label={tex}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
