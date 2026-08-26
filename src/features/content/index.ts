/**
 * API pública de la feature `content`. Lo único importable desde otras features.
 * Contrato de dominio: schema.ts (única fuente de tipos).
 * Validación runtime en frontera: types.ts (schemas zod + parsers).
 * Contenido embebido: data/.
 */
import type { Concept } from "@/features/content/schema";
import { CONCEPTS } from "@/features/content/data/concepts";
import { UNIT1 } from "@/features/content/data/unit1";
import { UNIT2 } from "@/features/content/data/unit2";
import { UNIT3 } from "@/features/content/data/unit3";

export * from "@/features/content/schema";
export * from "@/features/content/types";

export const CURRICULUM = [UNIT1, UNIT2, UNIT3];

export const ALL_CONCEPTS: Concept[] = Object.values(CONCEPTS);
