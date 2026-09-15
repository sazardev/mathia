/** data-attribute que marca el chrome del kit (toolbar, calculadora, panel, FAB) para excluirlo de la captura. */
export const EXPORT_EXCLUDE_ATTR = "data-toolkit-chrome";

function excludeToolkitChrome(node: HTMLElement): boolean {
  return !node.hasAttribute?.(EXPORT_EXCLUDE_ATTR);
}

/**
 * Exporta "lo que se ve en pantalla" (contenido real + tinta dibujada encima) como PNG.
 * html-to-image rasteriza el DOM en vivo; el canvas de tinta se compone aparte para
 * garantizar que sus trazos salgan sin depender del soporte de <canvas> de la librería.
 */
export async function exportScreenAsImage(
  inkCanvas: HTMLCanvasElement,
): Promise<Blob> {
  const { toCanvas } = await import("html-to-image");
  const backgroundCanvas = await toCanvas(document.body, {
    filter: excludeToolkitChrome,
    skipFonts: false,
  });

  const output = document.createElement("canvas");
  output.width = backgroundCanvas.width;
  output.height = backgroundCanvas.height;
  const ctx = output.getContext("2d");
  if (ctx === null)
    throw new Error("No se pudo preparar el lienzo de exportación");

  ctx.drawImage(backgroundCanvas, 0, 0);
  const scaleX = backgroundCanvas.width / inkCanvas.clientWidth;
  const scaleY = backgroundCanvas.height / inkCanvas.clientHeight;
  ctx.drawImage(
    inkCanvas,
    0,
    0,
    inkCanvas.clientWidth * scaleX,
    inkCanvas.clientHeight * scaleY,
  );

  return new Promise<Blob>((resolve, reject) => {
    output.toBlob((blob) => {
      if (blob === null) reject(new Error("No se pudo generar la imagen"));
      else resolve(blob);
    }, "image/png");
  });
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function notebookExportFilename(): string {
  const now = new Date();
  const stamp = now.toISOString().slice(0, 16).replace(/[:T]/g, "-");
  return `apuntes-mathia-${stamp}.png`;
}
