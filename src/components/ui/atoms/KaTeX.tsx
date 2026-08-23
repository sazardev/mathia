import { useEffect, useState } from "react";
import styles from "./KaTeX.module.css";

type KaTeXProps = {
  tex: string;
  displayMode?: boolean;
};

let katexModule: Promise<typeof import("katex")> | null = null;

function loadKatex() {
  katexModule ??= Promise.all([
    import("katex"),
    import("katex/dist/katex.min.css"),
  ]).then(([mod]) => mod);
  return katexModule;
}

export function KaTeX({ tex, displayMode = false }: KaTeXProps) {
  const [html, setHtml] = useState<string | null>(null);
  const [prevTex, setPrevTex] = useState(tex);
  const [prevDisplayMode, setPrevDisplayMode] = useState(displayMode);

  if (prevTex !== tex || prevDisplayMode !== displayMode) {
    setPrevTex(tex);
    setPrevDisplayMode(displayMode);
    setHtml(null);
  }

  useEffect(() => {
    let alive = true;
    loadKatex().then((katex) => {
      if (!alive) return undefined;
      setHtml(katex.renderToString(tex, { throwOnError: false, displayMode }));
      return undefined;
    });
    return () => {
      alive = false;
    };
  }, [tex, displayMode]);

  if (html === null) {
    return (
      <span className={styles["loading"]} aria-label={tex}>
        {tex}
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
