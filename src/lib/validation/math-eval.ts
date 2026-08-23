type Token =
  | { kind: "num"; value: number }
  | { kind: "op"; value: string }
  | { kind: "lparen" }
  | { kind: "rparen" };

const TOKEN_AT_POS = /^(\d+\.\d+|\d+|[-+*/^()])/;

function skipSpaces(input: string, pos: number): number {
  return pos + (input.slice(pos).length - input.slice(pos).trimStart().length);
}

function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let pos = skipSpaces(input, 0);
  // Contexto decide si un +/- es unario: inicio de expresión, tras "(" o tras otro operador.
  let context: "start" | "operand" | "op" | "lparen" = "start";
  while (pos < input.length) {
    const match = TOKEN_AT_POS.exec(input.slice(pos));
    const raw = match?.[1];
    if (raw === undefined) {
      throw new Error(`Símbolo inválido en derivación cerca de: "${input.slice(pos, pos + 12)}"`);
    }
    if (/^\d/.test(raw)) {
      tokens.push({ kind: "num", value: Number(raw) });
      context = "operand";
    } else if (raw === "(") {
      tokens.push({ kind: "lparen" });
      context = "lparen";
    } else if (raw === ")") {
      tokens.push({ kind: "rparen" });
      context = "operand";
    } else {
      const isUnary = (raw === "-" || raw === "+") && context !== "operand";
      tokens.push({ kind: "op", value: isUnary ? `u${raw}` : raw });
      context = "op";
    }
    pos = skipSpaces(input, pos + raw.length);
  }
  return tokens;
}

const PRECEDENCE: Record<string, number> = { "u-": 4, "u+": 4, "^": 3, "*": 2, "/": 2, "+": 1, "-": 1 };
const RIGHT_ASSOC = new Set(["^", "u-", "u+"]);

function applyOperator(op: string, values: number[]): void {
  if (op === "u-" || op === "u+") {
    const operand = values.pop();
    if (operand === undefined) throw new Error("Operando faltante");
    values.push(op === "u-" ? -operand : operand);
    return;
  }
  const b = values.pop();
  const a = values.pop();
  if (a === undefined || b === undefined) throw new Error("Operandos faltantes");
  switch (op) {
    case "+":
      values.push(a + b);
      break;
    case "-":
      values.push(a - b);
      break;
    case "*":
      values.push(a * b);
      break;
    case "/":
      if (b === 0) throw new Error("División por cero");
      values.push(a / b);
      break;
    case "^":
      values.push(Math.pow(a, b));
      break;
    default:
      throw new Error(`Operador desconocido: ${op}`);
  }
}

/** Evalúa aritmética pura (+ - * / ^ paréntesis, signo unario) sin usar eval(). Lanza Error si es inválida. */
export function evaluateArithmetic(expression: string): number {
  if (expression.trim() === "") throw new Error("Derivación vacía");
  const tokens = tokenize(expression);
  const output: Token[] = [];
  const operators: string[] = [];
  let openParens = 0;

  for (const token of tokens) {
    if (token.kind === "num") {
      output.push(token);
    } else if (token.kind === "lparen") {
      openParens += 1;
      operators.push("(");
    } else if (token.kind === "rparen") {
      openParens -= 1;
      if (openParens < 0) throw new Error("Paréntesis desbalanceados");
      popUntilOpen(operators, output);
    } else {
      while (shouldPopTop(operators, token.value)) {
        const popped = operators.pop();
        if (popped !== undefined && popped !== "(") output.push({ kind: "op", value: popped });
      }
      operators.push(token.value);
    }
  }

  if (openParens !== 0) throw new Error("Paréntesis desbalanceados");
  while (operators.length > 0) {
    const top = operators.pop();
    if (top === undefined) break;
    if (top === "(") throw new Error("Paréntesis desbalanceados");
    output.push({ kind: "op", value: top });
  }

  const values: number[] = [];
  for (const token of output) {
    if (token.kind === "num") values.push(token.value);
    else if (token.kind === "op") applyOperator(token.value, values);
    else throw new Error("Paréntesis desbalanceados");
  }
  const result = values[0];
  if (values.length !== 1 || result === undefined || !Number.isFinite(result)) {
    throw new Error("Expresión malformada o resultado no finito");
  }
  return result;
}

function shouldPopTop(operators: string[], current: string): boolean {
  const top = operators[operators.length - 1];
  if (top === undefined || top === "(") return false;
  const topPrec = PRECEDENCE[top] ?? 0;
  const curPrec = PRECEDENCE[current] ?? 0;
  return topPrec > curPrec || (topPrec === curPrec && !RIGHT_ASSOC.has(current));
}

function popUntilOpen(operators: string[], output: Token[]): void {
  while (operators.length > 0) {
    const top = operators.pop();
    if (top === undefined || top === "(") return;
    output.push({ kind: "op", value: top });
  }
  throw new Error("Paréntesis desbalanceados");
}
