#!/usr/bin/env node
/**
 * Sourcing tool para el Common Standards Project (commonstandardsproject.com, CC BY 3.0 US,
 * atribución a Desire2Learn). Ver scripts/content-ingest/README.md para el flujo completo.
 *
 * A diferencia de MathQA, esta API exige una API key propia (sign up gratuito en
 * commonstandardsproject.com) y un standard-set id que solo se obtiene buscando en su UI
 * ("Common Core Math" -> dominio de álgebra que te interese). Ninguno de los dos se pudo
 * verificar en el entorno donde se escribió este script, así que este tool no asume un shape
 * de respuesta fijo: vuelca el JSON crudo y genera un resumen legible recorriendo la estructura
 * de forma genérica (arrays de nodos con alguna de las claves conocidas de CASE/CSP:
 * description/statement/asnIdentifier/children/standards).
 *
 * Uso:
 *   CSP_API_KEY=... CSP_STANDARD_SET_URL="https://api.commonstandardsproject.com/api/v1/standard_sets/<ID>" \
 *     node ccss.mjs
 */
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const CACHE_DIR = fileURLToPath(new URL("../.cache/", import.meta.url));
const SEED_DIR = fileURLToPath(new URL("../seed/", import.meta.url));

const apiKey = process.env.CSP_API_KEY;
const standardSetUrl = process.env.CSP_STANDARD_SET_URL;

if (!apiKey || !standardSetUrl) {
  console.error(
    "Faltan CSP_API_KEY y/o CSP_STANDARD_SET_URL.\n" +
      "1. Regístrate gratis en https://commonstandardsproject.com para obtener una API key.\n" +
      "2. Busca el standard set de álgebra que te interese (ej. 'Common Core Math HSA') y copia la URL/id que te da su buscador.\n" +
      "3. Vuelve a correr: CSP_API_KEY=xxx CSP_STANDARD_SET_URL=https://... node ccss.mjs",
  );
  process.exit(1);
}

const TEXT_KEYS = [
  "description",
  "statement",
  "statementNotation",
  "title",
  "name",
];
const CHILDREN_KEYS = ["children", "standards", "items", "results"];

function summarizeNode(node, depth, lines) {
  if (Array.isArray(node)) {
    for (const child of node) summarizeNode(child, depth, lines);
    return;
  }
  if (typeof node !== "object" || node === null) return;

  const textKey = TEXT_KEYS.find(
    (key) => typeof node[key] === "string" && node[key].trim(),
  );
  if (textKey) {
    lines.push(`${"  ".repeat(depth)}- ${node[textKey].trim()}`);
  }

  const childrenKey = CHILDREN_KEYS.find((key) => Array.isArray(node[key]));
  if (childrenKey) {
    summarizeNode(node[childrenKey], textKey ? depth + 1 : depth, lines);
  }
}

async function run() {
  let res;
  try {
    res = await fetch(standardSetUrl, {
      headers: { Authorization: `Bearer ${apiKey}`, "Api-Key": apiKey },
    });
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(
      `No se pudo conectar a ${standardSetUrl} (${detail}). Verifica la URL y que esta red tenga salida a commonstandardsproject.com.`,
      { cause: error },
    );
  }
  if (!res.ok) {
    throw new Error(
      `CSP API respondió ${res.status}: ${await res.text()}\n` +
        "Revisa que CSP_STANDARD_SET_URL y CSP_API_KEY sean correctos (la forma exacta de auth no se pudo verificar sin cuenta; si esto falla con 401, prueba pasando la key como query param en vez de header, según lo que indique tu dashboard de CSP).",
    );
  }
  const data = await res.json();

  await mkdir(CACHE_DIR, { recursive: true });
  await writeFile(`${CACHE_DIR}ccss-raw.json`, JSON.stringify(data, null, 2));

  const lines = [
    "# Progresión de habilidades de álgebra (Common Core / Common Standards Project)",
    "",
    "Fuente: Common Standards Project (commonstandardsproject.com), licencia CC BY 3.0 US, atribución a Desire2Learn.",
    "Este archivo es referencia de diseño para ordenar unidades/lecciones — no se consume desde la app.",
    "",
  ];
  summarizeNode(data, 0, lines);

  if (lines.length <= 5) {
    console.error(
      "El resumidor genérico no encontró nodos con las claves esperadas (description/children/...). " +
        "Revisa scripts/content-ingest/.cache/ccss-raw.json a mano y ajusta TEXT_KEYS/CHILDREN_KEYS en este script.",
    );
  }

  await mkdir(SEED_DIR, { recursive: true });
  await writeFile(
    `${SEED_DIR}ccss-algebra-progression.md`,
    lines.join("\n") + "\n",
  );
  console.log(
    "Escrito scripts/content-ingest/seed/ccss-algebra-progression.md",
  );
}

await run();
