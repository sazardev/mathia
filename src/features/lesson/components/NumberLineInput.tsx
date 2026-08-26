import {
  NumberLine,
  type NumberLineMarker,
} from "@/components/ui/molecules/NumberLine";

type NumberLineInputProps = {
  min: number;
  max: number;
  step: number;
  value: number | null;
  onChange: (value: number) => void;
  disabled?: boolean;
  /** Se pasa solo tras responder, para pintar el punto correcto. */
  correctValue?: number | undefined;
};

export function NumberLineInput({
  min,
  max,
  step,
  value,
  onChange,
  disabled = false,
  correctValue,
}: NumberLineInputProps) {
  const markers: NumberLineMarker[] = [];
  if (correctValue !== undefined) {
    const userWasWrong = value !== null && value !== correctValue;
    if (userWasWrong) {
      markers.push({ value, tone: "wrong" });
    }
    markers.push({ value: correctValue, tone: "correct" });
  } else if (value !== null) {
    markers.push({ value, tone: "selected" });
  }

  return (
    <NumberLine
      min={min}
      max={max}
      step={step}
      markers={markers}
      onSelect={onChange}
      disabled={disabled}
      ariaLabel="Elige un valor en la recta numérica"
      ariaValueText={value !== null ? String(value) : undefined}
    />
  );
}
