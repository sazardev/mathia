import { useCallback, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

export interface DraggablePosition {
  x: number;
  y: number;
}

interface DragOrigin extends DraggablePosition {
  startX: number;
  startY: number;
}

/** Arrastre genérico acotado al viewport; pensado para ventanas flotantes (ej. Calculator). */
export function useDraggable(initial: DraggablePosition) {
  const [position, setPosition] = useState<DraggablePosition>(initial);
  const originRef = useRef<DragOrigin | null>(null);

  const onPointerDown = useCallback(
    (e: ReactPointerEvent<HTMLElement>) => {
      originRef.current = {
        x: position.x,
        y: position.y,
        startX: e.clientX,
        startY: e.clientY,
      };
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [position],
  );

  const onPointerMove = useCallback((e: ReactPointerEvent<HTMLElement>) => {
    const origin = originRef.current;
    if (origin === null) return;
    const maxX = Math.max(0, window.innerWidth - 48);
    const maxY = Math.max(0, window.innerHeight - 48);
    setPosition({
      x: Math.min(Math.max(0, origin.x + (e.clientX - origin.startX)), maxX),
      y: Math.min(Math.max(0, origin.y + (e.clientY - origin.startY)), maxY),
    });
  }, []);

  const onPointerUp = useCallback((e: ReactPointerEvent<HTMLElement>) => {
    originRef.current = null;
    e.currentTarget.releasePointerCapture(e.pointerId);
  }, []);

  return { position, onPointerDown, onPointerMove, onPointerUp };
}
