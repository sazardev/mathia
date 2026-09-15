import { IconButton } from "@/components/ui/atoms/IconButton";
import type { IconName } from "@/components/ui/atoms/Icon";
import { Spinner } from "@/components/ui/atoms/Spinner";
import { HIGHLIGHTER_COLORS, INK_COLORS } from "../lib/palette";
import type { ShapeKind, Tool } from "../types";
import { ColorSwatches } from "./ColorSwatches";
import { ShapePicker } from "./ShapePicker";
import { SizePopover } from "./SizePopover";
import styles from "./Toolbar.module.css";

const TOOLS: { tool: Tool; icon: IconName; label: string }[] = [
  { tool: "pen", icon: "pencil", label: "Lápiz" },
  { tool: "highlighter", icon: "highlighter", label: "Marcador" },
  { tool: "shape", icon: "arrow", label: "Formas" },
  { tool: "eraser", icon: "eraser", label: "Borrador" },
];

interface ToolbarProps {
  tool: Tool;
  onToolChange: (tool: Tool) => void;
  shapeKind: ShapeKind;
  onShapeKindChange: (shape: ShapeKind) => void;
  color: string;
  onColorChange: (color: string) => void;
  activeWidth: number;
  widthRange: { min: number; max: number };
  onWidthChange: (width: number) => void;
  onUndo: () => void;
  onClear: () => void;
  notebookOpen: boolean;
  onToggleNotebook: () => void;
  calculatorOpen: boolean;
  onToggleCalculator: () => void;
  graphOpen: boolean;
  onToggleGraph: () => void;
  onExport: () => void;
  exporting: boolean;
  onClose: () => void;
}

export function Toolbar(props: ToolbarProps) {
  const palette =
    props.tool === "highlighter" ? HIGHLIGHTER_COLORS : INK_COLORS;

  return (
    <div
      className={styles["toolbar"]}
      role="toolbar"
      aria-label="Herramientas del kit de estudio"
      data-toolkit-chrome="true"
    >
      <IconButton
        icon="x"
        label="Cerrar kit"
        variant="ghost"
        onPress={props.onClose}
      />

      <div className={styles["group"]}>
        {TOOLS.map(({ tool, icon, label }) => (
          <IconButton
            key={tool}
            icon={icon}
            label={label}
            variant={props.tool === tool ? "primary" : "ghost"}
            onPress={() => props.onToolChange(tool)}
          />
        ))}
        {props.tool === "shape" && (
          <ShapePicker
            active={props.shapeKind}
            onChange={props.onShapeKindChange}
          />
        )}
        <IconButton
          icon="undo"
          label="Deshacer trazo"
          variant="ghost"
          onPress={props.onUndo}
        />
        <IconButton
          icon="trash"
          label="Limpiar todo"
          variant="ghost"
          onPress={props.onClear}
        />
      </div>

      {props.tool !== "eraser" && (
        <ColorSwatches
          colors={palette}
          active={props.color}
          onChange={props.onColorChange}
        />
      )}

      <SizePopover
        activeWidth={props.activeWidth}
        widthRange={props.widthRange}
        onWidthChange={props.onWidthChange}
      />

      <div className={styles["group"]}>
        <IconButton
          icon="notebook"
          label="Cuaderno de notas"
          variant={props.notebookOpen ? "primary" : "ghost"}
          onPress={props.onToggleNotebook}
        />
        <IconButton
          icon="calculator"
          label="Calculadora"
          variant={props.calculatorOpen ? "primary" : "ghost"}
          onPress={props.onToggleCalculator}
        />
        <IconButton
          icon="curve"
          label="Graficador de funciones"
          variant={props.graphOpen ? "primary" : "ghost"}
          onPress={props.onToggleGraph}
        />
        {props.exporting ? (
          <output className={styles["exportingSpinner"]} aria-live="polite">
            <Spinner size={20} />
          </output>
        ) : (
          <IconButton
            icon="download"
            label="Exportar como imagen"
            variant="ghost"
            onPress={props.onExport}
          />
        )}
      </div>
    </div>
  );
}
