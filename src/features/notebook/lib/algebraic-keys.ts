export type KeyCategory =
  | "numero"
  | "variable"
  | "operador"
  | "trigonometrica"
  | "funcion"
  | "constante"
  | "casos"
  | "edicion";

export type KeyAction =
  | { kind: "insert"; text: string }
  | { kind: "backspace" }
  | { kind: "clear" }
  | { kind: "moveLeft" }
  | { kind: "moveRight" };

export interface AlgebraicKey {
  id: string;
  display: string;
  action: KeyAction;
  category: KeyCategory;
  keywords: string[];
}

export const CATEGORY_LABELS: Record<KeyCategory, string> = {
  numero: "Números",
  variable: "Variable",
  operador: "Operadores",
  trigonometrica: "Trigonométricas",
  funcion: "Funciones",
  constante: "Constantes y griegas",
  casos: "Comparación y casos",
  edicion: "Edición",
};

function insertKey(
  id: string,
  display: string,
  text: string,
  category: KeyCategory,
  keywords: string[],
): AlgebraicKey {
  return { id, display, action: { kind: "insert", text }, category, keywords };
}

function actionKey(
  id: string,
  display: string,
  action: KeyAction,
  category: KeyCategory,
  keywords: string[],
): AlgebraicKey {
  return { id, display, action, category, keywords };
}

const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

const NUMBER_KEYS: AlgebraicKey[] = [
  ...DIGITS.map((d) => insertKey(d, d, d, "numero", [d])),
  insertKey("decimal", ".", ".", "numero", ["punto", "decimal"]),
];

/** Solo incluye tokens que el evaluador (`lib/math/function-eval.ts`) sabe
 * interpretar — cada tecla mantiene la expresión en camino a ser válida, nunca
 * inserta un símbolo que garantice un error al pulsarla sola. θ (theta) es un
 * ALIAS del mismo x, no una segunda variable: sigue siendo una función de una
 * sola variable real, solo cambia cómo se escribe/renderiza. */
export const ALGEBRAIC_KEYS: AlgebraicKey[] = [
  ...NUMBER_KEYS,
  insertKey("x", "x", "x", "variable", ["x", "variable", "incognita"]),
  insertKey("theta", "θ", "theta", "variable", ["theta", "angulo", "griega"]),
  insertKey("add", "+", "+", "operador", ["suma", "mas"]),
  insertKey("sub", "−", "-", "operador", ["resta", "menos"]),
  insertKey("mul", "×", "*", "operador", ["multiplicacion", "por"]),
  insertKey("div", "÷", "/", "operador", ["division", "entre"]),
  insertKey("pow", "^", "^", "operador", ["potencia", "exponente"]),
  insertKey("lparen", "(", "(", "operador", ["parentesis", "abrir"]),
  insertKey("rparen", ")", ")", "operador", ["parentesis", "cerrar"]),
  insertKey("sq", "x²", "^2", "operador", ["cuadrado", "al cuadrado"]),
  insertKey("cube", "x³", "^3", "operador", ["cubo", "al cubo"]),
  insertKey("recip", "1/x", "^-1", "operador", ["reciproco", "inverso"]),
  insertKey("sin", "sin", "sin(", "trigonometrica", ["seno"]),
  insertKey("cos", "cos", "cos(", "trigonometrica", ["coseno"]),
  insertKey("tan", "tan", "tan(", "trigonometrica", ["tangente"]),
  insertKey("asin", "sin⁻¹", "asin(", "trigonometrica", ["arcoseno", "arcsin"]),
  insertKey("acos", "cos⁻¹", "acos(", "trigonometrica", [
    "arcocoseno",
    "arccos",
  ]),
  insertKey("atan", "tan⁻¹", "atan(", "trigonometrica", [
    "arcotangente",
    "arctan",
  ]),
  insertKey("sinh", "sinh", "sinh(", "trigonometrica", ["seno hiperbolico"]),
  insertKey("cosh", "cosh", "cosh(", "trigonometrica", ["coseno hiperbolico"]),
  insertKey("tanh", "tanh", "tanh(", "trigonometrica", [
    "tangente hiperbolica",
  ]),
  insertKey("sqrt", "√", "sqrt(", "funcion", ["raiz", "raiz cuadrada"]),
  insertKey("cbrt", "∛", "cbrt(", "funcion", ["raiz cubica"]),
  insertKey("abs", "|x|", "abs(", "funcion", ["valor absoluto"]),
  insertKey("log", "log", "log(", "funcion", ["logaritmo"]),
  insertKey("ln", "ln", "ln(", "funcion", ["logaritmo natural"]),
  insertKey("exp", "eˣ", "exp(", "funcion", ["exponencial"]),
  insertKey("floor", "⌊x⌋", "floor(", "funcion", ["piso", "redondear abajo"]),
  insertKey("ceil", "⌈x⌉", "ceil(", "funcion", ["techo", "redondear arriba"]),
  insertKey("round", "round", "round(", "funcion", ["redondear"]),
  insertKey("sign", "sgn", "sign(", "funcion", ["signo"]),
  insertKey("pi", "π", "pi", "constante", ["pi", "griega", "griego"]),
  insertKey("e", "e", "e", "constante", ["euler", "constante"]),
  insertKey("phi", "φ", "phi", "constante", ["fi", "numero aureo", "griega"]),
  insertKey("tau", "τ", "tau", "constante", ["tau", "dos pi", "griega"]),
  insertKey("gamma", "γ", "gamma", "constante", ["euler-mascheroni", "griega"]),
  insertKey("lt", "<", "<", "casos", ["menor que"]),
  insertKey("gt", ">", ">", "casos", ["mayor que"]),
  insertKey("lte", "≤", "<=", "casos", ["menor o igual"]),
  insertKey("gte", "≥", ">=", "casos", ["mayor o igual"]),
  insertKey("eq", "=", "==", "casos", ["igual", "igualdad"]),
  insertKey("neq", "≠", "!=", "casos", ["distinto", "diferente"]),
  insertKey("question", "?", "?", "casos", ["entonces", "condicion", "si"]),
  insertKey("colon", ":", ":", "casos", ["si no", "sino", "de lo contrario"]),
  actionKey("backspace", "⌫", { kind: "backspace" }, "edicion", [
    "borrar",
    "retroceso",
  ]),
  actionKey("clear", "C", { kind: "clear" }, "edicion", [
    "limpiar",
    "borrar todo",
  ]),
  actionKey("left", "←", { kind: "moveLeft" }, "edicion", [
    "izquierda",
    "cursor",
  ]),
  actionKey("right", "→", { kind: "moveRight" }, "edicion", [
    "derecha",
    "cursor",
  ]),
];

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function filterKeys(
  keys: AlgebraicKey[],
  query: string,
): AlgebraicKey[] {
  const q = normalize(query.trim());
  if (q === "") return keys;
  return keys.filter(
    (key) =>
      normalize(key.display).includes(q) ||
      key.keywords.some((kw) => normalize(kw).includes(q)),
  );
}

export interface CursorInsertResult {
  next: string;
  cursor: number;
}

function clampIndex(index: number, length: number): number {
  return Math.max(0, Math.min(index, length));
}

function backspace(
  current: string,
  start: number,
  end: number,
): CursorInsertResult {
  if (start !== end) {
    return {
      next: current.slice(0, start) + current.slice(end),
      cursor: start,
    };
  }
  const from = Math.max(0, start - 1);
  return { next: current.slice(0, from) + current.slice(start), cursor: from };
}

/** Aplica la acción de una tecla (insertar, borrar, limpiar o mover el
 * cursor) sobre la selección actual y devuelve el texto resultante junto con
 * dónde debe quedar el cursor después — p. ej. justo dentro del paréntesis
 * recién insertado de "sin(". */
export function applyKeyAction(
  current: string,
  action: KeyAction,
  selectionStart: number,
  selectionEnd: number,
): CursorInsertResult {
  const start = clampIndex(selectionStart, current.length);
  const end = Math.max(start, clampIndex(selectionEnd, current.length));

  switch (action.kind) {
    case "insert":
      return {
        next: current.slice(0, start) + action.text + current.slice(end),
        cursor: start + action.text.length,
      };
    case "backspace":
      return backspace(current, start, end);
    case "clear":
      return { next: "", cursor: 0 };
    case "moveLeft":
      return {
        next: current,
        cursor: start !== end ? start : Math.max(0, start - 1),
      };
    case "moveRight":
      return {
        next: current,
        cursor: start !== end ? end : Math.min(current.length, end + 1),
      };
  }
}
