import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { IconButton } from "@/components/ui/atoms/IconButton";
import { cn } from "@/lib/cn";
import styles from "./Scratchpad.module.css";

/* oxlint-disable react/exhaustive-effect-dependencies */

type Tool = "pen" | "eraser";
type Mode = "draw" | "notebook";

type Point = { x: number; y: number };

type Stroke = {
  tool: Tool;
  color: string;
  width: number;
  points: Point[];
};

const INK_COLORS = [
  "var(--color-text-primary)",
  "var(--color-primary-600)",
  "var(--color-danger-500)",
  "var(--color-xp-500)",
  "var(--color-warning-500)",
];

function resolveInk(value: string): string {
  const match = /^var\((--[\w-]+)\)$/.exec(value);
  if (match === null) return value;
  const name = match[1] ?? "";
  const computed = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return computed === "" ? value : computed;
}

function drawStroke(ctx: CanvasRenderingContext2D, stroke: Stroke) {
  if (stroke.points.length === 0) return;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  if (stroke.tool === "eraser") {
    ctx.globalCompositeOperation = "destination-out";
    ctx.strokeStyle = "rgba(0,0,0,1)";
  } else {
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = resolveInk(stroke.color);
  }
  ctx.lineWidth = stroke.width;
  ctx.beginPath();
  const first = stroke.points[0];
  if (first === undefined) return;
  ctx.moveTo(first.x, first.y);
  for (let i = 1; i < stroke.points.length; i++) {
    const p = stroke.points[i];
    if (p !== undefined) ctx.lineTo(p.x, p.y);
  }
  if (stroke.points.length === 1) {
    ctx.lineTo(first.x + 0.1, first.y + 0.1);
  }
  ctx.stroke();
}

export function Scratchpad() {
  const [open, setOpen] = useState(false);
  const [tool, setTool] = useState<Tool>("pen");
  const [mode, setMode] = useState<Mode>("draw");
  const [color, setColor] = useState<string>(
    INK_COLORS[0] ?? "var(--color-text-primary)",
  );
  const [width, setWidth] = useState<number>(3);
  const [eraserWidth, setEraserWidth] = useState<number>(24);
  const [sizeOpen, setSizeOpen] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const strokesRef = useRef<Stroke[]>([]);
  const drawingRef = useRef(false);
  const currentRef = useRef<Stroke | null>(null);
  const sizeRef = useRef({ w: 0, h: 0 });

  function redraw() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (
      canvas === null ||
      ctx === null ||
      canvas === undefined ||
      ctx === undefined
    )
      return;
    ctx.clearRect(0, 0, sizeRef.current.w, sizeRef.current.h);
    for (const stroke of strokesRef.current) drawStroke(ctx, stroke);
  }

  function setupCanvas() {
    const canvas = canvasRef.current;
    if (canvas === null || canvas === undefined) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.round(rect.width * dpr));
    canvas.height = Math.max(1, Math.round(rect.height * dpr));
    const ctx = canvas.getContext("2d");
    if (ctx === null || ctx === undefined) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    sizeRef.current = { w: rect.width, h: rect.height };
    redraw();
  }

  function pointerPos(e: ReactPointerEvent<HTMLCanvasElement>): Point {
    const canvas = canvasRef.current;
    if (canvas === null || canvas === undefined) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  useEffect(() => {
    if (!open) return;
    setupCanvas();
    const canvas = canvasRef.current;
    if (canvas === null || canvas === undefined) return;
    const observer = new ResizeObserver(() => setupCanvas());
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function onPointerDown(e: ReactPointerEvent<HTMLCanvasElement>) {
    if (canvasRef.current === null || canvasRef.current === undefined) return;
    drawingRef.current = true;
    canvasRef.current.setPointerCapture(e.pointerId);
    const stroke: Stroke = {
      tool,
      color,
      width: tool === "eraser" ? eraserWidth : width,
      points: [pointerPos(e)],
    };
    currentRef.current = stroke;
    strokesRef.current.push(stroke);
    redraw();
  }

  function onPointerMove(e: ReactPointerEvent<HTMLCanvasElement>) {
    if (!drawingRef.current) return;
    const stroke = currentRef.current;
    if (stroke === null || stroke === undefined) return;
    stroke.points.push(pointerPos(e));
    redraw();
  }

  function onPointerUp(e: ReactPointerEvent<HTMLCanvasElement>) {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    canvasRef.current?.releasePointerCapture(e.pointerId);
    currentRef.current = null;
  }

  function undo() {
    strokesRef.current.pop();
    redraw();
  }

  function clear() {
    strokesRef.current = [];
    redraw();
  }

  if (!open) {
    return (
      <IconButton
        icon="pencil"
        label="Abrir pizarra"
        variant="primary"
        size="lg"
        className={styles["fab"]}
        onPress={() => setOpen(true)}
      />
    );
  }

  return (
    <div className={styles["overlay"]} aria-label="Pizarra de dibujo">
      {mode === "notebook" && (
        <div className={styles["paper"]} aria-hidden="true" />
      )}
      <canvas
        ref={canvasRef}
        className={styles["canvas"]}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        aria-label="Lienzo: dibuja o escribe encima del ejercicio"
      />

      <div
        className={styles["toolbar"]}
        role="toolbar"
        aria-label="Herramientas de la pizarra"
      >
        <IconButton
          icon="x"
          label="Cerrar pizarra"
          variant="ghost"
          onPress={() => setOpen(false)}
        />

        <div className={styles["group"]}>
          <IconButton
            icon="pencil"
            label="Lápiz"
            variant={tool === "pen" ? "primary" : "ghost"}
            onPress={() => setTool("pen")}
          />
          <IconButton
            icon="eraser"
            label="Borrador"
            variant={tool === "eraser" ? "primary" : "ghost"}
            onPress={() => setTool("eraser")}
          />
          <IconButton
            icon="notebook"
            label={mode === "notebook" ? "Modo cuaderno" : "Modo dibujo"}
            variant={mode === "notebook" ? "primary" : "ghost"}
            onPress={() =>
              setMode((m) => (m === "notebook" ? "draw" : "notebook"))
            }
          />
          <IconButton
            icon="undo"
            label="Deshacer trazo"
            variant="ghost"
            onPress={undo}
          />
          <IconButton
            icon="trash"
            label="Limpiar todo"
            variant="ghost"
            onPress={clear}
          />
        </div>

        <div className={styles["group"]}>
          {INK_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              className={cn(
                styles["swatch"],
                color === c && tool === "pen" && styles["swatchActive"],
              )}
              style={{ background: c }}
              aria-label={`Color ${c}`}
              aria-pressed={color === c && tool === "pen"}
              onClick={() => {
                setColor(c);
                setTool("pen");
              }}
            />
          ))}
        </div>

        <div className={styles["group"]}>
          <button
            type="button"
            className={cn(
              styles["sizeToggle"],
              sizeOpen && styles["sizeToggleActive"],
            )}
            aria-expanded={sizeOpen}
            aria-controls="sp-size-panel"
            onClick={() => setSizeOpen((prev) => !prev)}
          >
            Grosor {tool === "eraser" ? eraserWidth : width}
          </button>
          {sizeOpen && (
            <div id="sp-size-panel" className={styles["sizePanel"]}>
              <label className={styles["sliderLabel"]}>
                <span>{tool === "eraser" ? "Borrador" : "Lápiz"}</span>
                <input
                  type="range"
                  min={tool === "eraser" ? 4 : 1}
                  max={tool === "eraser" ? 80 : 40}
                  value={tool === "eraser" ? eraserWidth : width}
                  aria-label={`Grosor del ${tool === "eraser" ? "borrador" : "lápiz"}`}
                  onChange={(e) =>
                    tool === "eraser"
                      ? setEraserWidth(Number(e.target.value))
                      : setWidth(Number(e.target.value))
                  }
                />
                <span className={styles["sliderValue"]}>
                  {tool === "eraser" ? eraserWidth : width}
                </span>
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
