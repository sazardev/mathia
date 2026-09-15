import type { PointerEvent as ReactPointerEvent, RefObject } from "react";
import styles from "./ToolCanvas.module.css";

interface ToolCanvasProps {
  paper: boolean;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  onPointerDown: (e: ReactPointerEvent<HTMLCanvasElement>) => void;
  onPointerMove: (e: ReactPointerEvent<HTMLCanvasElement>) => void;
  onPointerUp: (e: ReactPointerEvent<HTMLCanvasElement>) => void;
}

export function ToolCanvas({
  paper,
  canvasRef,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}: ToolCanvasProps) {
  return (
    <>
      {paper && <div className={styles["paper"]} aria-hidden="true" />}
      <canvas
        ref={canvasRef}
        className={styles["canvas"]}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        aria-label="Lienzo: dibuja, resalta o marca encima del contenido"
      />
    </>
  );
}
