export type MathSegment =
  | { readonly kind: "text"; readonly value: string }
  | { readonly kind: "math"; readonly value: string };

/**
 * Divide una cadena en segmentos de texto y matemática inline.
 * Convención del contenido (U-06): los tramos entre pares de "$" son KaTeX.
 * Con número impar de "$" (contenido inválido) se devuelve todo como texto.
 * El símbolo "$" es SOLO delimitador matemático: el dinero se escribe con
 * palabras («50 pesos»), nunca "$50".
 */
export function splitMathSegments(text: string): readonly MathSegment[] {
  const dollarCount = (text.match(/\$/g) ?? []).length;
  if (dollarCount === 0 || dollarCount % 2 !== 0) {
    return [{ kind: "text", value: text }];
  }

  const segments: MathSegment[] = [];
  const parts = text.split("$");
  for (const [index, value] of parts.entries()) {
    if (value === "") continue;
    segments.push(
      index % 2 === 0 ? { kind: "text", value } : { kind: "math", value },
    );
  }
  return segments;
}

/** Texto legible sin delimitadores "$", para atributos aria y resúmenes. */
export function plainText(text: string): string {
  return splitMathSegments(text)
    .map((segment) => segment.value)
    .join("");
}
