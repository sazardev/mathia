type FuncName =
  | "sin"
  | "cos"
  | "tan"
  | "asin"
  | "acos"
  | "atan"
  | "sinh"
  | "cosh"
  | "tanh"
  | "sqrt"
  | "cbrt"
  | "abs"
  | "log"
  | "ln"
  | "exp"
  | "floor"
  | "ceil"
  | "round"
  | "sign";

const FUNC_NAMES: readonly FuncName[] = [
  "sin",
  "cos",
  "tan",
  "asin",
  "acos",
  "atan",
  "sinh",
  "cosh",
  "tanh",
  "sqrt",
  "cbrt",
  "abs",
  "log",
  "ln",
  "exp",
  "floor",
  "ceil",
  "round",
  "sign",
];

function isFuncName(name: string): name is FuncName {
  return (FUNC_NAMES as readonly string[]).includes(name);
}

type VarName = "x" | "theta";
type ConstName = "pi" | "e" | "phi" | "tau" | "gamma";
const CONST_NAMES: readonly ConstName[] = ["pi", "e", "phi", "tau", "gamma"];

function isConstName(name: string): name is ConstName {
  return (CONST_NAMES as readonly string[]).includes(name);
}

const COMPARE_VALUES = ["<", ">", "<=", ">=", "==", "!="] as const;
type CompareOp = (typeof COMPARE_VALUES)[number];

function isCompareOpValue(value: string): value is CompareOp {
  return (COMPARE_VALUES as readonly string[]).includes(value);
}

type Node =
  | { type: "num"; value: number }
  | { type: "var"; name: VarName }
  | { type: "const"; name: ConstName }
  | { type: "unary"; op: "-" | "+"; arg: Node }
  | { type: "binary"; op: "+" | "-" | "*" | "/" | "^"; left: Node; right: Node }
  | { type: "call"; name: FuncName; arg: Node }
  | { type: "compare"; op: CompareOp; left: Node; right: Node }
  | { type: "ternary"; condition: Node; whenTrue: Node; whenFalse: Node };

type OpValue = "+" | "-" | "*" | "/" | "^" | "?" | ":" | CompareOp;

type Token =
  | { kind: "num"; value: number }
  | { kind: "var"; name: VarName }
  | { kind: "const"; name: ConstName }
  | { kind: "func"; name: FuncName }
  | { kind: "op"; value: OpValue }
  | { kind: "lparen" }
  | { kind: "rparen" };

const OP_CHARS = ["+", "-", "*", "/", "^", "?", ":"] as const;
type OpChar = (typeof OP_CHARS)[number];

function isOpChar(ch: string): ch is OpChar {
  return (OP_CHARS as readonly string[]).includes(ch);
}

/** Reconoce los operadores de comparación de dos caracteres antes que los de
 * uno solo (p. ej. "<=" completo, no "<" seguido de un "=" suelto e inválido). */
function matchCompareOp(input: string, pos: number): CompareOp | null {
  const two = input.slice(pos, pos + 2);
  if (two === "<=" || two === ">=" || two === "==" || two === "!=") return two;
  const one = input[pos];
  if (one === "<" || one === ">") return one;
  return null;
}

const NUM_RE = /^(\d+\.\d+|\d+)/;
const IDENT_RE = /^[A-Za-z]+/;

function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let pos = 0;
  while (pos < input.length) {
    const ch = input[pos];
    if (ch === undefined) break;
    if (ch === " " || ch === "\t") {
      pos += 1;
      continue;
    }
    if (ch === "(") {
      tokens.push({ kind: "lparen" });
      pos += 1;
      continue;
    }
    if (ch === ")") {
      tokens.push({ kind: "rparen" });
      pos += 1;
      continue;
    }
    const compareToken = matchCompareOp(input, pos);
    if (compareToken !== null) {
      tokens.push({ kind: "op", value: compareToken });
      pos += compareToken.length;
      continue;
    }
    if (isOpChar(ch)) {
      tokens.push({ kind: "op", value: ch });
      pos += 1;
      continue;
    }
    const rest = input.slice(pos);
    const numMatch = NUM_RE.exec(rest)?.[0];
    if (numMatch !== undefined) {
      tokens.push({ kind: "num", value: Number(numMatch) });
      pos += numMatch.length;
      continue;
    }
    const identMatch = IDENT_RE.exec(rest)?.[0];
    if (identMatch !== undefined) {
      pos += identMatch.length;
      const name = identMatch.toLowerCase();
      if (isFuncName(name)) {
        tokens.push({ kind: "func", name });
      } else if (name === "x" || name === "theta") {
        tokens.push({ kind: "var", name });
      } else if (isConstName(name)) {
        tokens.push({ kind: "const", name });
      } else {
        throw new Error(`Identificador desconocido: "${name}"`);
      }
      continue;
    }
    throw new Error(`Símbolo inválido cerca de: "${rest.slice(0, 12)}"`);
  }
  return tokens;
}

function endsOperand(token: Token): boolean {
  return (
    token.kind === "num" ||
    token.kind === "rparen" ||
    token.kind === "var" ||
    token.kind === "const"
  );
}

function startsOperand(token: Token): boolean {
  return (
    token.kind === "num" ||
    token.kind === "lparen" ||
    token.kind === "func" ||
    token.kind === "var" ||
    token.kind === "const"
  );
}

/** Inserta un `*` sintético entre tokens adyacentes que cierran/abren operando
 * (p. ej. "2x", "2(x+1)", "x(x+1)", "2sin(x)") para soportar multiplicación implícita. */
function insertImplicitMultiplication(tokens: Token[]): Token[] {
  const result: Token[] = [];
  for (const token of tokens) {
    const prev = result[result.length - 1];
    if (prev !== undefined && endsOperand(prev) && startsOperand(token)) {
      result.push({ kind: "op", value: "*" });
    }
    result.push(token);
  }
  return result;
}

interface ParserState {
  tokens: Token[];
  pos: number;
}

function peek(state: ParserState): Token | undefined {
  return state.tokens[state.pos];
}

function advance(state: ParserState): Token {
  const token = state.tokens[state.pos];
  if (token === undefined)
    throw new Error("La expresión termina de forma incompleta");
  state.pos += 1;
  return token;
}

function expectRparen(state: ParserState): void {
  const token = advance(state);
  if (token.kind !== "rparen") throw new Error("Falta un paréntesis de cierre");
}

/** Punto de entrada de la gramática: ternario (?:) sobre una comparación,
 * la precedencia más baja — así "x<0 ? -x : x" no necesita paréntesis extra. */
function parseTernary(state: ParserState): Node {
  const condition = parseComparison(state);
  const question = peek(state);
  if (question?.kind !== "op" || question.value !== "?") return condition;
  advance(state);
  const thenBranch = parseTernary(state);
  const colon = advance(state);
  if (colon.kind !== "op" || colon.value !== ":") {
    throw new Error('Se esperaba ":" en el operador ternario');
  }
  const elseBranch = parseTernary(state);
  return {
    type: "ternary",
    condition,
    whenTrue: thenBranch,
    whenFalse: elseBranch,
  };
}

/** Una sola comparación, no encadenable (igual que la mayoría de lenguajes:
 * "1 < x < 3" no es válido, hay que escribir "1 < x && x < 3"... salvo que
 * aquí no hay `&&`, así que se documenta como no soportado por ahora. */
function parseComparison(state: ParserState): Node {
  const left = parseExpr(state);
  const token = peek(state);
  if (token?.kind === "op" && isCompareOpValue(token.value)) {
    advance(state);
    return { type: "compare", op: token.value, left, right: parseExpr(state) };
  }
  return left;
}

function parseExpr(state: ParserState): Node {
  let node = parseTerm(state);
  for (;;) {
    const token = peek(state);
    if (token?.kind === "op" && (token.value === "+" || token.value === "-")) {
      advance(state);
      node = {
        type: "binary",
        op: token.value,
        left: node,
        right: parseTerm(state),
      };
    } else break;
  }
  return node;
}

function parseTerm(state: ParserState): Node {
  let node = parseUnary(state);
  for (;;) {
    const token = peek(state);
    if (token?.kind === "op" && (token.value === "*" || token.value === "/")) {
      advance(state);
      node = {
        type: "binary",
        op: token.value,
        left: node,
        right: parseUnary(state),
      };
    } else break;
  }
  return node;
}

function parseUnary(state: ParserState): Node {
  const token = peek(state);
  if (token?.kind === "op" && (token.value === "-" || token.value === "+")) {
    advance(state);
    return { type: "unary", op: token.value, arg: parseUnary(state) };
  }
  return parsePower(state);
}

function parsePower(state: ParserState): Node {
  const base = parseAtom(state);
  const token = peek(state);
  if (token?.kind === "op" && token.value === "^") {
    advance(state);
    return { type: "binary", op: "^", left: base, right: parseUnary(state) };
  }
  return base;
}

function parseAtom(state: ParserState): Node {
  const token = advance(state);
  switch (token.kind) {
    case "num":
      return { type: "num", value: token.value };
    case "var":
      return { type: "var", name: token.name };
    case "const":
      return { type: "const", name: token.name };
    case "func": {
      const openToken = advance(state);
      if (openToken.kind !== "lparen")
        throw new Error(`Se esperaba "(" tras ${token.name}`);
      const arg = parseTernary(state);
      expectRparen(state);
      return { type: "call", name: token.name, arg };
    }
    case "lparen": {
      const node = parseTernary(state);
      expectRparen(state);
      return node;
    }
    case "op":
    case "rparen":
      throw new Error("Se esperaba un número, variable o paréntesis");
  }
}

function parseExpression(expr: string): Node {
  const trimmed = expr.trim();
  if (trimmed === "") throw new Error("La expresión está vacía");
  const tokens = insertImplicitMultiplication(tokenize(trimmed));
  const state: ParserState = { tokens, pos: 0 };
  const node = parseTernary(state);
  if (state.pos !== tokens.length)
    throw new Error("Sobran símbolos al final de la expresión");
  return node;
}

export type AngleMode = "rad" | "deg";

const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;

type FuncImpl = Record<FuncName, (value: number) => number>;

/** sin/cos/tan/asin/acos/atan son las únicas funciones sensibles al modo de
 * ángulo — las hiperbólicas y el resto no tienen noción de grados/radianes. */
function buildFuncImpl(angleMode: AngleMode): FuncImpl {
  const toRad =
    angleMode === "deg" ? (v: number) => v * DEG_TO_RAD : (v: number) => v;
  const fromRad =
    angleMode === "deg" ? (v: number) => v * RAD_TO_DEG : (v: number) => v;
  return {
    sin: (v) => Math.sin(toRad(v)),
    cos: (v) => Math.cos(toRad(v)),
    tan: (v) => Math.tan(toRad(v)),
    asin: (v) => fromRad(Math.asin(v)),
    acos: (v) => fromRad(Math.acos(v)),
    atan: (v) => fromRad(Math.atan(v)),
    sinh: Math.sinh,
    cosh: Math.cosh,
    tanh: Math.tanh,
    sqrt: Math.sqrt,
    cbrt: Math.cbrt,
    abs: Math.abs,
    log: Math.log10,
    ln: Math.log,
    exp: Math.exp,
    floor: Math.floor,
    ceil: Math.ceil,
    round: Math.round,
    sign: Math.sign,
  };
}

const CONST_VALUES: Record<ConstName, number> = {
  pi: Math.PI,
  e: Math.E,
  phi: (1 + Math.sqrt(5)) / 2,
  tau: 2 * Math.PI,
  gamma: 0.5772156649015329,
};

function compareOp(op: CompareOp, left: number, right: number): boolean {
  switch (op) {
    case "<":
      return left < right;
    case ">":
      return left > right;
    case "<=":
      return left <= right;
    case ">=":
      return left >= right;
    case "==":
      return left === right;
    case "!=":
      return left !== right;
  }
}

function evaluateBinary(
  op: "+" | "-" | "*" | "/" | "^",
  left: number,
  right: number,
): number {
  switch (op) {
    case "+":
      return left + right;
    case "-":
      return left - right;
    case "*":
      return left * right;
    case "/":
      return left / right;
    case "^":
      return Math.pow(left, right);
  }
}

/** Nunca lanza: división por cero, raíces/logaritmos fuera de dominio, etc.
 * producen NaN/Infinity que el llamador filtra con Number.isFinite por muestra.
 * `compare` evalúa a 1/0 (verdadero/falso) y `ternario` decide su rama sin
 * evaluar la que no toma (evita, p. ej., sqrt de negativo en la rama descartada). */
function evaluateNode(node: Node, x: number, funcImpl: FuncImpl): number {
  switch (node.type) {
    case "num":
      return node.value;
    case "var":
      return x;
    case "const":
      return CONST_VALUES[node.name];
    case "unary":
      return node.op === "-"
        ? -evaluateNode(node.arg, x, funcImpl)
        : evaluateNode(node.arg, x, funcImpl);
    case "call":
      return funcImpl[node.name](evaluateNode(node.arg, x, funcImpl));
    case "binary":
      return evaluateBinary(
        node.op,
        evaluateNode(node.left, x, funcImpl),
        evaluateNode(node.right, x, funcImpl),
      );
    case "compare":
      return compareOp(
        node.op,
        evaluateNode(node.left, x, funcImpl),
        evaluateNode(node.right, x, funcImpl),
      )
        ? 1
        : 0;
    case "ternary":
      return evaluateNode(node.condition, x, funcImpl) !== 0
        ? evaluateNode(node.whenTrue, x, funcImpl)
        : evaluateNode(node.whenFalse, x, funcImpl);
  }
}

export type CompileResult =
  { ok: true; evaluate: (x: number) => number } | { ok: false; error: string };

export function compileFunction(
  expr: string,
  angleMode: AngleMode = "rad",
): CompileResult {
  try {
    const ast = parseExpression(expr);
    const funcImpl = buildFuncImpl(angleMode);
    return {
      ok: true,
      evaluate: (x: number) => evaluateNode(ast, x, funcImpl),
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Expresión inválida",
    };
  }
}

function precedence(node: Node): number {
  switch (node.type) {
    case "num":
    case "var":
    case "const":
    case "call":
    case "ternary": // "\begin{cases}" ya es autocontenido, nunca necesita paréntesis
      return 4;
    case "unary":
      return 3;
    case "binary":
      return node.op === "^" ? 4 : node.op === "*" || node.op === "/" ? 2 : 1;
    case "compare":
      return 0;
  }
}

function wrapLatex(node: Node, minPrecedence: number): string {
  return precedence(node) < minPrecedence
    ? `\\left(${toLatex(node)}\\right)`
    : toLatex(node);
}

/** Funciones cuya notación LaTeX es siempre "\macro\left(arg\right)" — el
 * resto (sqrt/cbrt/abs/exp/floor/ceil/round/sign) tiene una forma especial y
 * se resuelve aparte para mantener esta tabla simple. */
const SIMPLE_LATEX_MACROS: Partial<Record<FuncName, string>> = {
  sin: "\\sin",
  cos: "\\cos",
  tan: "\\tan",
  asin: "\\arcsin",
  acos: "\\arccos",
  atan: "\\arctan",
  sinh: "\\sinh",
  cosh: "\\cosh",
  tanh: "\\tanh",
  log: "\\log",
  ln: "\\ln",
};

function callToLatex(name: FuncName, arg: string): string {
  const macro = SIMPLE_LATEX_MACROS[name];
  if (macro !== undefined) return `${macro}\\left(${arg}\\right)`;
  switch (name) {
    case "sqrt":
      return `\\sqrt{${arg}}`;
    case "cbrt":
      return `\\sqrt[3]{${arg}}`;
    case "abs":
      return `\\left|${arg}\\right|`;
    case "exp":
      return `e^{${arg}}`;
    case "floor":
      return `\\left\\lfloor ${arg}\\right\\rfloor`;
    case "ceil":
      return `\\left\\lceil ${arg}\\right\\rceil`;
    case "round":
      return `\\operatorname{round}\\left(${arg}\\right)`;
    case "sign":
      return `\\operatorname{sgn}\\left(${arg}\\right)`;
    default:
      throw new Error(`Función sin representación LaTeX: ${name}`);
  }
}

function binaryToLatex(node: Extract<Node, { type: "binary" }>): string {
  const { op, left, right } = node;
  if (op === "/") return `\\frac{${toLatex(left)}}{${toLatex(right)}}`;
  if (op === "^") {
    const nestedPower = left.type === "binary" && left.op === "^";
    const base =
      precedence(left) < 4 || nestedPower
        ? `\\left(${toLatex(left)}\\right)`
        : toLatex(left);
    return `${base}^{${toLatex(right)}}`;
  }
  if (op === "+") return `${wrapLatex(left, 1)} + ${wrapLatex(right, 1)}`;
  if (op === "-") return `${wrapLatex(left, 1)} - ${wrapLatex(right, 2)}`;
  return `${wrapLatex(left, 2)} \\cdot ${wrapLatex(right, 2)}`;
}

const CONST_LATEX: Record<ConstName, string> = {
  pi: "\\pi",
  e: "e",
  phi: "\\varphi",
  tau: "\\tau",
  gamma: "\\gamma",
};

const COMPARE_LATEX: Record<CompareOp, string> = {
  "<": "<",
  ">": ">",
  "<=": "\\leq",
  ">=": "\\geq",
  "==": "=",
  "!=": "\\neq",
};

function compareToLatex(node: Extract<Node, { type: "compare" }>): string {
  return `${toLatex(node.left)} ${COMPARE_LATEX[node.op]} ${toLatex(node.right)}`;
}

/** Aplana una cadena de ternarios anidados (multi-caso, p. ej. la función
 * signo) en un único bloque "\begin{cases}" en vez de anidar uno por rama. */
function ternaryToLatex(node: Extract<Node, { type: "ternary" }>): string {
  const rows: string[] = [];
  let current: Node = node;
  while (current.type === "ternary") {
    rows.push(
      `${toLatex(current.whenTrue)} & \\text{si } ${toLatex(current.condition)}`,
    );
    current = current.whenFalse;
  }
  rows.push(`${toLatex(current)} & \\text{en otro caso}`);
  return `\\begin{cases} ${rows.join(" \\\\ ")} \\end{cases}`;
}

function toLatex(node: Node): string {
  switch (node.type) {
    case "num":
      return String(node.value);
    case "var":
      return node.name === "theta" ? "\\theta" : "x";
    case "const":
      return CONST_LATEX[node.name];
    case "unary":
      return `${node.op === "-" ? "-" : ""}${wrapLatex(node.arg, 3)}`;
    case "call":
      return callToLatex(node.name, toLatex(node.arg));
    case "binary":
      return binaryToLatex(node);
    case "compare":
      return compareToLatex(node);
    case "ternary":
      return ternaryToLatex(node);
  }
}

/** Vista previa en LaTeX de una expresión válida; `null` si no compila (el
 * llamador debe mostrar el error de `compileFunction` en ese caso). */
export function previewLatex(expr: string): string | null {
  try {
    return toLatex(parseExpression(expr));
  } catch {
    return null;
  }
}
