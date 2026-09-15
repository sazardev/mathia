let katexModule: Promise<typeof import("katex")> | null = null;
let katexResolved: typeof import("katex") | null = null;
let katexFailed = false;

export function loadKatex() {
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

export function renderTex(tex: string, displayMode: boolean): string | null {
  if (katexResolved === null) return null;
  return katexResolved.renderToString(tex, {
    throwOnError: false,
    displayMode,
  });
}
