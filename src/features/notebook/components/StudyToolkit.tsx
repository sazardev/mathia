import { lazy, Suspense, useEffect, useState } from "react";
import { Spinner } from "@/components/ui/atoms/Spinner";
import { useActiveProfileId } from "../hooks/useActiveProfileId";
import { useToolCanvas } from "../hooks/useToolCanvas";
import {
  downloadBlob,
  exportScreenAsImage,
  notebookExportFilename,
} from "../lib/export-image";
import { INK_COLORS } from "../lib/palette";
import type { ShapeKind, Tool } from "../types";
import { Calculator } from "./Calculator";
import { NotebookPanel } from "./NotebookPanel";
import { StudyToolkitFab } from "./StudyToolkitFab";
import styles from "./StudyToolkit.module.css";
import { ToolCanvas } from "./ToolCanvas";
import { Toolbar } from "./Toolbar";

const FunctionGrapher = lazy(() =>
  import("./FunctionGrapher").then((m) => ({ default: m.FunctionGrapher })),
);

const WIDTH_RANGES: Record<Tool, { min: number; max: number }> = {
  pen: { min: 1, max: 40 },
  shape: { min: 1, max: 40 },
  highlighter: { min: 6, max: 60 },
  eraser: { min: 4, max: 80 },
};

export function StudyToolkit() {
  const [open, setOpen] = useState(false);
  const [tool, setTool] = useState<Tool>("pen");
  const [shapeKind, setShapeKind] = useState<ShapeKind>("arrow");
  const [color, setColor] = useState<string>(
    INK_COLORS[0] ?? "var(--color-text-primary)",
  );
  const [penWidth, setPenWidth] = useState(3);
  const [highlighterWidth, setHighlighterWidth] = useState(18);
  const [eraserWidth, setEraserWidth] = useState(24);
  const [notebookOpen, setNotebookOpen] = useState(false);
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [graphOpen, setGraphOpen] = useState(false);
  const [exporting, setExporting] = useState(false);

  const profileId = useActiveProfileId();

  const [activeWidth, setActiveWidth] =
    tool === "highlighter"
      ? [highlighterWidth, setHighlighterWidth]
      : tool === "eraser"
        ? [eraserWidth, setEraserWidth]
        : [penWidth, setPenWidth];

  const canvas = useToolCanvas({
    active: open,
    tool,
    shapeKind,
    color,
    width: activeWidth,
  });

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function handleExport(): Promise<void> {
    const canvasEl = canvas.canvasRef.current;
    if (canvasEl === null || exporting) return;
    setExporting(true);
    try {
      const blob = await exportScreenAsImage(canvasEl);
      downloadBlob(blob, notebookExportFilename());
    } catch {
      // Best-effort: si la captura falla (webview sin soporte), no bloquea el resto del kit.
    } finally {
      setExporting(false);
    }
  }

  if (!open) return <StudyToolkitFab onOpen={() => setOpen(true)} />;

  return (
    <div className={styles["overlay"]} aria-label="Kit de estudio flotante">
      <ToolCanvas
        paper={notebookOpen}
        canvasRef={canvas.canvasRef}
        onPointerDown={canvas.onPointerDown}
        onPointerMove={canvas.onPointerMove}
        onPointerUp={canvas.onPointerUp}
      />

      <Toolbar
        tool={tool}
        onToolChange={setTool}
        shapeKind={shapeKind}
        onShapeKindChange={setShapeKind}
        color={color}
        onColorChange={setColor}
        activeWidth={activeWidth}
        widthRange={WIDTH_RANGES[tool]}
        onWidthChange={setActiveWidth}
        onUndo={canvas.undo}
        onClear={canvas.clear}
        notebookOpen={notebookOpen}
        onToggleNotebook={() => setNotebookOpen((v) => !v)}
        calculatorOpen={calculatorOpen}
        onToggleCalculator={() => setCalculatorOpen((v) => !v)}
        graphOpen={graphOpen}
        onToggleGraph={() => setGraphOpen((v) => !v)}
        onExport={() => void handleExport()}
        exporting={exporting}
        onClose={() => setOpen(false)}
      />

      {calculatorOpen && (
        <Calculator onClose={() => setCalculatorOpen(false)} />
      )}

      {notebookOpen && (
        <NotebookPanel
          onClose={() => setNotebookOpen(false)}
          profileId={profileId}
          getCurrentStrokes={() => canvas.strokesRef.current}
          onLoadStrokes={canvas.loadStrokes}
        />
      )}

      {graphOpen && (
        <Suspense
          fallback={
            <div className={styles["loadingPanel"]} data-toolkit-chrome="true">
              <Spinner size={24} />
            </div>
          }
        >
          <FunctionGrapher onClose={() => setGraphOpen(false)} />
        </Suspense>
      )}
    </div>
  );
}
