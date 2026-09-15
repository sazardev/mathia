import { useCallback, useEffect, useRef } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { drawStroke, redrawAll, setupCanvasSize } from "../lib/canvas-drawing";
import type { Point, ShapeKind, Stroke, Tool } from "../types";

interface UseToolCanvasArgs {
  active: boolean;
  tool: Tool;
  shapeKind: ShapeKind;
  color: string;
  /** Grosor ya resuelto para la herramienta activa (el llamador decide pen/marcador/goma). */
  width: number;
}

export function useToolCanvas({
  active,
  tool,
  shapeKind,
  color,
  width,
}: UseToolCanvasArgs) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const strokesRef = useRef<Stroke[]>([]);
  const sizeRef = useRef({ width: 0, height: 0 });
  const drawingRef = useRef(false);
  const currentRef = useRef<Stroke | null>(null);
  const shapeStartRef = useRef<Point | null>(null);

  const redraw = useCallback((preview?: Stroke) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d") ?? null;
    if (canvas === null || ctx === null) return;
    redrawAll(
      ctx,
      sizeRef.current.width,
      sizeRef.current.height,
      strokesRef.current,
    );
    if (preview !== undefined) drawStroke(ctx, preview);
  }, []);

  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas === null) return;
    sizeRef.current = setupCanvasSize(canvas);
    redraw();
  }, [redraw]);

  useEffect(() => {
    if (!active) return;
    setupCanvas();
    const canvas = canvasRef.current;
    if (canvas === null) return;
    const observer = new ResizeObserver(() => setupCanvas());
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [active, setupCanvas]);

  function pointerPos(e: ReactPointerEvent<HTMLCanvasElement>): Point {
    const canvas = canvasRef.current;
    if (canvas === null) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function onPointerDown(e: ReactPointerEvent<HTMLCanvasElement>): void {
    const canvas = canvasRef.current;
    if (canvas === null) return;
    drawingRef.current = true;
    canvas.setPointerCapture(e.pointerId);
    const point = pointerPos(e);
    if (tool === "shape") {
      shapeStartRef.current = point;
      return;
    }
    const stroke: Stroke = {
      tool,
      color,
      width,
      points: [point],
    };
    currentRef.current = stroke;
    strokesRef.current.push(stroke);
    redraw();
  }

  function onPointerMove(e: ReactPointerEvent<HTMLCanvasElement>): void {
    if (!drawingRef.current) return;
    const point = pointerPos(e);
    if (tool === "shape") {
      const start = shapeStartRef.current;
      if (start === null) return;
      redraw({
        tool: "shape",
        shape: shapeKind,
        color,
        width,
        points: [start, point],
      });
      return;
    }
    const stroke = currentRef.current;
    if (stroke === null) return;
    stroke.points.push(point);
    redraw();
  }

  function onPointerUp(e: ReactPointerEvent<HTMLCanvasElement>): void {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    canvasRef.current?.releasePointerCapture(e.pointerId);
    if (tool === "shape") {
      const start = shapeStartRef.current;
      shapeStartRef.current = null;
      if (start !== null) {
        strokesRef.current.push({
          tool: "shape",
          shape: shapeKind,
          color,
          width,
          points: [start, pointerPos(e)],
        });
        redraw();
      }
      return;
    }
    currentRef.current = null;
  }

  const undo = useCallback(() => {
    strokesRef.current.pop();
    redraw();
  }, [redraw]);

  const clear = useCallback(() => {
    strokesRef.current = [];
    redraw();
  }, [redraw]);

  const loadStrokes = useCallback(
    (strokes: Stroke[]) => {
      strokesRef.current = strokes;
      redraw();
    },
    [redraw],
  );

  return {
    canvasRef,
    strokesRef,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    undo,
    clear,
    loadStrokes,
  };
}
