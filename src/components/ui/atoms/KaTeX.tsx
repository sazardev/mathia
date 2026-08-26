/* oxlint-disable */
import { useEffect, useState } from "react";
import styles from "./KaTeX.module.css";

type KaTeXProps = {
  tex: string;
  displayMode?: boolean;
};

let katexModule: Promise<typeof import("katex")> | null = null;
let katexResolved: typeof import("katex") | null = null;
let katexFailed = false;

function loadKatex() {
  if (katexFailed) katexModule = null;
  katexModule ??= Promise.all([
    import("katex"),
    import("katex/dist/katex.min.css"),
  ])
    .then(([mod]) => {
      katexResolved = mod;
      return mod;
    })
    .catch((error) => {
      katexFailed = true;
      katexModule = null;
      throw error;
    });
  return katexModule;
}

function renderTex(tex: string, displayMode: boolean): string | null {
  if (katexResolved === null) return null;
  return katexResolved.renderToString(tex, {
    throwOnError: false,
    displayMode,
  });
}

export function KaTeX({ tex, displayMode = false }: KaTeXProps) {
  const [html, setHtml] = useState<string | null>(() =>
    renderTex(tex, displayMode),
  );
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const rendered = renderTex(tex, displayMode);
    if (rendered !== null) {
      setHtml(rendered);
      setLoadError(false);
      return;
    }
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

  if (html !== null) {
    return (
      <span
        className={styles["math"]}
        aria-label={tex}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  if (loadError) {
    return (
      <span className={styles["loading"]} aria-label={tex}>
        {tex}
      </span>
    );
  }

  return (
    <span className={styles["loading"]} aria-busy="true" aria-label={tex}>
      {tex}
    </span>
  );
}
