import { MathiaError } from "./errors";

export const DEEP_LINK_SCHEME = "mathia";

export type DeepLink = {
  path: string;
  search: Record<string, string>;
};

export function parseDeepLink(rawUrl: string): DeepLink | MathiaError {
  const candidate = rawUrl.trim();

  if (candidate === "") {
    return new MathiaError("INVALID_DEEP_LINK", "Deep link vacío");
  }

  if (candidate.startsWith("/")) {
    return parseInternalPath(candidate);
  }

  if (!candidate.startsWith(`${DEEP_LINK_SCHEME}:`)) {
    return new MathiaError(
      "INVALID_DEEP_LINK",
      `Esquema no soportado: se esperaba "${DEEP_LINK_SCHEME}://" o una ruta interna`,
    );
  }

  try {
    const url = new URL(candidate);
    return parseInternalPath(`/${url.hostname}/${url.pathname}${url.search}`);
  } catch {
    return new MathiaError("INVALID_DEEP_LINK", `URL malformada: "${rawUrl}"`);
  }
}

export function buildDeepLink(
  path: string,
  search?: Record<string, string>,
): string | MathiaError {
  const trimmed = path.trim();

  if (!trimmed.startsWith("/")) {
    return new MathiaError(
      "INVALID_DEEP_LINK",
      `Ruta interna inválida para deep link: "${path}"`,
    );
  }

  const base = `${DEEP_LINK_SCHEME}://${trimmed.slice(1)}`;
  const queryString = new URLSearchParams(search).toString();

  return queryString === "" ? base : `${base}?${queryString}`;
}

function parseInternalPath(url: string): DeepLink | MathiaError {
  const queryIndex = url.indexOf("?");
  const pathPart = queryIndex === -1 ? url : url.slice(0, queryIndex);
  const searchPart = queryIndex === -1 ? "" : url.slice(queryIndex + 1);
  const path = normalizePath(pathPart);

  const search: Record<string, string> = {};
  for (const [key, value] of new URLSearchParams(searchPart)) {
    search[key] = value;
  }

  return { path, search };
}

function normalizePath(pathPart: string): string {
  let normalized = `/${pathPart}`.replace(/\/{2,}/g, "/");

  if (normalized.length > 1 && normalized.endsWith("/")) {
    normalized = normalized.slice(0, -1);
  }

  return normalized;
}
