import type { NotebookScopeType } from "@/lib/storage";

export type Tool = "pen" | "highlighter" | "eraser" | "shape";
export type ShapeKind = "arrow" | "rectangle" | "ellipse" | "line";

export interface Point {
  x: number;
  y: number;
}

export interface Stroke {
  tool: Tool;
  shape?: ShapeKind;
  color: string;
  width: number;
  points: Point[];
}

export interface ScopeTab {
  scopeType: NotebookScopeType;
  scopeId: string | null;
  label: string;
}
