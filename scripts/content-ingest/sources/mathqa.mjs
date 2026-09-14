#!/usr/bin/env node
/**
 * Sourcing tool para MathQA (allenai/math_qa, licencia Apache-2.0).
 * Ver scripts/content-ingest/README.md para el flujo completo.
 *
 * Modos:
 *   node mathqa.mjs inspect   -> descarga una muestra pequeña y describe el shape real
 *                                (nombres de campo, categorías vistas). Correr esto PRIMERO:
 *                                la forma exacta de las filas no se pudo verificar en el entorno
 *                                donde se escribió este script (huggingface.co no era alcanzable).
 *   node mathqa.mjs run       -> descarga en volumen, filtra, verifica y escribe seed/mathqa-algebra.json
 */
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const DATASET = "allenai/math_qa";
const API_BASE = "https://datasets-server.huggingface.co/rows";
const PAGE_SIZE = 100;
const MAX_ROWS = Number(process.env.MATHQA_MAX_ROWS ?? 2000);
const MAX_SEED_SIZE = Number(process.env.MATHQA_SEED_SIZE ?? 60);
// Heurística inicial: en el paper de MathQA (Amini et al. 2019) la categoría "general" agrupa
// los problemas verbales de aritmética/álgebra escolar (edades, razones, precios), a diferencia
// de "geometry"/"physics"/"probability". Ajustar con MATHQA_CATEGORY si `inspect` muestra otra cosa.
const TARGET_CATEGORY = process.env.MATHQA_CATEGORY ?? "general";

const CACHE_DIR = fileURLToPath(new URL("../.cache/", import.meta.url));
const SEED_DIR = fileURLToPath(new URL("../seed/", import.meta.url));

async function fetchPage(offset) {
  const url = `${API_BASE}?dataset=${encodeURIComponent(DATASET)}&config=default&split=train&offset=${offset}&length=${PAGE_SIZE}`;
  let res;
  try {
    res = await fetch(url);
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(
      `No se pudo conectar a datasets-server.huggingface.co (${detail}). Verifica que esta red tenga salida a huggingface.co.`,
      { cause: error },
    );
  }
  if (!res.ok) {
    throw new Error(
      `HF datasets-server respondió ${res.status} en offset ${offset}: ${await res.text()}`,
    );
  }
  const body = await res.json();
  return (body.rows ?? []).map((entry) => entry.row);
}

async function fetchRows(maxRows) {
  const rows = [];
  for (let offset = 0; offset < maxRows; offset += PAGE_SIZE) {
    const page = await fetchPage(offset);
    if (page.length === 0) break;
    rows.push(...page);
    process.stderr.write(`descargadas ${rows.length} filas...\n`);
  }
  return rows;
}

function findFieldName(row, pattern) {
  return Object.keys(row).find((key) => pattern.test(key));
}

async function runInspect() {
  const rows = await fetchRows(PAGE_SIZE);
  if (rows.length === 0) {
    throw new Error(
      "La API no devolvió filas: revisa MATHQA_MAX_ROWS o el nombre del dataset",
    );
  }
  const [sample] = rows;
  const categoryField = findFieldName(sample, /categor/i);
  const formulaField = findFieldName(sample, /formula/i);
  const correctField = findFieldName(sample, /correct/i);
  const optionsField = findFieldName(sample, /option/i);

  console.log("Campos de una fila:", Object.keys(sample));
  console.log("Ejemplo completo:", JSON.stringify(sample, null, 2));
  console.log({ categoryField, formulaField, correctField, optionsField });

  if (categoryField) {
    const categories = new Set(rows.map((row) => row[categoryField]));
    console.log(`Categorías vistas en ${rows.length} filas:`, [...categories]);
  } else {
    console.log(
      "ADVERTENCIA: no se encontró un campo que parezca 'category'. Ajusta findFieldName o filtra por otra señal (ver README).",
    );
  }
}

/**
 * Intérprete del "linear_formula"/"annotated_formula" de MathQA: pasos "op(arg,arg)"
 * separados por "|". Args: "nN" = N-ésimo número extraído del enunciado en orden de aparición,
 * "const_X" = literal (con "_" en vez de "."), "#K" = resultado del paso K (0-indexed).
 */
const OPS = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
  divide: (a, b) => a / b,
  power: (a, b) => a ** b,
  sqrt: (a) => Math.sqrt(a),
  max: (a, b) => Math.max(a, b),
  min: (a, b) => Math.min(a, b),
  floor: (a) => Math.floor(a),
  inverse: (a) => 1 / a,
  gcd: (a, b) => {
    let [x, y] = [Math.abs(a), Math.abs(b)];
    while (y !== 0) [x, y] = [y, x % y];
    return x;
  },
};

function extractNumbers(problemText) {
  const matches = problemText.match(/\d+(\.\d+)?/g) ?? [];
  return matches.map(Number);
}

function resolveArg(token, numbers, results) {
  if (token.startsWith("#")) {
    const value = results[Number(token.slice(1))];
    if (value === undefined)
      throw new Error(`Referencia no resuelta: ${token}`);
    return value;
  }
  if (token.startsWith("const_")) {
    return Number(token.slice("const_".length).replace("_", "."));
  }
  if (token.startsWith("n")) {
    const value = numbers[Number(token.slice(1))];
    if (value === undefined)
      throw new Error(`Número inexistente en el problema: ${token}`);
    return value;
  }
  throw new Error(`Token de argumento no reconocido: "${token}"`);
}

export function evaluateLinearFormula(formula, numbers) {
  const results = [];
  for (const rawStep of formula.split("|").filter(Boolean)) {
    const match = /^(\w+)\(([^)]*)\)$/.exec(rawStep.trim());
    if (!match) throw new Error(`Paso con formato inválido: "${rawStep}"`);
    const [, opName, argsRaw] = match;
    const op = OPS[opName];
    if (!op) throw new Error(`Operación no soportada: "${opName}"`);
    const args = argsRaw
      .split(",")
      .map((token) => resolveArg(token.trim(), numbers, results));
    results.push(op(...args));
  }
  if (results.length === 0) throw new Error("Fórmula vacía");
  return results.at(-1);
}

function parseOptions(optionsText) {
  const pairs = new Map();
  for (const part of optionsText.split(",")) {
    const match = /^\s*([a-z])\s*\)\s*(.+?)\s*$/i.exec(part);
    if (match) pairs.set(match[1].toLowerCase(), match[2]);
  }
  return pairs;
}

function toVerifiedSeed(row, fields) {
  const problem = row.Problem ?? row.problem;
  const formula = row[fields.formulaField];
  const correctLetter = String(row[fields.correctField] ?? "").toLowerCase();
  const optionsText = row[fields.optionsField];
  if (!problem || !formula || !correctLetter || !optionsText) return null;

  const numbers = extractNumbers(problem);
  const options = parseOptions(optionsText);
  const declaredAnswerText = options.get(correctLetter);
  const declaredAnswer = declaredAnswerText
    ? Number.parseFloat(declaredAnswerText)
    : NaN;
  if (!Number.isFinite(declaredAnswer)) return null;

  let computed;
  try {
    computed = evaluateLinearFormula(formula, numbers);
  } catch {
    return null;
  }
  if (!Number.isFinite(computed) || Math.abs(computed - declaredAnswer) > 1e-6)
    return null;

  return {
    sourceId: row.id ?? `mathqa-${numbers.join("-")}-${formula.slice(0, 16)}`,
    prompt: problem,
    verifiedAnswer: computed,
    operationProgram: formula,
    license: "Apache-2.0",
    sourceUrl: "https://math-qa.github.io/math-QA/",
  };
}

async function runIngest() {
  const rows = await fetchRows(MAX_ROWS);
  const sample = rows[0];
  const fields = {
    categoryField: findFieldName(sample, /categor/i),
    formulaField: findFieldName(sample, /formula/i),
    correctField: findFieldName(sample, /correct/i),
    optionsField: findFieldName(sample, /option/i),
  };
  if (!fields.formulaField || !fields.correctField || !fields.optionsField) {
    throw new Error(
      `No se reconocieron los campos esperados (${JSON.stringify(fields)}). Corre "inspect" primero y ajusta el script.`,
    );
  }

  const filtered = fields.categoryField
    ? rows.filter((row) => row[fields.categoryField] === TARGET_CATEGORY)
    : rows;

  const seeds = [];
  for (const row of filtered) {
    const seed = toVerifiedSeed(row, fields);
    if (seed) seeds.push(seed);
    if (seeds.length >= MAX_SEED_SIZE) break;
  }

  if (seeds.length === 0) {
    throw new Error(
      "Ninguna fila sobrevivió al filtro + verificación. Revisa TARGET_CATEGORY y el parseo de opciones con 'inspect'.",
    );
  }

  await mkdir(CACHE_DIR, { recursive: true });
  await writeFile(
    `${CACHE_DIR}mathqa-raw-sample.json`,
    JSON.stringify(rows.slice(0, 20), null, 2),
  );
  await mkdir(SEED_DIR, { recursive: true });
  await writeFile(
    `${SEED_DIR}mathqa-algebra.json`,
    JSON.stringify(seeds, null, 2),
  );

  console.log(
    `${seeds.length} problemas verificados escritos en scripts/content-ingest/seed/mathqa-algebra.json (de ${filtered.length} candidatos en categoría "${TARGET_CATEGORY}")`,
  );
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const mode = process.argv[2];
  if (mode === "inspect") {
    await runInspect();
  } else if (mode === "run") {
    await runIngest();
  } else {
    console.error("Uso: node mathqa.mjs <inspect|run>");
    process.exit(1);
  }
}
