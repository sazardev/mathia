/* oxlint-disable */
import { useEffect, useState } from "react";
import { loadKatex, renderTex } from "@/lib/katex-loader";
import styles from "./KaTeX.module.css";

type KaTeXProps = {
  tex: string;
  displayMode?: boolean;
};

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
